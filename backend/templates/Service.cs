using AutoMapper;
using Base.Shared.DomainValidation;
using Base.Shared.Services;
using FGR.Sistema.Entities.Inventario;
using FGR.Sistema.Repository.Interface.Inventario;
using FGR.Sistema.Repository.Interface.Mestres;
using FGR.Sistema.Service.Interface.Inventario;
using FGR.Sistema.Service.Models.Common;
using FGR.Sistema.Service.Models.Inventario;
using FGR.Sistema.Service.Models.Utils;

namespace FGR.Sistema.Service.Inventario;

internal class ItemService(
    IItemRepository repository,
    ICategoriaRepository categorias,
    IItemValidator validator,
    IDomainValidation validation,
    IMapper mapper)
    : BaseServiceCrud<Item>(repository), IItemService
{
    public async Task<ItemResponse?> CriarAsync(ItemRequest request)
    {
        GeneralUtils.TrimObjectStringProperties(request);
        await validator.ValidarCriar(request);
        validation.EnsureValid();

        var categoria = await categorias.FindAsync(request.CategoriaUuid);
        var item = mapper.Map<Item>(request);
        item.Categoria = categoria!;
        item.VidaUtilMeses ??= categoria!.VidaUtilPadraoMeses;

        await CreateAsync(item);
        return mapper.Map<ItemResponse>(item);
    }

    public async Task<ItemResponse?> EditarAsync(ItemRequest request, Guid uuid)
    {
        GeneralUtils.TrimObjectStringProperties(request);
        await validator.ValidarEditar(request, uuid);
        validation.EnsureValid();

        var item = (await FindAsync(uuid, i => i.Categoria))!;
        mapper.Map(request, item);
        if (item.Categoria.Uuid != request.CategoriaUuid)
            item.Categoria = (await categorias.FindAsync(request.CategoriaUuid))!;

        await EditAsync(item);
        return mapper.Map<ItemResponse>(item);
    }

    public async Task<ItemResponse?> ObterAsync(Guid uuid)
    {
        var item = await FindAsNoTrackingAsync(uuid, i => i.Categoria);
        return item is null ? null : mapper.Map<ItemResponse>(item);
    }

    public async Task<IList<SelectItemResponse>> ListarSelectItemsAsync() =>
        (await repository.ListAllAsync<SelectItemResponse>(orderBy: q => q.OrderBy(i => i.Nome))).ToList();
}
