import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useService } from '@hooks/UseService';
import { useToastRef } from '@hooks/UseToastRef';
import { useInternationalization } from '@hooks/UseInternationalization';
import { useApiError } from '@core/hooks/UseApiError';
import { ItemService } from '@services/item/ItemService';
import { ItemRequest } from '@models/item/ItemRequest';
import { filterItemQueryKey } from './UseFilterItemQuery';

export const useItemMutation = (form: UseFormReturn<ItemRequest>, onSaved: () => void) => {
    const service = useService(ItemService);
    const queryClient = useQueryClient();
    const toast = useToastRef();
    const { formHandleError } = useApiError();
    const { tMessage } = useInternationalization('item');

    return useMutation({
        mutationFn: (request: ItemRequest) => service.persist(request),
        onSuccess: async () => {
            toast?.current?.show({ severity: 'success', summary: tMessage('saved') });
            await queryClient.invalidateQueries({ queryKey: [filterItemQueryKey] });
            onSaved();
        },
        onError: (error) => formHandleError(form, error)
    });
};
