import { extractTokenFromCookies, verifyAndDecodeToken } from "../../utils/auth";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react"

import { Button } from "@mui/material";
import Logout from "../logout";
// import { loader } from "./root";
import styles from './nav.module.css'

export default function Nav(){
   let auth = useLoaderData<typeof loader>();
   const navigate = useNavigate();

   return (
      <nav>
         <div className={styles.links}>
            <Button onClick={() => navigate("/")}>
               Home
            </Button>
            <Button onClick={() => navigate("/profile")}>
               Profile
            </Button>
         </div>
         <div className={styles.user}>
            {auth !== null ? (
               <div style={{color:"black"}}>
                  {auth.email}
                  <Logout/>
               </div>
            ) : (
            
               <Button onClick={() => navigate("/login")}>
                  Login!!!
               </Button>
            )}
         </div>
      </nav>
   )
}