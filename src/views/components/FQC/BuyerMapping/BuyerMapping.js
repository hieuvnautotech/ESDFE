import { useModal, useModal2 } from '@basesShared';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiTextField, MuiSearchField } from '@controls';
import { Badge, Button, Grid, IconButton } from '@mui/material';
import { BuyerQRService, BuyerMappingService } from '@services';
import { PrintBuyer, ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import BuyerCodeDialog from './BuyerCodeDialog';
import LinkIcon from '@mui/icons-material/Link';

export default function BuyerMapping() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const semiInputRef = useRef('');
  const buyerInputRef = useRef('');
  const { isShowing, toggle } = useModal();
  const [DataMapping, setDataMapping] = useState(null);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      BuyerQR: '',
      SemiLotCode: '',
      ProductId: null,
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOSemiLotFQCId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
      flex: 0.3,
    },
    {
      field: 'WorkOrder',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      flex: 0.3,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.6,
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      flex: 0.3,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      flex: 0.3,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      flex: 0.4,
    },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'BuyerQR.BuyerQR' }),
      flex: 0.5,
    },
    // {
    //   field: 'OQC',
    //   headerName: 'OQC',
    //   width: 80,
    //   disableClickEventBubbling: true,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       params.row.BuyerQR && (
    //         <Button
    //           variant="contained"
    //           color="primary"
    //           size="small"
    //           onClick={() => handleCheckPQC(params.row)}
    //           sx={{ paddingTop: '1px', paddingBottom: '1px' }}
    //           disabled={params.row.QCOQCMasterId == null ? true : false}
    //         >
    //           {intl.formatMessage({ id: 'WO.Check' })}
    //         </Button>
    //       )
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    fetchData();
    buyerInputRef.current.value = '';
    semiInputRef.current.value = '';
    return () => {
      isRendered = false;
    };
  }, [state.page]);

  useEffect(() => {
    if (!_.isEmpty(DataMapping)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.WOSemiLotFQCId == DataMapping.WOSemiLotFQCId;
      });
      if (index !== -1) {
        newArr[index] = DataMapping;
      } else {
        newArr = [DataMapping, ...newArr];
        if (newArr.length > state.pageSize) {
          newArr.pop();
        }
      }

      setState({ ...state, data: newArr });
    }
  }, [DataMapping]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      BuyerQR: state.searchData.BuyerQR,
      SemiLotCode: state.searchData.SemiLotCode,
      ProductId: state.searchData.ProductId,
      page: state.page,
      pageSize: state.pageSize,
    };
    const res = await BuyerMappingService.getBuyerMapping(params);
    setState({
      ...state,
      data: [...res.Data],
      totalRow: res.TotalRow,
      isLoading: false,
    });
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };

  const inputChangeSemi = (e) => {
    semiInputRef.current.value = e.target.value;
  };

  const keyPressSemi = async (e) => {
    if (e.key === 'Enter') {
      const lot = semiInputRef.current.value.trim() ?? '';
      if (lot != '') {
        buyerInputRef.current.focus();
      }
    }
  };

  const inputChangeBuyer = (e) => {
    buyerInputRef.current.value = e.target.value;
  };

  const keyPressBuyer = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };

  const scanBtnClick = async () => {
    const semi = semiInputRef.current.value.trim();
    const buyer = buyerInputRef.current.value.trim();
    if (semi != '' && buyer != '') {
      const res = await BuyerMappingService.mappingBuyerQR({ BuyerQR: buyer, SemiLotCode: semi });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDataMapping(res.Data);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }

      buyerInputRef.current.value = '';
      semiInputRef.current.value = '';
      semiInputRef.current.focus();
    }
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end" sx={{ mb: 1 }}>
        <Grid item xs={7} container direction="row">
          <Grid item>
            <MuiTextField
              autoFocus
              size="small"
              ref={semiInputRef}
              sx={{ mt: 1, width: 300, mr: 1 }}
              onChange={inputChangeSemi}
              onKeyDown={keyPressSemi}
              label={intl.formatMessage({ id: 'WO.SemiLotCode' })}
            />
          </Grid>
          <Grid item>
            <MuiTextField
              size="small"
              ref={buyerInputRef}
              sx={{ mt: 1, width: 300 }}
              onChange={inputChangeBuyer}
              onKeyDown={keyPressBuyer}
              label={intl.formatMessage({ id: 'BuyerQR.BuyerQR' })}
            />
          </Grid>
          <Grid item>
            <MuiButton text="scan" color="info" onClick={scanBtnClick} sx={{ ml: 1, mr: 1, marginTop: '10px' }} />
          </Grid>
          <Grid item>
            <Button variant="contained" color="error" onClick={() => toggle()} sx={{ ml: 1, mr: 1, marginTop: '10px' }}>
              {intl.formatMessage({ id: 'BuyerQR.ChangeBuyerQR' })}
            </Button>
          </Grid>
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '30%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.product_code' })}
                fetchDataFunc={BuyerQRService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '45%' }}>
              <MuiSearchField
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mb: 1 }} />
            </Grid>
          </Grid>
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
        //onSelectionModelChange={(ids) => setDataPrint(ids)}
        // onRowClick={(params) => {
        //   const bq = buyerInputRef.current.value.trim();
        //   if (bq == '' && params.row.BuyerQR == '') {
        //     semiInputRef.current.value = params.row.SemiLotCode;
        //   }
        // }}
        getRowClassName={(params) => {
          if (params.row.BuyerQR != null && params.row.BuyerQR != '') return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
      <BuyerCodeDialog isOpen={isShowing} onClose={toggle} setDataMapping={setDataMapping} />
    </React.Fragment>
  );
}
