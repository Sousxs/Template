import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import PageCard from '@components/shared/page-card/PageCard';
import HasPermission from '@components/auth/HasPermission';
import { useInternationalization } from '@hooks/UseInternationalization';
import { PermissionEnum } from '@models/permission/PermissionEnum';
import { itemListBreadcrumbs } from '@pages/item/config/ItemBreadcrumb';
import { ItemListProvider } from '@app/context/item/ItemListContext';
import { ItemFilter } from '@components/item/ItemFilter';
import { ItemTable } from '@components/item/ItemTable';

export const ItemListarPage = () => {
    const navigate = useNavigate();
    const { tTitle } = useInternationalization('item');
    const { tAction } = useInternationalization('shared');

    return (
        <PageCard
            title={tTitle('list')}
            breadcrumbs={itemListBreadcrumbs}
            titleSideContent={
                <HasPermission hasAll={[PermissionEnum.ItemCriar]}>
                    <Button icon="pi pi-plus" label={tAction('new')} onClick={() => navigate('/item/new')} />
                </HasPermission>
            }
        >
            <ItemListProvider>
                <ItemFilter />
                <ItemTable />
            </ItemListProvider>
        </PageCard>
    );
};
