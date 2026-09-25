import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/shared/form/Form';
import { ButtonSalvar } from '@components/shared/button/ButtonSalvar';
import { ButtonCancelar } from '@components/shared/button/ButtonCancelar';
import { ClassValidatorResolver } from '@core/forms/ClassValidatorResolver';
import { useInternationalization } from '@hooks/UseInternationalization';
import { ItemRequest } from '@models/item/ItemRequest';
import { useItemMutation } from '@hooks/item/UseItemMutation';

type Props = { defaultValues?: Partial<ItemRequest>; categorias: { value: string; label: string }[]; onSaved: () => void; onCancel: () => void };

export const ItemForm = ({ defaultValues, categorias, onSaved, onCancel }: Props) => {
    const { tLabel } = useInternationalization('item');
    const form = useForm<ItemRequest>({ resolver: ClassValidatorResolver(ItemRequest), defaultValues: { active: true, ...defaultValues } });
    const mutation = useItemMutation(form, onSaved);

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
                <FormField name="codigoPatrimonio" render={({ field }) => (
                    <FormItem className="col-12 md:col-3">
                        <FormLabel>{tLabel('codigoPatrimonio')}</FormLabel>
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
