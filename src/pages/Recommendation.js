import React, { useState, useContext, useEffect, } from 'react';
import axios from "axios";
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import Input from "../components/customizedComponents/Input.js";
import FormWrapper from "../components/wrappers/FormWrapper.js"
import { FiEdit, } from 'react-icons/fi';
import { AiOutlineSave, } from 'react-icons/ai';
import { UserContext, } from '../App.js'
import { API_URL, } from "../utils/constants.js"
import { useFormik } from 'formik';
import * as yup from 'yup';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const validationSchema = yup.object({
    email: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required"),
    username: yup
        .string("Enter first name")
        .required("First name is required"),
    lastname: yup
        .string("Enter last name")
        .required("Last name is required"),
    group: yup.string().when("isStudent", {
        is: isStudent => isStudent,
        then: yup
            .string("Enter group")
            .matches(/^[1-9]{3}([A-Z]{2}|([A-Z][1-9]))$/ , 'Enter a valid group')
            .required("Group is required"),
    }),
    password: yup
        .string("Enter user's password")
        .test("optional-password", "This field should be either empty or 8 characters length", value => !value || value.length === 0 || value.length >= 8),
    confirmPassword: yup.string().when("password", {
        is: password => password?.length,
        then: yup
            .string("Confirm user's password")
            .min(8, "Password confirmation should be of minimum 8 characters length")
            .required("Password confirmation is required")
            .oneOf([yup.ref("password"), null], "Passwords must match"),
        otherwise: yup
            .string("Confirm user's password")
            .min(0, "First enter a password")
            .max(0, "First enter a password")
    }),
    isStudent: yup
        .bool()
});

function Recommendation() {
    const [ editing, updateEditing ] = useState(false);
    const { user, updateUser, } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            username: user?.username,
            lastname: user?.lastname,
            group: user?.group,
            email: user?.email,
            password: '',
            confirmPassword: '',
            isStudent: user?.role === 3,
        },
        validationSchema: validationSchema,
    });
    const { values, errors, touched, setFieldValue, getFieldProps, validateForm, handleSubmit, setValues, } = formik;
    const _onSelect = () => {
      console.log("hai")
    }
    useEffect(() => {
        if (user.id) {
            console.log("user?.role", user?.role)
            setValues({
                username: user?.username,
                lastname: user?.lastname,
                group: user?.group,
                email: user?.email,
                password: '',
                confirmPassword: '',
                isStudent: user?.role === 3,
            })
        }
    }, [user])

    console.log(values.isStudent)
    const _toogleEdit = () => {
        updateEditing(prevState => !prevState);
        setFieldValue('password', '');
        setFieldValue('confirmPassword', '');
    }
    const options = [
      { value: 'user1', label: 'user1', id: '1'},
      { value: 'user2', label: 'user2', id: '2'},
      { value: 'user3', label: 'user3', id: '3'},
      { value: 'user4', label: 'user4', id: '4'},
      { value: 'user5', label: 'user5', id: '5'},
      { value: 'user6', label: 'user6', id: '6'},
      { value: 'user7', label: 'user7', id: '7'},
      { value: 'user8', label: 'user8', id: '8'},
    ]
    const defaultOption = options[0];
    

    const _handleSave = () => {
        validateForm()
        .then(newErrors => {
            console.log(newErrors)
            if (Object.keys(newErrors).filter(err => err !== 'group' || (err === 'group' && values.isStudent)).length !== 0) {
                handleSubmit();
                return;
            }

            const body = {
                username: values.username,
                lastname: values.lastname,
                group: values.group,
                email: values.email,
                password: values.password,
                password_confirmation: values.confirmPassword,
            };

            if (!body.password) {
                delete body.password;
                delete body.confirmPassword;
            }

            axios.patch(API_URL + "/user/edit",
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
                    updateUser({
                        username: res.data.user_attributes.username,
                        lastname: res.data.user_attributes.lastname,
                        group: res.data.user_attributes.group,
                        email: res.data.user_attributes.email,
                        type: res.data.user_attributes.role || 1,
                    })
                }
                _toogleEdit();
            })
            .catch(err => console.log(err))
        })
    }

    return (
        <DefaultWrapper>
            <div className="flex justify-center items-center h-full w-full">
                <FormWrapper>
                    <div className="w-4/5 flex justify-between  mb-5">
                      <span className="text-2xl">Recommendation System</span>
                    </div>
                    <div className="w-4/5">
                        <span className="w-4/5">User:</span>
                        <Dropdown options={options} onChange={_onSelect} value={defaultOption} placeholder="Select an option" />
                    </div>
                </FormWrapper>
            </div>
        </DefaultWrapper>
    );
  }
  
  export default Recommendation;
  