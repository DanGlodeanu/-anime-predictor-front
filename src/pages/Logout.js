import React, { useEffect, } from 'react';
import { useNavigate, } from "react-router-dom";
import LoginWrapper from "../components/wrappers/LoginWrapper.js"

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Se face api req")
        localStorage.removeItem("token");
        // simulare api res
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    })

    return (
        <LoginWrapper>
            <div className="text-2xl text-white2">
                Logging out...
            </div>
        </LoginWrapper>
    );
}
  
export default Logout;
  