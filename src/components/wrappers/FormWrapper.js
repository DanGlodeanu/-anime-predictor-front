import React from "react";

function FormWrapper(props) {
    const { children, } = props;

    return (
        <div className="w-160 min-h-max bg-primary flex flex-col items-center p-10 animate-fade-in-up">
            { children }
        </div>
    );
}
  
export default FormWrapper;
