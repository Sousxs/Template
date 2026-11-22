using Base.Shared.Data;
using Base.Shared.DependencyInjection;
using Empresa.Sistema.Entities.Catalogo;

namespace Empresa.Sistema.Repository.Interface.Catalogo;

[Repository]
public interface IProdutoRepository : IRepository<Produto>
{
    Task<bool> ExistsCodigoAsync(string codigo, Guid? exceto = null);
}
