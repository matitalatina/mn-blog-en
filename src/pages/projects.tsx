import React from 'react';
import { Helmet } from 'react-helmet';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Footer } from '../components/Footer';
import SiteNav from '../components/header/SiteNav';
import { PostFullContent } from '../components/PostContent';
import { Wrapper } from '../components/Wrapper';
import IndexLayout from '../layouts';
import {
  inner,
  outer,
  SiteArchiveHeader,
  SiteHeader,
  SiteMain,
  SiteNavMain,
} from '../styles/shared';
import { NoImage, PostFull, PostFullHeader, PostFullTitle } from '../templates/post';
import { colors } from '../styles/colors';

import fontanelleImage from '../images/projects/fontanelle.jpg';
import gaslowImage from '../images/projects/gaslow.png';
import pricemetImage from '../images/projects/pricemet.png';
import metextImage from '../images/projects/metext.png';
import randommetImage from '../images/projects/randommet.png';
import squizlyImage from '../images/projects/squizly.gif';

const PageTemplate = css`
  .site-main {
    margin-top: 64px;
    padding-bottom: 4vw;
    background: #fff;
  }

  @media (prefers-color-scheme: dark) {
    .site-main {
      background: ${colors.darkmode};
    }
  }
`;

const ProjectItemContainer = styled.div`
  margin-bottom: 1vw;
`;

const ProjectContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const ProjectImage = styled.img`
  width: 240px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 800px) {
    width: 180px;
    margin-bottom: 1rem;
  }
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h2`
  margin: 0 0 0.8em;
  font-size: 3.2rem;
  font-weight: 700;
  color: ${colors.primary};

  @media (max-width: 500px) {
    font-size: 2.6rem;
  }
`;

const ProjectDescription = styled.p`
  margin: 0 0 1.5em;
  font-size: 1.8rem;
  line-height: 1.6em;
`;

const ProjectLink = styled.a`
  display: inline-block;
  padding: 0.5em 1.2em;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  font-size: 1.6rem;
  line-height: 1.6em;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.2s ease;
  box-shadow: none;
  margin: 0 0.5em 0.5em 0;

  /* Higher specificity to override PostFullContent styles */
  .post-full-content & {
    box-shadow: none;
  }

  &:hover {
    color: #fff;
    background: ${colors.primary};
    text-decoration: none;
    box-shadow: none;
  }

  /* Higher specificity for hover state to override PostFullContent styles */
  .post-full-content &:hover {
    color: #fff;
    box-shadow: none;
  }
`;

const ProjectLinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5em;
`;

const Divider = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  margin: 4vw 0;
  background: #e5eff5;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Projects: React.FC = () => (
  <IndexLayout>
    <Helmet>
      <title>My Projects - Mattia Natali</title>
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
            <PostFullHeader className="post-full-header" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
              <PostFullTitle className="post-full-title">My Projects</PostFullTitle>
            </PostFullHeader>

            <PostFullContent className="post-full-content">
              <div className="post-content">
                <p>
                  Here you can find some of the projects I&apos;ve been working on. These range from
                  web applications to mobile apps designed to solve specific problems or provide
                  useful services.
                </p>

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={fontanelleImage} alt="Fontanelle in Italia" />
                    <ProjectInfo>
                      <ProjectTitle>Fontanelle in Italia</ProjectTitle>
                      <ProjectDescription>
                        A web application that helps people find public drinking fountains in Italy.
                        The app shows the location of each fountain on a map, making it easy for
                        users to find clean drinking water while out and about.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://fontanelle.mattianatali.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={squizlyImage} alt="Squizly" />
                    <ProjectInfo>
                      <ProjectTitle>Squizly</ProjectTitle>
                      <ProjectDescription>
                        Squizly is the simplest video compressor for macOS. This open-source desktop
                        application makes it easy to compress and convert video files on Mac,
                        available for both Intel and Apple Silicon processors.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://github.com/matitalatina/squizly"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on GitHub
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={gaslowImage} alt="GasLow" />
                    <ProjectInfo>
                      <ProjectTitle>GasLow</ProjectTitle>
                      <ProjectDescription>
                        GasLow is an application that helps users find the best fuel prices around
                        them. The app provides real-time information about fuel prices from
                        different gas stations, allowing users to save money on fuel costs. The data
                        is sourced from the open data published by the &quot;Ministero dello
                        sviluppo economico&quot; and is updated daily.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://gaslow.mattianatali.it/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </ProjectLink>
                        <ProjectLink
                          href="https://apps.apple.com/us/app/gaslow-prezzo-carburanti/id1510630580"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on App Store
                        </ProjectLink>
                        <ProjectLink
                          href="https://play.google.com/store/apps/details?id=it.mattianatali.gaslowapp&hl=it"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Play
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={metextImage} alt="Metext | OCR" />
                    <ProjectInfo>
                      <ProjectTitle>Metext | OCR</ProjectTitle>
                      <ProjectDescription>
                        Metext is an OCR (Optical Character Recognition) app that extracts text from
                        images. Users can extract text from photos taken with their camera or images
                        from their gallery. The app uses state-of-the-art OCR algorithms to provide
                        accurate text recognition and allows users to select specific parts of the
                        image, review and edit the extracted text, and share or copy it for use in
                        other applications.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://play.google.com/store/apps/details?id=it.mattianatali.metext&hl=it"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Play
                        </ProjectLink>
                        <ProjectLink
                          href="https://apps.apple.com/us/app/metext-text-scanner-ocr/id1510120975"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on App Store
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={pricemetImage} alt="PriceMet" />
                    <ProjectInfo>
                      <ProjectTitle>PriceMet</ProjectTitle>
                      <ProjectDescription>
                        PriceMet is a mobile application that notifies users when prices on Amazon
                        drop. This app helps users save money by monitoring product prices and
                        sending notifications when desired items go on sale or decrease in price.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://pricemet.mattianatali.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </ProjectLink>
                        <ProjectLink
                          href="https://play.google.com/store/apps/details?id=com.mattianatali.pricemet&hl=it&gl=US"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Play
                        </ProjectLink>
                        <ProjectLink
                          href="https://apps.apple.com/us/app/pricemet-notifica-prezzi/id6443516529"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on App Store
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>

                <Divider />

                <ProjectItemContainer>
                  <ProjectContent>
                    <ProjectImage src={randommetImage} alt="RandomMet 2" />
                    <ProjectInfo>
                      <ProjectTitle>RandomMet 2</ProjectTitle>
                      <ProjectDescription>
                        RandomMet is a fun decision-making app that helps you and your friends
                        choose where to go (bowling, bar, pub, cinema, etc.) when you can&apos;t
                        decide. It also works as an &quot;Oracle&quot; to tell you if your idea is
                        good or not, and can even help you find a new color when you need
                        inspiration.
                      </ProjectDescription>
                      <ProjectLinksContainer>
                        <ProjectLink
                          href="https://play.google.com/store/apps/details?id=it.mattianatali.randommetapp2&hl=it"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Play
                        </ProjectLink>
                      </ProjectLinksContainer>
                    </ProjectInfo>
                  </ProjectContent>
                </ProjectItemContainer>
              </div>
            </PostFullContent>
          </article>
        </div>
      </main>
      <Footer />
    </Wrapper>
  </IndexLayout>
);

export default Projects;
