import React from "react";
import tw from "twin.macro";
import { TextScroller } from "./TextScroller";

type InfoTextProps = {
    text: string
    continueText?: string
    next?: Function
    hideButton?: boolean
}

export const InfoText = ({text, continueText = "Continue", next = () => {}, hideButton = false}: InfoTextProps) => {

    return (
        <div css={[tw`bg-black rounded-md p-5 px-10 flex flex-col mb-5`]}>
            <div css={tw`text-3xl font-mono`}>{ text }</div>
            { !hideButton &&
                <button css={tw`mt-5 font-serif hover:font-bold`} onClick={() => {next()}}>{ continueText }</button>
            }
        </div>
    )
}