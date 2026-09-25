using Base.Shared.Audit;
using Base.Shared.Data;
using FGR.Sistema.Entities.Inventario.Enum;
using FGR.Sistema.Entities.Mestres;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FGR.Sistema.Entities.Inventario;

[Table("Item")]
public class Item : DefaultEntity, IAuditable
{
    [Required, StringLength(200), Column("Nome")]
    public string Nome { get; set; } = string.Empty;

    [StringLength(50), Column("CodigoPatrimonio"), Uppercase]
    public string? CodigoPatrimonio { get; set; }

    [Required, Column("Status")]
    public StatusItem Status { get; set; } = StatusItem.EmEstoque;

    [StringLength(500), Column("StatusMotivo")]
    public string? StatusMotivo { get; set; }

    [Required, Column("CategoriaId")]
    public long CategoriaId { get; set; }

    [ForeignKey(nameof(CategoriaId)), AuditIgnore]
    public Categoria Categoria { get; set; } = null!;

    [Column("DataAquisicao")]
    public DateOnly? DataAquisicao { get; set; }

    [Column("VidaUtilMeses")]
    public int? VidaUtilMeses { get; set; }
}
