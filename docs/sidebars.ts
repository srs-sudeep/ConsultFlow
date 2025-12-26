import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/azure-setup',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/frontend',
        'architecture/backend',
        'architecture/database',
        'architecture/authentication',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/workflow-builder',
        'features/mom-generator',
        'features/microsoft-integration',
        'features/execution-logs',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/authentication',
        'api/workflows',
        'api/mom',
        'api/logs',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/tech-stack',
        'development/project-structure',
        'development/contributing',
      ],
    },
  ],
};

export default sidebars;
