import React, { useEffect, useState, useContext, } from 'react';
import { UserContext, } from '../App.js'
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import FormWrapper from "../components/wrappers/FormWrapper.js"
import { useParams, } from "react-router-dom";
import axios from "axios";
import { API_URL, FIVE_MINUTES, } from "../utils/constants.js"

function Qr() {
    const [message, updateMessage] = useState("");
    const [error, updateError] = useState("");
    const { token, } = useParams();
    const { user, } = useContext(UserContext);
    
    useEffect(() => {
        const date = new Date(parseInt(token.split('-')[0]));

        if (Date.now() - date > FIVE_MINUTES) {
            updateError("It is too late to scan this QR.")
        }
        else {
            if(user.id) {
                const body = {
                    user_email: user.email,
                    body: token,
                }
                
                axios.post(API_URL + "/qr/add_student",
                        body,
                        {
                            headers: {
                                Authorization: `Bearer ${ localStorage.getItem("token") }`
                        },
                    })
                    .then(res => {
                        if (res?.data?.error) {
                            console.log(res?.data?.error);
                        } else {
                            updateMessage("You are added on attendance list.")
                        }
                    })
                    .catch(err => console.log(err))
            }
        }

    }, [user]);

    return (
        <DefaultWrapper>
            <div className="flex justify-center items-center h-full w-full">
                <FormWrapper>
                        { error ? (
                            <span className="text-2xl text-error">{ error }</span>
                        ) : (
                            <span className="text-2xl">{ message }</span>
                        ) }
                </FormWrapper>
            </div>
        </DefaultWrapper>
    );
  }
  
  export default Qr;
  