using Base.Shared.DomainValidation;
using FGR.Sistema.Repository.Interface.Inventario;
using FGR.Sistema.Repository.Interface.Mestres;
using FGR.Sistema.Service.Interface.Inventario;
using FGR.Sistema.Service.Models.Inventario;

namespace FGR.Sistema.Service.Inventario;

internal class ItemValidator(
    IItemRepository itens,
    ICategoriaRepository categorias,
    IDomainValidation validation) : IItemValidator
{
    public async Task ValidarCriar(ItemRequest request) => await ValidarComum(request, null);

    public async Task ValidarEditar(ItemRequest request, Guid uuid)
    {
        if (!await itens.ExistsAsync(uuid))
            validation.AddDomainError("Item não encontrado.");

        await ValidarComum(request, uuid);
    }

    private async Task ValidarComum(ItemRequest request, Guid? uuid)
    {
        if (string.IsNullOrWhiteSpace(request.Nome))
            validation.AddFieldError(nameof(request.Nome), "Informe o nome.");

        if (!await categorias.ExistsAsync(request.CategoriaUuid))
            validation.AddFieldError(nameof(request.CategoriaUuid), "Categoria não encontrada.");

        if (!string.IsNullOrWhiteSpace(request.CodigoPatrimonio)
            && await itens.ExistsCodigoAsync(request.CodigoPatrimonio, uuid))
            validation.AddFieldError(nameof(request.CodigoPatrimonio), "Código já cadastrado.");
    }
}
