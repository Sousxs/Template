# Formulários

react-hook-form com resolver de class-validator. O modelo de request é uma classe decorada; o mesmo objeto valida no app e viaja para a API.

```ts
export class ItemRequest {
    @IsNotEmpty({ message: 'validation.required' })
    @MaxLength(200)
    nome: string;

    @IsUUID('4', { message: 'validation.required' })
    categoriaUuid: string;

    @IsOptional() @MaxLength(50)
    codigoPatrimonio?: string;
}
```

```tsx
const form = useForm<ItemRequest>({ resolver: ClassValidatorResolver(ItemRequest), defaultValues });
```

## Kit de formulário

`components/shared/form/Form.tsx`: `Form` (= `FormProvider`), `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormLoading`, `useFormField`, `useFormLoading`. Inputs especializados em `components/shared/input/`: `InputMonetary`, `InputNumberDecimal`, `InputAlphanumeric`, `InputNumeroDocumento`, `RadioButtonGroup`.

```tsx
<Form {...form}>
  <FormField name="nome" render={({ field }) => (
    <FormItem className="col-12 md:col-6">
      <FormLabel required>{tLabel('nome')}</FormLabel>
      <FormControl><InputText {...field} /></FormControl>
    </FormItem>
  )} />
</Form>
```

## Regras

- Mensagens de validação são chaves de i18n, traduzidas por `Validator18n`.
- Validação cruzada entre campos fica em `validation/<feature>/<X>Validator.ts` como decorator custom, não no componente.
- `useFormSubmit` envolve o `handleSubmit` com loader e `formHandleError`.
- Erro de campo devolvido pela API (`errors[campo]`) aparece no campo; `domainErrors` em toast.
- Cancelar em formulário com alteração pergunta antes de sair (`DataDiffValidator` do `PageCard`).
- Botões padronizados: `ButtonSalvar`, `ButtonCancelar`, `ButtonVoltar`. Sem botão criado na tela.
