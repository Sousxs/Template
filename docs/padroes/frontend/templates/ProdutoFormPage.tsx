import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageCard from '@components/shared/page-card/PageCard';
import { FormLoading } from '@components/shared/form/Form';
import { useService } from '@hooks/UseService';
import { useInternationalization } from '@hooks/UseInternationalization';
import { ProdutoService } from '@services/produto/ProdutoService';
import { CategoriaService } from '@services/mestre/CategoriaService';
import { ProdutoRequest } from '@models/produto/ProdutoRequest';
import { itemFormBreadcrumbs } from '@pages/produto/config/ProdutoBreadcrumb';
import { ProdutoForm } from '@components/produto/ProdutoForm';

export const ProdutoFormPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const { tTitle } = useInternationalization('produto');
    const produtos = useService(ProdutoService);
    const categorias = useService(CategoriaService);

    const produto = useQuery({ queryKey: ['produto', uuid], queryFn: () => produtos.get<ProdutoRequest, string>(uuid!, ProdutoRequest), enabled: !!uuid });
    const opcoes = useQuery({ queryKey: ['categoria-select'], queryFn: () => categorias.selectItems() });

    if ((uuid && produto.isPending) || opcoes.isPending) return <FormLoading />;

    return (
        <PageCard title={tTitle(uuid ? 'edit' : 'new')} breadcrumbs={itemFormBreadcrumbs}>
            <ProdutoForm defaultValues={produto.data} categorias={opcoes.data ?? []} onSaved={() => navigate('/produto')} onCancel={() => navigate('/produto')} />
        </PageCard>
    );
};
