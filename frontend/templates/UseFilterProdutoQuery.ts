import { useQuery } from '@tanstack/react-query';
import { useService } from '@hooks/UseService';
import { useFetchApi } from '@hooks/UseApiFetch';
import { useApiError } from '@core/hooks/UseApiError';
import { PaginationResponse } from '@core/models/PaginationResponse';
import { SearchParams } from '@hooks/UsePagination';
import { ProdutoService } from '@services/produto/ProdutoService';
import { ProdutoResponse } from '@models/produto/ProdutoResponse';

export const filterProdutoQueryKey = 'filterProdutoQueryKey';

export const useFilterProdutoQuery = (searchParams: SearchParams, onSuccess?: (data: PaginationResponse<ProdutoResponse>) => void) => {
    const service = useService(ProdutoService);
    const { fetchApi } = useFetchApi();
    const { toastHandleError } = useApiError();

    return useQuery<PaginationResponse<ProdutoResponse>>({
        queryKey: [filterProdutoQueryKey, searchParams],
        queryFn: () =>
            fetchApi(service.paginate<ProdutoResponse>(searchParams.page, searchParams.rows, searchParams.sort, searchParams.filter), {
                onSuccess,
                onError: toastHandleError
            })
    });
};
