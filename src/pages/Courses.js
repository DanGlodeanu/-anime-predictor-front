import React, { useState, useEffect, useContext} from 'react';
import { Link } from "react-router-dom";
import { VscPieChart, } from 'react-icons/vsc';
import axios from "axios";
import { API_URL, } from "../utils/constants.js";
import { FiEdit, } from 'react-icons/fi';
import { AiOutlineQrcode, } from 'react-icons/ai';
import TableWrapper from '../components/wrappers/TableWrapper.js'
import Button from "../components/customizedComponents/Button"
import { useNavigate, } from "react-router-dom";
import { UserContext, } from '../App.js'
import { COURSES_DAY_TYPES, COURSES_INTERVAL_TYPES, SELECT_STYLES, } from "../utils/constants.js";
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"

function Courses() {
    const [courses, updateCourses] = useState([]);
    const { user, } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("after login", user)
        if (user.id) {
            console.log(user)
            if (user.role === 3) {
                axios.get(API_URL + "/user/courses?email=" + user.email)
                    .then(res => {
                        console.log("succes", res)
                        if (res?.data?.error) {
                            console.log(res?.data?.error);
                        } else {
                            console.log("res", res);
                            updateCourses(res.data.courses)
                        }
                    })
                    .catch(err => console.log(err))
            }
            else {
                axios.get(API_URL + "/teacher/courses?email=" + user.email)
                    .then(res => {
                        console.log("succes", res)
                        if (res?.data?.error) {
                            console.log(res?.data?.error);
                        } else {
                            console.log("res", res);
                            updateCourses(res.data.courses)
                        }
                    })
                    .catch(err => console.log(err))
            }
        }
    }, [user]);

    const getHeader = ()  => {
        const titles = ['Course Name', 'Profesor', 'Interval']
        return titles.map((title) => (
            <th className="pt-5 pl-6 pb-2 border-b border-gray-500 text-left">
                { title }
            </th>
        ))
    }

    const getCourse = ()  => {
        return courses.map((course) => (
        
            <tr>
                <td className="pt-6 pb-2 pl-6 border-b border-black text-left text-sm flex-wrap break-normal">
                    <input className="w-full" disabled value={ course.name }/>
                </td>
                <td className="pt-6 pb-2 pl-6 border-b border-black text-left text-sm">
                    <input className="w-full" disabled value={ course.teacher_email }/>
                </td>
                <td className="pt-6 pb-2 pl-6 border-b border-black text-left text-sm">
                    <input className="w-full" disabled value={COURSES_DAY_TYPES.find(option => option.value === course.week_day)?.label +
                        ' ' + COURSES_INTERVAL_TYPES.find(option => option.value === course.interval)?.label}/>
                </td>
                <td className="pt-6 pb-2 pl-6 border-b border-black text-left text-sm">
                    <div className="flex justify-between">
                        { user.role === 2
                            ? 
                            <Link className="tooltip" to={ `/edit-course/${ course.id }` }>
                                <FiEdit className="w-4 h-5"/>
                                    <span className="tooltiptext">Edit Course</span>
                            </Link>
                            :
                            <></>
                        }
                        { user.role === 2
                            ? 
                            <Link className="tooltip" to={ `/qr/${ course.id }` }>
                                <AiOutlineQrcode className="w-5 h-5"/>
                                <span className="tooltiptext">Generate QR</span>
                            </Link>
                            :
                            <></>
                        }
                        <Link className="tooltip" to={ `/statistics/${ course.id }`}>
                            <VscPieChart className="w-5 h-5"/>
                            <span className="tooltiptext">Show Statistics</span>
                        </Link>
                    </div>
                </td>
            </tr>
        ))
    }

    const _onClick = () => {
        navigate("/add-course");
    }

    return (
        <DefaultWrapper>
            <TableWrapper>
                <span className='text-2xl'>
                    COURSES
                </span>
                <table className="w-11/12 table-auto mx-auto">
                    <thead>
                        <tr>
                            { getHeader() }
                            <th className="pb-2 pt-5 border-b border-gray-500">
                            { user.role === 2
                                ? 
                                <Button
                                    label="Add Course"
                                    onClick={ _onClick }/>
                                :
                                <></>
                            }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { getCourse() }
                    </tbody>
                </table>
            </TableWrapper>
        </DefaultWrapper>
    );
  }
  
  export default Courses;
  