using Base.Shared.DependencyInjection;
using Base.Shared.Services;
using Empresa.Sistema.Entities.Catalogo;
using Empresa.Sistema.Service.Models.Common;
using Empresa.Sistema.Service.Models.Catalogo;

namespace Empresa.Sistema.Service.Interface.Catalogo;

[Service]
public interface IProdutoService : IBaseService<Produto>
{
    Task<ProdutoResponse?> CriarAsync(ProdutoRequest request);
    Task<ProdutoResponse?> EditarAsync(ProdutoRequest request, Guid uuid);
    Task<ProdutoResponse?> ObterAsync(Guid uuid);
    Task<IList<SelectItemResponse>> ListarSelectItemsAsync();
}

[Service]
public interface IProdutoValidator
{
    Task ValidarCriar(ProdutoRequest request);
    Task ValidarEditar(ProdutoRequest request, Guid uuid);
}
