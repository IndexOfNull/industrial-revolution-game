import React, { ReactNode, useEffect, useState } from 'react';

type AutoProceedProps = {
  duration?: number;
  children?: ReactNode;
  onStart?: Function;
  onFinish?: Function;
  onChange?: Function;
};

export const AutoProceed = ({
  duration = 1000,
  children,
  onStart = () => {},
  onFinish = () => {},
  onChange = () => {},
}: AutoProceedProps) => {
  const childrenArray = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    return onStart();
  }, []);

  useEffect(() => {
    if (!done) {
      const timeout = setTimeout(() => {
        if (currentIndex < childrenArray.length - 1) {
          setCurrentIndex(currentIndex + 1);
          onChange();
        } else {
          setDone(true);
          onFinish();
          onChange();
          //setCurrentIndex(0); //Super hacky but this allows us to stack AutoProceed components together
        }
      }, duration);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentIndex, done]);

  return (
    <div>
      {childrenArray.map((child, index) => {
        if (currentIndex == index) {
          return child;
        }
      })}
    </div>
  );
};
