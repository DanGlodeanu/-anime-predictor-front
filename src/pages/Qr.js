import React, { useEffect, useState, } from 'react';
import QRCode from "react-qr-code";
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import FormWrapper from "../components/wrappers/FormWrapper.js";
import { useParams, } from "react-router-dom";
import axios from "axios";
import { API_URL, QR_TYPES, } from "../utils/constants.js"
import Button from "../components/customizedComponents/Button"

function Qr() {
    const [course, updateCourse] = useState({});
    const [token, updateToken] = useState("");
    const { id, } = useParams();

    useEffect(() => {
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
                    updateCourse(res.data.courses)
                }
            })
            .catch(err => console.log(err))
    }, [id]);

    const _addQr = role => () => {
        const rand = [ ...Array(10) ].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        const qrToken = `${ Date.now() }-${ id }-${ rand }`;
        console.log(qrToken)

        const body = {
            course_id: id,
            body: qrToken,
            role: role,
        };
    
        axios.post(API_URL + "/qrs",
                body,
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
                    updateToken(qrToken);
                }
            })
            .catch(err => console.log(err))
    }

    const _getButtons = () => {
        return (
            <div className="flex justify-between w-full mt-8">
                { QR_TYPES.map(qr => (
                    <Button onClick={ _addQr(qr.value) }>
                        { qr.label }
                    </Button>
                ))}
            </div>
        )
    }

    return (
        <DefaultWrapper>
            <div className="flex justify-center items-center h-full w-full">
                <FormWrapper>
                    <span className="text-2xl">
                        Attendance { course.name }
                    </span>
                    { _getButtons() }
                    { token ? (
                        <QRCode
                            className="scale-qr mt-8"
                            fgColor={ course.color }
                            value={ `http://localhost:3000/scan-qr/${ token }` }
                            size={ 256 }
                        />
                    ) : null }
                </FormWrapper>
            </div>
        </DefaultWrapper>
    );
  }
  
  export default Qr;
  