/* eslint-disable no-template-curly-in-string */
const branch = process.env.CI_COMMIT_BRANCH || process.env.BRANCH_NAME;

const releaseBranches = ['main'];
const preReleaseBranches = ['beta', 'rc']; // [] if empty

const isReleaseOrPreBranch = [
  ...releaseBranches,
  ...preReleaseBranches,
].includes(branch);

const plugins = [
  '@semantic-release/commit-analyzer',
  '@semantic-release/release-notes-generator',
  '@semantic-release/changelog',
  ...(branch ? ['@semantic-release/gitlab'] : []),
  [
    '@semantic-release/npm',
    {
      npmPublish: false,
    },
  ],
  [
    '@semantic-release/git',
    {
      assets: ['./build', 'CHANGELOG.md', 'package.json', 'yarn.lock'],
    },
  ],
];

if (isReleaseOrPreBranch) {
  plugins.push([
    '@eclass/semantic-release-docker',
    {
      baseImageName: 'portal-frontend',
      registries: [
        {
          url: 'docker.io',
          imageName: 'docker.io/hbpmip/portal-frontend',
          user: 'DOCKERHUB_USERNAME',
          password: 'DOCKERHUB_TOKEN',
        },
      ],
    },
  ]);
}

const config = {
  tagFormat: '${version}',
  plugins,
  branches: [
    ...releaseBranches,
    '+([0-9])?(.{+([0-9]),x}).x',
    ...preReleaseBranches.map((b) => ({ name: b, prerelease: true })),
  ],
};

module.exports = config;
