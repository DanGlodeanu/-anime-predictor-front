import React, { useState, useEffect, useContext} from 'react';
import { UserContext, } from '../App.js';
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import Button from "../components/customizedComponents/Button.js"
import Input from "../components/customizedComponents/Input.js";
import axios from "axios";
import { API_URL, } from "../utils/constants.js";
import FormWrapper from "../components/wrappers/FormWrapper.js"
import { COURSES_DAY_TYPES, COURSES_INTERVAL_TYPES, SELECT_STYLES, } from "../utils/constants.js";
import { useNavigate, } from "react-router-dom";
import Select from 'react-select';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    courseName: yup
        .string("Enter course's name")
        .required("Course name is required"),
    weekDay: yup
        .number("Enter course's week day")
        .required("Week day is required"),
    interval: yup
        .number("Enter course's interval")
        .required("Interval is required"),
    description: yup
        .string("Enter course's description")
        .required("Description is required"),
    bonuses: yup
        .string("Enter course's bonuses"),
    color: yup
        .string("Enter course's color")
        .required("Color is required"),
});

function AddUser() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            courseName: '',
            weekDay: COURSES_DAY_TYPES[0].value,
            interval: COURSES_INTERVAL_TYPES[0].value,
            description: '',
            bonuses: '',
            color: '#141416',
        },
        validationSchema: validationSchema,
    });

    const { values, errors, touched, getFieldProps, setValues, validateForm, handleSubmit, } = formik;
    const [reqError, updateReqError] = useState("");
    const { user } = useContext(UserContext);
    const [ course, updateCourse, ] = useState({
        name: "",
        week_day: -1,
        interval: -1,
        description: "",
        bonuses: "",
        color: "#000000",
        user_id: -1,
    });

    const _onSelect = field => option => {
        setValues(prevValues => ({
            ...prevValues,
            [field]: option.value,
        }));
	};

    const _onClick = () => {
        validateForm()
        .then(newErrors => {
            if (Object.keys(newErrors).length !== 0) {
                handleSubmit();
                return;
            }

            const body = {
                name: values.courseName,
                week_day: values.weekDay,
                interval: values.interval,
                description: values.description,
                bonuses: values.bonuses,
                color: values.color,
                user_id: user.id,
            };

            axios.post(API_URL + "/courses", body)
                .then(res => {
                    if (res?.data?.error) {
                        updateReqError(res?.data?.error);
                    } else {
                        updateReqError("");
                        console.log('test', values)
                        updateCourse({
                            name: values.courseName,
                            week_day: values.weekDay,
                            interval: values.interval,
                            description: values.description,
                            bonuses: values.bonuses,
                            color: values.color,
                            user_id: user.id
                        })
                        navigate("/courses");
                    }
                })
        })
	};

    return (
        <DefaultWrapper>
            <div className="flex justify-center items-center h-full w-full">
                <FormWrapper>
                    <div className="w-4/5 flex justify-center">
                        <span className="text-2xl">CREATE COURSE</span>
                    </div>
                    <div className="w-4/5">
                        <Input
                            label="Course name:"
                            fieldProps={ getFieldProps("courseName") }
                            error={ touched.courseName && errors.courseName }
                            id="courseNameInput"/>
                        <Input
                            label="Description:"
                            fieldProps={ getFieldProps("description") }
                            error={ touched.description && errors.description }
                            type="textarea"
                            id="descriptionInput"/>
                        <Input
                            label="Bonuses:"
                            fieldProps={ getFieldProps("bonuses") }
                            error={ touched.bonuses && errors.bonuses }
                            type="textarea"
                            id="bonusesInput"/>
                        <div className="flex justify-between mt-10 mb-8">
                            <Select
                                className="w-40"
                                isSearchable={ false }
                                value={ COURSES_DAY_TYPES.find(option => option.value === values.weekDay) }
                                onChange={ _onSelect("weekDay") }
                                options={ COURSES_DAY_TYPES }
                                styles={ SELECT_STYLES }/>
                            <Select
                                className="w-40"
                                isSearchable={ false }
                                value={ COURSES_INTERVAL_TYPES.find(option => option.value === values.interval) }
                                onChange={ _onSelect("interval") }
                                options={ COURSES_INTERVAL_TYPES }
                                styles={ SELECT_STYLES }/>
                            <input
                                { ...getFieldProps("color") }
                                className="h-8 m-0"
                                type="color"/>
                        </div>
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
