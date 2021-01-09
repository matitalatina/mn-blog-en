import React from 'react';
import { css } from '@emotion/react';

import { colors } from '../../styles/colors';
import { SubscribeForm } from './SubscribeForm';
import { Hero } from '../ui/hero/Hero';
import styled from '@emotion/styled';
import { HeroTitle } from '../ui/hero/HeroTitle';

export interface SubscribeProps {
  title: string;
}

export const Subscribe: React.FC<SubscribeProps> = props => {
  return (
    <SubscribeFormSection>
      <SubscribeFormTitle>Keeping up to date is essential</SubscribeFormTitle>
      <p>Get the latest news by email</p>
      <SubscribeForm />
    </SubscribeFormSection>
  );
};

const SubscribeFormSection = Hero;

const SubscribeFormTitle = HeroTitle;
