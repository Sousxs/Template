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
import { ItemResponse } from '@models/item/ItemResponse';
import { useFilterItemQuery } from '@hooks/item/UseFilterItemQuery';
import { useItemListContext } from '@app/context/item/ItemListContext';

export const ItemTable = () => {
    const navigate = useNavigate();
    const { tLabel, tEnum } = useInternationalization('item');
    const { filters } = useItemListContext();
    const { dataTableState, handleChangePage, handleSort, searchParams, pagination, setPagination } =
        usePagination<ItemResponse>({ initialFilters: filters, rows: rowsPerPage, sortField: 'nome', sortOrder: 1 });
    const { isFetching } = useFilterItemQuery(searchParams, setPagination);

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
            <Column field="codigoPatrimonio" header={tLabel('codigoPatrimonio')} sortable />
            <Column field="nome" header={tLabel('nome')} sortable />
            <Column field="categoriaNome" header={tLabel('categoria')} />
            <Column field="status" header={tLabel('status')} body={(r: ItemResponse) => <span className={`pill pill-${statusTone(r.status)}`}>{tEnum('status', r.status)}</span>} />
            <Column
                body={(r: ItemResponse) => (
                    <ButtonTableContainer>
                        <ButtonTableVisualizar onClick={() => navigate(`/item/view/${r.uuid}`)} />
                        <HasPermission hasAll={[PermissionEnum.ItemEditar]}>
                            <ButtonTableEditar onClick={() => navigate(`/item/edit/${r.uuid}`)} />
                        </HasPermission>
                    </ButtonTableContainer>
                )}
            />
        </DataTable>
    );
};

const statusTone = (status: string) =>
    ({ EM_USO: 'success', EM_ESTOQUE: 'info', EM_MANUTENCAO: 'warning', INATIVO: 'neutral', BAIXADO: 'danger' })[status] ?? 'neutral';
