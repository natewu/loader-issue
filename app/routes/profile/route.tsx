// import { useRouteData } from "remix";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import { redirect } from "@remix-run/node";

function ProfilePage() {
   // const { username, email } = useRouteData();
   // const [password, setPassword] = useState("");

  

   return (
      <div>
         <h1>Profile</h1>
         <p>example</p>
         {/* <p>Email: {email}</p> */}
         <Link to="/">Go back to home</Link>
      </div>
   );
}

export default ProfilePage;
