import React from 'react';

import { SubscribeForm } from './SubscribeForm';
import { Hero } from '../ui/hero/Hero';
import { HeroTitle } from '../ui/hero/HeroTitle';

export interface SubscribeProps {
  title: string;
}

export const Subscribe: React.FC<SubscribeProps> = props => {
  return (
    <SubscribeFormSection>
      <SubscribeFormTitle css={SubscribeFormTitle}>Rimanere aggiornati è fondamentale</SubscribeFormTitle>
      <p>Ricevi le ultime novità via email</p>
      <SubscribeForm />
    </SubscribeFormSection>
  );
};

const SubscribeFormSection = Hero;

const SubscribeFormTitle = HeroTitle;
