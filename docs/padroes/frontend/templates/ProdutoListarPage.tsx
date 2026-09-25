import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import PageCard from '@components/shared/page-card/PageCard';
import HasPermission from '@components/auth/HasPermission';
import { useInternationalization } from '@hooks/UseInternationalization';
import { PermissionEnum } from '@models/permission/PermissionEnum';
import { itemListBreadcrumbs } from '@pages/produto/config/ProdutoBreadcrumb';
import { ProdutoListProvider } from '@app/context/produto/ProdutoListContext';
import { ProdutoFilter } from '@components/produto/ProdutoFilter';
import { ProdutoTable } from '@components/produto/ProdutoTable';

export const ProdutoListarPage = () => {
    const navigate = useNavigate();
    const { tTitle } = useInternationalization('produto');
    const { tAction } = useInternationalization('shared');

    return (
        <PageCard
            title={tTitle('list')}
            breadcrumbs={itemListBreadcrumbs}
            titleSideContent={
                <HasPermission hasAll={[PermissionEnum.ProdutoCriar]}>
                    <Button icon="pi pi-plus" label={tAction('new')} onClick={() => navigate('/produto/new')} />
                </HasPermission>
            }
        >
            <ProdutoListProvider>
                <ProdutoFilter />
                <ProdutoTable />
            </ProdutoListProvider>
        </PageCard>
    );
};
