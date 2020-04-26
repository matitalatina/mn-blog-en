import IndexLayout from '../../layouts';
import Wrapper from '../../components/Wrapper';
import SiteNav from '../../components/header/SiteNav';
import { SiteHeader, outer, inner, SiteMain } from '../../styles/shared';
import * as React from 'react';
import { css } from '@emotion/core';

import { PostFullHeader, PostFullTitle, NoImage, PostFull } from '../../templates/post';
import { PostFullContent } from '../../components/PostContent';
import Footer from '../../components/Footer';
import Helmet from 'react-helmet';

const PageTemplate = css`
  .site-main {
    background: #fff;
    padding-bottom: 4vw;
  }
`;

const About: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>Metext - Privacy Policy</title>
    </Helmet>
    <Wrapper css={PageTemplate}>
      <header css={[outer, SiteHeader]}>
        <div css={inner}>
          <SiteNav />
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <div css={inner}>
          <article className="post page" css={[PostFull, NoImage]}>
            <PostFullHeader>
              <PostFullTitle>Metext - Privacy Policy</PostFullTitle>
            </PostFullHeader>

            <PostFullContent className="post-full-content">
              <div className="post-content">
                <p>
                  I am Mattia Natali, the data controller. <a href="m&#97;il&#116;o&#58;ma&#116;t&#37;69anat%&#54;1l&#37;69de&#37;76&#64;gm&#97;il%2Ec&#111;m">You can contact me</a> if you have any questions regarding your privacy.
              </p>
                <h2>Information we collect</h2>
                <p>I may collect data about:</p>
                <ul>
                  <li>device type and locale settings (English, Italian, etc.)</li>
                  <li>IP Address</li>
                  <li>time spent and your behavior on my app. For example, how many times you required image scanning.</li>
                </ul>
                <p>
                  when you&apos;re using my app.
              </p>
                <h2>Use of information</h2>
                <p>We use this data to:</p>
                <ul>
                  <li>provide the app with your preferred language.</li>
                  <li>give you personalized ads.</li>
                  <li>have analytics and insights to check the performance of my app.</li>
                </ul>
                <h2>Disclosure of personal information to third parties</h2>
                <p>We may disclose personal information to:</p>
                <ul>
                  <li>third party service providers to enable them to provide their services, including (without limitation) IT service providers, data storage, web-hosting and server providers, debt collectors, maintenance or problem-solving providers, professional advisors, and payment systems operators.</li>
                </ul>
              </div>
            </PostFullContent>
          </article>
        </div>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default About;
