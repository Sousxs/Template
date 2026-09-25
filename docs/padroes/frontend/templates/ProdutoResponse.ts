export class ProdutoResponse {
    uuid: string;
    codigo?: string;
    nome: string;
    categoriaNome: string;
    status: string;
    dataLancamento?: string;
    active: boolean;
}

export type ProdutoFilterRequest = {
    nome?: string;
    codigo?: string;
    status?: string;
    categoriaUuid?: string;
    active?: boolean;
};
