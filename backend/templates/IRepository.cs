using Base.Shared.Data;
using Base.Shared.DependencyInjection;
using FGR.Sistema.Entities.Inventario;

namespace FGR.Sistema.Repository.Interface.Inventario;

[Repository]
public interface IItemRepository : IRepository<Item>
{
    Task<bool> ExistsCodigoAsync(string codigo, Guid? exceto = null);
}
