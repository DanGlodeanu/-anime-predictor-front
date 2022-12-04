import React from "react";

function Input(props) {
    const { placeholder, type, label, error, onChange, value, labelClassName, inputClassName, id, isDisabled, } = props;

    return (
        <label
            for={ id }
            className={`w-24 flex flex-col self-center ${ labelClassName ? labelClassName : '' } ${ error ? 'text-error' : '' }`}>
            { label }
            { type === "textarea"
                ?
                <textarea
                    value={ value }
                    onChange={ onChange }
                    id={ id }
                    type={ type }
                    className= {`flex flex-col py-3 px-3.5 border ${ inputClassName ? inputClassName : '' } ${ error ? 'border-error' : 'border-black' }`}
                    disabled={ isDisabled }/>  
                :
                <input
                    value={ value }
                    onChange={ onChange }
                    id={ id }
                    type={ type }
                    placeholder={ placeholder }
                    className= {`placeholder-black flex flex-col py-1 px-1 border ${ inputClassName ? inputClassName : '' } ${ error ? 'border-error' : 'border-black' }`}
                    disabled={ isDisabled }/>  
            }
            <div className="text-xs h-2">
                { error }
            </div>
        </label>
    );
}

export default Input;