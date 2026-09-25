using System.Net;
using System.Net.Http.Json;
using FGR.Sistema.Service.Models.Inventario;
using FGR.Sistema.Test.Integration.Configuration;
using Xunit;

namespace FGR.Sistema.Test.Integration.Tests.Inventario;

public class ItemControllerTests(CustomApplicationFactory<Program> factory, DependencyInjectionFixture di)
    : BaseControllerTests(factory, di)
{
    [Fact]
    public async Task Criar_ComDadosValidos_Retorna201()
    {
        var request = new ItemRequest { Nome = "Cadeira presidente", CategoriaUuid = Seeds.CategoriaCadeira };

        var response = await ClientComPermissoes("Item.Criar").PostAsJsonAsync("/Item", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Criar_ComCodigoDuplicado_Retorna400()
    {
        var request = new ItemRequest { Nome = "Mesa", CategoriaUuid = Seeds.CategoriaMesa, CodigoPatrimonio = Seeds.CodigoExistente };

        var response = await ClientComPermissoes("Item.Criar").PostAsJsonAsync("/Item", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Criar_SemPermissao_Retorna403()
    {
        var response = await ClientComPermissoes("Item.Listar").PostAsJsonAsync("/Item", new ItemRequest());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Listar_ComPaginacaoPadrao_RetornaEnvelope()
    {
        var response = await ClientComPermissoes("Item.Listar").GetAsync($"/Item{DefaultPagination}");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.Contains("content", body!.Keys);
        Assert.Contains("totalElements", body.Keys);
    }
}
