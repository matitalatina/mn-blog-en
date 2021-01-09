import styled from "@emotion/styled";
import { colors } from "../../../styles/colors";

export const HeroTitle = styled.h3`
  margin: 0 0 3px 0;
  padding: 0;
  /* color: var(--darkgrey); */
  color: ${colors.darkgrey};
  font-size: 3.5rem;
  line-height: 1;
  font-weight: 600;

  @media (max-width: 650px) {
    font-size: 2.4rem;
  }

  @media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.9);
  }
`;