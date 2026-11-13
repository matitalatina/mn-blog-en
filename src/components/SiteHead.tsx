import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import favicon from '../favicon.png';

interface SiteHeadProps {
  children?: React.ReactNode;
}

export const SiteHead: React.FC<SiteHeadProps> = ({ children }) => (
  <>
    <link rel="icon" href={favicon} type="image/x-icon" />
    {children}
  </>
);
