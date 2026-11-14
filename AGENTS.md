# AGENTS.md

Dieses Repo enthält Agent Skills (`skills/<name>/SKILL.md`), keine Anwendung. Es gilt für alle, die Skills hier schreiben oder ändern.

## Struktur

- `skills/<name>/SKILL.md` ist ein Skill. Der Ordnername ist gleich `name` im Frontmatter (kebab-case).
- Zusatzmaterial liegt in `references/` (wird bei Bedarf gelesen) und `assets/` (Vorlagen für die Ausgabe).
- `drafts/` enthält Entwürfe, die nicht installiert werden.
- `docs/` enthält Dokumentation für Menschen, `ROADMAP.md` die offenen Punkte.

## Regeln für Skills

- Frontmatter hat nur `name` und `description`. Die `description` steht in einer Zeile, maximal 1024 Zeichen.
- Die `description` entscheidet, wann ein Skill geladen wird. Sie nennt, was der Skill tut, und konkrete Auslöser (Stichwörter, Aufgaben). Sie darf deutlich formuliert sein, weil Agenten Skills eher zu selten als zu oft laden.
- `SKILL.md` bleibt unter 500 Zeilen. Längere Details wandern in `references/`, mit Hinweis in der `SKILL.md`, wann sie zu lesen sind.
- Verweise auf Dateien eines anderen Skills schreiben als `<skill>/references/<datei>` oder `<skill>/assets/<datei>`.
- Anweisungen im Imperativ, mit Begründung, wo sie nicht selbsterklärend sind. Verbote immer mit der erlaubten Alternative.
- Fließtext ist Deutsch. Fachbegriffe, Bezeichner, Code und Code-Kommentare sind Englisch.
- Code in Skills folgt den eigenen Konventionen (kebab-case-Dateien, `~`-Alias, Named Exports).

## Prüfen

```bash
bun run validate
```

Das Skript prüft Frontmatter, Namen, Größenlimits und Dateiverweise. Es muss vor jedem Commit grün sein.
