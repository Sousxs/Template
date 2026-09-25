using Base.Shared.Audit;
using Base.Shared.Data;
using FGR.Sistema.Entities.Catalogo.Enum;
using FGR.Sistema.Entities.Mestres;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FGR.Sistema.Entities.Catalogo;

[Table("Produto")]
public class Produto : DefaultEntity, IAuditable
{
    [Required, StringLength(200), Column("Nome")]
    public string Nome { get; set; } = string.Empty;

    [StringLength(50), Column("Codigo"), Uppercase]
    public string? Codigo { get; set; }

    [Required, Column("Status")]
    public StatusProduto Status { get; set; } = StatusProduto.Disponivel;

    [StringLength(500), Column("StatusMotivo")]
    public string? StatusMotivo { get; set; }

    [Required, Column("CategoriaId")]
    public long CategoriaId { get; set; }

    [ForeignKey(nameof(CategoriaId)), AuditIgnore]
    public Categoria Categoria { get; set; } = null!;

    [Column("DataLancamento")]
    public DateOnly? DataLancamento { get; set; }

}
