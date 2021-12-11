import React, { useState, useEffect } from "react";
import tw from "twin.macro";

import { Option } from "./Option";
import { InfoText } from "./InfoText";
import { AutoProceed } from "./AutoProceed";

export const Story = () => {

    let [additionals, setAdditionals] = useState([]);
    let [storyIndex, setStoryIndex] = useState(0);
    const [money, setMoney] = useState(0);

    const [wearingPin, setWearingPin] = useState(false);
    const [parentsMovedIn, setParentsMovedIn] = useState(false);

    function incrementStory() {
        setStoryIndex(storyIndex + 1);
    }

    /*useEffect(() => {
        let counter = 0;
        let interval = setInterval(() => {
            console.log("running")
            setStoryIndex(counter);
            counter++;
            if (counter == 3) {
                clearInterval(interval);
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [])*/

    const story = [

        <AutoProceed duration={50}>

            <InfoText text="The year is 1911." hideButton={true}/>
            <InfoText text="It is the Industrial Revolution. " hideButton={true}/>
            <InfoText text="You work in a factory." hideButton={true}/>
            <InfoText text="You're the mother of a single child..." hideButton={true}/>
            <InfoText text="It's five in the morning" hideButton={true}/>
            <InfoText text="Time to wake up..." continueText="Wake Up" next={() => {
                document.body.style.backgroundColor = "#333"
                incrementStory();
            }}/>
            
        </AutoProceed>,

        <InfoText 
        text="" next={() => incrementStory()}/>

    ]


    return (
        <div css={tw`flex flex-col-reverse`}>

            {story[storyIndex]}
            
            
        </div>
    )
}