import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { useService } from '@hooks/UseService';
import { useToastRef } from '@hooks/UseToastRef';
import { useInternationalization } from '@hooks/UseInternationalization';
import { useApiError } from '@core/hooks/UseApiError';
import { ProdutoService } from '@services/produto/ProdutoService';
import { ProdutoRequest } from '@models/produto/ProdutoRequest';
import { filterProdutoQueryKey } from './UseFilterProdutoQuery';

export const useProdutoMutation = (form: UseFormReturn<ProdutoRequest>, onSaved: () => void) => {
    const service = useService(ProdutoService);
    const queryClient = useQueryClient();
    const toast = useToastRef();
    const { formHandleError } = useApiError();
    const { tMessage } = useInternationalization('produto');

    return useMutation({
        mutationFn: (request: ProdutoRequest) => service.persist(request),
        onSuccess: async () => {
            toast?.current?.show({ severity: 'success', summary: tMessage('saved') });
            await queryClient.invalidateQueries({ queryKey: [filterProdutoQueryKey] });
            onSaved();
        },
        onError: (error) => formHandleError(form, error)
    });
};
