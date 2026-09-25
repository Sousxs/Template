import { AppMenuItem } from '@models/menu/AppMenuItem';
import { PermissionEnum } from '@models/permission/PermissionEnum';

export class ItemMenu {
    public static readonly listar: AppMenuItem = { label: 'Bens', icon: 'pi pi-box', to: '/item', permissions: [PermissionEnum.ItemListar] };
    public static readonly novo: AppMenuItem = { label: 'Novo bem', to: '/item/new', permissions: [PermissionEnum.ItemCriar] };
}
