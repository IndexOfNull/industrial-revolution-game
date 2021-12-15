import React, { ReactNode } from 'react';
import tw from 'twin.macro';
import { TextScroller } from './TextScroller';

type InfoTextProps = {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  continueText?: string;
  next?: Function;
  hideButton?: boolean;
  children?: ReactNode;
};

export const InfoText = ({
  text = '',
  bold = false,
  italic = false,
  underline = false,
  continueText = 'Continue',
  next = () => {},
  hideButton = false,
  children,
}: InfoTextProps) => {
  return (
    <div css={[tw`bg-black rounded-md p-5 px-10 flex flex-col`]}>
      {text.length > 0 && <div css={[tw`text-3xl font-mono`, bold && tw`font-bold`, italic && tw`italic`, underline && tw`underline`]}>{text}</div>}
      {children && <div css={[tw`flex justify-center items-center`, text.length > 0 && tw`mt-5`]}>{children}</div>}
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
