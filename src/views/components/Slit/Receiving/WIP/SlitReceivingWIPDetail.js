import { MuiButton, MuiDataGrid, MuiTextField } from '@controls';
import { Grid } from '@mui/material';
import { SlitReceivingService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';

export default function SlitReceivingWIPDetail({ WIPRMId }) {
  const intl = useIntl();
  const lotInputRef = useRef();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      keyWord: '',
      ProcessId: null,
      showDelete: true,
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WIPRMId', hide: true },
    { field: 'row_version', hide: true },
    { field: 'MaterialLotId', hide: true },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      flex: 0.8,
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'materialSO.MaterialId' }),
      flex: 0.4,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      flex: 0.6,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'materialLot.Length' }),
      flex: 0.4,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialLot.Width' }),
      flex: 0.4,
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      flex: 0.5,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete, WIPRMId]);

  //handle
  async function fetchData(Id) {
    setState({ ...state, isLoading: true });
    const params = {
      WIPRMId: Id ?? WIPRMId,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await SlitReceivingService.getReturnMaterialDetail(params);

    if (res)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleLotInputChange = (e) => {
    lotInputRef.current.value = e.target.value;
  };

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };

  const scanBtnClick = async () => {
    const lot = lotInputRef.current.value.trim();

    const res = await SlitReceivingService.scanReturnMaterialDetailLot({ WIPRMId: WIPRMId, MaterialLotCode: lot });

    lotInputRef.current.value = '';
    lotInputRef.current.focus();

    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      setState({ ...state, isSubmit: false });
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setState({ ...state, isSubmit: false });
    }
  };

  return (
    <React.Fragment>
      <Grid container direction="row">
        <Grid item>
          <MuiTextField
            size="small"
            ref={lotInputRef}
            sx={{ mb: 1, mt: 1, width: 350 }}
            onChange={handleLotInputChange}
            onKeyDown={keyPress}
            label={intl.formatMessage({ id: 'materialLot.MaterialLotCode' })}
            disabled={WIPRMId ? false : true}
          />
        </Grid>
        <Grid item>
          <MuiButton
            text="scan"
            color="success"
            onClick={scanBtnClick}
            sx={{ mb: 1, ml: 1, mr: 2, marginTop: '10px' }}
            disabled={WIPRMId ? false : true}
          />
        </Grid>
      </Grid>

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
        getRowId={(rows) => rows.MaterialLotId}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        getRowClassName={(params) => {
          if (params.row.LotStatus) return `Mui-created`;
        }}
      />
    </React.Fragment>
  );
}
