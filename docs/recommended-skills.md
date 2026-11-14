# Empfohlene Skills von anderen

Stand: 14. November 2026. Diese Skills stammen nicht aus diesem Repo. Die Auswahl beruht auf Installationszahlen und Katalogbeschreibungen, nicht auf eigenem Test in deinen Projekten. Installationszahlen sind teilweise ein Verteilungseffekt (Skills, die in anderen Paketen mitgeliefert werden, zählen mit), also nur ein grober Hinweis.

**Vor jeder Installation den Quelltext lesen.** Skills laufen mit den Rechten des Agenten. Die `skills`-CLI weist beim Installieren selbst darauf hin.

## Die Skills, die du schon magst

### grill-with-docs (mattpocock)

Ein hartnäckiges Interview, das einen Plan oder Entwurf Punkt für Punkt prüft, die Begriffe schärft und dabei Dokumentation mitschreibt (laut Beschreibung `CONTEXT.md` und ADRs). Sinnvoll vor dem Coden, wenn unklare Begriffe sonst zu falsch gebauten Features führen. Laut Katalogbeschreibung ruft der Skill intern die Skills `grilling` und `domain-modeling` auf.

```bash
# nur der Skill (Abhängigkeiten prüfen, siehe unten)
npx skills add mattpocock/skills --skill grill-with-docs

# oder das ganze Repo
npx skills add mattpocock/skills
```

Mit `--list` vorher nachsehen, wie die Hilfs-Skills heißen, und sie mit `--skill` zusätzlich angeben. Ohne sie läuft der Skill womöglich nur eingeschränkt.

### archify (tt-a1i)

Macht aus einer Beschreibung oder aus Code ein Architektur-, Ablauf-, Sequenz- oder Datenfluss-Diagramm als eine selbstständige, interaktive HTML-Datei. Danach lässt sich im Gespräch nachschärfen ("Redis hinzufügen", "Auth nach links"). Laut README für Claude Code, Codex CLI und opencode gedacht, MIT-lizenziert.

```bash
npx skills add tt-a1i/archify -g
```

Der Skill bringt einen eigenen Renderer mit, der nach Beschreibung im Projekt-README auf Node.js-Zugriff angewiesen sein kann. Das betrifft nur das Werkzeug, nicht deinen Projektcode, kollidiert aber mit der Regel "Bun statt Node". Beim ersten Einsatz prüfen.

## Weitere beliebte Skills

| Skill | Quelle | Wofür | Hinweis |
|---|---|---|---|
| `grill-me` | mattpocock/skills | Interview vor dem Coden ohne Dokumentation | Schlankere Variante von `grill-with-docs` |
| `improve-codebase-architecture` | mattpocock/skills | Architektur eines bestehenden Codebestands verbessern | Für gewachsene Projekte wie ältere Apps |
| `tdd` | mattpocock/skills | Testgetriebene Entwicklung | Prüfen, ob die Beispiele zu `bun test` passen |
| `diagnosing-bugs` | mattpocock/skills | Systematische Fehlersuche | Allgemein einsetzbar |
| `setup-matt-pocock-skills` | mattpocock/skills | Richtet die Skills von Matt Pocock im Projekt ein | Auf GitHub-Workflows ausgelegt, bei Codeberg die Tracker-Option prüfen |
| `find-skills` | vercel-labs/skills | Durchsucht die Registry mitten in der Arbeit und schlägt Skills vor | Meistinstalliert (über 4 Mio.), aber es sind Fremd-Skills, vor dem Installieren prüfen |
| `agent-browser` | vercel-labs | Browser-Automatisierung für UI-Prüfungen | Prüfen, welche Laufzeit es verlangt |
| `frontend-design` | anthropics | Gestalterisch eigenständige Oberflächen | Kann mit der Vorgabe "Mantine, kein eigener Stil" konkurrieren, nur gezielt aufrufen |
| `skill-creator` | anthropics | Eigene Skills erstellen und testen | Nützlich zum Pflegen dieses Repos |
| `write-a-skill` | mattpocock/skills | Neue Skills mit sauberer Struktur anlegen | Alternative zu `skill-creator` |

## Empfohlene Reihenfolge

1. `grill-with-docs` mit seinen Hilfs-Skills, weil du es schon schätzt und es zu "erst denken, dann bauen" passt.
2. `archify` für Architekturdiagramme.
3. Danach nach Bedarf: `diagnosing-bugs` und `improve-codebase-architecture` bei bestehenden Projekten, `tdd` zusammen mit `bun test`, `agent-browser` für UI-Prüfungen.
4. `frontend-design` bewusst nur dann, wenn du eine gestalterisch freie Seite willst, die nicht strikt nach Mantine aussehen muss.

## Skills auf Codeberg verteilen

Die Kurzform `owner/repo` steht in der `skills`-CLI für GitHub. Für Skills von Codeberg die volle URL angeben, so wie bei diesem Repo:

```bash
npx skills add https://codeberg.org/dreitagebart/skills --all
```
