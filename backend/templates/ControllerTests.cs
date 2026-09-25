using System.Net;
using System.Net.Http.Json;
using FGR.Sistema.Service.Models.Catalogo;
using FGR.Sistema.Test.Integration.Configuration;
using Xunit;

namespace FGR.Sistema.Test.Integration.Tests.Catalogo;

public class ProdutoControllerTests(CustomApplicationFactory<Program> factory, DependencyInjectionFixture di)
    : BaseControllerTests(factory, di)
{
    [Fact]
    public async Task Criar_ComDadosValidos_Retorna201()
    {
        var request = new ProdutoRequest { Nome = "Cimento CP-II 50 kg", CategoriaUuid = Seeds.CategoriaCimento };

        var response = await ClientComPermissoes("Produto.Criar").PostAsJsonAsync("/Produto", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Criar_ComCodigoDuplicado_Retorna400()
    {
        var request = new ProdutoRequest { Nome = "Argamassa", CategoriaUuid = Seeds.CategoriaAlvenaria, Codigo = Seeds.CodigoExistente };

        var response = await ClientComPermissoes("Produto.Criar").PostAsJsonAsync("/Produto", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Criar_SemPermissao_Retorna403()
    {
        var response = await ClientComPermissoes("Produto.Listar").PostAsJsonAsync("/Produto", new ProdutoRequest());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Listar_ComPaginacaoPadrao_RetornaEnvelope()
    {
        var response = await ClientComPermissoes("Produto.Listar").GetAsync($"/Produto{DefaultPagination}");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.Contains("content", body!.Keys);
        Assert.Contains("totalElements", body.Keys);
    }
}
