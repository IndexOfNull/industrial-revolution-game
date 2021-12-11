import React, { useEffect, useState } from "react";
import { useInterval } from "../utils/useInterval"
import tw from "twin.macro";

type TextScrollerProps = {
    text: string
    duration?: number
    characterTime?: number
}

export const TextScroller = ({text, duration = 1000, characterTime = undefined}: TextScrollerProps) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    
    const interval = (characterTime == undefined) ? duration / text.length : characterTime

    let clearTimer = useInterval(() => {
        setCurrentIndex(currentIndex + 1);
        if (currentIndex == text.length) {
            clearTimer();
        }
    }, interval);

    return (
        <p>{ text.substr(0, currentIndex) }</p>
    )

}