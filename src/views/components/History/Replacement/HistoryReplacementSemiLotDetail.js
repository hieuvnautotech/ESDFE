import { MuiDataGrid } from '@controls';
import { Grid } from '@mui/material';
import { HistoryReplacementSemiLotService } from '@services';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export default function HistoryReplacementSemiLotDetail({ SemiLotCode }) {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 9,
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotDetailId) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'process',
      headerName: intl.formatMessage({ id: 'History.process' }),
      flex: 0.4,
    },

    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'work_order.WoCode' }),
      flex: 0.4,
    },
    {
      field: 'worker',
      headerName: intl.formatMessage({ id: 'slitOrder.StaffName' }),
      flex: 0.4,
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.6,
    },
    {
      field: 'real_qty',
      headerName: intl.formatMessage({ id: 'History.real_qty' }),
      align: 'right',
      flex: 0.3,
    },
    {
      field: 'remark',
      headerName: intl.formatMessage({ id: 'mold.Remark' }),
      flex: 0.4,
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, SemiLotCode]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      SemiLotCode: SemiLotCode,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await HistoryReplacementSemiLotService.getDetail(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <React.Fragment>
      <Grid sx={{ mt: 4 }} />

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
        getRowId={(rows) => rows.WOSemiLotDetailId}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
    </React.Fragment>
  );
}
