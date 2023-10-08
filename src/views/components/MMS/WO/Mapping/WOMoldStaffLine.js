import { useModal } from '@basesShared';
import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiDataGrid, MuiDialog } from '@controls';
import { WOService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const WOMoldStaffLine = ({ WOProcessId, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [mode, setMode] = useState(CREATE_ACTION);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
  });
  const { isShowing, toggle } = useModal();
  const [rowData, setRowData] = useState({});
  const handleCloseDialog = () => {
    onClose();
  };
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'id', hide: true },
    { field: 'WOProcessId', hide: true },
    { field: 'LineId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'Name',
      headerName: intl.formatMessage({ id: 'general.name' }),
      flex: 0.6,
    },
    {
      field: 'StartDate',
      headerName: intl.formatMessage({ id: 'WO.StartDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'EndDate',
      headerName: intl.formatMessage({ id: 'WO.EndDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'type',
      headerName: intl.formatMessage({ id: 'standardQC.QCType' }),
      flex: 0.6,
    },
  ];
  //useEffect
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }

    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen, WOProcessId]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOProcessId: WOProcessId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await WOService.getWOProcessMoldStaffLineList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <MuiDialog
      maxWidth="md"
      title={intl.formatMessage({ id: 'WO.moldlinemachine' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.id}
        // getRowClassName={(params) => {
        //   if (_.isEqual(params.row, newData)) return `Mui-created`;
        // }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
    </MuiDialog>
  );
};
export default WOMoldStaffLine;
