import React from "react";
import tw from "twin.macro";
import { TextScroller } from "./TextScroller";

type OptionProps = {
    text: string
    option1: string
    option2: string
    option3: string
    active?: boolean
}

export const Option = ({active = true, text, option1, option2, option3}: OptionProps) => {

    const activeClickFilter = (func: Function) => {
        if (active) func();
    }

    return (
        <div css={[tw`bg-black rounded-md p-5 px-10 flex flex-col mb-5`, !active && tw`opacity-10`]}>
            <div css={tw`text-3xl mb-5 font-mono`}>{ text }</div>
            <button css={tw`mr-3`}>{ option1 }</button>
            <button css={tw`mr-3`}>{ option2 }</button>
            <button>{ option3 }</button>
        </div>
    )
}