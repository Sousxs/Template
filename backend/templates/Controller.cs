using Base.Export;
using Base.OAuth.Common;
using Base.Shared.DataTables;
using FGR.Sistema.Entities.Inventario;
using FGR.Sistema.Service.Interface.Inventario;
using FGR.Sistema.Service.Models.Inventario;
using Microsoft.AspNetCore.Authorization;

namespace FGR.Sistema.Api.Controllers.Inventario;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
[Authorize]
public class ItemController(
    IItemService service,
    IDomainValidation domainValidation,
    BLL.ILogger<ItemController> logger,
    IUnityOfWork unityOfWork,
    IMapper mapper,
    IExportService export)
    : BaseApiStatusController<Item, ItemController>(service, domainValidation, logger, unityOfWork)
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Permission(Permissions.Item.Listar)]
    public Task<IActionResult> Listar([FromQuery] DataTableRequest<ItemFilterRequest> request) =>
        ExecuteAsync(async () =>
        {
            var page = await service.ListMapperAsync<ItemResponse>(request, i => i.Categoria);
            return page.ToActionResult();
        });

    [HttpGet("select-items")]
    [Permission(Permissions.Item.Listar)]
    public Task<IActionResult> SelectItems() =>
        ExecuteAsync(async () => Ok(await service.ListarSelectItemsAsync()));

    [HttpGet("{uuid:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ItemResponse))]
    [Permission(Permissions.Item.Visualizar)]
    public Task<IActionResult> Obter(Guid uuid) =>
        ExecuteAsync(async () =>
        {
            var item = await service.ObterAsync(uuid);
            return item is null ? NotFound() : Ok(item);
        });

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ItemResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(IDomainValidation))]
    [Permission(Permissions.Item.Criar)]
    public Task<IActionResult> Criar([FromBody] ItemRequest request) =>
        ExecuteWithTransactionAsync(async () =>
        {
            var response = await service.CriarAsync(request);
            return Created($"/Item/{response!.Uuid}", response);
        });

    [HttpPut("{uuid:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ItemResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(IDomainValidation))]
    [Permission(Permissions.Item.Editar)]
    public Task<IActionResult> Editar(Guid uuid, [FromBody] ItemRequest request) =>
        ExecuteWithTransactionAsync(async () => Ok(await service.EditarAsync(request, uuid)));

    [HttpGet("export")]
    [Permission(Permissions.Item.Exportar)]
    public Task<IActionResult> Exportar([FromQuery] ExportRequest<ItemFilterRequest> request) =>
        ExecuteAsync(async () =>
        {
            var dados = await service.ExportAsync(request.Filters, i => i.Categoria);
            return export.ToDownload(request.Type, "itens", mapper.Map<IList<ItemResponse>>(dados));
        });
}
