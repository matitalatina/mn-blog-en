import styled from '@emotion/styled';
import React from 'react';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookMessengerIcon, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import FacebookShareButton from 'react-share/lib/FacebookShareButton';

type Props = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  bgStyle?: React.CSSProperties;
  borderRadius?: number;
  iconFillColor?: string;
  round?: boolean;
  size?: number | string;
};

type IconConfig = {
  color: string;
  networkName: string;
  /** SVG path */
  path: string;
};

function createIcon(iconConfig: IconConfig) {
  const Icon: React.FC<Props> = ({
    bgStyle,
    borderRadius,
    iconFillColor,
    round,
    size,
    ...rest
  }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} {...rest}>
      {round ? (
        <circle cx="32" cy="32" r="31" fill={iconConfig.color} style={bgStyle} />
      ) : (
        <rect
          width="64"
          height="64"
          rx={borderRadius}
          ry={borderRadius}
          fill={iconConfig.color}
          style={bgStyle}
        />
      )}

      <path d={iconConfig.path} fill={iconFillColor} />
    </svg>
  );

  Icon.defaultProps = {
    bgStyle: {},
    borderRadius: 0,
    iconFillColor: 'white',
    size: 64,
  };

  return Icon;
}

export interface ShareButtonsProps {
  title: string;
  url: string;
  subject: string;
  twitterAuthor: string | undefined;
  tags: string[];
}

const TwitterIcon = createIcon({
  color: '#000000',
  networkName: 'X',
  path: 'm 40.26875,19 h 4.4125 L 35.04375,30.0125 46.38125,45 h -8.875 L 30.55,35.9125 22.6,45 H 18.18125 L 28.4875,33.21875 17.61875,19 h 9.1 L 33,27.30625 Z m -1.55,23.3625 H 41.1625 L 25.3875,21.5 h -2.625 z',
});

export default TwitterIcon;

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
