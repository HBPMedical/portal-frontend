# hbpmip/portal-frontend

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html) [![](https://images.microbadger.com/badges/version/hbpmip/portal-frontend.svg)](https://hub.docker.com/r/hbpmip/portal-frontend/tags 'hbpmip/portal-frontend image tags') [![](https://images.microbadger.com/badges/image/hbpmip/portal-frontend.svg)](https://microbadger.com/#/images/hbpmip/portal-frontend 'hbpmip/portal-frontend on microbadger')

## Docker image for Portal Frontend

This Docker image provides a Caddy server configured to serve the frontend HTML, images and scripts
and provide an access point to the public backend services.

Environment variables:

- ERROR_LOG_LEVEL: reporting level for the error log. Defaults to warn.
- PORTAL_BACKEND_SERVER: address of the portal backend server, for example PORTAL_BACKEND_SERVER="backend:8080"
- PORTAL_BACKEND_CONTEXT: context path for the portal backend server, defaults to 'services'.
- VERSION: Version of MIP
- INSTANCE_NAME: Name of the instance deployed
