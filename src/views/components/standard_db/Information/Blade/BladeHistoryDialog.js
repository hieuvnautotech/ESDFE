import { MuiDialog, MuiDataGrid } from '@controls';
import { BladeService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { MoldDto } from '@models';

const BladeHistoryDialog = ({ initModal, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {},
  });
  useEffect(() => {
    if (isOpen) fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen]);

  async function fetchData() {
    if (isRendered) {
      setState({ ...state, isLoading: true });
    }

    const params = {
      page: state.page,
      pageSize: state.pageSize,
      BladeId: initModal?.BladeId,
    };
    const res = await BladeService.getBladeHistory(params);
    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleCloseDialog = () => {
    onClose();
  };
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.Id) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'Id', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'SlitOrder',
      headerName: intl.formatMessage({ id: 'Blade.SlitOrder' }),
      width: 350,
    },
    {
      field: 'BladeName',
      headerName: intl.formatMessage({ id: 'Blade.BladeName' }),
      width: 350,
    },
    // {
    //   field: 'MaterialCode',
    //   headerName: intl.formatMessage({ id: 'materialLot.MaterialCode' }),
    //   width: 300,
    // },
    {
      field: 'TotalLength',
      headerName: intl.formatMessage({ id: 'Blade.TotalLength' }),
      width: 200,
    },
  ];
  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({
        id: 'general.create',
      })}
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
        gridHeight={736}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        onPageSizeChange={(newPageSize) => setState({ ...state, pageSize: newPageSize, page: 1 })}
        getRowId={(rows) => rows.Id}
        getRowClassName={(params) => {}}
      />
    </MuiDialog>
  );
};
export default BladeHistoryDialog;
