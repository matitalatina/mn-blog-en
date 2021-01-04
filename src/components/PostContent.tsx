import { lighten } from 'polished';
import React from 'react';
import styled from '@emotion/styled';
import RehypeReact from 'rehype-react';

import { colors } from '../styles/colors';

const renderAst = new RehypeReact({
  createElement: React.createElement,
  // components: { 'interactive-counter': Counter },
  components: {},
}).Compiler;

const Ast = ({ ast, ...props }: any) => {
  ast.properties = props;
  return renderAst(ast);
};

export interface PostContentProps {
  htmlAst: any;
}

const PostContent: React.FC<PostContentProps> = ({ htmlAst }) => {
  return (
    <PostFullContent className="post-full-content">
      {/* TODO: this will apply the class when rehype-react is published https://github.com/rhysd/rehype-react/pull/11 */}
      <Ast className="post-content" ast={htmlAst} />
    </PostFullContent>
  );
};

export const PostFullContent = styled.section`
  position: relative;
  margin: 0 auto;
  padding: 0 170px 6vw;
  min-height: 230px;
  font-size: 2.2rem;
  line-height: 1.6em;
  background: #fff;

  @media (max-width: 1170px) {
    padding: 0 11vw;
  }
  @media (max-width: 800px) {
    padding: 0 5vw;
    font-size: 1.8rem;
  }
  @media (max-width: 500px) {
    padding: 0;
  }
  @media (max-width: 500px) {
    .post-full-custom-excerpt {
      font-size: 1.9rem;
      line-height: 1.5em;
    }
  }

  .no-image {
    padding-top: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  dl,
  pre,
  blockquote,
  .post-full-comments,
  .footnotes {
    margin: 0 0 1.5em 0;
    min-width: 100%;
  }
  @media (max-width: 500px) {
    p,
    ul,
    ol,
    dl,
    pre,
    .post-full-comments,
    .footnotes {
      margin-bottom: 1.28em;
    }
  }

  li {
    word-break: break-word;
  }

  li p {
    margin: 0;
  }

  a {
    /* color: var(--darkgrey); */
    color: ${colors.darkgrey};
    word-break: break-word;
    /* box-shadow: var(--darkgrey) 0 -1px 0 inset; */
    box-shadow: ${colors.primary} 0 -1px 0 inset;
    transition: all 0.2s ease-in-out;
  }

  a:hover {
    /* color: var(--blue); */
    color: ${colors.primary};
    text-decoration: none;
    /* box-shadow: var(--blue) 0 -1px 0 inset; */
    box-shadow: ${colors.primary} 0 -1px 0 inset;
  }

  strong,
  em {
    /* color: color(var(--darkgrey) l(-5%)); */
    color: ${lighten('-0.05', colors.darkgrey)};
  }

  small {
    display: inline-block;
    line-height: 1.6em;
  }

  img,
  video {
    display: block;
    margin: 1.5em auto;
    max-width: 1040px;
    height: auto;
  }
  @media (max-width: 1040px) {
    img,
    video {
      width: 100%;
    }
  }

  img[src$='#full'] {
    max-width: none;
    width: 100vw;
  }

  img + br + small {
    display: block;
    margin-top: -3em;
    margin-bottom: 1.5em;
    text-align: center;
  }

  iframe {
    margin: 0 auto !important;
  }

  blockquote {
    margin: 0 0 1.5em;
    padding: 0 1.5em;
    border-left: ${colors.primary} 3px solid;
  }
  @media (max-width: 500px) {
    blockquote {
      padding: 0 1.3em;
    }
  }

  blockquote p {
    margin: 0 0 1em 0;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    font-style: italic;
  }

  blockquote p:last-child {
    margin-bottom: 0;
  }

  code {
    padding: 0 5px 2px;
    font-size: 0.8em;
    line-height: 1em;
    font-weight: 400 !important;
    /* background: var(--whitegrey); */
    background: ${colors.whitegrey};
    border-radius: 3px;
  }

  p code, 
  li code,
  p code[class*="language-"],
  li code[class*="language-"] {
    word-break: break-all;
  }

  pre {
    overflow-x: auto;
    /* margin: 1.5em 0 3em; */
    padding: 20px;
    max-width: 100%;
    /* border: color(var(--darkgrey) l(-10%)) 1px solid; */
    /* border: ${lighten('-0.1', colors.darkgrey)} 1px solid; */
    /* color: var(--whitegrey); */
    color: ${colors.whitegrey};
    font-size: 1.4rem;
    line-height: 1.5em;
    /* background: color(var(--darkgrey) l(-3%)); */
    /* background: ${lighten('-0.03', colors.darkgrey)}; */
    border-radius: 5px;
  }

  pre ::selection {
    /* color: color(var(--midgrey) l(-25%)); */
    color: ${lighten('-0.25', colors.midgrey)};
  }

  pre code {
    padding: 0;
    font-size: inherit;
    line-height: inherit;
    background: transparent;
  }

  pre code :not(span) {
    color: inherit;
  }

  .fluid-width-video-wrapper {
    margin: 1.5em 0 3em;
  }

  hr {
    margin: 2em 0;
  }

  hr:after {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    display: block;
    margin-left: -10px;
    width: 1px;
    height: 30px;
    /* background: color(var(--lightgrey) l(+10%)); */
    background: ${lighten('0.1', colors.lightgrey)};
    box-shadow: #fff 0 0 0 5px;
    transform: rotate(45deg);
  }

  hr + p {
    margin-top: 1.2em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    /* color: color(var(--darkgrey) l(-5%)); */
    color: ${lighten('-0.05', colors.darkgrey)};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
  }

  h1 {
    margin: 0.5em 0 0.4em;
    font-size: 4.2rem;
    line-height: 1.25em;
    font-weight: 600;
  }
  p + h1 {
    margin-top: 0.8em;
  }
  @media (max-width: 800px) {
    h1 {
      font-size: 3.2rem;
      line-height: 1.25em;
    }
  }

  h2 {
    margin: 0.5em 0 0.4em;
    font-size: 3.2rem;
    line-height: 1.25em;
    font-weight: 600;
  }
  p + h2 {
    margin-top: 0.8em;
  }
  @media (max-width: 800px) {
    h2 {
      margin-bottom: 0.3em;
      font-size: 2.8rem;
      line-height: 1.25em;
    }
  }

  h3 {
    margin: 0.5em 0 0.2em;
    font-size: 2.5rem;
    line-height: 1.3em;
    font-weight: 600;
  }
  h2 + h3 {
    margin-top: 0.7em;
  }
  @media (max-width: 800px) {
    h3 {
      margin-bottom: 0.3em;
      font-size: 2.4rem;
      line-height: 1.3em;
    }
  }

  h4 {
    margin: 0.5em 0 0.2em;
    font-size: 2.5rem;
    font-weight: 600;
  }
  h2 + h4 {
    margin-top: 0.7em;
  }
  h3 + h4 {
    margin-top: 0;
  }
  @media (max-width: 800px) {
    h4 {
      margin-bottom: 0.3em;
      font-size: 2.4rem;
      line-height: 1.3em;
    }
  }

  h5 {
    display: block;
    margin: 0.5em 0;
    padding: 0.4em 1em 0.9em;
    border: 0;
    color: ${colors.primary};
    font-size: 3.2rem;
    line-height: 1.35em;
    text-align: center;
  }
  @media (min-width: 1180px) {
    h5 {
      max-width: 1060px;
      /* width: 100vw; */
    }
  }
  @media (max-width: 800px) {
    h5 {
      margin-bottom: 1em;
      margin-left: 1.3em;
      padding: 0 0 0.5em;
      font-size: 2.4rem;
      text-align: initial;
    }
  }

  h6 {
    margin: 0.5em 0 0.2em 0;
    font-size: 2rem;
    font-weight: 700;
  }
  @media (max-width: 800px) {
    h6 {
      font-size: 1.8rem;
      line-height: 1.4em;
    }
  }

  table {
    display: inline-block;
    overflow-x: auto;
    margin: 0.5em 0 2.5em;
    max-width: 100%;
    width: auto;
    border-spacing: 0;
    border-collapse: collapse;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1.6rem;
    white-space: nowrap;
    vertical-align: top;
  }

  table {
    -webkit-overflow-scrolling: touch;
    background: radial-gradient(ellipse at left, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 0
        center,
      radial-gradient(ellipse at right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 100% center;
    background-attachment: scroll, scroll;
    background-size: 10px 100%, 10px 100%;
    background-repeat: no-repeat;
  }

  table td:first-of-type {
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 20px 100%;
    background-repeat: no-repeat;
  }

  table td:last-child {
    background-image: linear-gradient(
      to left,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-position: 100% 0;
    background-size: 20px 100%;
    background-repeat: no-repeat;
  }

  table th {
    /* color: var(--darkgrey); */
    color: ${colors.darkgrey};
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.2px;
    text-align: left;
    text-transform: uppercase;
    /* background-color: color(var(--whitegrey) l(+4%)); */
    background-color: ${lighten('0.04', colors.whitegrey)};
  }

  table th,
  table td {
    padding: 6px 12px;
    /* border: color(var(--whitegrey) l(-1%) s(-5%)) 1px solid; */
    border: ${lighten('-0.01', colors.whitegrey)} 1px solid;
  }

  @media (prefers-color-scheme: dark) {
    /* background: var(--darkmode); */
    background: ${colors.darkmode};

    h1,
    h2,
    h3,
    h4,
    h6 {
      color: rgba(255, 255, 255, 0.9);
    }

    a {
      color: #fff;
    }

    strong {
      color: #fff;
    }

    em {
      color: #fff;
    }

    code {
      color: #fff;
      background: #000;
    }

    hr {
      /* border-top-color: color(var(--darkmode) l(+8%)); */
      /* border-top-color: ${lighten('0.08', colors.darkmode)}; */
      border-top-color: #17191c;
    }

    hr:after {
      background: #17191c;
      box-shadow: ${colors.darkmode} 0 0 0 5px;
    }

    figcaption {
      color: rgba(255, 255, 255, 0.6);
    }

    table td:first-of-type {
      /* background-image: linear-gradient(
        to right,
        var(--darkmode) 50%,
        color(var(--darkmode) a(0%)) 100%
      ); */
      background-image: linear-gradient(to right, ${colors.darkmode} 50%, ${colors.darkmode} 100%);
    }

    table td:last-child {
      /* background-image: linear-gradient(
        to left,
        var(--darkmode) 50%,
        color(var(--darkmode) a(0%)) 100%
      ); */
      background-image: linear-gradient(270deg, #191b1f 50%, rgba(25, 27, 31, 0));
    }

    table th {
      color: rgba(255, 255, 255, 0.85);
      /* background-color: color(var(--darkmode) l(+8%)); */
      background-color: ${lighten('0.08', colors.darkmode)};
    }

    table th,
    table td {
      /* border: color(var(--darkmode) l(+8%)) 1px solid; */
      border: ${lighten('0.08', colors.darkmode)} 1px solid;
    }

    .kg-bookmark-container,
    .kg-bookmark-container:hover {
      color: rgba(255, 255, 255, 0.75);
      box-shadow: 0 0 1px rgba(255, 255, 255, 0.9);
    }
  }

  /* Start Syntax Highlighting */
  /**
  * okaidia theme for JavaScript, CSS and HTML
  * Loosely based on Monokai textmate theme by http://www.monokai.nl/
  * @author ocodia
  */

  code[class*="language-"],
  pre[class*="language-"] {
    color: #f8f8f2;
    background: #272822;
    text-shadow: 0 1px rgba(0, 0, 0, 0.3);
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 0.8em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */
  pre[class*="language-"] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
    border-radius: 0.3em;
  }

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
    background: #272822;
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
    white-space: normal;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: slategray;
  }

  .token.punctuation {
    color: #acfff1;
  }

  .namespace {
    opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #f92672;
  }

  .token.boolean,
  .token.number {
    color: #ae81ff;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #a6e22e;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string,
  .token.variable {
    color: #f8f8f2;
  }

  .token.atrule,
  .token.attr-value,
  .token.function,
  .token.class-name {
    color: #e6db74;
  }

  .token.keyword {
    color: #66d9ef;
  }

  .token.regex,
  .token.important {
    color: #fd971f;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
  /* End Syntax Highlighting */

  .gatsby-highlight {
    width: 100%;
  }

  .post-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 920px;
  }
  .gatsby-highlight pre[class*='language-'] {
    min-width: 100%;
  }
  /* End Syntax Highlighting */
`;

export default PostContent;
