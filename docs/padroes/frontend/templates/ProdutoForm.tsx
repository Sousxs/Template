import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/shared/form/Form';
import { ButtonSalvar } from '@components/shared/button/ButtonSalvar';
import { ButtonCancelar } from '@components/shared/button/ButtonCancelar';
import { ClassValidatorResolver } from '@core/forms/ClassValidatorResolver';
import { useInternationalization } from '@hooks/UseInternationalization';
import { ProdutoRequest } from '@models/produto/ProdutoRequest';
import { useProdutoMutation } from '@hooks/produto/UseProdutoMutation';

type Props = { defaultValues?: Partial<ProdutoRequest>; categorias: { value: string; label: string }[]; onSaved: () => void; onCancel: () => void };

export const ProdutoForm = ({ defaultValues, categorias, onSaved, onCancel }: Props) => {
    const { tLabel } = useInternationalization('produto');
    const form = useForm<ProdutoRequest>({ resolver: ClassValidatorResolver(ProdutoRequest), defaultValues: { active: true, ...defaultValues } });
    const mutation = useProdutoMutation(form, onSaved);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="grid">
                <FormField name="nome" render={({ field }) => (
                    <FormItem className="col-12 md:col-6">
                        <FormLabel required>{tLabel('nome')}</FormLabel>
                        <FormControl><InputText {...field} className="w-full" /></FormControl>
                    </FormItem>
                )} />
                <FormField name="categoriaUuid" render={({ field }) => (
                    <FormItem className="col-12 md:col-3">
                        <FormLabel required>{tLabel('categoria')}</FormLabel>
                        <FormControl><Dropdown options={categorias} value={field.value} onChange={(e) => field.onChange(e.value)} className="w-full" /></FormControl>
                    </FormItem>
                )} />
                <FormField name="codigo" render={({ field }) => (
                    <FormItem className="col-12 md:col-3">
                        <FormLabel>{tLabel('codigo')}</FormLabel>
                        <FormControl><InputText {...field} className="w-full" /></FormControl>
                    </FormItem>
                )} />
                <div className="col-12 flex justify-content-end gap-2">
                    <ButtonCancelar onClick={onCancel} />
                    <ButtonSalvar loading={mutation.isPending} />
                </div>
            </form>
        </Form>
    );
};
