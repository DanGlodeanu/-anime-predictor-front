import React from "react";

function Button(props) {
    const { children, label, className, onClick, disabled, } = props;

    return (
        <button
            className={ `transition duration-700 ease-in-out border border-black rounded-lg px-10 py-3 hover:bg-black2 hover:text-white2 hover:border-white2 ${ className ? className : '' }` }
            disabled={ disabled }
            onClick={ onClick }>
            { children ? children : label }
        </button>
    );
}
  
export default Button;
