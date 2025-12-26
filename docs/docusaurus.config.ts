import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ConsultFlow',
  tagline: 'AI-Powered Workflow Automation for Consulting Teams',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://consultflow.vercel.app',
  baseUrl: '/',

  organizationName: 'srs-sudeep',
  projectName: 'consultflow',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/srs-sudeep/consultflow/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/srs-sudeep/consultflow/tree/main/docs/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/consultflow-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ConsultFlow',
      logo: {
        alt: 'ConsultFlow Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'doc',
          docId: 'api/authentication',
          label: 'API',
          position: 'left',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/srs-sudeep',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture/overview',
            },
            {
              label: 'API Reference',
              to: '/docs/api/authentication',
            },
          ],
        },
        {
          title: 'Features',
          items: [
            {
              label: 'Workflow Builder',
              to: '/docs/features/workflow-builder',
            },
            {
              label: 'MOM Generator',
              to: '/docs/features/mom-generator',
            },
            {
              label: 'Microsoft Integration',
              to: '/docs/features/microsoft-integration',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/srs-sudeep',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ConsultFlow. Built with ❤️ by <a href="https://github.com/srs-sudeep" target="_blank">@srs-sudeep</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'json'],
    },
    announcementBar: {
      id: 'support_us',
      content:
        '⭐ If you like ConsultFlow, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/srs-sudeep">GitHub</a>!',
      backgroundColor: '#f97316',
      textColor: '#fff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
