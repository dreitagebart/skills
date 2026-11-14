---
name: containers
description: Container-Konventionen von dreitagebart - Containerfile statt Dockerfile, compose.yml statt docker-compose.yml, Multistage-Builds, Basisimages in der Reihenfolge Red Hat UBI (inkl. AlmaLinux/Fedora), Alpine, slim, immer restart unless-stopped und container_name. Verwenden bei Containerfile, Compose-Dateien, Images, Deployment, Container-Builds, Podman oder Docker, Datenbank-Containern und beim Containerisieren einer App.
---

# Container

## Dateinamen

- `Containerfile`, nie `Dockerfile`.
- `compose.yml`, nie `docker-compose.yml`. Kein `version:`-Schlüssel (veraltet).
- `.containerignore` neben dem Containerfile (Podman liest sie, Docker ebenfalls über die Kompatibilität).

## Images bauen

- **Immer Multistage:** eine Stage für Abhängigkeiten, eine zum Bauen, eine schlanke Laufzeit-Stage. In die Laufzeit-Stage kommen nur Artefakte, die zur Laufzeit gebraucht werden, kein Compiler und keine Dev-Abhängigkeiten.
- **Basisimage-Reihenfolge:**
  1. **Red Hat UBI** (`registry.access.redhat.com/ubi9/...`, ggf. `ubi10/...`), solange kein Login nötig ist und das Image schlank bleibt:
     - **Laufzeit-Stages:** `ubi9-micro` (distroless, ohne Paketmanager) oder `ubi9-minimal` (wenn Paketinstallationen über `microdnf` nötig sind).
     - **Sprach-Runtimes / Build-Stages:** Offizielle UBI-Images wie `ubi9/go-toolset`, `ubi9/python-312` oder `ubi9/nodejs-20`.
     - *Fallback im RPM-Ökosystem:* Wenn ein benötigtes Paket in den kostenfreien UBI-Repos fehlt, auf **AlmaLinux** (`almalinux:9-minimal`) oder **Fedora** (`fedora-minimal`) ausweichen.
  2. **Alpine** (`*-alpine`), wenn kein passendes, schlankes Image im Red-Hat-/RPM-Ökosystem existiert.
  3. **slim**-Varianten (`*-slim`), nur wenn es kein Alpine-Image gibt oder Alpine (`musl` statt `glibc`) nachweislich Kompatibilitätsprobleme macht.
- Für Bun gibt es kein offizielles Red-Hat-Image, deshalb `oven/bun:<Version>-alpine`, ersatzweise `-slim`.
- **Paketmanagement in UBI/Alma:** In `*-minimal`-Images immer `microdnf` statt `dnf` nutzen und Caches im selben `RUN`-Layer bereinigen (`microdnf clean all`).
- **Tags nicht raten.** Vor dem Eintragen den Tag in der Registry prüfen (`podman search`, Registry-Webseite) und exakt pinnen. Ein schwebender Tag wie `latest` wird nicht verwendet.
- **Kein root zur Laufzeit:** UBI-Images bringen bereits den unprivilegierten Standard-User `1001` mit (`USER 1001`), das `oven/bun`-Image nutzt `USER bun`. Bei anderen Images explizit einen Non-Root-User anlegen und setzen.
- Geheimnisse gehören nicht ins Image: keine `.env`-Datei kopieren, keine Secrets als `ARG`. Konfiguration kommt zur Laufzeit über Umgebungsvariablen.

Vorlagen: `assets/Containerfile.bun-next` (Next.js mit Bun, Standalone-Output) und `assets/.containerignore`.

Die Vorlage setzt `output: 'standalone'` in `next.config.ts` voraus. Mit Prisma läuft `prisma generate` in der Build-Stage (Skill `database`). Im Turborepo wird vorher mit `turbo prune <app> --docker` ein schlanker Workspace erzeugt; die Vorlage gilt dann pro App angepasst.

## Compose

Für **jeden Dienst** in `compose.yml` gilt:

- `restart: unless-stopped`
- `container_name:` mit eindeutigem Namen, Vorschlag `<projekt>-<dienst>` (zum Beispiel `myproject-web`).

Weitere Regeln:

- Datenbanken (PostgreSQL) bekommen ein benanntes Volume, kein Bind-Mount auf unbekannte Pfade.
- Die Datenbank-Hauptversion wird bewusst gewählt und im Tag fixiert.
- `build.dockerfile` zeigt auf `Containerfile`.
- Zugangsdaten über `env_file` oder Secrets, nie im Klartext in der Compose-Datei.

Die Vorlage `assets/compose.yml` ist ein **Platzhalter**, die echten Compose-Templates liefert der Nutzer nach. Bis dahin die Regeln oben anwenden, aber keine eigenen Stack-Entscheidungen (Reverse-Proxy, Netzwerke, Healthchecks) erfinden, sondern nachfragen.
