import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import { Grid, Tooltip, Typography } from '@mui/material';
import { productService, FQCRoutingService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import FQCRoutingDetail from './FQCRoutingDetail';

export default function FQCRouting() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [ProductCode, setProductCode] = useState('');
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 9,
    searchData: {
      Model: null,
      ProductCode: null,
      ProductType: null,
      Description: null,
      showDelete: true,
    },
  });

  const columns = [
    { field: 'ProductId', headerName: '', flex: 0.3, hide: true },
    { field: 'Model', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.ProductId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'ProductCode', headerName: intl.formatMessage({ id: 'product.product_code' }), width: 150 },
    { field: 'ProductName', headerName: intl.formatMessage({ id: 'product.product_name' }), width: 350 },
    { field: 'ModelName', headerName: intl.formatMessage({ id: 'product.Model' }), width: 150 },
    { field: 'ProjectName', headerName: intl.formatMessage({ id: 'product.project_name' }), width: 150 },
    { field: 'SSVersion', headerName: intl.formatMessage({ id: 'product.SS_Version' }), width: 130 },
    { field: 'ProductTypeName', headerName: intl.formatMessage({ id: 'product.product_type' }), width: 130 },
    { field: 'Vendor', headerName: intl.formatMessage({ id: 'product.vendor' }), width: 110 },
    { field: 'ProductStampName', headerName: intl.formatMessage({ id: 'product.Product_stamps' }), width: 130 },
    { field: 'PackingAmount', headerName: intl.formatMessage({ id: 'product.Packing_amount' }), width: 140 },
    { field: 'ExpiryMonth', headerName: intl.formatMessage({ id: 'product.ExpiryMonth' }), width: 120 },
    { field: 'Temperature', headerName: intl.formatMessage({ id: 'product.Temperature' }), width: 130 },
    {
      field: 'RemarkBuyer',
      headerName: intl.formatMessage({ id: 'product.RemarkBuyer' }),
      width: 130,
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'product.Description' }),
      width: 200,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.Description} className="col-text-elip">
            <Typography sx={{ fontSize: 14, maxWidth: 10000 }}>{params.row.Description}</Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 150,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    { field: 'createdName', headerName: 'Created By', width: 120 },
    {
      field: 'modifiedDate',
      headerName: 'Modified Date',
      width: 150,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    { field: 'modifiedName', headerName: 'Modified By', width: 120 },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.isActived]);

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      ModelId: state.searchData.ModelId,
      ProductCode: state.searchData.ProductCode,
      ProductType: state.searchData.ProductType,
      Description: state.searchData.Description,
      showDelete: state.searchData.showDelete,
    };
    const res = await FQCRoutingService.getProductList(params);
    setState({
      ...state,
      data: [...res.Data],

      totalRow: res.TotalRow,
      isLoading: false,
    });
  }
  const getModel = async () => {
    const res = await productService.getProductModel();
    return res;
  };

  const getproductType = async () => {
    const res = await productService.getProductType();
    return res;
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="ProductCode"
                label="product.product_code"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ProductCode')}
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.Model' })}
                fetchDataFunc={getModel}
                displayLabel="ModelCode"
                displayValue="ModelId"
                onChange={(e, item) => handleSearch(item ? item.ModelId ?? null : null, 'ModelId')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'product.product_type' })}
                fetchDataFunc={getproductType}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailId"
                onChange={(e, item) => handleSearch(item ? item.commonDetailId ?? null : null, 'ProductType')}
                variant="standard"
              />
            </Grid>
            <Grid item style={{ width: '21%' }}>
              <MuiSearchField
                variant="Description"
                label="product.Description"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'Description')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
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
        getRowId={(rows) => rows.ProductId}
        // onSelectionModelChange={(Ids) => setProductId(Ids[0])}
        // onSelectionModelChange={(row) => setProductCode(row.row?.ProductCode)}
        onCellClick={(row) => setProductCode(row.row?.ProductCode)}
      />
      <FQCRoutingDetail ProductCode={ProductCode} />
    </React.Fragment>
  );
}
