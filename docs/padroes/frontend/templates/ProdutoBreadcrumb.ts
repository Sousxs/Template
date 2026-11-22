import { AppMenu } from '@app/AppMenu';
import { ProdutoMenu } from '@pages/produto/config/ProdutoMenu';

export const itemListBreadcrumbs = [AppMenu.menuHome, ProdutoMenu.listar];
export const itemFormBreadcrumbs = [AppMenu.menuHome, ProdutoMenu.listar, ProdutoMenu.novo];
