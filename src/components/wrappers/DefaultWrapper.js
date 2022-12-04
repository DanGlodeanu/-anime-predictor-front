import React from "react";

function DefaultWrapper(props) {
    const { children, } = props;

    return (
        <div className="mx-24 mt-10 py-10">
            { children }
        </div>
    );
}
  
export default DefaultWrapper;
