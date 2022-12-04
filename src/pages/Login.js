import React, { useState, useContext, } from "react";
import axios from "axios";
import Button from "../components/customizedComponents/Button"
import Input from "../components/customizedComponents/Input"
import FormWrapper from "../components/wrappers/FormWrapper.js"
import LoginWrapper from "../components/wrappers/LoginWrapper.js"
import { UserContext, } from '../App.js';
import { API_URL, } from "../utils/constants.js"
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, } from "react-router-dom";

const validationSchema = yup.object({
    email: yup
        .string("Enter user's email")
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string("Enter user's password")
        .min(8, "Password should be of minimum 8 characters length")
        .required("Password is required"),
});


function Login() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
    });
    const { values, errors, touched, getFieldProps, validateForm, handleSubmit, } = formik;
    const [reqError, updateReqError] = useState("");
    const { user, updateUser, } = useContext(UserContext);

    const _onClick = () => {
        validateForm()
        .then(newErrors => {
            if (Object.keys(newErrors).length !== 0) {
                handleSubmit();
                return;
            }

            const body = {
                email: values.email,
                password: values.password,
            };

            axios.post(API_URL + "/login", body)
            .then(res => {
                if (res?.data?.error) {
                    updateReqError(res?.data?.error);
                } else {
                    updateReqError("");
                    localStorage.setItem("token", res.data.token);
                    updateUser({
                        firstname: res.data.user.firstname,
                        lastname: res.data.user.lastname,
                        group: res.data.user.group,
                        email: res.data.user.email,
                        id: res.data.user.id,
                        role: res.data.user.role || 1,
                    })
                    navigate("/courses");
                }
            })

        })
		
    }

    return (
        <LoginWrapper>
            <FormWrapper>
                <span className="text-2xl" >LOGIN</span>
                <form className="w-4/5">
                    <Input
                        label="Email:"
                        fieldProps={ getFieldProps("email") }
                        error={ touched.email && errors.email }
                        type="email"
                        id="emailInput"/>
                    <Input
                        label="Password:"
                        fieldProps={ getFieldProps("password") }
                        error={ touched.password && errors.password }
                        type="password"
                        id="passwordInput"/>
                    { reqError ?
                        <div className="text-center w-full pb-4 text-error">
                            { reqError } 
                        </div>
                        : null }
                </form>
                <Button
                    label="Login"
                    onClick={ _onClick }/>
            </FormWrapper>
        </LoginWrapper>
    );
}
  
export default Login;
