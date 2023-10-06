# Contributing

## Contribution Types

### Report Bugs

Report bugs at <https://github.com/HBPMedical/hbpmip/portal-frontend/issues>.

If you are reporting a bug, please include:

-   Your operating system name and version.
-   Any details about your local setup that might be helpful in
    troubleshooting.
-   Detailed steps to reproduce the bug.

### Fix Bugs

Look through the GitHub issues for bugs. Anything tagged with \"bug\"
and \"help wanted\" is open to whoever wants to implement it.

### Implement Features

Look through the GitHub issues for features. Anything tagged with
\"enhancement\" and \"help wanted\" is open to whoever wants to
implement it.

### Write Documentation

The stack could always use more documentation, whether as
part of the official docs, in docstrings, or even
on the web in blog posts, articles, and such.

### Submit Feedback

The best way to send feedback is to create an issue at
<https://github.com/HBPMedical/hbpmip/portal-frontend/issues>.

If you are proposing a feature:

-   Explain in detail how it would work.
-   Keep the scope as narrow as possible, to make it easier to
    implement.
-   Remember that this is a volunteer-driven project, and that
    contributions are welcome :)

## Get Started!

Ready to contribute? Here\'s how to set up the frontend for
local development.

The interface runs on [React.js](https://reactjs.org), a JavaScript library for building user interfaces. This project is using [Vite.js](https://vitejs.dev/).
It embed several libraries, among them are:

- [TypeScript](https://www.typescriptlang.org), a typed superset of JavaScript
- [D3.js](https://d3js.org), [Bokeh.js](https://bokeh.org) and [Bokeh.js](https://docs.bokeh.org/en/latest/docs/user_guide/bokehjs.html), visualizations and interactive charts libraries
- [Bootstrap](https://getbootstrap.com/), a frontend component library
- [Apollo](https://www.apollographql.com/docs/react/), a state library

Here is the setup to do Frontend development in this project:

### Backend

- You will need to run a backend which will contains the API and the underlying logic of the analytic engine. For exareme see [mip-deployment](https://github.com/HBPMedical/mip-deployment) process.

### Middleware

The Frontend comes with a Middleware which is in charge of normalizing input from various engine and allows the Frontend to be completely agnostic from external services.

See https://github.com/HBPMedical/gateway

You need to install the middleware to your stack in order to communicate with the backend.

- `git clone https://github.com/HBPMedical/gateway.git`
- `cd gateway/api`
- `git checkout main`
- `npm install`
- `npm run start:dev`

### React Frontend setup

Let's fire a development Frontend. I assume you cloned this repository and checked out the desired branch. You are most likely going to checkout the dev branch.

- Install the latest [nodejs](https://nodejs.org)
- Install the latest [yarn](https://yarnpkg.com/en/)
- Run: `yarn install`
- Create a `.env.development` file in the root directory and add

```
VITE_BACKEND_URL=http://localhost:8081
VITE_GATEWAY_URL=$VITE_BACKEND_URL/graphql
```

which points to the backend API.

- Run: `yarn start:dev`
- Browse to your local IP. http://localhost:5173

#### Design Components

Starting with the MIP 6.5, components are designed with [Storybook](https://storybook.js.org/), an open source tool for building UI components and pages in isolation.

`yarn run storybook` -> http://localhost:6006/

It follows the [Component Driven User Interfaces](https://www.componentdriven.org/) process.

### Tests

This will run unit tests to ensure that the UI is working properly. Results of the tests are showing up in the frontend.

- `yarn test`

- Tests run with Jest, see [the jest cli doc](https://jestjs.io/docs/en/cli) for more details

### Build & Releases

Build and releases are managed by GitLab CI and [Semantic Release](https://github.com/semantic-release/semantic-release).

Please keep your commit the most specific to a change it describes. It
is highly advice to track unstaged files with `git status`, add a file
involved in the change to the stage one by one with `git add <file>`.
The use of `git add .` is highly disencouraged. When all the files for a
given change are staged, commit the files with a brieg message using
`git commit -m "<type>[optional scope]: <description>"` that describes
your change and where `<type>` can be `fix` for a bug fix, `feat` for a
new feature, `refactor` for a code change that neither fixes a bug nor
adds a feature, `docs` for documentation, `ci` for continuous
integration testing, and `test` for adding missing tests or correcting
existing tests. This follows the Angular conventional commits, please
see <https://www.conventionalcommits.org/en/v1.0.0-beta.4/> for more
details.
:::

5.  When you\'re done making changes, push your branch to GitHub:

        git push origin name-of-your-bugfix-or-feature

6.  Submit a pull request through the GitHub website.

    Please make sure that the pull request is made against the `dev`
    branch. The `master` branch is used for the stable version releases.
    :::

### Pull Request Guidelines

Before you submit a pull request, check that it meets these guidelines:

1.  Make sure that the tests pass
