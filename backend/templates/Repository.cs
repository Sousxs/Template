using AutoMapper;
using Base.Repository.Database;
using Base.Shared.Data;
using Base.Shared.DomainValidation;
using FGR.Sistema.Database;
using FGR.Sistema.Entities.Catalogo;
using FGR.Sistema.Repository.Interface.Catalogo;
using Microsoft.EntityFrameworkCore;

namespace FGR.Sistema.Repository.Catalogo;

internal class ProdutoRepository(
    AppDbContext dbContext,
    ILogger<IRepository<Produto>> logger,
    IDomainValidation validation,
    IMapper mapper)
    : Repository<Produto>(dbContext, logger, mapper, validation), IProdutoRepository
{
    public Task<bool> ExistsCodigoAsync(string codigo, Guid? exceto = null) =>
        GetQuery().AsNoTracking()
            .Where(i => i.Codigo == codigo && (exceto == null || i.Uuid != exceto))
            .AnyAsync();
}
