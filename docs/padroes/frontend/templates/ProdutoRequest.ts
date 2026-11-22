import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class ProdutoRequest {
    uuid?: string;

    @IsNotEmpty({ message: 'validation.required' })
    @MaxLength(200, { message: 'validation.maxLength' })
    nome: string;

    @IsOptional()
    @MaxLength(50, { message: 'validation.maxLength' })
    codigo?: string;

    @IsUUID('4', { message: 'validation.required' })
    categoriaUuid: string;

    @IsOptional()
    dataLancamento?: string;

    active: boolean = true;
}
