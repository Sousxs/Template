import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '@hooks/UsePagination';
import { useInternationalization } from '@hooks/UseInternationalization';
import { rowsPerPage, rowsPerPageOptions } from '@core/utils/TableUtil';
import HasPermission from '@components/auth/HasPermission';
import ButtonTableContainer from '@components/shared/button/ButtonTableContainer';
import { ButtonTableEditar } from '@components/shared/button/ButtonTableEditar';
import { ButtonTableVisualizar } from '@components/shared/button/ButtonTableVisualizar';
import TableSkeleton from '@components/shared/table/TableSkeleton';
import { PermissionEnum } from '@models/permission/PermissionEnum';
import { ProdutoResponse } from '@models/produto/ProdutoResponse';
import { useFilterProdutoQuery } from '@hooks/produto/UseFilterProdutoQuery';
import { useProdutoListContext } from '@app/context/produto/ProdutoListContext';

export const ProdutoTable = () => {
    const navigate = useNavigate();
    const { tLabel, tEnum } = useInternationalization('produto');
    const { filters } = useProdutoListContext();
    const { dataTableState, handleChangePage, handleSort, searchParams, pagination, setPagination } =
        usePagination<ProdutoResponse>({ initialFilters: filters, rows: rowsPerPage, sortField: 'nome', sortOrder: 1 });
    const { isFetching } = useFilterProdutoQuery(searchParams, setPagination);

    if (isFetching && !pagination) return <TableSkeleton />;

    return (
        <DataTable
            value={pagination?.content}
            lazy
            paginator
            rows={dataTableState.rows}
            first={dataTableState.first}
            totalRecords={pagination?.totalElements}
            rowsPerPageOptions={rowsPerPageOptions}
            sortField={dataTableState.sortField}
            sortOrder={dataTableState.sortOrder}
            onPage={handleChangePage}
            onSort={handleSort}
            loading={isFetching}
            emptyMessage={tLabel('empty')}
        >
            <Column field="codigo" header={tLabel('codigo')} sortable />
            <Column field="nome" header={tLabel('nome')} sortable />
            <Column field="categoriaNome" header={tLabel('categoria')} />
            <Column field="status" header={tLabel('status')} body={(r: ProdutoResponse) => <span className={`pill pill-${statusTone(r.status)}`}>{tEnum('status', r.status)}</span>} />
            <Column
                body={(r: ProdutoResponse) => (
                    <ButtonTableContainer>
                        <ButtonTableVisualizar onClick={() => navigate(`/produto/view/${r.uuid}`)} />
                        <HasPermission hasAll={[PermissionEnum.ProdutoEditar]}>
                            <ButtonTableEditar onClick={() => navigate(`/produto/edit/${r.uuid}`)} />
                        </HasPermission>
                    </ButtonTableContainer>
                )}
            />
        </DataTable>
    );
};

const statusTone = (status: string) =>
    ({ EM_HOMOLOGACAO: 'success', DISPONIVEL: 'info', ESGOTADO: 'warning', SUSPENSO: 'neutral', DESCONTINUADO: 'danger' })[status] ?? 'neutral';
