using AutoMapper;
using Base.Repository.Database;
using Base.Shared.Data;
using Base.Shared.DomainValidation;
using FGR.Sistema.Database;
using FGR.Sistema.Entities.Inventario;
using FGR.Sistema.Repository.Interface.Inventario;
using Microsoft.EntityFrameworkCore;

namespace FGR.Sistema.Repository.Inventario;

internal class ItemRepository(
    AppDbContext dbContext,
    ILogger<IRepository<Item>> logger,
    IDomainValidation validation,
    IMapper mapper)
    : Repository<Item>(dbContext, logger, mapper, validation), IItemRepository
{
    public Task<bool> ExistsCodigoAsync(string codigo, Guid? exceto = null) =>
        GetQuery().AsNoTracking()
            .Where(i => i.CodigoPatrimonio == codigo && (exceto == null || i.Uuid != exceto))
            .AnyAsync();
}
