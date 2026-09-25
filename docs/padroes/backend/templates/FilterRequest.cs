using FGR.Sistema.Service.Models.Attribute;

namespace FGR.Sistema.Service.Models.Catalogo;

// Propriedades marcadas aparecem no Swagger como parâmetros de filtro da listagem.
public class ProdutoFilterRequest
{
    [Searcheable] public string? Nome { get; set; }
    [Searcheable] public string? Codigo { get; set; }
    [Searcheable] public string? Status { get; set; }
    [Searcheable(CustomName = "Categoria.Uuid")] public Guid? CategoriaUuid { get; set; }
    [Searcheable] public bool? Active { get; set; }
}
