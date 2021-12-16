import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';

import { Option } from './Option';
import { InfoText } from './InfoText';
import { AutoProceed } from './AutoProceed';
import { Switcher } from './Switcher';
import { EndOfDay } from './EndOfDay';

export const Story = () => {
  let [additionals, setAdditionals] = useState([]);
  let [storyIndex, setStoryIndex] = useState(1);
  const [money, setMoney] = useState(0);

  const [wearingPin, setWearingPin] = useState(false);
  const [parentsMovedIn, setParentsMovedIn] = useState(false);
  const [childWorking, setChildWorking] = useState(false);
  const [sentChildToWork, setSentChildToWork] = useState(false);
  const [saidHello, setSaidHello] = useState(false);
  const [goingToStrike, setGoingToStrike] = useState(false);

  const childWorkingBonus = 0.25; //Extra money per day if child is working
  //const dailyMoney = 0.2 * (60 / 6); //20 cents with 60 hour work days and 6 days per week (roughly estimated based on 1911 Buffalo, N.Y. hourly rates https://fraser.stlouisfed.org/title/union-scale-wages-hours-labor-3912/union-scale-wages-hours-labor-1907-1912-476865?start_page=68)
  const [dailyMoney, setDailyMoney] = useState(0.2 * (60 / 6));
  //according to this, tenements costed roughly $10 a month (https://www.tenement.org/blog/the-rent-is-due-a-history-of-rent-at-97-orchard-street/)
  //so that's roughly $120 a year, and if we assume two other families are defraying the cost, it's $40 a year
  //the game happens over roughly a month, so we'll go with $3.33 (cost per month) / 7 ~= 0.5

  //Gonna roughly base food prices based on this: https://www.newspapers.com/clip/2985627/food-prices-1911/
  //Just going to imagine about how much food would be needed for a week and divide the total cost by 7
  //We'll just call it about 60 cents per week or about 10 cents per day

  //{ Food: 0.1, Heat: 0.1, Rent: 0.5 };
  //These numbers look too easy, so I'm buffing them.

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
  const [evicted, setEvicted] = useState(false);
  const [starvedToDeath, setStarvedToDeath] = useState(false);
  const [frozenToDeath, setFrozenToDeath] = useState(false);

  const baseEndOfDayOptions: { [key: string]: number } = { Food: 0.25, Heat: 0.15, Rent: 1.3 };
  const [endOfDayOptions, setEndOfDayOptions] = useState(baseEndOfDayOptions);
  const [endOfDayTitleText, setEndOfDayTitleText] = useState('How will you spend your money?');

  function incrementStory() {
    setStoryIndex(storyIndex + 1);
  }

  function makeDailyMoney(amount = dailyMoney) {
    let newAmount = money + amount;
    if (childWorking) {
      newAmount += childWorkingBonus;
    }
    setMoney(newAmount);
  }

  useEffect(() => {
    let options = Object.assign(baseEndOfDayOptions, {});
    if (childIsSick && !childIsDead) {
      options.Medicine = 1.5;
    } else if (childIsDead) {
      options.Food = options.Food - 0.03;
    }

    if (parentsMovedIn) {
      options.Food = options.Food + 0.07;
    }
    setEndOfDayOptions(options);
  }, [childIsSick, childIsDead, parentsMovedIn]);

  useEffect(() => {
    let finalText = '';

    finalText += childIsSick ? 'Your child is sick. Medicine is available for purchase. ' : '';

    if (daysWithoutFood >= 1) {
      finalText += 'Your family is hungry. ';
    }

    if (daysWithoutRent >= 3) {
      finalText += 'Your landlord is about to evict you. ';
    }

    if (daysWithoutHeat >= 1) {
      finalText += "It's cold. ";
    }

    setEndOfDayTitleText(finalText + 'How will you spend your money?');
  }, [childJustDied, childIsSick, daysWithoutRent, daysWithoutFood, daysWithoutHeat]);

  useEffect(() => {
    if (childJustDied || evicted || starvedToDeath || frozenToDeath) setStoryIndex(0);
  }, [childJustDied, evicted, starvedToDeath, frozenToDeath]);

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

    if (daysWithoutFood > 1) {
      //Starve after the second day without food
      setStarvedToDeath(true);
    } else if (daysWithoutHeat > 2) {
      //Freeze on the third day without heat
      setFrozenToDeath(true);
    } else if (daysWithoutRent > 2) {
      //Evict after three days of no rent
      setEvicted(true);
    }
  }

  return (
    <div css={tw`flex`}>
      <Switcher currentItem={storyIndex}>
        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.transitionDuration = '5s';
            document.body.style.backgroundColor = '#001361';
            audioObject.src = 'music/goodnight.mp3';
            audioObject.loop = false;
            audioObject.play();
          }}
        >
          {childJustDied && <InfoText text="Your child died. You lose..." hideButton={true} />}
          {starvedToDeath && (
            <InfoText text="Your family starved to death. You lose..." hideButton={true} />
          )}
          {frozenToDeath && (
            <InfoText text="Your family froze to death. You lose..." hideButton={true} />
          )}
          {evicted && (
            <InfoText text="Your family has been evicted. You lose..." hideButton={true} />
          )}
        </AutoProceed>

        <AutoProceed
          duration={4000}
          onFinish={() => {
            incrementStory();
          }}
        >
          <InfoText bold={true} text="New York -- Winter 1911" hideButton={true} />
          <InfoText text="It is the Industrial Revolution... " hideButton={true} />
        </AutoProceed>

        <InfoText
          text="It's time to wake up..."
          continueText="Wake Up"
          next={() => {
            document.body.style.backgroundColor = '#333';
            incrementStory();
          }}
        />

        <AutoProceed duration={750} onFinish={incrementStory}>
          <InfoText text="." hideButton={true} />
          <InfoText text=".." hideButton={true} />
          <InfoText text="..." hideButton={true} />
        </AutoProceed>

        <AutoProceed
          duration={5000}
          onFinish={() => {
            incrementStory();
            document.body.style.backgroundColor = '#78878f';
          }}
        >
          <InfoText text="It's five in the morning." hideButton={true} />
          <InfoText
            text={'You have $' + money.toFixed(2) + ' for food, housing, and your family.'}
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

        <AutoProceed duration={5000}>
          <InfoText text="Too bad you work in a factory." hideButton={true} />
          <InfoText text="It's a little like this one..." hideButton={true}>
            <img css={tw`max-h-80`} src="img/factory.jpg" />
          </InfoText>
          <InfoText text="It's dirty." hideButton={true} />
          <InfoText text={'You make $' + dailyMoney / 60 + ' an hour.'} hideButton={true} />
          <InfoText text="You sit down at your station." hideButton={true} />
          <InfoText
            text="There is a little girl to your left, and a young woman to your right."
            hideButton={true}
          />
          <InfoText text="The young woman looks to be no older than nineteen." hideButton={true} />
          <Option
            text=""
            option1="Say hello"
            option2="Do nothing"
            onOption1={() => {
              setSaidHello(true);
              incrementStory();
            }}
            onOption2={() => {
              setStoryIndex(storyIndex + 2);
            }}
          />
        </AutoProceed>

        <AutoProceed duration={4500} onFinish={incrementStory}>
          <InfoText text="You say hi," hideButton={true} />
          <InfoText text="But she doesn't seem to understand English." hideButton={true} />
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
          text={`You worked for 10 hours and made $${dailyMoney.toFixed(2)}`}
          continueText="Walk home"
          next={() => {
            makeDailyMoney();
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
          duration={6000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={incrementStory}
        >
          <InfoText text="Home sweet home." hideButton={true} />
          <InfoText text="You live in a tenement house." hideButton={true}>
            <img css={tw`max-h-80`} src="img/tenement.jpg"></img>
          </InfoText>
          <InfoText
            text="Your family shares a single room with two other families."
            hideButton={true}
          />
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
        >
          <InfoText bold={true} text="The Next Day -- 3PM" hideButton={true} />
          <InfoText text="It's Sunday, your one day of the week off." hideButton={true} />
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
          duration={5000}
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

        <AutoProceed duration={4500} onFinish={incrementStory}>
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

        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={7000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
        >
          <InfoText bold={true} text="A Few Days Later at The Factory -- Noon" hideButton={true} />
          <InfoText text="Your boss stops by to have a word with you." hideButton={true} />
          <InfoText text="" hideButton={true}>
            <div css={tw`text-3xl text-red-500 italic font-mono`}>
              "We could always use more hands around here... Why don't you bring your young one in?"
            </div>
          </InfoText>
          <Option
            text={
              "Will you bring your child to work? He'll earn $" +
              childWorkingBonus +
              ' per day, but it could be dangerous for him.'
            }
            option1="Yes"
            option2="No"
            onOption1={() => {
              setChildWorking(true);
              setSentChildToWork(true);
              incrementStory();
            }}
            onOption2={() => {
              setStoryIndex(storyIndex + 2);
            }}
          />
        </AutoProceed>

        <AutoProceed
          duration={5000}
          onFinish={() => {
            setStoryIndex(storyIndex + 2);
          }}
        >
          <InfoText text={'"Yes, I\'ll bring him in"'} hideButton={true} />
          <InfoText text="Your boss gives you a slight nod of approval." hideButton={true} />
        </AutoProceed>

        <AutoProceed
          duration={5000}
          onFinish={() => {
            incrementStory();
          }}
        >
          <InfoText italic={true} text={'"No, he needs to stay at home."'} hideButton={true} />
          <InfoText text={'Your boss gives you a dissatisfied look.'} hideButton={true} />
        </AutoProceed>

        <InfoText
          text={`You work for the rest of the day and make $${dailyMoney.toFixed(2)}`}
          continueText="Walk home"
          next={() => {
            makeDailyMoney();
            incrementStory();
          }}
        />

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
          {childWorking ? (
            <InfoText
              text={'You have a difficult time telling your child that he has to work now.'}
              hideButton={true}
            />
          ) : (
            <InfoText text={"It's been a long day."} hideButton={true} />
          )}
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
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={6000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
        >
          <InfoText
            bold={true}
            text="A Few Days Later at the Factory -- Morning"
            hideButton={true}
          />
          {childWorking && (
            <InfoText text={"It's your child's first day at work."} hideButton={true} />
          )}
          <InfoText
            text="The factory down the street burned down a few days ago."
            hideButton={true}
          />
          <InfoText text="Your factory has doors that lock from the outside." hideButton={true} />
          <InfoText text="You find this unsettling." hideButton={true} />
          {saidHello ? (
            [
              <InfoText key={1} text="" hideButton={true}>
                <div css={tw`text-2xl text-blue-500 italic font-mono`}>
                  "There is strike... tomorrow. Will you join?"
                </div>
              </InfoText>,
              <InfoText
                key={2}
                text="The young woman next to you caught you off guard."
                hideButton={true}
              />,
              <InfoText
                key={3}
                text="It looks like she can speak a little English after all..."
                hideButton={true}
              />,
              <InfoText
                key={4}
                text="Striking is risky. You could lose your job or suffer other consequences."
                hideButton={true}
              />,
              <Option
                key={5}
                text="Will you join the strike?"
                option1="Yes"
                option2="No"
                onOption1={() => {
                  incrementStory();
                  setGoingToStrike(true);
                }}
                onOption2={() => {
                  setStoryIndex(storyIndex + 2);
                }}
              />,
            ]
          ) : (
            <InfoText
              text="You have a long day ahead of you."
              continueText="Get to work"
              next={() => {
                setStoryIndex(storyIndex + 3);
              }}
            />
          )}
        </AutoProceed>

        <AutoProceed
          duration={4000}
          onFinish={() => {
            setStoryIndex(storyIndex + 2);
          }}
        >
          <InfoText text="" hideButton={true}>
            <div css={tw`text-2xl text-blue-500 italic font-mono`}>"Thank you..."</div>
          </InfoText>
        </AutoProceed>

        <AutoProceed duration={4000} onFinish={incrementStory}>
          <InfoText text="" hideButton={true}>
            <div css={tw`text-2xl text-blue-500 italic font-mono`}>"Oh, okay..."</div>
          </InfoText>
          <InfoText text="She looks disappointed..." hideButton={true} />
        </AutoProceed>

        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={() => {
            makeDailyMoney();
            incrementStory();
          }}
        >
          <InfoText text="Home sweet home." hideButton={true} />
          <InfoText text="Work was hard today..." hideButton={true} />
          <InfoText text={`You made $${dailyMoney.toFixed(2)}...`} hideButton={true} />
          <InfoText text="Long working hours are doing you in..." hideButton={true} />
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
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={5500}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={incrementStory}
        >
          <InfoText bold={true} text="The Next Day" hideButton={true} />

          {goingToStrike
            ? [
                <InfoText
                  key={1}
                  text="Almost everybody is outside the factory."
                  hideButton={true}
                />,
                <InfoText
                  key={2}
                  text="Your boss spots you; he has an incredulous look on his face."
                  hideButton={true}
                />,
                <InfoText
                  key={3}
                  text="The strike lasted for the whole day..."
                  hideButton={true}
                />,
              ]
            : [
                <InfoText key={1} text="There was a strike today." hideButton={true} />,
                <InfoText key={2} text="So you spent the day at home." hideButton={true} />,
              ]}
        </AutoProceed>

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
          <InfoText text="You're unsure of what might happen tomorrow." hideButton={true} />
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
          duration={5500}
          onFinish={() => {
            if (goingToStrike) {
              setChildWorking(false);
            }
          }}
        >
          <InfoText bold={true} text="The Next Day" hideButton={true} />
          {goingToStrike ? (
            [
              <InfoText key={1} text="Your boss stopped by your station." hideButton={true} />,
              <InfoText key={2} text="" hideButton={true}>
                <div css={tw`text-3xl text-red-500 italic font-mono`}>
                  "I saw you at the strike. Don't bring your kid here anymore, we don't need him."
                </div>
              </InfoText>,
            ]
          ) : (
            <InfoText text="Most of your co-workers have been replaced" hideButton={true} />
          )}
          <InfoText text="You keep your head down and get to work." hideButton={true} />
          <InfoText
            text="It's almost a relief that your child doesn't have to work."
            hideButton={true}
          />
          <InfoText text="But you might still need the extra money..." hideButton={true} />
          <InfoText
            text="The little girl neighboring your station slips you something..."
            hideButton={true}
          />
          <InfoText text="" hideButton={true}>
            <img css={tw`max-h-80`} src="img/votesforwomen.jpg"></img>
          </InfoText>
          <InfoText text="It's a homemade suffragette pin..." hideButton={true} />
          <InfoText
            text="Women's suffrage is a heated topic. You might catch nasty looks."
            hideButton={true}
          />
          <Option
            text="Will you wear the pin?"
            option1="Wear the pin"
            option2="Slide it back"
            onOption1={() => {
              setWearingPin(true);
              incrementStory();
            }}
            onOption2={() => {
              setStoryIndex(storyIndex + 2);
            }}
          />
        </AutoProceed>

        <AutoProceed
          duration={5000}
          onFinish={() => {
            setStoryIndex(storyIndex + 2);
          }}
        >
          <InfoText italic={true} text="The girl flashes you a smile," hideButton={true} />
          <InfoText
            italic={true}
            text="But she suddenly looks back down at her station."
            hideButton={true}
          />
          <InfoText bold={true} text="It's your boss" hideButton={true} />
          <InfoText bold={true} italic={true} text="He saw the pin." hideButton={true} />
        </AutoProceed>

        <AutoProceed duration={4000} onFinish={incrementStory}>
          <InfoText italic={true} text="The girl looks disappointed." hideButton={true} />
        </AutoProceed>

        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
            makeDailyMoney();
          }}
          onFinish={incrementStory}
        >
          <InfoText text="Home sweet home." hideButton={true} />
          <InfoText text={`You made another $${dailyMoney.toFixed(2)}.`} hideButton={true} />
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
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        <AutoProceed
          duration={5500}
          onStart={() => {
            document.body.style.backgroundColor = '#333';
          }}
          onFinish={() => {
            setDailyMoney(dailyMoney * 0.75);
            incrementStory();
          }}
        >
          <InfoText bold={true} text="The Next Day" hideButton={true} />

          {wearingPin && [
            <InfoText
              key={1}
              text={'Your boss stopped by your station' + (goingToStrike ? ' again' : '') + '.'}
              hideButton={true}
            />,
            <InfoText
              key={2}
              text={'He tells you your wages have been garnished'}
              hideButton={true}
            />,
          ]}

          {wearingPin && goingToStrike && (
            <InfoText text={'It seems like you like stirring the pot.'} hideButton={true} />
          )}
        </AutoProceed>

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
          onFinish={() => {
            makeDailyMoney();
            incrementStory();
          }}
        >
          <InfoText text="Home sweet home." hideButton={true} />
          {goingToStrike || wearingPin ? (
            <InfoText text="Your future seems uncertain." hideButton={true} />
          ) : (
            <InfoText text="Your life is growing increasingly boring." hideButton={true} />
          )}
          <InfoText text={`You made $${dailyMoney.toFixed(2)}...`} hideButton={true} />
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
          duration={4000}
          onStart={() => {
            document.body.style.backgroundColor = '#000';
          }}
          onFinish={incrementStory}
        ></AutoProceed>

        {parentsMovedIn &&
          goingToStrike &&
          wearingPin &&
          !sentChildToWork && [
            <AutoProceed
              key={1}
              duration={4000}
              onStart={() => {
                document.body.style.backgroundColor = '#333';
                audioObject.src = 'music/buildup.mp3';
                audioObject.loop = true;
                audioObject.play();
              }}
              onFinish={incrementStory}
            >
              <InfoText text="You helped your parents find a place to stay," hideButton={true} />
              <InfoText text="You fought for your rights," hideButton={true} />
              <InfoText
                text="And even kept your child away from dangerous labor."
                hideButton={true}
              />
              <InfoText text="You..." hideButton={true} />
            </AutoProceed>,
            <AutoProceed
              key={2}
              duration={4000}
              onStart={() => {
                document.body.style.backgroundColor = '#000';
              }}
              onFinish={incrementStory}
            ></AutoProceed>,
            <AutoProceed
              key={3}
              duration={4000}
              onStart={() => {
                document.body.style.backgroundColor = '#00a2ff';
                audioObject.src = 'music/win.mp3';
                audioObject.play();
              }}
            >
              <InfoText text="Were on the right side of history." hideButton={true} />
              <InfoText text="You win!" hideButton={true} />
            </AutoProceed>,
          ]}

        {(parentsMovedIn || goingToStrike || wearingPin || !sentChildToWork) && [
          <AutoProceed
            key={1}
            duration={4000}
            onStart={() => {
              document.body.style.backgroundColor = '#333';
              audioObject.src = 'music/buildup.mp3';
              audioObject.loop = false;
              audioObject.play();
            }}
            onFinish={incrementStory}
          >
            {parentsMovedIn && (
              <InfoText text="You helped your parents find a place to stay." hideButton={true} />
            )}
            {goingToStrike && (
              <InfoText text="You fought for better working conditions." hideButton={true} />
            )}
            {wearingPin && <InfoText text="You fought for women's suffrage." hideButton={true} />}
            {!sentChildToWork && (
              <InfoText text="You kept your child away from dangerous labor." hideButton={true} />
            )}
            <InfoText text="You..." hideButton={true} />
          </AutoProceed>,
          <AutoProceed
            key={2}
            duration={4000}
            onStart={() => {
              document.body.style.backgroundColor = '#000';
            }}
            onFinish={incrementStory}
          ></AutoProceed>,
          <AutoProceed
            key={3}
            duration={4000}
            onStart={() => {
              document.body.style.backgroundColor = '#333';
              audioObject.src = 'music/halflose.mp3';
              audioObject.play();
            }}
          >
            <InfoText text="Could have done a little better." hideButton={true} />
            <InfoText text="Try again." hideButton={true} />
          </AutoProceed>,
        ]}
      </Switcher>
    </div>
  );
};
