import React, { useState, useEffect, } from "react";
import axios from "axios";
import DefaultWrapper from "../components/wrappers/DefaultWrapper.js"
import Button from "../components/customizedComponents/Button.js"
import Input from "../components/customizedComponents/Input.js";
import FormWrapper from "../components/wrappers/FormWrapper.js"
import { SELECT_STYLES, } from "../utils/constants.js"
import Select from 'react-select';
import { API_URL, } from "../utils/constants.js"
import { AiFillDelete, } from 'react-icons/ai'

function ColdStart() {
    const [ animes, updateAnimes ] = useState([]);
    const [ selectedAnimes, updateSelectedAnimes ] = useState([]);
    const [ recommendedAnimes, updaterecommendedAnimes ] = useState([]);
    const [ loading, updateLoading ] = useState(false);

    useEffect(() => {
        axios.get(API_URL + '/animes')
        .then(res => {
            updateAnimes([...Array(300).keys()].map(index => ({
                label: res.data.name[index],
                value: res.data.anime_id[index],
                rating: '',
            })))
        })
        .catch(err => {
            console.log('err', err)
        })
    }, [])

    const _onSelect = option => {
        const anime = selectedAnimes.find(selectedAnime => selectedAnime.value === option.value)
        console.log(option, anime, selectedAnimes)
        if (!anime) {
            updateSelectedAnimes([...selectedAnimes, option]);
        }
	};

    const removeAnime = (value) => () => {
        updateSelectedAnimes(selectedAnimes.filter(selectedAnime => selectedAnime.value !== value));
    }

    const updateRating = (animeId) => (event) => {
        updateSelectedAnimes(selectedAnimes.map(selectedAnime => ({
            ...selectedAnime,
            rating: selectedAnime.value === animeId ? event.target.value : selectedAnime.rating,
        })));
    }

    const _onClick = () => {
        if (selectedAnimes) {
            updateLoading(true)
            
            axios.post(API_URL + '/new-user-prediction', selectedAnimes.map(selectedAnime => ({
                anime_id: selectedAnime.value,
                rating: isNaN(selectedAnime.rating) ? -1 : parseInt(selectedAnime.rating)
            })))
            .then(res => {
                updateLoading(false)
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
                        <span className="text-2xl">COLD START</span>
                        <Select
                            className="w-40"
                            isSearchable={ false }
                            onChange={ _onSelect }
                            options={ animes }
                            styles={ SELECT_STYLES }/>
                    </div>
                    <Button
                        label={ loading ? 'Loading...' : 'Get'}
                        disabled={ loading }
                        type="submit"
                        className="w-4/5 mt-6"
                        onClick={ _onClick }/>
                    <div className="w-4/5 flex flex-col gap-8 mt-6">
                        { !recommendedAnimes.length && selectedAnimes.map(selectedAnime => (
                            <div key={ selectedAnime.value } className="flex justify-between items-baseline">
                                <div className="font-semibold mr-2">{ selectedAnime.label }</div>
                                <div className="flex justify-end gap-2">
                                <Input
                                    value={ selectedAnime.rating }
                                    onChange={ updateRating(selectedAnime.value) }
                                    placeholder="Rating"
                                    id="descriptionInput"/>
                                    <button onClick={ removeAnime(selectedAnime.value) }>
                                        <AiFillDelete />
                                    </button>
                                </div>
                            </div>
                        )) }
                    </div>
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
  
export default ColdStart;
