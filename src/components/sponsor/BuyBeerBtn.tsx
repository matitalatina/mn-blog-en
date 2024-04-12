import React from 'react';
import { ButtonLink } from '../ui/Button';

export const BuyBeerButton: React.FC<{className?: string}> = ({ className }) => {
  return (<ButtonLink className={className} href="https://www.buymeacoffee.com/mattianatali" target="_blank">☕️ Buy me a coffee</ButtonLink>);
};
