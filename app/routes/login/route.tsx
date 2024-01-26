import { Form, useNavigate } from "@remix-run/react";

import {  type MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
   return [
      { title: "connect - login" },
      { name: "description", content: "Welcome to Remix!" },
   ];
};

// export async function action({ request }: { request: Request }) {
//    // const navigate = useNavigate();
//    const body = await request.formData();
//    console.log(body)
//    const email = body.get("email");
//    const password = body.get("password");
//    console.log("user", email, password);

//    // // Post to the login endpoint
//    // const response = await axios.post("/login", { email, password }, { withCredentials: true })
//    // .then((res) => {
//    //    // redirect to profile page
//    //    return redirect("/profile");
//    // }
//    // ).catch((err) => {
//    //    console.log("Error", err);
//    // });
//    // console.log("action");
//    return "hi"
// }

export default function Index() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();


   function handleSubmit(e: { preventDefault: () => void; }) {
      e.preventDefault();
      // axios.post("/login", { email, password }, { withCredentials: true }).then((res) => {
      //    // redirect to profile page
      //    navigate("/profile");
      // }).catch((err) => {
      //    console.log("Error", err);
      // });
      fetch("/login", {
         method: "POST",
         body: JSON.stringify({ email, password }),
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
      }).then((res) => {
         console.log("res", res);
         navigate("/profile");
      }).catch((err) => {
         console.log("Error", err);
      });
   }

   return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
         <h1>Login</h1>
         <Form method="post">
            <input type="text" name="email" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <input type="submit" value="Login" onClick={handleSubmit} />
         </Form>
      </div>
   );
}
