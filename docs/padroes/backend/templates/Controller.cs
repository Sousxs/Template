using Base.Export;
using Base.OAuth.Common;
using Base.Shared.DataTables;
using FGR.Sistema.Entities.Catalogo;
using FGR.Sistema.Service.Interface.Catalogo;
using FGR.Sistema.Service.Models.Catalogo;
using Microsoft.AspNetCore.Authorization;

namespace FGR.Sistema.Api.Controllers.Catalogo;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
[Authorize]
public class ProdutoController(
    IProdutoService service,
    IDomainValidation domainValidation,
    BLL.ILogger<ProdutoController> logger,
    IUnityOfWork unityOfWork,
    IMapper mapper,
    IExportService export)
    : BaseApiStatusController<Produto, ProdutoController>(service, domainValidation, logger, unityOfWork)
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Permission(Permissions.Produto.Listar)]
    public Task<IActionResult> Listar([FromQuery] DataTableRequest<ProdutoFilterRequest> request) =>
        ExecuteAsync(async () =>
        {
            var page = await service.ListMapperAsync<ProdutoResponse>(request, i => i.Categoria);
            return page.ToActionResult();
        });

    [HttpGet("select-items")]
    [Permission(Permissions.Produto.Listar)]
    public Task<IActionResult> SelectItems() =>
        ExecuteAsync(async () => Ok(await service.ListarSelectItemsAsync()));

    [HttpGet("{uuid:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProdutoResponse))]
    [Permission(Permissions.Produto.Visualizar)]
    public Task<IActionResult> Obter(Guid uuid) =>
        ExecuteAsync(async () =>
        {
            var produto = await service.ObterAsync(uuid);
            return produto is null ? NotFound() : Ok(produto);
        });

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ProdutoResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(IDomainValidation))]
    [Permission(Permissions.Produto.Criar)]
    public Task<IActionResult> Criar([FromBody] ProdutoRequest request) =>
        ExecuteWithTransactionAsync(async () =>
        {
            var response = await service.CriarAsync(request);
            return Created($"/Produto/{response!.Uuid}", response);
        });

    [HttpPut("{uuid:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProdutoResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(IDomainValidation))]
    [Permission(Permissions.Produto.Editar)]
    public Task<IActionResult> Editar(Guid uuid, [FromBody] ProdutoRequest request) =>
        ExecuteWithTransactionAsync(async () => Ok(await service.EditarAsync(request, uuid)));

    [HttpGet("export")]
    [Permission(Permissions.Produto.Exportar)]
    public Task<IActionResult> Exportar([FromQuery] ExportRequest<ProdutoFilterRequest> request) =>
        ExecuteAsync(async () =>
        {
            var dados = await service.ExportAsync(request.Filters, i => i.Categoria);
            return export.ToDownload(request.Type, "produtos", mapper.Map<IList<ProdutoResponse>>(dados));
        });
}
