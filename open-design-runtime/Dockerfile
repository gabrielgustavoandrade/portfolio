# Thin wrapper: official Open Design image + OpenCode CLI (musl) for BYOK generation on Railway.
FROM ghcr.io/nexu-io/od:latest

USER root

ARG OPENCODE_VERSION=1.17.4

RUN set -eux; \
  apk add --no-cache curl ca-certificates libstdc++ libgcc; \
  arch="$(uname -m)"; \
  case "$arch" in \
    x86_64) asset="opencode-linux-x64-baseline-musl.tar.gz" ;; \
    aarch64) asset="opencode-linux-arm64-musl.tar.gz" ;; \
    *) echo "unsupported arch: $arch" >&2; exit 1 ;; \
  esac; \
  curl -fsSL -o /tmp/opencode.tar.gz \
    "https://github.com/anomalyco/opencode/releases/download/v${OPENCODE_VERSION}/${asset}"; \
  tar -xzf /tmp/opencode.tar.gz -C /usr/local/bin; \
  rm -f /tmp/opencode.tar.gz; \
  chmod 755 /usr/local/bin/opencode; \
  ln -sf /usr/local/bin/opencode /usr/local/bin/opencode-cli; \
  opencode --version; \
  opencode-cli --version

ENV PATH="/usr/local/bin:${PATH}"

# Keep the base image entrypoint/cmd for the OD daemon. Do not override USER unless the base requires it.
