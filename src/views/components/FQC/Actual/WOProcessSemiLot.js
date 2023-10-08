import { MuiDataGrid } from '@controls';
import { Typography } from '@mui/material';
import { ActualService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export default function WOProcessSemiLot({ WOId }) {
  const intl = useIntl();
  let isRendered = useRef(true);

  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotMMSId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOSemiLotMMSId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.7,
    },
    {
      field: 'PressLotCode',
      headerName: intl.formatMessage({ id: 'WO.PressLotCode' }),
      flex: 0.4,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'LotStatusName',
      headerName: intl.formatMessage({ id: 'materialLot.LotStatus' }),
      renderCell: (params) => {
        return <span>{intl.formatMessage({ id: params?.row?.LotStatusName })}</span>;
      },
      flex: 0.3,
      renderCell: (params) => {
        return <Typography sx={{ fontSize: 14 }}>{intl.formatMessage({ id: params.row?.LotStatusName })}</Typography>;
      },
    },

    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, WOId]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOId: WOId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await ActualService.getWOSemiLot(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <React.Fragment>
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={30}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.WOSemiLotMMSId}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
    </React.Fragment>
  );
}
