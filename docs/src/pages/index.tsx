import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs">
            Get Started →
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: '🎨 Visual Workflow Builder',
    description: 'Build automation workflows using an intuitive n8n-style drag-and-drop canvas. No coding required.',
  },
  {
    title: '🤖 AI-Powered MOM Generation',
    description: 'Transform meeting transcripts into structured minutes with action items using GPT models.',
  },
  {
    title: '📧 Microsoft 365 Integration',
    description: 'Send emails via Outlook, create calendar events, and post to Teams channels automatically.',
  },
  {
    title: '🔐 Enterprise Authentication',
    description: 'Secure Azure AD OAuth 2.0 authentication with Microsoft single sign-on.',
  },
  {
    title: '📊 Execution Tracking',
    description: 'Monitor workflow executions with detailed logs and status tracking.',
  },
  {
    title: '⚡ Modern Tech Stack',
    description: 'Built with Next.js 14, Express, TypeScript, MongoDB, and React Flow.',
  },
];

function Feature({title, description}: {title: string; description: string}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="padding-horiz--md padding-vert--lg">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className={styles.quickLinkCard}>
              <h3>📚 Documentation</h3>
              <p>Complete guides for setup, configuration, and usage.</p>
              <Link to="/docs">Read the Docs →</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.quickLinkCard}>
              <h3>🏗️ Architecture</h3>
              <p>Deep dive into system design and implementation.</p>
              <Link to="/docs/architecture/overview">View Architecture →</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.quickLinkCard}>
              <h3>🔌 API Reference</h3>
              <p>Complete API documentation with examples.</p>
              <Link to="/docs/api/authentication">Explore API →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Documentation`}
      description="AI-Powered Workflow Automation for Consulting Teams">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickLinks />
      </main>
    </Layout>
  );
}
