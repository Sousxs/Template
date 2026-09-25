using AutoMapper;
using FGR.Sistema.Entities.Catalogo;
using FGR.Sistema.Service.Models.Catalogo;

namespace FGR.Sistema.Service.Models.Mappers;

public class CatalogoProfile : Profile
{
    public CatalogoProfile()
    {
        CreateMap<Produto, ProdutoResponse>()
            .ForMember(d => d.CategoriaNome, o => o.MapFrom(s => s.Categoria.Nome))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<ProdutoRequest, Produto>()
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.Uuid, o => o.Ignore())
            .ForMember(d => d.CategoriaId, o => o.Ignore())
            .ForMember(d => d.Categoria, o => o.Ignore());
    }
}
