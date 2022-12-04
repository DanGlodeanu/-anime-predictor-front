import React, { useState, useEffect, useContext } from "react";
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import Input from "../components/customizedComponents/Input.js";
import FormWrapper from "../components/wrappers/FormWrapper.js";
import Header from "../components/Header.js";
import axios from "axios";
import { API_URL, } from "../utils/constants.js";
import { UserContext, } from '../App.js'
import { FiEdit, } from 'react-icons/fi';
import { AiOutlineSave, } from 'react-icons/ai';
import { COURSES_DAY_TYPES, COURSES_INTERVAL_TYPES, SELECT_STYLES, } from "../utils/constants.js"
import Select from 'react-select';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, } from "react-router-dom";

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
    color: yup
        .string("Enter course's color")
        .required("Color is required"),
});

function AddUser() {
    const { user, } = useContext(UserContext);
    const [ editing, updateEditing ] = useState(false);
    const { id, } = useParams();
    const [ students, updateStudents ] = useState([]);
    const [reqMessage, updateReqMessage] = useState("");

    useEffect(() => {
        if (user.id) {
            if (user.id !== 3) {
                axios.get(API_URL + "/course/" + id,
                {
                    headers: {
                        Authorization: `Bearer ${ localStorage.getItem("token") }`
                    }
                })
                    .then(res => {
                        if (res?.data?.error) {
                            console.log(res?.data?.error);
                        } else {
                            const course = res.data.courses;
                            setValues({
                                courseName: course.name,
                                weekDay: course.week_day,
                                interval: course.interval,
                                description: course.description,
                                bonuses: course.bonuses,
                                color: course.color,
                                id: course.id,
                            })

                            axios.get(API_URL + "/user/students",
                                {
                                    headers: {
                                        Authorization: `Bearer ${ localStorage.getItem("token") }`
                                    }
                                }
                            )
                                .then(res => {
                                    if (res?.data?.error) {
                                        console.log(res?.data?.error);
                                    } else {
                                        updateStudents(res.data.users.filter(user => user && user.firstname 
                                            && user.lastname 
                                            && user.group 
                                            && !course.students.includes(user.email)))
                                    }
                                })
                                .catch(err => console.log(err))
                        }
                    })
                    .catch(err => console.log(err))
            }
        }
    }, [user])

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

    const _onSelect = field => option => {
        setValues(prevValues => ({
            ...prevValues,
            [field]: option.value,
        }));
	};

    const _addStudent = option => {
        axios.post(API_URL + "/course/add_user?id=" + values.id + "&user_email=" + option.email)
        .then(res => {
            if (res?.data?.error) {
                updateReqMessage(res?.data?.error);
            } else {
                updateReqMessage("");
                updateStudents(students.filter(student => student.id !== option.id))
            } 
        })
        
	};

    const _toogleEdit = () => {
        updateEditing(prevState => !prevState);
    }

    const _handleSave = () => {
        validateForm()
        .then(newErrors => {
            console.log('newErrors', newErrors)
            if (Object.keys(newErrors).length !== 0) {
                handleSubmit();
                return;
            }

            const body = {
                name: values.courseName,
                week_day: values.weekDay,
                interval: values.interval,
                description: values.description,
                bonuses: values.bonuses || "",
                color: values.color,
                user_id: user.id,
            };

            axios.patch(API_URL + "/course/edit?id=" + values.id, body, {
                headers: {
                    Authorization: `Bearer ${ localStorage.getItem("token") }`
                }
            })
                .then(res => {
                    if (res?.data?.error) {
                        console.log(res?.data?.error);
                    } else {
                        _toogleEdit();
                    }
                })

            
        })
    }

    const formatOptionLabel = ({ firstname, lastname, group, }) => (
        <span>
            { `${lastname} ${firstname} ${group}` }
        </span>
    );

    return (
        <DefaultWrapper>
            <div className="flex justify-center items-center h-full w-full">
                <FormWrapper>
                    <div className="w-4/5 flex justify-between">
                        <span className="text-2xl">COURSE INFO</span>
                        { editing 
                            ? 
                            <button
                                onClick={ _handleSave }
                                className="inline-flex items-center">
                                SAVE
                                <AiOutlineSave className="ml-2"/>
                            </button>
                            :
                            <button
                                onClick={ _toogleEdit }
                                className="inline-flex items-center">
                                EDIT
                                <FiEdit className="ml-2"/>
                            </button>
                        }
                    </div>
                    <div className="w-4/5">
                        <Input
                            isDisabled={ !editing }
                            label="Course name:"
                            fieldProps={ getFieldProps("courseName") }
                            error={ touched.courseName && errors.courseName }
                            id="courseNameInput"/>
                        <Input
                            isDisabled={ !editing }
                            label="Description:"
                            fieldProps={ getFieldProps("description") }
                            error={ touched.description && errors.description }
                            type="textarea"
                            id="descriptionInput"/>
                        <Input
                            isDisabled={ !editing }
                            label="Bonuses:"
                            fieldProps={ getFieldProps("bonuses") }
                            error={ touched.bonuses && errors.bonuses }
                            type="textarea"
                            id="bonusesInput"/>
                        <Select
                            value=""
                            placeholder="Add Student"
                            formatOptionLabel={formatOptionLabel}
                            options={students}
                            onChange={ _addStudent }
                            maxMenuHeight={ 140 }
                            styles={ SELECT_STYLES }/>
                        <div className="flex justify-between mt-10 mb-8">
                            <Select
                                className="w-40"
                                isDisabled={ !editing }
                                isSearchable={ false }
                                value={ COURSES_DAY_TYPES.find(option => option.value === values.weekDay) }
                                onChange={ _onSelect("weekDay") }
                                options={ COURSES_DAY_TYPES }
                                styles={ SELECT_STYLES }/>
                            <Select
                                className="w-40"
                                isDisabled={ !editing }
                                isSearchable={ false }
                                value={ COURSES_INTERVAL_TYPES.find(option => option.value === values.interval) }
                                onChange={ _onSelect("interval") }
                                options={ COURSES_INTERVAL_TYPES }
                                styles={ SELECT_STYLES }/>
                            <input
                                { ...getFieldProps("color") }
                                disabled={ !editing }
                                className="h-8 m-0"
                                type="color"/>
                        </div>
                    </div>
                    {
                        reqMessage
                        ?
                        <span>Student added successfully to the course</span>
                        :
                        null
                    }
                </FormWrapper>
            </div>
        </DefaultWrapper>
    );
}
  
export default AddUser;
