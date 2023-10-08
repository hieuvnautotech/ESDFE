import { useModal, useModal2 } from '@basesShared';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiIconButton, MuiSearchField, MuiTextField } from '@controls';
import { Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FQCOQCService, IQCReceivingService, WOService } from '@services';
import { ErrorAlert, PrintMaterial, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import FQCOQCAllLotDialog from './FQCOQCAllLotDialog';
import FQCOQCCheckQCDialog from './FQCOQCCheckQCDialog';

const FQCOQC = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const lotInputRef = useRef(null);
  const componentRef = useRef();
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [openDetailIds, setOpenDetailIds] = useState([]);
  const [rowSelected, setRowSelected] = useState([]);
  const [RowCheck, setRowCheck] = useState({});
  const [State, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      WOCode: '',
      ProductCode: '',
      PressLotCode: '',
      SemiLotCode: '',
      CheckResult: null,
    },
  });

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [State.page, State.pageSize]);

  async function fetchData() {
    setOpenDetailIds([]);
    setState({ ...State, isLoading: true });
    const params = {
      WOCode: State.searchData.WOCode,
      ProductCode: State.searchData.ProductCode,
      PressLotCode: State.searchData.PressLotCode,
      SemiLotCode: State.searchData.SemiLotCode,
      CheckResult: State.searchData.CheckResult,
      page: State.page,
      pageSize: State.pageSize,
    };
    const res = await FQCOQCService.getAll(params);
    if (res && isRendered)
      setState({
        ...State,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...State.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...State, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...State, searchData: { ...newSearchData } });
    }
  };

  const handleCheckQC = async (row) => {
    setRowCheck(row);
    toggle();
  };

  const handleCloseCheckQC = () => {
    toggle();
    fetchData();
  };

  const handleViewLot = async (row) => {
    setRowCheck(row);
    toggle2();
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.PressLotCode) + 1 + (State.page - 1) * State.pageSize,
    },
    {
      field: 'action',
      headerName: '',
      width: 120,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <MuiIconButton
                color="error"
                onClick={() => handleCheckQC(params.row)}
                text="checkqc"
                disabled={params.row.QCOQCMasterId != null ? false : true}
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <MuiIconButton color="success" onClick={() => handleViewLot(params.row)} text="view" />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <MuiIconButton
                color="error"
                onClick={() => handleDelete(params.row)}
                text="delete"
                disabled={params.row.CheckResult != null}
              />
            </Grid>
          </Grid>
        );
      },
    },
    { field: 'ModelCode', headerName: intl.formatMessage({ id: 'product.Model' }), flex: 0.3 },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'returnMaterial.ProductId' }), flex: 0.3 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), flex: 0.55 },
    { field: 'WOCode', headerName: intl.formatMessage({ id: 'WO.WOCode' }), flex: 0.3 },
    { field: 'PressLotCode', headerName: intl.formatMessage({ id: 'WO.PressLot' }), flex: 0.35 },
    { field: 'ActualQty', headerName: intl.formatMessage({ id: 'WO.ActualQty' }), flex: 0.3 },
    {
      field: 'CheckResult',
      headerName: intl.formatMessage({ id: 'qcOQC.After_FQC' }),
      flex: 0.3,
      valueFormatter: (params) =>
        params?.value != null ? (params?.value ? 'OK' : 'NG') : intl.formatMessage({ id: 'IQCReceiving.NotYet' }),
    },
    {
      field: 'CheckResultPacking',
      headerName: intl.formatMessage({ id: 'qcOQC.After_Packing' }),
      flex: 0.3,
      valueFormatter: (params) =>
        params?.value != null ? (params?.value ? 'OK' : 'NG') : intl.formatMessage({ id: 'IQCReceiving.NotYet' }),
    },
    // {
    //   field: 'StaffName',
    //   headerName: intl.formatMessage({ id: 'slitOrder.StaffNameCheck' }),
    //   flex: 0.3,
    // },
    // {
    //   field: 'CheckDate',
    //   headerName: intl.formatMessage({ id: 'mold.CheckDate' }),
    //   valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    //   flex: 0.3,
    // },
  ];

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await FQCOQCService.deleteOQC(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getDataPrint = (data) => {
    setRowSelected(data);
  };

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} intl={intl} searchData={State.searchData} getDataPrint={getDataPrint} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 260, []);

  const handleLotInputChange = (e) => {
    lotInputRef.current.value = e.target.value;
  };

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };
  const handleScan = async (inputValue) => {
    if (inputValue.lot.trim() === '') {
      ErrorAlert(intl.formatMessage({ id: 'lot.facAndLot_required' }));
      return;
    }
    const res = await FQCOQCService.scanReceiving({
      PressLotCode: String(inputValue.lot.trim()),
    });
    if (res && isRendered) {
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        fetchData();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    } else {
      ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
    }
  };

  const scanBtnClick = async () => {
    const lot = lotInputRef.current.value.trim();
    await handleScan({ lot });
    lotInputRef.current.value = '';
    lotInputRef.current.focus();
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs={2}>
          <MuiTextField
            ref={lotInputRef}
            label={intl.formatMessage({ id: 'WO.PressLot' })}
            onChange={handleLotInputChange}
            onKeyDown={keyPress}
          />
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '13%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.WOCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'WOCode')}
              />
            </Grid>
            <Grid item style={{ width: '25%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'bom.ProductId' })}
                fetchDataFunc={WOService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductCode ?? null : null, 'ProductCode')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '16%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.PressLot"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'PressLotCode')}
              />
            </Grid>

            <Grid item style={{ width: '16%' }}>
              <MuiSearchField
                fullWidth
                disabled={State.isLoading}
                size="small"
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item style={{ width: '12%' }}>
              <MuiAutocomplete
                translationLabel
                label={intl.formatMessage({ id: 'materialLot.LotStatus' })}
                fetchDataFunc={() => {
                  return {
                    Data: [
                      { item: 'OK', label: 'LotStatus.002' },
                      { item: 'NG', label: 'LotStatus.003' },
                    ],
                  };
                }}
                displayLabel="item"
                displayValue="label"
                onChange={(e, value) =>
                  handleSearch(value?.item != null ? (value?.item == 'OK' ? true : false) : null, 'CheckResult')
                }
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 0 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MuiDataGrid
        showLoading={State.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        gridHeight={736}
        rows={State.data}
        page={State.page - 1}
        pageSize={State.pageSize}
        rowCount={State.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...State, page: newPage + 1 })}
        getRowId={(rows) => rows.PressLotCode}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        detailPanelExpandedRowIds={openDetailIds}
        onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        getRowClassName={(params) => {
          if (params.row.CheckResult == false || params.row.CheckResultPacking == false) return `Mui-NG`;
          else if (params.row.CheckResult == true) return `Mui-OK`;
        }}
      />
      <FQCOQCCheckQCDialog RowCheck={RowCheck} isOpen={isShowing} onClose={handleCloseCheckQC} />
      <FQCOQCAllLotDialog RMModel={RowCheck} isOpen={isShowing2} onClose={toggle2} />
    </React.Fragment>
  );
};

const DetailPanelContent = ({ row: rowProp, intl, searchData, getDataPrint: getDataPrint }) => {
  let isDetailRendered = useRef(true);
  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    MaterialId: rowProp.MaterialId,
  });

  const fetchDetailData = async () => {
    setDetailPanelState({ ...detailPanelState, isLoading: true });
    const params = {
      PressLotCode: rowProp.PressLotCode,
      page: detailPanelState.page,
      pageSize: detailPanelState.pageSize,
    };
    const res = await FQCOQCService.getDetail(params);

    setDetailPanelState({
      ...detailPanelState,
      data: res.Data ?? [],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.SemiLotCode) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.7,
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      type: 'number',
      flex: 0.5,
    },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'BuyerQR.BuyerQR' }),
      flex: 0.6,
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.scannedName' }),
      flex: 0.4,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.scannedDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  useEffect(() => {
    fetchDetailData();
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp, searchData]);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState.isLoading}
          isPagingServer={true}
          headerHeight={35}
          columns={detailPanelColumns}
          rows={detailPanelState.data}
          page={detailPanelState.page - 1}
          pageSize={detailPanelState.pageSize}
          rowCount={detailPanelState.totalRow}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.SemiLotCode}
          initialState={{ pinnedColumns: { right: ['action'] } }}
          //checkboxSelection

          onSelectionModelChange={(ids) => getDataPrint(ids)}
        />
      </Paper>
    </Stack>
  );
};

export default FQCOQC;
