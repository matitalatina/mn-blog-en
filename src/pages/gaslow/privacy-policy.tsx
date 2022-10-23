import IndexLayout from '../../layouts';
import { Wrapper } from '../../components/Wrapper';
import SiteNav, { SiteNavMain } from '../../components/header/SiteNav';
import { SiteHeader, outer, inner, SiteMain, SiteArchiveHeader } from '../../styles/shared';
import * as React from 'react';
import { css } from '@emotion/react';

import { PostFullHeader, PostFullTitle, NoImage, PostFull } from '../../templates/post';
import { PostFullContent } from '../../components/PostContent';
import { Footer } from '../../components/Footer';
import Helmet from 'react-helmet';

const PageTemplate = css`
  .site-main {
    margin-top: 64px;
  }
`;

const About: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>Gaslow - Privacy Policy</title>
    </Helmet>
    <Wrapper css={PageTemplate}>
      <header className="site-archive-header no-image" css={[SiteHeader, SiteArchiveHeader]}>
        <div css={[outer, SiteNavMain]}>
          <div css={inner}>
            <SiteNav isHome={false} />
          </div>
        </div>
      </header>
      <main id="site-main" className="site-main" css={[SiteMain, outer]}>
        <div css={inner}>
          <article className="post page" css={[PostFull, NoImage]}>
            <PostFullHeader>
              <PostFullTitle>Gaslow - Privacy Policy</PostFullTitle>
            </PostFullHeader>

            <PostFullContent className="post-full-content">
              <div className="post-content">
                <p>
                  I am Mattia Natali, the data controller. <a href="m&#97;il&#116;o&#58;ma&#116;t&#37;69anat%&#54;1l&#37;69de&#37;76&#64;gm&#97;il%2Ec&#111;m">You can contact me</a> if you have any questions regarding your privacy.
                </p>
                <h2>Information we collect</h2>
                <h3>Functional data</h3>
                <p>We collect your exact position and the position of the location you entered in the search field only to give you the gas stations you requested.<br/>
                  <b>We do not store your position in our backend.</b> It's used only to give you the service you required.
                  <p>We do not collect your favorite stations. That list doesn't leave your device.</p>
                </p>
                <h4>Non functional data</h4>
                <p>We may collect data about:</p>
                <ul>
                  <li>device type and locale settings (English, Italian, etc.)</li>
                  <li>IP Address</li>
                  <li>time spent and your behavior on my app. For example, how many times you search a station.</li>
                </ul>
                <p>
                  when you&apos;re using my app.
                </p>
                <h4>Use of non functional data</h4>
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
