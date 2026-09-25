import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useFilterForm } from '@hooks/UseFilterForm';
import { useInternationalization } from '@hooks/UseInternationalization';
import { ButtonFiltrar } from '@components/shared/button/ButtonFiltrar';
import { ButtonLimparFiltro } from '@components/shared/button/ButtonLimparFiltro';
import { ItemFilterRequest } from '@models/item/ItemResponse';
import { useItemListContext } from '@app/context/item/ItemListContext';

export const ItemFilter = () => {
    const { tLabel, tEnum } = useInternationalization('item');
    const { setFilters } = useItemListContext();
    const { form, apply, clear } = useFilterForm<ItemFilterRequest>({ onApply: setFilters });

    const statusOptions = ['EM_ESTOQUE', 'EM_USO', 'EM_MANUTENCAO', 'INATIVO'].map((s) => ({ value: s, label: tEnum('status', s) }));

    return (
        <form onSubmit={apply} className="filter-panel grid">
            <div className="col-12 md:col-4">
                <label className="field-label">{tLabel('nome')}</label>
                <InputText {...form.register('nome')} className="w-full" />
            </div>
            <div className="col-12 md:col-3">
                <label className="field-label">{tLabel('status')}</label>
                <Dropdown options={statusOptions} showClear className="w-full" value={form.watch('status')} onChange={(e) => form.setValue('status', e.value)} />
            </div>
            <div className="col-12 flex gap-2">
                <ButtonFiltrar />
                <ButtonLimparFiltro onClick={clear} />
            </div>
        </form>
    );
};
