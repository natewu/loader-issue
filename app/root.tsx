import './app.css';

import {
   Links,
   LiveReload,
   Meta,
   Outlet,
   Scripts,
   ScrollRestoration,
} from "@remix-run/react";
import { extractTokenFromCookies, verifyAndDecodeToken } from "./utils/auth";

import type { LinksFunction } from "@remix-run/node";
import Nav from "./components/nav/nav";
import { cssBundleHref } from "@remix-run/css-bundle";

export const links: LinksFunction = () => [
   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: { request: Request }) {
   try {
      // Fetch cookies from the client-side request
      const clientCookies = request.headers.get('cookie');

      const token = extractTokenFromCookies(clientCookies);

      // Verify auth token
      let auth = await verifyAndDecodeToken(token);

      return auth;
   } catch (error) {
      // Handle errors appropriately
      throw { status: 500, message: "Error checking authentication." };
   }
}


export default function App() {
   return (
      <html lang="en">
         <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <Meta />
            <Links />
         </head>
         <body>

            <Nav/>
            <div className="content">
               <Outlet />
            </div>
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
         </body>
      </html>
   );
}
