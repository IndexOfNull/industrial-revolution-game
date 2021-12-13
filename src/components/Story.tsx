import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';

import { Option } from './Option';
import { InfoText } from './InfoText';
import { AutoProceed } from './AutoProceed';
import { Switcher } from './Switcher';
import { EndOfDay } from './EndOfDay';

export const Story = () => {
  let [additionals, setAdditionals] = useState([]);
  let [storyIndex, setStoryIndex] = useState(13);
  const [money, setMoney] = useState(10);

  const [wearingPin, setWearingPin] = useState(false);
  const [parentsMovedIn, setParentsMovedIn] = useState(false);

  const [musicSource, setMusicSource] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [audioObject, setAudioObject] = useState(new Audio());

  const [daysWithoutMedicine, setDaysWithoutMedicine] = useState(0);
  const [daysWithoutFood, setDaysWithoutFood] = useState(0);
  const [daysWithoutRent, setDaysWithoutRent] = useState(0);
  const [daysWithoutHeat, setDaysWithoutHeat] = useState(0);
  const [childIsSick, setChildIsSick] = useState(false);
  const [childIsDead, setChildIsDead] = useState(false);
  const [childJustDied, setChildJustDied] = useState(false);

  const baseEndOfDayOptions: { [key: string]: number } = { Food: 1.5, Heat: 1.5, Rent: 3 };
  const [endOfDayOptions, setEndOfDayOptions] = useState(baseEndOfDayOptions);
  const [endOfDayTitleText, setEndOfDayTitleText] = useState('How will you spend your money?');

  function incrementStory() {
    setStoryIndex(storyIndex + 1);
  }

  useEffect(() => {
    let options = Object.assign(baseEndOfDayOptions, {});
    if (childIsSick && !childIsDead) {
      options.Medicine = 3;
    } else if (childIsDead) {
      options.Food = options.Food - 0.5;
    }

    if (parentsMovedIn) {
      options.Food = options.Food + 1;
    }
    setEndOfDayOptions(options);
  }, [childIsSick, childIsDead, parentsMovedIn]);

  useEffect(() => {
    let finalText = '';

    if (childJustDied) {
      finalText += 'Your child has died. ';
    } else {
      finalText += childIsSick ? 'Your child is sick. Medicine is available for purchase. ' : '';
    }

    if (daysWithoutRent >= 3) {
      finalText += 'Your landlord is planning on evicting you. ';
    }

    if (daysWithoutHeat > 1) {
      finalText += "It's cold. ";
    }

    setEndOfDayTitleText(finalText + 'How will you spend your money?');
  }, [childJustDied, childIsSick, daysWithoutRent, daysWithoutFood, daysWithoutHeat]);

  function chanceRoll(percentChance: number) {
    const random = Math.random() * 100;
    return 100 - percentChance < random;
  }

  function endOfDayHandler(newMoney: number, selectedOptions: string[]) {
    //The real game logic
    setMoney(newMoney);
    incrementStory();

    if (childJustDied) {
      setChildJustDied(false);
    }

    //Handle incrementing
    if (selectedOptions.indexOf('Food') == -1) {
      setDaysWithoutFood(daysWithoutFood + 1);
    } else {
      setDaysWithoutFood(0);
    }

    if (selectedOptions.indexOf('Rent') == -1) {
      setDaysWithoutRent(daysWithoutRent + 1);
    } else {
      setDaysWithoutRent(0);
    }

    if (selectedOptions.indexOf('Heat') == -1) {
      setDaysWithoutHeat(daysWithoutHeat + 1);
    } else {
      setDaysWithoutHeat(0);
    }

    if (childIsSick && selectedOptions.indexOf('Medicine') == -1) {
      setDaysWithoutMedicine(daysWithoutMedicine + 1);
    } else {
      setDaysWithoutMedicine(0);
      if (chanceRoll(50)) {
        setChildIsSick(false);
      }
    }

    if (!childIsDead) {
      const childSicknessChance = Math.min(Math.max(0, daysWithoutHeat * 20), 50);
      if (chanceRoll(childSicknessChance) && !childIsSick) {
        setChildIsSick(true);
      }

      const childDeathChance = Math.min(Math.max(0, daysWithoutMedicine * 15), 50); //Clamp between 0 -> 50% chance, will be 0 if there's no days without medicine
      if (chanceRoll(childDeathChance)) {
        setChildIsDead(true); //They died :(
        setChildJustDied(true);
        setChildIsSick(false);
        setDaysWithoutMedicine(0);
      }
    }
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
          <InfoText text="It's the winter of 1911." hideButton={true} />
          <InfoText text="It's cold in New York." hideButton={true} />
          <InfoText text="It is the Industrial Revolution... " hideButton={true} />
          <InfoText text="And you're the mother of a single child..." hideButton={true} />
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

        <AutoProceed duration={3000} onFinish={incrementStory}>
          <InfoText text="You say hi." hideButton={true} />
          <InfoText text="She doesn't understand English." hideButton={true} />
        </AutoProceed>

        <InfoText
          text="You have a long day ahead of you."
          continueText="Get to work"
          next={incrementStory}
        />

        {/* Fade to black */}
        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={3000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={incrementStory}
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
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={5000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={incrementStory}
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
            endOfDayHandler(newAmount, optionsSelected);
          }}
          options={endOfDayOptions}
          text={endOfDayTitleText}
          continueText="Next"
          moneyToSpend={money}
        />

        <AutoProceed
          duration={6000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={3000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
        >
          <InfoText text="The Next Day -- 12PM" hideButton={true} />
          <InfoText text="It's your single day off" hideButton={true} />
          <InfoText text="You've received a letter from your parents." hideButton={true} />
          <InfoText
            text="They've immigrated to the United States and need a place to stay."
            hideButton={true}
          />
          <Option
            text="Will you let your parents move in?"
            option1="Yes"
            option2="No"
            onOption1={() => {
              setParentsMovedIn(true);
              incrementStory();
            }}
            onOption2={() => {
              setStoryIndex(storyIndex + 2);
            }}
          />
        </AutoProceed>

        <AutoProceed
          duration={3000}
          onFinish={() => {
            setStoryIndex(storyIndex + 2);
          }}
        >
          <InfoText
            text="You spend the rest of the day helping your parents move in."
            hideButton={true}
          />
          <InfoText text="Your tenement home is getting cramped." hideButton={true} />
          <InfoText text="Your evening duties are calling you." hideButton={true} />
        </AutoProceed>

        <AutoProceed duration={3000} onFinish={incrementStory}>
          <InfoText
            text="Your parents aren't happy that you won't let them move in."
            hideButton={true}
          />
          <InfoText text="It's getting late." hideButton={true} />
          <InfoText text="Your evening duties are calling you." hideButton={true} />
        </AutoProceed>

        <EndOfDay
          onContinue={(newAmount, optionsSelected) => {
            endOfDayHandler(newAmount, optionsSelected);
          }}
          options={endOfDayOptions}
          text={endOfDayTitleText}
          continueText="Next"
          moneyToSpend={money}
        />

        {/*         <InfoText text="This is your boss..." hideButton={true}>
          <img src="img/aspeno.gif"></img>
        </InfoText> */}
      </Switcher>
    </div>
  );
};
