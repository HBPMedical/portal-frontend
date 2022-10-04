# Changelog

## TBD - WIP

Features : 
- GraphQL Migration complete (no more Portalbackend direct call)
- Added HBP logo in the footer
- Migration from CRA to Vite.js
- Updated to React 18
- Vite configuration for Caddy
- Migration from Google Analytics to Matomo
- Filter & Formula can be hidden (Gateway dependant)
- Externalization of Caddy config
- JWT implementation
- New visualizations integration
  - Alert
  - BubbleChart
  - LineChart
  - BarChart
  - Histograms
  - MeansPlot
- Experiment export results (PDF)
- Experiment result (unit) export (jpg)
- Possiblity to edit chart Axis
- Minors graphic enchancements
- Added Toast notification system
- Added contactLink and ontologyURL env variable
- Added env var for expriments list refresh
- Add Modal based on promise

Bug Fixes : 
- Descriptive stats call has no coVariables property
- Updated libraries to fix critical dependencies issues
- Bubble text splitting issue

## 8.0.1 - 2021/12/22

- Updated Login Page links
- Integrated new portal backend experiment status logic 
## 8.0.0 - 2021/12/21

- Formula UI
  - Interaction and transformation operation on contiunous data
  - Integrated for Descriptive Statistics and Logistic Regression
- GraphQL type definitions available for frontend
- Added Storybook. 
  - Table and GroupTable visual components.
- Integrated new Descriptive Statistics output
- GraphQL implementation for Metadata
- GraphQL implementation for Descriptive Statistics

## 7.1.0 - 2021/01/14

- Moved web server from nginx to Caddy

## 7.0.0 - 2021/01/14

- Integration with new Backend API

## 6.4.12 - 2021/01/14

- One-way Anova integration
- CART: typo
- Logout handling
- Scaling charts & visualisation fix

## 6.4.11 - 2021/01/12

- Cart & bug fixes

## 6.4.10 - 2021/01/12

- New Login page
- Better labels display in Bubble hierarchy
- Boostrap Components updated to v4
- Data Model replacement by experiment parameters
- Experiment module, search, delete, pagination
- Refactored tests
- Basic SEO ls+json
- Styling harmonized
- Various UI improvements
- nginx timeout for backend increased
- nominal replaces multinominal % binominal types (Breaking change)
- New Logistic Regression integration
- New Naive Bayes integration
- React.Strict component
- Removed moment.js for Day.js
- moving XMLHTTPRequest from request to Axios library
- CART: added samples value

## 6.4.9 - 2020/10/20

- Naive Bayes visualisations #283

## 6.4.8 - 2020/10/20

- Updated MIP Screens Tutorial

## 6.4.7 - 2020/10/20

- MIP Tutorial

## 6.4.6 - 2020/10/15

- Check parameters for null
- nginx timeout set to 300

## 6.4.5 - 2020/10/13

- Fixed available algorithms rules parsing #288
- Fixed filter formating output

## 6.4.4 - 2020/09/29

- Added 3C algorithm + test
  - Current R implementation matters about the order of the x variables sent in an array
- Added filter box
- Various minor bug fixes

## 6.4.3 - 2020/06/15

- Renamed federation to datacatalogueUrl for main server

## 6.4.2 - 2020/06/15

- Fixed error handling in summary_statistics

## 6.4.1 - 2020/06/11

- New test data for TBI
- Fixes for
  - Kaplan Meyer
  - Statistics
  - Calibration Belt
  - Longitudinal data

## 6.4.0 - 2020/06/11

- Cart new output
- Removed timeout for experiment
- Fixed IE broken link

## 6.3.3 - 2020/06/08

- Fixed scaling of containers for browser resizing or large screen [#174](https://redmine.hbpmip.link/issues/174)
  - Needs a refactoring of current Highchart implementation
- Highcharts lib update
- Refactored variable lookup function, Bubbles should react faster
- Fix for stalled session [#176](https://redmine.hbpmip.link/issues/176)
- Fix for missing datastests on saved models [#162](https://redmine.hbpmip.link/issues/162)
- Fix for wrong dataset selection [#175](https://redmine.hbpmip.link/issues/175)
- New error message when user don't have access to roles/pathologies [#153](https://redmine.hbpmip.link/issues/153)
- Added link to MIP website for requesting access [#6](https://redmine.hbpmip.link/issues/6)
- No more unecessary call if not logged in [#24](https://redmine.hbpmip.link/issues/24)
- Cleanup CSS / removed unused code

## 6.3.2 - 2020/06/02

- UI splash Radial background
- Fixed error handling for stats
- Mip deployment fixes

## 6.3.1 - 2020/05/28

- Updated MIP deployment test server with python deployment

## 6.3.0 - 2020/05/22

- New statistics fixes
- Filter fixes
- Error handling for tables

## 6.2.3 - 2020/05/22

- Datacatalogue integration for Federation
- New Descriptive statistics integration

## 6.2.2 - 2020/05/07

- Kaplan Meier new integration

## 6.2.1 - 2020/05/07

- Fixed XSRF regression

## 6.2.0 - 2020/05/06

- Fixed XSRF token parsing in cookie

## 6.1.4.1 - 2020/04/30

- Fixed Terms Of Service form for local instances.
- Fixed Galaxy access

## 6.1.4 - 2020/04/16

- Keycloak and Galaxy Error handling

## 6.1.3 - 2020/04/07

- Bug fix for enumerations without a label
- Reworked filter comparison, fixes a refresh bug in filters

## 6.1.2 - 2020/04/03

- Added dataset, amyloid42_status, p_tau_status to filters
- Error message for Galaxy
- Pathology label on views
- Dataset Labels for Analysis
- Tests refactoring
- mip-deployment stack added as a git submodule

## 6.1.1 - 2020/03/26

- Longitudinal bug fix

## 6.1.0 - 2020/03/26

- ROHAN Service link (Ontologies for Neurosciences)
- Kaplan Meyer and longitudinal datasets integration
- Exareme 20.0.0 integration

## 6.0.1 - 2020/03/23

- Added alert message for Keycloack Forbidden 403 response

## 6.0.0 - 2020/03/14

- polynominal => multinominal change

## dev_5.2.7 - 13.03.2020

- Reworked Histogram variables
- Reworked Cart last node + center zoom

## dev_5.2.4 - 2020/03/10

- Cart algorithm integrated
- Updated Typescript & d3.js librairies
- Histogram grouping variables fixes
- Annotation module for Highchart
- Changed TBI CDEs Mortality to Categorical type
- hbpmip/exareme:dev_v14.2
- Calibration Belt dynamic variables integration
- Added Annotation module for Highcharts
- Reverted x<->y for multiple histograms

## 5.2.0 - 2020/02/27

- New API for Galaxy integration
- Dockerized tests - (run-test.sh)
- Calibration Belt integration
- Removed hint on algorithm hover
- Histogram fixes
- Removed local/federated mode
- Added training videos in help
- Bug fixes
- UI improvements

## 5.1.18 - 2020/01/30

- Added more static filters for dementia
- Bug fixes
- PCA integrated

## 2019/12/13

- Multiple Histogram integrated
- NaiveBayes integrated
- TTEST_PAIRED integrated
- ID3 tree view visualisation (dendogram)
- TTEST_ONESAMPLE integrated
- Better tooltip on algorithms
- Default parameters and enum from Exareme integrated

## 2019/04/12

- Prevent user to perform an experiment without any selected dataset
- Logout button in Profile, call GET /logout
- Dropdown for Histograms
- Replace label by code if not exists in metadata
- KMeans integration + tests
- CircleCI script, not working, as their docker service logs doesn't produce outputs on CircleCI and local CircleCI doesn't have the same implementation
- Tests updated

## 5.1.11 - 2019/11/12

- Galaxy Workflow Engine embedded in Federation Mode
- Workflow error handling for Galaxy based algorithms
- Algorithm widgets
  - factorial/additive
  - levels selection for categorical variables
- Removed Woken calls
- Using Exareme for
  - descriptive statisticsd
  - histograms
  - algorithms
    - LOGISTIC_REGRESSION
    - TTEST_INDEPENDENT
    - ID3
    - PEARSON_CORRELATION
    - LINEAR_REGRESSION
    - ANOVA
    - Naive Bayes with cross validation
- Removed unused visjs library

## 5.0.0 - 2019/10/08

- Navigation reworked
- Explore layout redesigned
- Removed lots of css, migrating to styled-components
- Galaxy iFrame integration
- multipathologies
- Exareme statistics replace Woken summary statistics
- Removed /v3 path
- React Login
- Re-enabled Bugsnag for production build
- Removed Angular
- Switched React Linter from TSLint to ESLint
  - See [ESLint and Prettier in a TypeScript Project](https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb)

## 4.0.0 - 2019/07/05

- Removed ID3 and Naive Bayes standalone ( => 5.0 )
- Histograms:
  - Local version with Woken
  - Federated version with Exareme
  - Galaxy Workflow Error handling
  - Exareme histograms error handling

## 4.0.0-beta.1 - 2019/06/20

- Galaxy Workflow POC
  - Naive Bayes
- Multi pathologies POC
- Exareme Algorithms integration
  - Pearson correlation
  - Histograms
  - Logistic regression
  - Anova
  - Naive Bayes
  - ID3
- EE page
  - Exareme Histograms
  - React/D3 hook architecture
- Local/central algorithm list
- Homepage draft (/v3/home)
- Types cleanup

## 3.0.4 - 2019/05/29

- Bug fixes

## 3.0.3 - 2019/05/10

- Enabled KNN
- Filter tests by plateform in CI, do `yarn test woken` or `yarn test exareme`

## 3.0.2 - 2019/05/08

- Fixed Mime type bug due to Mime type bug on on [Woken see](https://jira.chuv.ch/browse/HBPLD-256?filter=-6)
- Fixed config.mode for federation
- Removed Heatmaply (Too heavy ~7 mo)

## 3.0.1 - 2019/05/08

- Test suite can now run as a standalone docker to test any live installation, see [/app/v3/README.md](./app/v3/README.md)
- Fixed footer

## 3.0.0 - 2019/04/30

- Tag release, no changes

## 2.16.5 - 2019/04/08

- Highcharts to 6.1.0 (angular security fix)
- Reworked Heatmap test

## 2.16.4 - 2019/03/26

- Idem than 2.16.3 - Previous merge failed

## 2.16.3 - 2019/03/26

- Fixed CircleCI build & test
  - Exareme tests are disabled as datasets are not aligned ( can't save a model on the backend if the dataset doesn't exist)
  - However tests pass on web-anayltics-demo, branch research_datasets
  - To be fixed in Exareme integration
- Fixed Heatmap bug
- Reworked mining cache

## 2.16.2 - 2019/03/20

- Added test for exareme filters
- Added footer to Experiment pages
- default kfold value to 3

## 2.16.1 - 2019/03/19

- Removed validation for local mode
- Tests fixes
- Fixed kfold for kmeans

## 2.16.0 - 2019/03/13

- Algorithm tests completed, testing 20 algorithms (Woken, Exareme) see ./app/v3/src/components/API/**tests**/Integration/Experiments/README.txt
- Algorithm fixes
- Updated yarn libraries (react, highcharts)
- Various UI fixes (Dropdown, results)

## 2.15.8 - 2019/03/08

- Implemented Helpdesk forms (Angular, React)
- New Term of Services page

## 2.15.6 - 2019/02/25

- Quick implementation of linear regression from Exareme

## 2.15.5 - 2019/02/24

- UI fixes
- Fixed filter bug
- Fixed heatmap visualisation
- Libs; swaped numeral (buggy) for numbro
- Formatted linearRegression

## 2.15.4 - 2019/02/22

- Fixed filter query bug
- Modularized plotly.js -> -1.20 Mo on build
- Integration and e2e test for Heatmap API
- Fixed Heatmap formating bugs for federation
- [numeral](https://www.npmjs.com/package/numeral) lib added for scientific notation
- Fixed visualisation bug to Woken format (see HBPLD-256 in jira)
- More testing for linear regression federated, 1 or several datasets
- Updated react libs
- Fixed typing, imports, canvas testing, ansync tests
- [Migrated](https://vincenttunru.com/migrate-create-react-app-typescript-to-create-react-app/) from create-react-app-typescript to Create React App

## 2.15.3 2019/02/18

- Tests
  - Jest and Enzyme config for Typescript
  - `yarn test`
  - Render tests for top level components, App, Results, Create
  - API Integration tests for Model: create and update
  - E2E tests based on mocks, federated mode
    - naivebayes
    - linearregression
- React version
  - Updated all librairies to latest version
  - Added bugsnag client
  - Fixed kfold polynominal presponse processing bug
