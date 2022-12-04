import React, { useEffect, useState, useContext, } from 'react';
import { UserContext, } from '../App.js'
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import TableWrapper from '../components/wrappers/TableWrapper.js'
import { useParams, } from "react-router-dom";
import axios from "axios";
import { API_URL, } from "../utils/constants.js"
import Button from "../components/customizedComponents/Button"
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { BsCloudDownload, } from 'react-icons/bs';

function Qr() {
    const { id, } = useParams();
    const [course, updateCourse] = useState({});
    const [date, updateDate] = useState(null);
    const [data1, updateData1] = useState(null);
    const [data2, updateData2] = useState(null);
    const [data3, updateData3] = useState(null);
    const { user, } = useContext(UserContext);

    useEffect(() => {
       
        if(user.id) {
            axios.get(API_URL + "/course/" + id,
                {
                    headers: {
                        Authorization: `Bearer ${ localStorage.getItem("token") }`
                },
            })
            .then(res => {
                if (res?.data?.error) {
                    console.log(res?.data?.error);
                } else {
                    updateCourse(res.data.courses);
                }
            })
            .catch(err => console.log(err))
        }

    }, [user]);

    const _getOptions = data => {
        return {
            chart: {
                type: 'pie',
                height: 355,
                width: 355,
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0,
                plotBorderWidth: 0,
                plotShadow: false,
                backgroundColor: 'transparent',
                style: {
                    fontFamily: '"Roboto Slab", sans-serif !important;',
                },
            },
            title: {
                text: null,
            },
            tooltip: {
                backgroundColor: '#FFFFFF',
                useHTML: true,
                formatter() {
                    let point = this.point;
                    return `
                        <div class="flex">
                            <div>${ point.y + ' Students' }</div>
                            <div class="capitalize pl-2" style="color:${ point.color };">${ point.text }</div>
                        </div>
                    `;
                },
                padding: 10,
                style: {
                    fontSize: '2rem',
                    zIndex: 100,
                },
            },
            series: [{
                dataLabels: { enabled: false },
                data: data,
            }]
        }
    }

    const _updateDate = e => {
        console.log(e.target.value)
        updateDate(e.target.value);

        axios.get(API_URL + "/course/" + id + "/statistics?date=" + e.target.value,
                {
                    headers: {
                        Authorization: `Bearer ${ localStorage.getItem("token") }`
                },
            })
            .then(res => {
                console.log("succes", res)
                if (res?.data?.error) {
                    console.log(res?.data?.error);
                } else {
                    console.log("res", res);

                    updateData1([
                        {
                            y: res.data.start_num,
                            text: 'Present'
                        },
                        {
                            y: res.data.enrolled_students - res.data.start_num,
                            text: 'Absent'
                        },
                    ]);

                    updateData2([
                        {
                            y: res.data.random_num,
                            text: 'Present'
                        },
                        {
                            y: res.data.enrolled_students - res.data.random_num,
                            text: 'Absent'
                        },
                    ]);

                    updateData3([
                        {
                            y: res.data.end_num,
                            text: 'Present'
                        },
                        {
                            y: res.data.enrolled_students - res.data.end_num,
                            text: 'Absent'
                        },
                    ]);
                }
            })
            .catch(err => console.log(err))
    }

    const _downloadAttendance = () => {
        axios({
            url: API_URL + "/course/" + id + "/presence.xlsx?date=" + date,
            method: 'GET',
            responseType: 'blob',
        }).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${ course.name }-${ date }-attendance.xls`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    return (
        <DefaultWrapper>
            <TableWrapper>
                <div className='flex justify-between w-full px-10'>
                    <div className='text-2xl mt-4'>
                        { course.name } ATTENDANCE STATISTICS
                    </div>
                    <input
                        type='date'
                        value={ date }
                        onChange={ _updateDate }
                    />
                </div>
                { date ? (
                    (data1?.[0].y === -1 && data2?.[0].y === -1  && data3?.[0].y === -1) || data1?.[0].y + data1?.[1].y === 0 ? (
                        <div className='my-6 text-2xl text-error'>
                            No attendance in this day
                        </div>
                    ) : (
                        <div className='w-full'>
                            <div className={ `w-full flex ${ data2?.[0].y !== -1 ? 'justify-between' : 'justify-around' }` }>
                                <div className='m-8 flex flex-col justify-center items-center'>
                                    <span className='text-lg'>
                                        Beginning of Course
                                    </span>
                                    <HighchartsReact
                                        highcharts={ Highcharts }
                                        options={ _getOptions(data1) }
                                    />
                                </div>
                                { data2?.[0].y !== -1 ? (
                                    <div className='m-8 flex flex-col justify-center items-center'>
                                        <span className='text-lg'>
                                            Random during the Course
                                        </span>
                                        <HighchartsReact
                                            highcharts={ Highcharts }
                                            options={ _getOptions(data2) }
                                        />
                                    </div>
                                ) : null }
                                <div className='m-8 flex flex-col justify-center items-center'>
                                    <span className='text-lg'>
                                        Ending of Course
                                    </span>
                                    <HighchartsReact
                                        highcharts={ Highcharts }
                                        options={ _getOptions(data3) }
                                    />
                                </div>
                            </div>
                            <div className='w-full flex justify-center my-6'>
                                { user.role === 2
                                    ?
                                    <Button
                                        onClick={ _downloadAttendance }
                                        className="flex">
                                        <BsCloudDownload className="w-5 h-5 mr-5"/>
                                        <span className="tooltiptext">Download Attendance</span>
                                    </Button>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    )
                ) : (
                    <div className='my-6 text-2xl text-error'>
                        Please Select a Date
                    </div>
                ) }
            </TableWrapper>
        </DefaultWrapper>
    );
  }
  
  export default Qr;
  