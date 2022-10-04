[![CHUV](https://img.shields.io/badge/HBP-AF4C64.svg)](https://www.humanbrainproject.eu) [![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0) [![DockerHub](https://img.shields.io/badge/docker-hbpmip%2Fportal--frontend-008bb8.svg)](https://hub.docker.com/r/hbpmip/portal-frontend/) 

# MIP portal frontend

## Summary

The MIP Frontend is the web component of the [Medical Informatics Platform](http://mip.humanbrainproject.eu/) for the Human Brain Project.

You can find more informations on the MIP on [EBRAINS](https://ebrains.eu/service/medical-informatics-platform) website.

## Deployment

The MIP is a collection of services and components bundled in a deployment pack. It can be either deployed localy or in a federated way. Everything you need in order to deploy is to be found in the [mip-deployment](https://github.com/HBPMedical/mip-deployment) repository.


## Frontend development

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

Starting with the MIP 6.5, components are designed with [Storybook](https://storybook.js.org/),  an open source tool for building UI components and pages in isolation. 

`yarn run storybook` -> http://localhost:6006/

It follows the [Component Driven User Interfaces](https://www.componentdriven.org/) process. 


### Tests

This will run unit tests to ensure that the UI is working properly. Results of the tests are showing up in the frontend. 

- `yarn test`

- Tests run with Jest, see [the jest cli doc](https://jestjs.io/docs/en/cli) for more details

### Build & Releases
Build and releases are managed by GitLab CI and [Semantic Release](https://github.com/semantic-release/semantic-release).

## License

Copyright © 2016-2022 CHUV

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# Acknowledgements

This work has been funded by the European Union Seventh Framework Program (FP7/2007­2013) under grant agreement no. 604102 (HBP)

This work is part of SP8 of the Human Brain Project (SGA1).
