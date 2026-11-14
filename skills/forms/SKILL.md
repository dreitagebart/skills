---
name: forms
description: Formulare und Eingabevalidierung mit @mantine/form und Zod (schemaResolver), Schemas geteilt zwischen Formular und tRPC-Procedure. Verwenden bei Formularen, useForm, Eingabefeldern, Validierungsregeln, Zod-Schemas für Eingaben, Mutations aus Formularen und Fehlermeldungen an Feldern - auch bei einem einzelnen Eingabefeld mit Validierung.
---

# Formulare mit Mantine Form und Zod

Ein Formular hat genau ein Zod-Schema. Dasselbe Schema validiert im Browser (Formular) und auf dem Server (tRPC-Input), damit beide Seiten nie auseinanderlaufen.

## Installation

```bash
bun add @mantine/form zod
```

`@mantine/form` unterstützt Standard Schema nativ über `schemaResolver`. Das alte Zusatzpaket `mantine-form-zod-resolver` wird nicht mehr benötigt.

## Schema

Schemas liegen in `src/schemas/<thema>.ts`, ein Typ wird daraus abgeleitet:

```ts
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(3, { error: 'Mindestens 3 Zeichen' }),
  content: z.string().min(1, { error: 'Pflichtfeld' }),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
```

Der Typ heißt `<Schemaname-ohne-Schema>Input` und wird nur dort exportiert, wo er gebraucht wird. Fehlermeldungen sind UI-Text und stehen in der Sprache des Produkts, alles andere im Code bleibt Englisch.

## Formular

```tsx
'use client'

import { Button, Stack, Textarea, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { type CreatePostInput, createPostSchema } from '~/schemas/post'
import { useTRPC } from '~/lib/trpc/client'

export const CreatePostForm = () => {
  const trpc = useTRPC()
  const createPost = useMutation(trpc.post.create.mutationOptions())

  const { onSubmit, getInputProps } = useForm<CreatePostInput>({
    mode: 'controlled',
    initialValues: { title: '', content: '' },
    validate: schemaResolver(createPostSchema, { sync: true }),
  })

  const handleSubmit = (values: CreatePostInput) => {
    createPost.mutate(values)
  }

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="Titel" {...getInputProps('title')} />
        <Textarea label="Inhalt" {...getInputProps('content')} />
        <Button type="submit" loading={createPost.isPending}>
          Speichern
        </Button>
      </Stack>
    </form>
  )
}
```

## Regeln

- **`mode: 'controlled'`** ist der Standard. Dadurch wird kein `key={form.key(...)}` an den Eingabefeldern benötigt.
- **`useForm` mit Generik und Destructuring:** Den abgeleiteten Input-Typ übergeben (`useForm<CreatePostInput>(...)`) und die benötigten Methoden direkt per Object Destructuring herausziehen (`const { onSubmit, getInputProps } = useForm(...)`).
- **Eigene `handleSubmit`-Funktion:** Die Submit-Handler-Logik wird in einer eigenen `handleSubmit`-Funktion definiert und an `onSubmit(handleSubmit)` übergeben, nie als Inline-Arrow-Function im `<form>`-Tag.
- `schemaResolver(schema, { sync: true })` verwenden, solange das Schema keine asynchronen `.refine()`-Prüfungen enthält.
- Auf dem Server dasselbe Schema als tRPC-Input nutzen: `.input(createPostSchema)`.
- Fehler aus der Mutation sichtbar machen und nicht verschlucken (siehe Skill `error-handling`).
- Der Dateiname der Formular-Komponente endet auf `-form`, die Datei liegt in `src/components/forms/`.
