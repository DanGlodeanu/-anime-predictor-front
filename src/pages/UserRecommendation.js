import React, { useState, useEffect, } from "react";
import axios from "axios";
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import Button from "../components/customizedComponents/Button.js"
import FormWrapper from "../components/wrappers/FormWrapper.js"
import { SELECT_STYLES, } from "../utils/constants.js"
import Select from 'react-select';
import { API_URL, } from "../utils/constants.js"

function UserRecommendation() {
    const [ users, updateUsers ] = useState([]);
    const [ selectedUser, updateSelectedUser ] = useState(null);
    const [ recommendedAnimes, updaterecommendedAnimes ] = useState([]);

    useEffect(() => {
        axios.get(API_URL + '/users')
        .then(res => {
            console.log('res.data', res.data)
            updateUsers(res.data.slice(0, 200).map(userId => ({ label: userId, value: userId, })))
        })
        .catch(err => {
            console.log('err', err)
        })
    }, [])

    const _onSelect = option => {
		updateSelectedUser(option);
	};

    const _onClick = () => {
        if (selectedUser) {
            console.log(selectedUser)
            axios.get(API_URL + '/prediction/' + selectedUser.value)
            .then(res => {
                updaterecommendedAnimes(res.data)
            })
            .catch(err => {
                console.log('err', err)
            })
        }
	};

    return (
        <DefaultWrapper>
            <div className="flex justify-center items-center h-full w-full">
                <FormWrapper>
                    <div className="w-4/5 flex justify-between">
                        <span className="text-2xl">GET RECOMMENDATIONS</span>
                        <Select
                            className="w-40"
                            isSearchable={ false }
                            value={ selectedUser }
                            onChange={ _onSelect }
                            options={ users }
                            styles={ SELECT_STYLES }/>
                    </div>
                    <Button
                        label="Get"
                        type="submit"
                        className="w-4/5 mt-6"
                        onClick={ _onClick }/>
                    <div className="w-4/5 flex flex-col gap-8 mt-6">
                        { recommendedAnimes.map((anime, index) => (
                            <div className="flex flex-col gap-4">
                                <div className="text-xl font-bold">{ index + 1 }. { anime.name }</div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex">
                                        <div className="font-semibold mr-2">Genre:</div>
                                        <div className="anime-info-value">{ anime.genre }</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold mr-2">Rating:</div>
                                        <div className="anime-info-value">{ anime.rating }</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold mr-2">Number of Episodes:</div>
                                        <div className="anime-info-value">{ anime.episodes }</div>
                                    </div>
                                    <div className="flex">
                                        <div className="font-semibold mr-2">Type:</div>
                                        <div className="anime-info-value">{ anime.type }</div>
                                    </div>
                                </div>
                            </div>
                        )) }
                    </div>
                </FormWrapper>
            </div>
        </DefaultWrapper>
    );
}
  
export default UserRecommendation;
