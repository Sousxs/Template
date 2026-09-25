using Base.Shared.Data;
using Base.Shared.DependencyInjection;
using FGR.Sistema.Entities.Catalogo;

namespace FGR.Sistema.Repository.Interface.Catalogo;

[Repository]
public interface IProdutoRepository : IRepository<Produto>
{
    Task<bool> ExistsCodigoAsync(string codigo, Guid? exceto = null);
}
