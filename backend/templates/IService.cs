using Base.Shared.DependencyInjection;
using Base.Shared.Services;
using FGR.Sistema.Entities.Inventario;
using FGR.Sistema.Service.Models.Common;
using FGR.Sistema.Service.Models.Inventario;

namespace FGR.Sistema.Service.Interface.Inventario;

[Service]
public interface IItemService : IBaseService<Item>
{
    Task<ItemResponse?> CriarAsync(ItemRequest request);
    Task<ItemResponse?> EditarAsync(ItemRequest request, Guid uuid);
    Task<ItemResponse?> ObterAsync(Guid uuid);
    Task<IList<SelectItemResponse>> ListarSelectItemsAsync();
}

[Service]
public interface IItemValidator
{
    Task ValidarCriar(ItemRequest request);
    Task ValidarEditar(ItemRequest request, Guid uuid);
}
