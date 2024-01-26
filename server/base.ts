import * as path from 'node:path';

import express, { Request, Response } from 'express';

import compression from 'compression';
import { installGlobals } from '@remix-run/node';
import jwt from 'jsonwebtoken';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
installGlobals();

const BUILD_FOLDER_PATH = path.resolve(process.cwd(), 'build');
export const BUILD_PATH = path.resolve(BUILD_FOLDER_PATH, 'index.js');
export const VERSION_PATH = path.resolve(BUILD_FOLDER_PATH, 'version.txt');

let didStartServer = false;

/**
 *
 * Start the Express server and give it a chance for the call-site
 * to setup hooks to our Express server before it starts.
 *
 * @param setupApp Allow the caller to add hooks to the Express app before we start
 * @param onReady Signals to the called when the server has been started
 */
export function startServerLifecycle(
  setupApp: (app: express.Application) => void,
  onReady: () => void
) {
  if (didStartServer) {
    throw new Error(
      'The express server has already been started. You can only have one instance running.'
    );
  }

  didStartServer = true;

  const app = express();

  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by');

  app.get('/health-check', (_req, resp) => {
    return resp.json({
      status: 'ok',
    });
  });

  /**
   * Our k8s infrastructure probes on these paths automatically to fetch
   * OpenAPI docs, but given that we provide none, this route
   * falls into the remix route handler, rendering lots of trace spams in
   * Datadog without a resource name.
   *
   * By hard-coding the route path in the Express app, the resources in Datadog
   * get named correctly, reducing the trace noise.
   * This has been reported to Datadog.
   * See: https://github.com/DataDog/dd-trace-js/issues/3283#issuecomment-1653821725
   */
  app.get('/v(2|3)/api-docs', (_req, resp) => {
    return resp.status(404).json({
      status: 'not_found',
    });
  });

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' })
  );

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static('public', { maxAge: '1h' }));

  setupApp(app);

  // Listen to uncaught exceptions that are unrecoverable.
  // At this point, we can just log the error, cleanup any resources
  // like closing database connections, removing files and exit the app.
  process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT_EXCEPTION', error);
    process.exit(1);
  });

  // Listen for uncaught Promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error(
      'UNHANDLED_REJECTION',
      new Error(`Unhandled rejection at ${promise}. Reason: ${reason}`)
    );
  });

  const user = { id: 1, email: 'test@test.com' };
  app.post(
    '/login',
    async (req: any, res: any, next: any) => {
      // just send back a default user for now
    

      const body = { _id: user.id, email: user.email };

      const token = jwt.sign({ user: body }, 'TOP_SECRET');

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'Lax', // Adjust as needed based on your requirements
        maxAge: 3600000 // 1 hour
      });

      return res.json({ token });
    }
  );

  app.post('/logout', logout);
  app.get('/logout', (req: any, res: any, next: any) => {
    // display the logout page
    return res.json({ message: 'Logout successful' });
  });

  app.get(
    '/check',
    async (req: any, res: any, next: any) => {
      return res.json({
        message: 'User is authenticated.',
        user
      });
    }
  );

  const port = process.env.PORT || 3000;

  const server = app.listen(port, async () => {
    console.info(
      `Express server started on port ${port} with env: ${process.env.NODE_ENV}`
    );

    onReady();
  });

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  /** Gracefully shutdown by cleaning up resources and stopping background jobs  */
  function gracefulShutdown() {
    console.info('SERVER_SHUTDOWN_SIGNAL', { msg: 'Server will shutdown' });
    closeConnectionsAndExit();
  }

  function closeConnectionsAndExit() {
    server.close(() => {
      console.info('HTTP_SERVER_CLOSED', {
        msg: 'Server cannot accept more connections',
      });
      process.exit(0);
    });
  }
}


export const logout = (req: Request, res: Response) => {

  // Check if user is logged in
  if (req.headers && req.headers.cookie) {
    if (!req.headers.cookie.split(';').find((cookie: string) => cookie.trim().startsWith('token='))) {
      return res.json({ message: 'No user to log out' });
    }
  }

  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  });

  res.json({ message: 'Logout successful' });
};


