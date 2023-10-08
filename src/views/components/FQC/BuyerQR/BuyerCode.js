import { useModal } from '@basesShared';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import { Badge, Grid, IconButton } from '@mui/material';
import { BuyerQRService } from '@services';
import { PrintBuyer, ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import BuyerCodeDialog from './BuyerCodeDialog';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BuyerCode() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const [DataPrint, setDataPrint] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      BuyerQR: '',
      ProductId: null,
      createdDate: null,
    },
  });

  const columns = [
    { field: 'BuyerQRId', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BuyerQRId) + 1 + (state.page - 1) * state.pageSize,
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
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
                disabled={params.row.LotCheckStatus}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'BuyerQR',
      headerName: intl.formatMessage({ id: 'buyer.BuyerCode' }),
      flex: 0.7,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      flex: 0.3,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      flex: 0.3,
    },

    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'materialLot.LotNo' }),
      flex: 0.3,
    },
    {
      field: 'ModelName',
      headerName: intl.formatMessage({ id: 'product.Model' }),
      flex: 0.3,
    },
    {
      field: 'PackingAmount',
      headerName: intl.formatMessage({ id: 'product.Packing_amount' }),
      flex: 0.3,
    },
    {
      field: 'Stamps',
      headerName: intl.formatMessage({ id: 'product.Product_stamps' }),
      flex: 0.3,
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 0.3,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    { field: 'createdName', headerName: 'Created By', flex: 0.3 },
  ];

  async function fetchData() {
    if (state.searchData.BuyerQR == '' && state.searchData.ProductId == null && state.searchData.createdDate == null)
      ErrorAlert(intl.formatMessage({ id: 'BuyerQR.error_Search' }));
    else {
      setState({ ...state, isLoading: true });
      const params = {
        page: 0,
        pageSize: 0,
        BuyerQR: state.searchData.BuyerQR,
        ProductId: state.searchData.ProductId,
        createdDate: state.searchData.createdDate ?? '',
      };
      const res = await BuyerQRService.getBuyerQR(params);
      setState({
        ...state,
        data: [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
    }
  }

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await BuyerQRService.deleteBuyerQR(item);
        if (res && res.HttpResponseCode === 200) {
          let newData = state.data;
          newData = newData.filter((x) => x.BuyerQRId != item.BuyerQRId);
          setState({ ...state, data: newData, totalRow: res.TotalRow - 1 });
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePrint = async () => {
    const res = await BuyerQRService.GetBuyerQRPrint(DataPrint);
    PrintBuyer(res.Data);
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };

  const handleSetNewData = async (value) => {
    setState({ ...state, data: value });
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end" sx={{ mb: 1 }}>
        <Grid item xs={3}>
          <MuiButton text="create" color="success" onClick={toggle} />
          <Badge badgeContent={DataPrint.length} color="warning">
            <MuiButton
              text="print"
              color="secondary"
              onClick={handlePrint}
              disabled={DataPrint.length > 0 ? false : true}
            />
          </Badge>
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="BuyerQR"
                label="buyer.BuyerCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'BuyerQR')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.product_code' })}
                fetchDataFunc={BuyerQRService.getProduct}
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, item) => handleSearch(item ? item.ProductId ?? null : null, 'ProductId')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.createdDate' })}
                value={state.searchData.createdDate}
                onChange={(e) => handleSearch(e, 'createdDate')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mb: 1 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MuiDataGrid
        checkboxSelection
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.BuyerQRId}
        onSelectionModelChange={(ids) => setDataPrint(ids)}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        hideFooter
      />
      <BuyerCodeDialog isOpen={isShowing} onClose={toggle} handleSetNewData={handleSetNewData} />
    </React.Fragment>
  );
}
