import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';

import { Option } from './Option';
import { InfoText } from './InfoText';
import { AutoProceed } from './AutoProceed';
import { Switcher } from './Switcher';
import { EndOfDay } from './EndOfDay';

export const Story = () => {
  let [additionals, setAdditionals] = useState([]);
  let [storyIndex, setStoryIndex] = useState(12);
  const [money, setMoney] = useState(10);

  const [wearingPin, setWearingPin] = useState(false);
  const [parentsMovedIn, setParentsMovedIn] = useState(false);

  const [musicSource, setMusicSource] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [audioObject, setAudioObject] = useState(new Audio());

  function incrementStory() {
    setStoryIndex(storyIndex + 1);
  }

  return (
    <div css={tw`flex`}>
      <Switcher currentItem={storyIndex}>
        <AutoProceed
          duration={1000}
          onFinish={() => {
            incrementStory();
          }}
        >
          <InfoText text="The year is 1911." hideButton={true} />
          <InfoText text="It is the Industrial Revolution. " hideButton={true} />
          <InfoText text="You're the mother of a single child..." hideButton={true} />
        </AutoProceed>

        <InfoText
          text="It's time to wake up..."
          continueText="Wake Up"
          next={() => {
            document.body.style.backgroundColor = '#333';
            incrementStory();

            audioObject.src = 'music/test.mp3';
            audioObject.play();
          }}
        />

        <AutoProceed
          duration={100}
          onFinish={() => {
            incrementStory();
            document.body.style.backgroundColor = '#78878f';
          }}
        >
          <InfoText text="." hideButton={true} />
          <InfoText text=".." hideButton={true} />
          <InfoText text="..." hideButton={true} />
          <InfoText text="It's five in the morning..." hideButton={true} />
          <InfoText
            text={'You have $' + money + ' for food, housing, and your family.'}
            hideButton={true}
          />
          <InfoText
            text="The walk to work is long, but the sun comes up along the way."
            hideButton={true}
          />
        </AutoProceed>

        <AutoProceed
          duration={500}
          onFinish={() => {
            document.body.style.backgroundColor = '#333';
            incrementStory();
          }}
        >
          <InfoText text="." hideButton={true} />
          <InfoText text=".." hideButton={true} />
          <InfoText text="..." hideButton={true} />
        </AutoProceed>

        <AutoProceed duration={3000}>
          <InfoText text="Too bad you work in a factory." hideButton={true} />
          <InfoText text="It's a little like this one..." hideButton={true}>
            <img src="img/factory.jpg" />
          </InfoText>
          <InfoText text="It's dirty." hideButton={true} />
          <Option
            text="You sit down at your station. There is a child to your left, and a young girl to your right. She looks to be no older than nineteen."
            option1="Say hello"
            option2="Do nothing"
            onOption1={() => {
              setStoryIndex(5);
            }}
            onOption2={() => {
              setStoryIndex(6);
            }}
          />
        </AutoProceed>

        <AutoProceed
          duration={3000}
          onFinish={() => {
            incrementStory();
          }}
        >
          <InfoText text="You say hi." hideButton={true} />
          <InfoText text="She doesn't understand English." hideButton={true} />
        </AutoProceed>

        <InfoText
          text="You have a long day ahead of you."
          continueText="Get to work"
          next={() => {
            incrementStory();
          }}
        />

        {/* Fade to black */}
        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={() => {
            incrementStory();
          }}
        ></AutoProceed>

        <AutoProceed
          duration={3000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={() => {
            incrementStory();
          }}
        >
          <InfoText text="The work day is over." hideButton={true} />
        </AutoProceed>

        <InfoText
          text="You worked for 16 hours and made $1.50"
          continueText="Walk home"
          next={() => {
            setMoney(money + 1.5);
            incrementStory();
          }}
        />

        {/* Fade to black */}
        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={() => {
            incrementStory();
          }}
        ></AutoProceed>

        <AutoProceed
          duration={5000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={() => {
            incrementStory();
          }}
        >
          <InfoText text="Home sweet home." hideButton={true} />
          <InfoText text="It's a tenement house." hideButton={true}>
            <img src="img/tenement.jpg"></img>
          </InfoText>
          <InfoText text="It's really quite dirty and odorous..." hideButton={true} />
          <InfoText text="Your evening duties are calling you." hideButton={true} />
        </AutoProceed>

        <EndOfDay
          onContinue={(newAmount, optionsSelected) => {
            console.log(newAmount);
            setMoney(newAmount);
            incrementStory();
          }}
          options={{ Food: 1.5, Heat: 1.5, Rent: 3, Medicine: 3 }}
          moneyToSpend={money}
        />

        {/*         <InfoText text="This is your boss..." hideButton={true}>
          <img src="img/aspeno.gif"></img>
        </InfoText> */}
      </Switcher>
    </div>
  );
};
