// Trecho de Database/AppDbContext.cs. Um método por domínio, chamado no OnModelCreating.
private static void ConfigurarCatalogo(ModelBuilder builder)
{
    builder.Entity<Produto>(e =>
    {
        e.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
        e.HasIndex(x => x.Codigo).IsUnique().HasFilter("[Codigo] IS NOT NULL");
        e.HasIndex(x => new { x.Status, x.CategoriaId });
    });
}
