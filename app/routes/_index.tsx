import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix + Express + TS' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>The loader issue example</h1>
      <ul>
        <li>
          <a target='_blank' href='/'>
            Home
          </a>
        </li>
        <li>
          <a target='_blank' href='/test-error'>
            Reproduce an error captured by <pre>handleError</pre> on our
            entry.server.tsx file.
          </a>
        </li>
      </ul>
    </div>
  );
}
