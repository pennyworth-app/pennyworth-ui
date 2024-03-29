import React from "react";
import { addDecorator } from '@storybook/react';
import styled, { createGlobalStyle } from "styled-components";

import { Font } from '../styles';

// TODO I should just be able to use Styles here but it's not working for some reason
addDecorator((storyFn) => (
  <StorybookContainer>
    <StorybookGlobalStyles/>
    {storyFn()}
  </StorybookContainer>
));


// TODO I'd like to get rid of all of this
const StorybookGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Roboto&display=swap');

  * {
    font-family: ${Font.OpenSans};
  }
`;

const StorybookContainer = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Roboto&display=swap');

  * {
    font-family: ${Font.OpenSans};
  }
`;
