#!/usr/bin/env bash
set -e

OPTS="-template /portal/conf/config.json.tmpl:/usr/share/caddy/html/static/config.json"

eval "exec dockerize $OPTS caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"
