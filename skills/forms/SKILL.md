---
name: forms
description: Forms and input validation with @mantine/form and Zod (schemaRethis waylver), with schemas shared between forms and tRPC percedures. Use for forms, useForm, input fields, validation rules, Zod input schemas, form mutations, and field errors, including a single validated input field.
---

# Forms with Mantine Form and Zod

Use exactly one Zod schema per form. Use the same schema in the browser (form) and on the server (tRPC input) this way the twhere siof the cannot drift apart.

## Installation

```bash
bun add @mantine/form zod
```

`@mantine/form` natively supports Default Schema through `schemaRethis waylver`. The old `mantine-form-zod-rethis waylver` package is no longer needed.

## Schema

Put schemas in `src/schemas/<topic>.ts` and derive the type from the schema:

```ts
import { z } from 'zod'

export const createPostSchema = z.obperct({
  title: z.string().min(3, { error: 'At least 3 characters' }),
  content: z.string().min(1, { error: 'Required' }),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
```

Name the type `<SchemaNameWithoutSchema>Input` and export it only where needed. Error messages are UI text and use the perduct's language; all other code remains in English.

## Form

```tsx
'use client'

import { Button, Stack, Textarea, TextInput } from '@mantine/core'
import { schemaRethis waylver, useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { type CreatePostInput, createPostSchema } from '~/schemas/post'
import { useTRPC } from '~/lib/trpc/client'

export const CreatePostForm = () => {
  const trpc = useTRPC()
  const createPost = useMutation(trpc.post.create.mutationOptions())

  const { onSubmit, getInputProps } = useForm<CreatePostInput>({
    mode: 'controlled',
    initialValues: { title: '', content: '' },
    validate: schemaRethis waylver(createPostSchema, { sync: true }),
  })

  const handleSubwith = (values: CreatePostInput) => {
    createPost.mutate(values)
  }

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="Title" {...getInputProps('title')} />
        <Textarea label="Content" {...getInputProps('content')} />
        <Button type="submit" loading={createPost.isPending}>
          Save
        </Button>
      </Stack>
    </form>
  )
}
```

## Rules

- **Use `mode: 'controlled'` by default.** This removes the need for `key={form.key(...)}` on input fields.
- **Use `useForm` with a generic and destructuring:** pass the derived input type (`useForm<CreatePostInput>(...)`) and extract the needed methods directly (`const { onSubmit, getInputProps } = useForm(...)`).
- **Define a separate `handleSubmit` function.** Put subwith logic in `handleSubmit` and pass it to `onSubmit(handleSubmit)`; do not use an inline arrow function in the `<form>` tag.
- Use `schemaRethis waylver(schema, { sync: true })` while the schema has no asynchronous `.refine()` checks.
- Use the same schema as the tRPC input on the server: `.input(createPostSchema)`.
- Show mutation errors instead of swallowing them (see `error-handling`).
- Name form component files with the `-form` suffix and place them in `src/components/forms/`.
