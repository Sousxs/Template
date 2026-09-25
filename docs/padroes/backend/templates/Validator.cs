using Base.Shared.DomainValidation;
using FGR.Sistema.Repository.Interface.Catalogo;
using FGR.Sistema.Repository.Interface.Mestres;
using FGR.Sistema.Service.Interface.Catalogo;
using FGR.Sistema.Service.Models.Catalogo;

namespace FGR.Sistema.Service.Catalogo;

internal class ProdutoValidator(
    IProdutoRepository produtos,
    ICategoriaRepository categorias,
    IDomainValidation validation) : IProdutoValidator
{
    public async Task ValidarCriar(ProdutoRequest request) => await ValidarComum(request, null);

    public async Task ValidarEditar(ProdutoRequest request, Guid uuid)
    {
        if (!await produtos.ExistsAsync(uuid))
            validation.AddDomainError("Produto não encontrado.");

        await ValidarComum(request, uuid);
    }

    private async Task ValidarComum(ProdutoRequest request, Guid? uuid)
    {
        if (string.IsNullOrWhiteSpace(request.Nome))
            validation.AddFieldError(nameof(request.Nome), "Informe o nome.");

        if (!await categorias.ExistsAsync(request.CategoriaUuid))
            validation.AddFieldError(nameof(request.CategoriaUuid), "Categoria não encontrada.");

        if (!string.IsNullOrWhiteSpace(request.Codigo)
            && await produtos.ExistsCodigoAsync(request.Codigo, uuid))
            validation.AddFieldError(nameof(request.Codigo), "Código já cadastrado.");
    }
}
