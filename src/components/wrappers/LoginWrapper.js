import React from "react";

function LoginWrapper(props) {
    const { children, } = props;

    return (
        <div className="flex justify-center items-center h-full w-full px-24 pb-10">
            { children }
        </div>
    );
}
  
export default LoginWrapper;
