FROM node:16 as builder
LABEL maintainer = "manuel.spuhler@chuv.ch"

WORKDIR /frontend

ADD yarn.lock /frontend
ADD package.json /frontend

RUN yarn install

ENV NODE_PATH=/frontend/node_modules
ENV PATH=$PATH:/frontend/node_modules/.bin

COPY public /frontend/public
COPY src /frontend/src
COPY ./.eslintrc.json \
    ./.eslintignore \
    ./.prettierrc.js \
    ./tsconfig.json \
    /frontend/

RUN yarn build

FROM caddy:latest
LABEL maintainer = "manuel.spuhler@chuv.ch"

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

ENV DOCKERIZE_VERSION=v0.6.1

RUN apk add --no-cache --update ca-certificates wget openssl bash && update-ca-certificates && wget -O /tmp/dockerize.tar.gz "https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-${DOCKERIZE_VERSION}.tar.gz" && tar -C /usr/local/bin -xzvf /tmp/dockerize.tar.gz && rm -rf /var/cache/apk/* /tmp/*

# Add frontend config
COPY ./docker/runner/conf/config.json.tmpl \
     /portal/conf/

# Add reverse proxy / webserver config
COPY ./docker/runner/conf/Caddyfile /etc/caddy/Caddyfile

COPY docker/runner/run.sh /

# Add front end resources
COPY --from=builder /frontend/build /usr/share/caddy/html/

EXPOSE 80 443

ENTRYPOINT ["/run.sh"]

LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="hbpmip/portal-frontend" \
    org.label-schema.description="Caddy server configured to serve the frontend of the MIP portal" \
    org.label-schema.url="https://mip.humanbrainproject.eu" \
    org.label-schema.vcs-type="git" \
    org.label-schema.vcs-url="https://github.com/HBPMedical/portal-frontend" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.version="$VERSION" \
    org.label-schema.vendor="LREN CHUV" \
    org.label-schema.license="AGPLv3" \
    org.label-schema.docker.dockerfile="Dockerfile" \
    org.label-schema.memory-hint="10" \
    org.label-schema.schema-version="1.0"

