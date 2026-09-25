import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageCard from '@components/shared/page-card/PageCard';
import { FormLoading } from '@components/shared/form/Form';
import { useService } from '@hooks/UseService';
import { useInternationalization } from '@hooks/UseInternationalization';
import { ItemService } from '@services/item/ItemService';
import { CategoriaService } from '@services/mestre/CategoriaService';
import { ItemRequest } from '@models/item/ItemRequest';
import { itemFormBreadcrumbs } from '@pages/item/config/ItemBreadcrumb';
import { ItemForm } from '@components/item/ItemForm';

export const ItemFormPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const { tTitle } = useInternationalization('item');
    const itens = useService(ItemService);
    const categorias = useService(CategoriaService);

    const item = useQuery({ queryKey: ['item', uuid], queryFn: () => itens.get<ItemRequest, string>(uuid!, ItemRequest), enabled: !!uuid });
    const opcoes = useQuery({ queryKey: ['categoria-select'], queryFn: () => categorias.selectItems() });

    if ((uuid && item.isPending) || opcoes.isPending) return <FormLoading />;

    return (
        <PageCard title={tTitle(uuid ? 'edit' : 'new')} breadcrumbs={itemFormBreadcrumbs}>
            <ItemForm defaultValues={item.data} categorias={opcoes.data ?? []} onSaved={() => navigate('/item')} onCancel={() => navigate('/item')} />
        </PageCard>
    );
};
