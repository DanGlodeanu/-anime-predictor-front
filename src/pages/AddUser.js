import React, { useState, } from "react";
import axios from "axios";
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import Button from "../components/customizedComponents/Button.js"
import Input from "../components/customizedComponents/Input.js";
import FormWrapper from "../components/wrappers/FormWrapper.js"
import { ADD_USER_TYPES, SELECT_STYLES, } from "../utils/constants.js"
import Select from 'react-select';
import { API_URL, } from "../utils/constants.js"
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    email: yup
        .string("Enter user's email")
        .email("Enter a valid email")
        .required("Email is required"),
    firstname: yup
        .string("Enter user's first name")
        .required("First name is required"),
    lastname: yup
        .string("Enter user's last name")
        .required("Last name is required"),
    group: yup.string().when("isStudent", {
        is: isStudent => isStudent,
        then: yup
        .string("Enter user's group")
        .matches(/^[1-9]{3}([A-Z]{2}|([A-Z][1-9]))$/ , 'Enter a valid group')
        .required("Group is required"),
    }),
    password: yup
        .string("Enter user's password")
        .min(8, "Password should be of minimum 8 characters length")
        .required("Password is required"),
    confirmPassword: yup
        .string("Confirm user's password")
        .min(8, "Password confirmation should be of minimum 8 characters length")
        .required("Password confirmation is required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    isStudent: yup
        .bool()
});

function AddUser() {
    const [ userType, updateUserType ] = useState(ADD_USER_TYPES[0]);
    const [reqError, updateReqError] = useState("");
    const [reqMsg, updateReqMsg] = useState("");

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            group: '',
            email: '',
            password: '',
            confirmPassword: '',
            isStudent: false,
        },
        validationSchema: validationSchema,
    });

    const { values, errors, touched, getFieldProps, setValues, validateForm, handleSubmit, } = formik;

    const _onSelect = option => {
        setValues(prevValues => ({
            ...prevValues,
            isStudent: option.value === 3,
        }));
		updateUserType(option);
	};

    const _onClick = () => {
        validateForm()
        .then(newErrors => {
            if (Object.keys(newErrors).length !== 0) {
                handleSubmit();
                return;
            }

            const body = {
                firstname: values.firstname,
                lastname: values.lastname,
                group: values.isStudent ? values.group : null,
                email: values.email,
                password: values.password,
                password_confirmation: values.confirmPassword,
                role: userType.value,
            };

            axios.post(API_URL + "/users",
                body,
                {
                    headers: {
                        Authorization: `Bearer ${ localStorage.getItem("token") }`
                },
            })
            .then(res => {
                if (res?.data?.error) {
                    updateReqError(res?.data?.error);
                    updateReqMsg("");
                } else {
                    updateReqError("");
                    updateReqMsg("User added successfully");
                }
            })

        })
	};

    return (
        <DefaultWrapper>
            <div className="flex justify-center items-center h-full w-full">
                <FormWrapper>
                    <div className="w-4/5 flex justify-between">
                        <span className="text-2xl">CREATE USER</span>
                        <Select
                            className="w-40"
                            isSearchable={ false }
                            value={ userType }
                            onChange={ _onSelect }
                            options={ ADD_USER_TYPES }
                            styles={ SELECT_STYLES }/>
                    </div>
                    <div className="w-4/5">
                        <Input
                            label="First name:"
                            fieldProps={ getFieldProps("firstname") }
                            error={ touched.firstname && errors.firstname }
                            id="firstNameInput"/>
                        <Input
                            label="Last name:"
                            fieldProps={ getFieldProps("lastname") }
                            error={ touched.lastname && errors.lastname }
                            id="lastNameInput"/>
                        { userType?.value === 3 ? (
                            <Input
                                label="Group:"
                                fieldProps={ getFieldProps("group") }
                                error={ touched.group && errors.group }
                                id="group"/>
                        ) : null}
                        <Input
                            label="Email:"
                            fieldProps={ getFieldProps("email") }
                            error={ touched.email && errors.email }
                            type="email"
                            id="userEmailInput"/>
                        <Input
                            label="Password:"
                            fieldProps={ getFieldProps("password") }
                            error={ touched.password && errors.password }
                            type="password"
                            id="userPasswordInput"/>
                        <Input
                            label="Confirm Password:"
                            fieldProps={ getFieldProps("confirmPassword") }
                            error={ touched.confirmPassword && errors.confirmPassword }
                            type="password"
                            id="userRetypePasswordInput"/>
                        { reqError ?
                            <div className="text-center w-full pb-4 text-error">
                                { reqError } 
                            </div>
                            : null }
                        { reqMsg ?
                            <div className="text-center w-full pb-4">
                                { reqMsg } 
                            </div>
                            : null }
                    </div>
                    <Button
                        label="Create"
                        type="submit"
                        onClick={ _onClick }/>
                </FormWrapper>
            </div>
        </DefaultWrapper>
    );
}
  
export default AddUser;
