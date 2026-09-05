# Open Design Railway runtime

Thin Railway image for **Open Design** only. It wraps `ghcr.io/nexu-io/od:latest` and bakes in the OpenCode CLI (musl) so BYOK generation can run on Railway.

This folder is isolated from the portfolio site. Do **not** change homepage, design, or `src/` when deploying or iterating on this runtime.

## What this is (and is not)

- **Is:** a Dockerfile + Railway build config for an Open Design daemon with `opencode` / `opencode-cli` on `PATH`.
- **Is not:** part of the Vite/React portfolio. Site code, Vercel deploy, and design stay untouched.

Point a Railway service at this directory (or this Dockerfile) instead of the repo root.

## Deploy on Railway

1. Create a service that builds from `open-design-runtime/Dockerfile` (see `railway.toml`).
2. Attach a volume at `/data` so Open Design can persist state.
3. Set the same env vars you would use for a stock Open Design image.

### Environment variables

These are unchanged from official Open Design / BYOK setup:

| Variable | Purpose |
| --- | --- |
| `OD_API_TOKEN` | Auth token for the Open Design API |
| `OD_DATA_DIR` | Data directory. Use `/data` on Railway so it matches the volume mount |
| `OPENAI_*` | BYOK keys and related OpenAI settings (for example `OPENAI_API_KEY`) |

Add any other Open Design vars the official image already documents. This wrapper does not rename or replace them.

## Image notes

- Base: `ghcr.io/nexu-io/od:latest`
- Extra: OpenCode CLI from the [anomalyco/opencode](https://github.com/anomalyco/opencode) release (`OPENCODE_VERSION`, default `1.17.4`)
- Binaries: `/usr/local/bin/opencode` and `/usr/local/bin/opencode-cli`
- Entrypoint/CMD come from the official image so the OD daemon still starts as usual
