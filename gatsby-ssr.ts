import type { GatsbySSR } from 'gatsby';

import config from './src/website-config';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: config.lang });
};
