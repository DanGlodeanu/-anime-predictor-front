import React from "react";

function FormWrapper(props) {
    const { children, } = props;

    return (
        <div className="py-4 w-11/12 h-auto bg-primary m-auto flex flex-col items-center animate-fade-in-up px-6">
            { children }
        </div>
    );
}
  
export default FormWrapper;
