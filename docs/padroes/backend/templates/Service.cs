using AutoMapper;
using Base.Shared.DomainValidation;
using Base.Shared.Services;
using FGR.Sistema.Entities.Catalogo;
using FGR.Sistema.Repository.Interface.Catalogo;
using FGR.Sistema.Repository.Interface.Mestres;
using FGR.Sistema.Service.Interface.Catalogo;
using FGR.Sistema.Service.Models.Common;
using FGR.Sistema.Service.Models.Catalogo;
using FGR.Sistema.Service.Models.Utils;

namespace FGR.Sistema.Service.Catalogo;

internal class ProdutoService(
    IProdutoRepository repository,
    ICategoriaRepository categorias,
    IProdutoValidator validator,
    IDomainValidation validation,
    IMapper mapper)
    : BaseServiceCrud<Produto>(repository), IProdutoService
{
    public async Task<ProdutoResponse?> CriarAsync(ProdutoRequest request)
    {
        GeneralUtils.TrimObjectStringProperties(request);
        await validator.ValidarCriar(request);
        validation.EnsureValid();

        var categoria = await categorias.FindAsync(request.CategoriaUuid);
        var produto = mapper.Map<Produto>(request);
        produto.Categoria = categoria!;

        await CreateAsync(produto);
        return mapper.Map<ProdutoResponse>(produto);
    }

    public async Task<ProdutoResponse?> EditarAsync(ProdutoRequest request, Guid uuid)
    {
        GeneralUtils.TrimObjectStringProperties(request);
        await validator.ValidarEditar(request, uuid);
        validation.EnsureValid();

        var produto = (await FindAsync(uuid, i => i.Categoria))!;
        mapper.Map(request, produto);
        if (produto.Categoria.Uuid != request.CategoriaUuid)
            produto.Categoria = (await categorias.FindAsync(request.CategoriaUuid))!;

        await EditAsync(produto);
        return mapper.Map<ProdutoResponse>(produto);
    }

    public async Task<ProdutoResponse?> ObterAsync(Guid uuid)
    {
        var produto = await FindAsNoTrackingAsync(uuid, i => i.Categoria);
        return produto is null ? null : mapper.Map<ProdutoResponse>(produto);
    }

    public async Task<IList<SelectItemResponse>> ListarSelectItemsAsync() =>
        (await repository.ListAllAsync<SelectItemResponse>(orderBy: q => q.OrderBy(i => i.Nome))).ToList();
}
