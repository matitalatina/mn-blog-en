import styled from '@emotion/styled';
import React from 'react';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookMessengerIcon, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import FacebookShareButton from 'react-share/lib/FacebookShareButton';

export interface ShareButtonsProps {
  title: string;
  url: string;
  subject: string;
  twitterAuthor: string | undefined;
  tags: string[];
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, subject, url, twitterAuthor, tags }) => {
  const iconSize = 40;
  return (
    <Group>
      <FacebookShareButton url={url}>
        <FacebookIcon round size={iconSize} />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title} via={twitterAuthor ?? undefined} hashtags={tags}>
        <TwitterIcon round size={iconSize} />
      </TwitterShareButton>

      <LinkedinShareButton url={url}>
        <LinkedinIcon round size={iconSize} />
      </LinkedinShareButton>

      <RedditShareButton url={url} title={title}>
        <RedditIcon round size={iconSize} />
      </RedditShareButton>

      <EmailShareButton url={url} subject={subject} body={title} separator={'\n'} >
        <EmailIcon round size={iconSize} />
      </EmailShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon round size={iconSize} />
      </WhatsappShareButton>

      <TelegramShareButton url={url} title={title}>
        <TelegramIcon round size={iconSize} />
      </TelegramShareButton>

      <FacebookShareButton url={url} title={title}>
        <FacebookMessengerIcon round size={iconSize} />
      </FacebookShareButton>
    </Group>
  );
};

const Group = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  & > button {
    flex: 0 1 auto;
    margin: 10px;
  }
`;
