using AutoMapper;
using FGR.Sistema.Entities.Inventario;
using FGR.Sistema.Service.Models.Inventario;

namespace FGR.Sistema.Service.Models.Mappers;

public class InventarioProfile : Profile
{
    public InventarioProfile()
    {
        CreateMap<Item, ItemResponse>()
            .ForMember(d => d.CategoriaNome, o => o.MapFrom(s => s.Categoria.Nome))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<ItemRequest, Item>()
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.Uuid, o => o.Ignore())
            .ForMember(d => d.CategoriaId, o => o.Ignore())
            .ForMember(d => d.Categoria, o => o.Ignore());
    }
}
