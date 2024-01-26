export function extractTokenFromCookies(cookies: string | null) {
   if (!cookies) return null;

   const tokenCookie = cookies.split(';').find((cookie) => cookie.trim().startsWith('token='));

   if (!tokenCookie) return null;

   return tokenCookie.split('=')[1].trim();
}

export async function verifyAndDecodeToken(token: string | null): Promise<any> {
   return new Promise((resolve) => {
      if (!token) {
         return resolve(null);
      }

      // Define a custom request handler to extract the token
      const headers = {
         authorization: `Bearer ${token}`,
         cookie: `token=${token}`
      }

      // Send the request to the server
      fetch('http://localhost:5000/check', {
         method: 'GET',
         headers
      })
         .then((response) => {
            if (!response.ok) {
               throw new Error('Invalid response');
            }
            return response.json();
         })
         .then((data) => {
            resolve(data.user);
         })
         .catch((error) => {
            console.log(error);
            resolve(null);
         });
   });
}