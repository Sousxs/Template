import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useFilterForm } from '@hooks/UseFilterForm';
import { useInternationalization } from '@hooks/UseInternationalization';
import { ButtonFiltrar } from '@components/shared/button/ButtonFiltrar';
import { ButtonLimparFiltro } from '@components/shared/button/ButtonLimparFiltro';
import { ProdutoFilterRequest } from '@models/produto/ProdutoResponse';
import { useProdutoListContext } from '@app/context/produto/ProdutoListContext';

export const ProdutoFilter = () => {
    const { tLabel, tEnum } = useInternationalization('produto');
    const { setFilters } = useProdutoListContext();
    const { form, apply, clear } = useFilterForm<ProdutoFilterRequest>({ onApply: setFilters });

    const statusOptions = ['DISPONIVEL', 'EM_HOMOLOGACAO', 'ESGOTADO', 'SUSPENSO'].map((s) => ({ value: s, label: tEnum('status', s) }));

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
