using Base.Export.Core;

namespace FGR.Sistema.Service.Models.Inventario;

public class ItemResponse
{
    public Guid Uuid { get; set; }

    [ShowInReport("Código")]
    public string? CodigoPatrimonio { get; set; }

    [ShowInReport("Nome")]
    public string Nome { get; set; } = string.Empty;

    [ShowInReport("Categoria")]
    public string CategoriaNome { get; set; } = string.Empty;

    [ShowInReport("Status")]
    public string Status { get; set; } = string.Empty;

    public DateOnly? DataAquisicao { get; set; }
    public bool Active { get; set; }
}
