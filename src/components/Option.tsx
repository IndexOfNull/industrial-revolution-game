import React from 'react';
import tw from 'twin.macro';
import { TextScroller } from './TextScroller';

type OptionProps = {
  text: string;
  option1?: string;
  option2?: string;
  option3?: string;
  onOption1?: Function;
  onOption2?: Function;
  onOption3?: Function;
  active?: boolean;
};

export const Option = ({
  active = true,
  text,
  option1,
  option2,
  option3,
  onOption1 = () => {},
  onOption2 = () => {},
  onOption3 = () => {},
}: OptionProps) => {
  const activeClickFilter = (func: Function) => {
    if (active) func();
  };

  return (
    <div css={[tw`bg-black rounded-md p-5 px-10 flex flex-col mb-5`, !active && tw`opacity-10`]}>
      <div css={tw`text-3xl mb-5 font-mono`}>{text}</div>
      {option1 && (
        <button
          css={tw`mr-3 font-serif hover:font-bold`}
          onClick={() => {
            onOption1();
          }}
        >
          {option1}
        </button>
      )}
      {option2 && (
        <button
          css={tw`mr-3 font-serif hover:font-bold`}
          onClick={() => {
            onOption2();
          }}
        >
          {option2}
        </button>
      )}
      {option3 && (
        <button
          css={tw`mr-3 font-serif hover:font-bold`}
          onClick={() => {
            onOption3();
          }}
        >
          {option3}
        </button>
      )}
    </div>
  );
};
