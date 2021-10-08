[![CHUV](https://img.shields.io/badge/HBP-AF4C64.svg)](https://www.humanbrainproject.eu) [![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html) [![DockerHub](https://img.shields.io/badge/docker-hbpmip%2Fportal--frontend-008bb8.svg)](https://hub.docker.com/r/hbpmip/portal-frontend/) 

# MIP portal frontend

## Summary

The MIP Frontend is the web component of the [Medical Informatics Platform](http://mip.humanbrainproject.eu/) for the Human Brain Project.

You can find more informations on the MIP on [EBRAINS](https://ebrains.eu/service/medical-informatics-platform) website.

## Deployment

The MIP is a collection of services and components bundled in a deployment pack. It can be either deployed localy or in a federated way. Everything you need in order to deploy is to be found in the [mip-deployment](https://github.com/HBPMedical/mip-deployment) repository.


## Frontend development

The interface runs on [React.js](https://reactjs.org), a JavaScript library for building user interfaces. This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
It embed several libraries, among them are:

- [TypeScript](https://www.typescriptlang.org), a typed superset of JavaScript
- [D3.js](https://d3js.org) and [Highcharts](https://www.highcharts.com), visualizations and interactive charts libraries
- [Bootstrap](https://getbootstrap.com/), a frontend component library
- [Unstated](https://github.com/jamiebuilds/unstated), a state library

Here is the setup to do frontend development in this project:

### Backend
- You will need to run a backend which will contains the API and the underlying logic of the analytic engine, Exareme.
- Checkout the desired branch of the [mip-deployment](https://github.com/HBPMedical/mip-deployment) project.
- Create a .env file in the folder filled with the following environment variables
```
PUBLIC_MIP_HOST=[MY IP]
KEYCLOAK_URL=${PUBLIC_MIP_HOST}
DATACATALOGUE_HOST=datacatalogue.mip.ebrains.eu
DATACATALOGUE_PROTOCOL=https
KEYCLOAK_AUTHENTICATION=0
KEYCLOAK_CLIENT_ID=MIP
KEYCLOAK_CLIENT_SECRET=
KEYCLOAK_PROTOCOL=http
KEYCLOAK_REALM=MIP
KEYCLOAK_SSL_REQUIRED=none
MIP_TYPE=local
NODE_TYPE=
PUBLIC_MIP_PROTOCOL=http
EXTERNAL_MIP_PROTOCOL=http
MIP_LINK=direct

EXAREME=24.1.2
PORTALBACKEND=7.2.0
FRONTEND=7.1.0
GALAXY=1.3.4
MIP=6.4.0
```
- You need to change PUBLIC_MIP_HOST to your local IP
- In docker-compose.yml file, change the line `CONVERT_CSVS=FALSE`to `CONVERT_CSVS=TRUE`so the data gets processed into the analytic engine.
- Launch the backend with docker-compose: `docker-compose up -d`
- You can tweak the component version (EXAREME, PORTALBACKEND, GALAXY according to your needs)

### Middleware

The next version of the Frontend comes with a Middleware which is in charge of normalizing input from various engine and allow the Frontend to be completely agnostic from external services. 

See https://github.com/HBPMedical/gateway

You need to install the middleware to your stack in order to communicate with the backend. 

- `git clone https://github.com/HBPMedical/gateway.git` 
- `cd gateway/api`
- `git checkout develop`
- `npm install`
- `npm run start:dev`

### React Frontend setup

Let's fire a development frontend. I assume you cloned this repository and checked out the desired branch. You are most likely going to checkout the dev branch.

- Install the latest [nodejs](https://nodejs.org)
- Install the latest [yarn](https://yarnpkg.com/en/)
- Run: `yarn install`
- Create a `.env.development` file in the root directory and add 
```
REACT_APP_BACKEND_URL=http://[MY IP]:8081
REACT_APP_GATEWAY_URL=$REACT_APP_BACKEND_URL/graphql
``` 
which points to the backend API.

- Run: `yarn watch`
- Browse to your local IP. http://[MY IP]:3000


#### Design Components

Starting with the MIP 6.5, component are designed with [Storybook](https://storybook.js.org/),  an open source tool for building UI components and pages in isolation. 

`yarn run storybook` -> http://localhost:6006/

It follows the [Component Driven User Interfaces](https://www.componentdriven.org/) process. 



### Tests

This will run integration tests on the backend API to ensure that the whole system is working properly. Results of the tests are showing up in the frontend. 

- `yarn test` or with a regex, `yarn test anova`

- Tests run with Jest, see [the jest cli doc](https://jestjs.io/docs/en/cli) for more details
- E2E tests are run with [TestProject](https://testproject.io/) on deployed versions

### Build 
- Produces a docker container
- Run: `./build.sh`

## Publish
- Builds and publish a release on Docker Hub
- Run: `./publish.sh`

## License

Copyright © 2016-2021 LREN CHUV

Licensed under the GNU Affero General Public License, Version 3.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# Acknowledgements

This work has been funded by the European Union Seventh Framework Program (FP7/2007­2013) under grant agreement no. 604102 (HBP)

This work is part of SP8 of the Human Brain Project (SGA1).
