import { useQuery } from '@tanstack/react-query';
import { useService } from '@hooks/UseService';
import { useFetchApi } from '@hooks/UseApiFetch';
import { useApiError } from '@core/hooks/UseApiError';
import { PaginationResponse } from '@core/models/PaginationResponse';
import { SearchParams } from '@hooks/UsePagination';
import { ItemService } from '@services/item/ItemService';
import { ItemResponse } from '@models/item/ItemResponse';

export const filterItemQueryKey = 'filterItemQueryKey';

export const useFilterItemQuery = (searchParams: SearchParams, onSuccess?: (data: PaginationResponse<ItemResponse>) => void) => {
    const service = useService(ItemService);
    const { fetchApi } = useFetchApi();
    const { toastHandleError } = useApiError();

    return useQuery<PaginationResponse<ItemResponse>>({
        queryKey: [filterItemQueryKey, searchParams],
        queryFn: () =>
            fetchApi(service.paginate<ItemResponse>(searchParams.page, searchParams.rows, searchParams.sort, searchParams.filter), {
                onSuccess,
                onError: toastHandleError
            })
    });
};
