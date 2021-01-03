export interface WebsiteConfig {
  title: string;
  description: string;
  coverImage?: string;
  logo: string;
  /**
   * Specifying a valid BCP 47 language helps screen readers announce text properly.
   * See: https://dequeuniversity.com/rules/axe/2.2/valid-lang
   */
  lang: string;
  /**
   * blog full path, no ending slash!
   */
  siteUrl: string;
  /**
   * full url, no username
   */
  facebook?: string;
  /**
   * full url, no username
   */
  twitter?: string;
  /**
   * full url, no username
   */
  linkedin?: string;
  /**
   * full url, no username
   */
  github?: string;
  /**
   * hide or show all email subscribe boxes
   */
  showSubscribe: boolean;
  /**
   * create a list on mailchimp and then create an embeddable signup form. this is the form action
   */
  mailchimpAction?: string;
  /**
   * this is the hidden input field name
   */
  mailchimpName?: string;
  /**
   * name and id of the mailchimp email field
   */
  mailchimpEmailFieldName?: string;
  /**
  /**
   * Meta tag for Google Webmaster Tools
   */
  googleSiteVerification?: string;
  /**
  /**
   * Appears alongside the footer, after the credits
   */
  footer?: string;
}

const config: WebsiteConfig = {
  title: 'Mattia Natali',
  description: '',
  coverImage: 'img/blog-cover.jpg',
  logo: 'img/ghost-logo.png',
  lang: 'it',
  siteUrl: 'https://www.mattianatali.it',
  facebook: 'https://www.facebook.com/mattianatali.dev/',
  twitter: 'https://twitter.com/matitalatina',
  linkedin: 'https://www.linkedin.com/in/mattian/',
  github: 'https://github.com/matitalatina/',
  showSubscribe: true,
  mailchimpAction: 'https://gmail.us4.list-manage.com/subscribe/post?u=a8dbd77c4662328d660883c64&amp;id=31345af945',
  mailchimpName: 'b_a8dbd77c4662328d660883c64_31345af945',
  mailchimpEmailFieldName: 'EMAIL',
  googleSiteVerification: 'GoogleCode',
  footer: '',
};

export default config;
