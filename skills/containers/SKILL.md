---
name: containers
description: dreitagebart container conventions - use Containerfile instead of Dockerfile, compose.yml instead of docker-compose.yml, multi-stage builds, base images in the order Red Hat UBI (including AlmaLinux/Fedora), Alpine, slim, and always set restart unless-stopped and container_name. Use for Containerfiles, Compose files, images, deployment, container builds, Podman or Docker, database containers, and containerizing an app.
---

# Container

## File names

- `Containerfile`, nie `Dockerfile`.
- `compose.yml`, never `docker-compose.yml`. Do not use the obsolete `version:` key.
- Put `.containerignore` next to the Containerfile (Podman reads it, and Docker supports it for compatibility).

## Building images

- **Always use multiple stages:** one for dependencies, one for building, and one lean runtime stage. Include only runtime artifacts in the runtime stage; exclude compilers and dev dependencies.
- **Basisimage-Reihenfolge:**
  1. **Red Hat UBI** (`registry.access.redhat.com/ubi9/...`, or `ubi10/...` if needed), provided no login is required and the image stays lean:
     - **Runtime stages:** `ubi9-micro` (distroless, no package manager) or `ubi9-minimal` (when packages must be installed with `microdnf`).
     - **Language runtimes/build stages:** official UBI images such as `ubi9/go-toolset`, `ubi9/python-312`, or `ubi9/nodejs-20`.
     - *RPM ecosystem fallback:* If a required package is missing from the free UBI repositories, use **AlmaLinux** (`almalinux:9-minimal`) or **Fedora** (`fedora-minimal`).
  2. **Alpine** (`*-alpine`) when no suitable lean image exists in the Red Hat/RPM ecosystem.
  3. **slim** variants (`*-slim`) only when no Alpine image exists or Alpine (`musl` instead of `glibc`) demonstrably causes compatibility issues.
- Bun has no official Red Hat image, so use `oven/bun:<Version>-alpine`, or `-slim` as a fallback.
- **Package management in UBI/Alma:** Always use `microdnf` instead of `dnf` in `*-minimal` images and clean caches in the same `RUN` layer (`microdnf clean all`).
- **Do not guess tags.** Check the tag in the registry (`podman search`, registry website) before adding it, then pin it exactly. Never use a floating tag such as `latest`.
- **Do not run as root:** UBI images already include the unprivileged default user `1001` (`USER 1001`); the `oven/bun` image uses `USER bun`. For other images, create and set a non-root user explicitly.
- Keep secrets out of the image: do not copy `.env` or pass secrets as `ARG`. Supply configuration at runtime through environment variables.

Templates: `assets/Containerfile.bun-next` (Next.js with Bun, standalone output) and `assets/.containerignore`.

The template requires `output: 'standalone'` in `next.config.ts`. With Prisma, run `prisma generate` in the build stage (see `database`). In a Turborepo, first create a lean workspace with `turbo prune <app> --docker`; adapt the template for each app.

## Compose

For **every service** in `compose.yml`:

- `restart: unless-stopped`
- Set `container_name:` to a unique name, suggested pattern `<project>-<service>` (for example `myproject-web`).

Weitere Regeln:

- Give databases (PostgreSQL) a named volume; do not bind-mount to unknown paths.
- Choose the database major version deliberately and pin it in the tag.
- Set `build.dockerfile` to `Containerfile`.
- Supply credentials through `env_file` or secrets, never as plaintext in the Compose file.

The `assets/compose.yml` template is a **placeholder**; the user will provide the real Compose templates. Until then, apply the rules above, but ask before making stack decisions (reverse proxy, networks, health checks).
