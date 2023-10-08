import { useModal } from '@basesShared';
import { MuiButton, MuiDataGrid, MuiTextField, MuiIconButton, MuiAutocomplete } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton } from '@mui/material';
import { BuyerQRShippingService, FGReceivingService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export default function FGReceivingLot({ FQCSOId, handleUpdateLot }) {
  const intl = useIntl();
  const lotInputRef = useRef();
  let isRendered = useRef(true);
  const [LocationId, setLocationId] = useState(0);
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
  const [newData, setNewData] = useState({});

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <MuiIconButton
                color="error"
                onClick={() => handleDelete(params.row)}
                text="delete"
                disabled={!params.row?.LotStatus || !params.row?.LocationCode}
              />
            </Grid>
          </Grid>
        );
      },
    },
    { field: 'MaterialId', hide: true },
    { field: 'FQCSOId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'returnMaterial.ProductId' }),
      flex: 0.3,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      flex: 0.5,
    },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'product.BuyerId' }),
      flex: 0.7,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.75,
    },
    {
      field: 'LocationCode',
      headerName: intl.formatMessage({ id: 'materialLot.LocationShelfCode' }),
      flex: 0.3,
    },
    {
      field: 'LotStatus',
      headerName: intl.formatMessage({ id: 'materialLot.LotStatus' }),
      width: 100,
      renderCell: (params) => {
        return <span>{params?.row?.LotStatus ? 'Received' : 'Waiting'}</span>;
      },
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'work_order.ActualQty' }),
      flex: 0.3,
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.scannedName' }),
      flex: 0.3,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.scannedDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData(FQCSOId);
    return () => {
      isRendered = false;
    };
  }, [state.page, state.searchData.showDelete, FQCSOId]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...state.data];
      if (data.length > state.pageSize) {
        data.pop();
      }
      setState({
        ...state,
        data: [...data],
        totalRow: state.totalRow + 1,
      });
    }
  }, [newData]);

  //handle
  async function fetchData(FQCSOId) {
    setState({ ...state, isLoading: true });
    const params = {
      FQCSOId: FQCSOId,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await FGReceivingService.getFQCSODetail(params);

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

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await FGReceivingService.deleteFGReceivingLot(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData(FQCSOId);
          // handleUpdateLot({ ...item, ActualQty: item.ActualQty * -1, ScanQty: -1 });
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const scanBtnClick = async () => {
    const lot = lotInputRef.current.value.trim();
    if (lot == '' || LocationId == 0) {
      ErrorAlert(intl.formatMessage({ id: 'FQCSO.required_buyer_and_location' }));
      return;
    }

    const res = await FGReceivingService.scanReceivingBuyerQR({
      FQCSOId: FQCSOId,
      BuyerQR: lot,
      LocationId: LocationId,
    });

    lotInputRef.current.value = '';
    lotInputRef.current.focus();

    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: 'general.success' }));
      fetchData(FQCSOId);
      // handleUpdateLot({ ...res.Data, ScanQty: 1 });
      // setNewData(res.Data);
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
    }
  };

  return (
    <React.Fragment>
      <Grid container direction="row">
        <Grid item>
          <MuiAutocomplete
            sx={{ mt: 1, width: 200, mr: 1 }}
            label={intl.formatMessage({ id: 'Location.Location' })}
            fetchDataFunc={FGReceivingService.getFGReceivingModel}
            displayLabel="LocationCode"
            displayValue="LocationId"
            disabled={FQCSOId ? false : true}
            onChange={(e, item) => setLocationId(item ? item.LocationId ?? null : null, null)}
          />
        </Grid>
        <Grid item>
          <MuiTextField
            size="small"
            ref={lotInputRef}
            sx={{ mt: 1, mb: 1, width: 450 }}
            onChange={handleLotInputChange}
            onKeyDown={keyPress}
            label={intl.formatMessage({ id: 'product.BuyerId' })}
            disabled={FQCSOId ? false : true}
          />
        </Grid>
        <Grid item>
          <MuiButton
            text="scan"
            color="success"
            onClick={scanBtnClick}
            sx={{ ml: 1, mb: 1, mr: 2, marginTop: '10px' }}
            disabled={FQCSOId ? false : true}
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
        getRowId={(rows) => rows.WOSemiLotFQCId}
        getRowClassName={(params) => {
          if (params.row?.LotStatus) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
    </React.Fragment>
  );
}
