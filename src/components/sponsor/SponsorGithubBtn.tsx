import React from 'react';
import styled from '@emotion/styled';
import { btnColor, ButtonLink } from '../ui/Button';
import { colors } from '../../styles/colors';

export const SponsorGithubBtn: React.FC<{className?: string}> = ({ className }) => {
  return (<ButtonFlex className={className} href="https://github.com/sponsors/matitalatina" target="_blank">❤️ Diventa uno sponsor</ButtonFlex>);
};

const ButtonFlex = styled(ButtonLink)`
  ${btnColor(colors.pink)}
`;
