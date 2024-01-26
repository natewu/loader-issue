import { Button } from "@mui/material";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

export async function action({ request }: { request: Request }) {
   return redirect("/", {
      headers: {
         "Set-Cookie": "token=; Max-Age=0; Path=/; HttpOnly",
      },
   });
}

export default function Logout(){

   const navigate = useNavigate();

   async function logout(){
      await fetch("/logout", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
      }).then((res) => {
         console.log(res);
         navigate("/");
      });
   }

   return (
      <Button onClick={() => logout()}>
         Logout
      </Button>
   )
}