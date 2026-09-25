// Trecho de Database/AppDbContext.cs. Um método por domínio, chamado no OnModelCreating.
private static void ConfigurarInventario(ModelBuilder builder)
{
    builder.Entity<Item>(e =>
    {
        e.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
        e.HasIndex(x => x.CodigoPatrimonio).IsUnique().HasFilter("[CodigoPatrimonio] IS NOT NULL");
        e.HasIndex(x => new { x.Status, x.CategoriaId });
    });
}
