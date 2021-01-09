import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { desaturate, darken, mix } from 'polished';
import { colors } from '../../styles/colors';

export const btnColor = (color: string) => css`
  background: linear-gradient(
    ${mix('0.1', '#fff', color)},
    ${desaturate('0.1', darken('0.07', color))} 60%,
    ${desaturate('0.1', darken('0.07', color))} 90%,
    ${desaturate('0.1', darken('0.04', color))}
  );

  :active,
  :focus {
    /* background: color(var(--blue) lightness(-9%) saturation(-10%)); */
    background: ${desaturate('0.1', darken('0.09', color))};
  }
`;

export const buttonStyle = css`
  position: relative;
  display: inline-block;
  padding: 0 20px;
  height: 43px;
  outline: none;
  color: #fff;
  font-size: 1.5rem;
  line-height: 39px;
  font-weight: 400;
  text-align: center;
  /* background: linear-gradient(
    color(var(--blue) whiteness(+7%)),
    color(var(--blue) lightness(-7%) saturation(-10%)) 60%,
    color(var(--blue) lightness(-7%) saturation(-10%)) 90%,
    color(var(--blue) lightness(-4%) saturation(-10%))
  ); */
  ${btnColor(colors.primary)}
  border-radius: 5px;

  -webkit-font-smoothing: subpixel-antialiased;

  @media (max-width: 500px) {
    margin: 10px 0 0 0;
    width: 100%;
  }

  @media (prefers-color-scheme: dark) {
    opacity: 0.9;
  }
`;

export const ButtonLink = styled.a`
  ${buttonStyle}
  &:hover {
    text-decoration: none;
  }
`;
