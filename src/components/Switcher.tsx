import React, { ReactNode } from 'react';

type SwitcherProps = {
  currentItem: number;
  children: ReactNode;
};

export const Switcher = ({ currentItem, children }: SwitcherProps) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div>
      {childrenArray.map((child, index) => {
        if (index == currentItem) {
          return child;
        }
      })}
    </div>
  );
};
