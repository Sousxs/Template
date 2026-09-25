namespace FGR.Sistema.Service.Models.Inventario;

// Sem DataAnnotations: as regras ficam no ItemValidator.
public class ItemRequest
{
    public string Nome { get; set; } = string.Empty;
    public string? CodigoPatrimonio { get; set; }
    public Guid CategoriaUuid { get; set; }
    public DateOnly? DataAquisicao { get; set; }
    public int? VidaUtilMeses { get; set; }
    public bool Active { get; set; } = true;
}
