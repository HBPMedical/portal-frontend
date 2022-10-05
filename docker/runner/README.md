# hbpmip/portal-frontend

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0) [![DockerHub](https://img.shields.io/badge/docker-hbpmip%2Fportal--frontend-008bb8.svg)](https://hub.docker.com/r/hbpmip/portal-frontend/) [![CHUV](https://img.shields.io/badge/HBP-AF4C64.svg)](https://www.humanbrainproject.eu)

## Docker image for Portal Frontend

This Docker image provides a Caddy server configured to serve the frontend HTML, images and scripts
and provide an access point to the public backend services.

The configuration file can be overwrite by mounting a volume in the container (_./your/file/path/to/Caddyfile:/etc/caddy/Caddyfile_).

## Environment variables

- ERROR_LOG_LEVEL: Reporting level for the error log. Defaults to warn.
- PORTAL_BACKEND_SERVER: Address of the portal backend server, for example PORTAL_BACKEND_SERVER="backend:8080"
- PORTAL_BACKEND_CONTEXT: Context path for the portal backend server, defaults to 'services'.
- VERSION: Version of MIP
- INSTANCE_NAME: Name of the instance deployed
- ONTOLOGY_URL: Ontology's URL
- DATACATALOGUE_SERVER: Datacatalogue's URL
- CONTACT_LINK: Contact URL (support)
- EXPERIMENTS_LIST_REFRESH: Time to wait before refresh experiments list in milliseconds

### Matomo
Matomo is an open source alternative to Google Analytics. It can be configured with the following environment variables

- MATOMO_ENABLED: Enable or disable Matomo
- MATOMO_URL: Base url for matomo scripts and data reporting. This parameter is required if Matomo is enabled
- MATOMO_SITE_ID: Matomo Website ID. This parameter is required if Matomo is enabled.