export class ItemResponse {
    uuid: string;
    codigoPatrimonio?: string;
    nome: string;
    categoriaNome: string;
    status: string;
    dataAquisicao?: string;
    active: boolean;
}

export type ItemFilterRequest = {
    nome?: string;
    codigoPatrimonio?: string;
    status?: string;
    categoriaUuid?: string;
    active?: boolean;
};
