import React from "react";
import tw from "twin.macro";

export const Counter = () => {

    const [val, setVal] = React.useState(0);

    return (
        <div>
            <h1>{val}</h1>
            <button css={tw`bg-gray-500`} onClick={() => setVal(val+1)}>Increment</button>
        </div>
    )
}