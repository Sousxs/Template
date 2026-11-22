import PermissionRouter from '@components/auth/PermissionRouter';
import { PermissionEnum } from '@models/permission/PermissionEnum';
import { ProdutoListarPage } from '@pages/produto/ProdutoListarPage';
import { ProdutoFormPage } from '@pages/produto/ProdutoFormPage';
import { ProdutoVisualizarPage } from '@pages/produto/ProdutoVisualizarPage';

const itemRoutes = {
    path: 'produto',
    children: [
        { index: true, element: <PermissionRouter permissions={[PermissionEnum.ProdutoListar]}><ProdutoListarPage /></PermissionRouter> },
        { path: 'new', element: <PermissionRouter permissions={[PermissionEnum.ProdutoCriar]}><ProdutoFormPage /></PermissionRouter> },
        { path: 'edit/:uuid', element: <PermissionRouter permissions={[PermissionEnum.ProdutoEditar]}><ProdutoFormPage /></PermissionRouter> },
        { path: 'view/:uuid', element: <PermissionRouter permissions={[PermissionEnum.ProdutoVisualizar]}><ProdutoVisualizarPage /></PermissionRouter> }
    ]
};

export default itemRoutes;
