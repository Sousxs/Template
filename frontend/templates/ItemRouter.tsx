import PermissionRouter from '@components/auth/PermissionRouter';
import { PermissionEnum } from '@models/permission/PermissionEnum';
import { ItemListarPage } from '@pages/item/ItemListarPage';
import { ItemFormPage } from '@pages/item/ItemFormPage';
import { ItemVisualizarPage } from '@pages/item/ItemVisualizarPage';

const itemRoutes = {
    path: 'item',
    children: [
        { index: true, element: <PermissionRouter permissions={[PermissionEnum.ItemListar]}><ItemListarPage /></PermissionRouter> },
        { path: 'new', element: <PermissionRouter permissions={[PermissionEnum.ItemCriar]}><ItemFormPage /></PermissionRouter> },
        { path: 'edit/:uuid', element: <PermissionRouter permissions={[PermissionEnum.ItemEditar]}><ItemFormPage /></PermissionRouter> },
        { path: 'view/:uuid', element: <PermissionRouter permissions={[PermissionEnum.ItemVisualizar]}><ItemVisualizarPage /></PermissionRouter> }
    ]
};

export default itemRoutes;
