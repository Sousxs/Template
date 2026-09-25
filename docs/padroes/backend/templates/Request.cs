namespace FGR.Sistema.Service.Models.Catalogo;

// Sem DataAnnotations: as regras ficam no ProdutoValidator.
public class ProdutoRequest
{
    public string Nome { get; set; } = string.Empty;
    public string? Codigo { get; set; }
    public Guid CategoriaUuid { get; set; }
    public DateOnly? DataLancamento { get; set; }
    public bool Active { get; set; } = true;
}
