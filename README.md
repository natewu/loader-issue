# loader issue example

## Description
1. When you click log in it will log in but the navbar is still showing the log in button. If you refresh the page it will show the correct behavior.
2. In the app/root.tsx it uses a loader that checks if user is logged in, and in the nav.tsx component it calls upon the nearest loader to check if user is logged in.
3. Actually, when a user logs in the loader successfully runs and console is logged and the page is redirected. But the nav component does not update.
4. Same with logging out, the loader runs and console is logged but the nav component does not update. Refreshing the page will show the correct behavior.