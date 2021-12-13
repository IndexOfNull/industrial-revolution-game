import * as React from 'react';

import tw from 'twin.macro';

import { Counter } from './components/Counter';
import { Story } from './components/Story';

//Preload images
const images = ['factory.jpg', 'aspeno.jpg', 'tenement.jpg', 'aspeno.gif', 'tenement.jpg'];
images.forEach((img) => {
  const imgObject = new Image();
  imgObject.src = 'img/' + img;
});
//For some reason, the root mounted component cannot be a functional component, so a class is used instead.
export class App extends React.Component {
  render() {
    return (
      <div css={tw`h-screen w-screen flex justify-center items-center text-white`}>
        <div css={tw`p-5 rounded text-center`}>
          <Story></Story>
        </div>
      </div>
    );
  }
}
