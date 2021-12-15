import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';

type EndofDayProps = {
  onContinue: (newAmount: number, selectedOptions: string[]) => void;
  continueText?: string;
  moneyToSpend: number;
  text?: string;
  options: { [key: string]: number };
};

export const EndOfDay = ({
  onContinue,
  continueText = 'Continue',
  text = 'How will you spend your money?',
  moneyToSpend,
  options,
}: EndofDayProps) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [moneyLeft, setMoneyLeft] = useState(moneyToSpend);

  useEffect(() => {
    let sum = 0;
    selectedOptions.forEach((option) => {
      sum += options[option];
    });
    setMoneyLeft(moneyToSpend - sum);
  }, [selectedOptions]);

  return (
    <div css={[tw`bg-black rounded-md p-5 px-10 flex flex-col mb-5`]}>
      <div css={tw`text-3xl font-mono`}>{text}</div>
      <div css={tw`text-3xl font-mono mb-2`}>You have ${moneyLeft}</div>
      {Object.keys(options).map((option) => {
        const optionCost = options[option];
        return (
          <div key={option} css={tw`mb-1`}>
            <input
              css={tw`appearance-none cursor-pointer w-7 h-7 border-white border-2 checked:border-red-500 checked:bg-red-500 align-middle rounded-sm mr-2`}
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  if (moneyToSpend - optionCost < 0) {
                    e.preventDefault();
                    e.target.checked = false;
                    return;
                  }
                  setSelectedOptions((selectedOptions) => [...selectedOptions, option]);
                } else {
                  setSelectedOptions(selectedOptions.filter((item) => item !== option));
                }
              }}
            />
            <label>
              {option} (-{optionCost})
            </label>
          </div>
        );
      })}
      <button
        css={tw`mt-5 font-serif hover:font-bold`}
        onClick={() => {
          onContinue(moneyLeft, selectedOptions);
        }}
      >
        {continueText}
      </button>
    </div>
  );
};
