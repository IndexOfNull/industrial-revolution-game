import React, { ReactNode } from 'react';
import tw from 'twin.macro';
import { TextScroller } from './TextScroller';

type InfoTextProps = {
  text: string;
  continueText?: string;
  next?: Function;
  hideButton?: boolean;
  children?: ReactNode;
};

export const InfoText = ({
  text,
  continueText = 'Continue',
  next = () => {},
  hideButton = false,
  children,
}: InfoTextProps) => {
  return (
    <div css={[tw`bg-black rounded-md p-5 px-10 flex flex-col mb-5`]}>
      <div css={tw`text-3xl font-mono`}>{text}</div>
      {children && <div css={tw`flex justify-center items-center mt-5`}>{children}</div>}
      {!hideButton && (
        <button
          css={tw`mt-5 font-serif hover:font-bold`}
          onClick={() => {
            next();
          }}
        >
          {continueText}
        </button>
      )}
    </div>
  );
};
