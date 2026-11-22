import { AppMenuItem } from '@models/menu/AppMenuItem';
import { PermissionEnum } from '@models/permission/PermissionEnum';

export class ProdutoMenu {
    public static readonly listar: AppMenuItem = { label: 'Produtos', icon: 'pi pi-box', to: '/produto', permissions: [PermissionEnum.ProdutoListar] };
    public static readonly novo: AppMenuItem = { label: 'Novo produto', to: '/produto/new', permissions: [PermissionEnum.ProdutoCriar] };
}
