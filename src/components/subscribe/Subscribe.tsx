import React from 'react';

import { SubscribeForm } from './SubscribeForm';
import { Hero } from '../ui/hero/Hero';
import { HeroTitle } from '../ui/hero/HeroTitle';

export interface SubscribeProps {
  title: string;
}

export const Subscribe: React.FC<SubscribeProps> = () => {
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
