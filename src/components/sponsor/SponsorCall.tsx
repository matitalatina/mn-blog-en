import { BuyBeerButton } from "./BuyBeerBtn"

import React from 'react';
import { Hero } from "../ui/hero/Hero";
import { HeroTitle } from "../ui/hero/HeroTitle";
import { SponsorGithubBtn } from "./SponsorGithubBtn";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const boxCss = css`
  /* flex: 0 1; */
  margin: 5px;
`;

export const SponsorCall: React.FC = () => {
  return (<Hero>
    <HeroTitle>Do you like my content?</HeroTitle>
    <p>Help me creating other stuff like this!</p>
    <BtnGroup>
      <BuyBeerButton css={boxCss} />
      <SponsorGithubBtn css={boxCss} />
    </BtnGroup>
  </Hero>);
};


const BtnGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;