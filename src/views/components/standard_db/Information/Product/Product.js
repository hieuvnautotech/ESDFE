import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import { ProductDto } from '@models';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { Switch, Tooltip, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { productService } from '@services';
import { SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreateDialog from './CreateProductDialog';
import ModifyDialog from './ModifyProductDialog';

const Product = () => {
  const intl = useIntl();

  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
  const [isOpenModifyDialog, setIsOpenModifyDialog] = useState(false);

  // const [modelArr, setModelArr] = useState([]); //Model Product
  // const [productTypeArr, setproductTypeArr] = useState([]); //Product Type
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});

  const [productState, setproductState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      ModelId: null,
      ProductCode: null,
      ProductType: null,
      Description: null,
      showDelete: true,
    },
  });

  const [selectedRow, setSelectedRow] = useState({
    ...ProductDto,
  });

  const [newData, setNewData] = useState({ ...ProductDto });
  const toggleCreateDialog = () => {
    setIsOpenCreateDialog(!isOpenCreateDialog);
  };
  const toggleModifyDialog = (row) => {
    setSelectedRow(row);
    setIsOpenModifyDialog(!isOpenModifyDialog);
  };

  useEffect(() => {
    fetchData();
  }, [productState.page, productState.pageSize, productState.searchData.showDelete]);

  useEffect(() => {
    if (!_.isEmpty(newData) && !_.isEqual(newData, ProductDto)) {
      const data = [newData, ...productState.data];
      if (data.length > productState.pageSize) {
        data.pop();
      }
      setproductState({
        ...productState,
        data: [...data],
        totalRow: productState.totalRow + 1,
      });
    }
  }, [newData]);

  // useEffect(() => {
  //   if (!_.isEmpty(selectedRow) && !_.isEqual(selectedRow, ProductDto)) {
  //     let newArr = [...productState.data];
  //     const index = _.findIndex(newArr, function (o) {
  //       return o.ProductId == selectedRow.ProductId;
  //     });
  //     if (index !== -1) {
  //       newArr[index] = selectedRow;
  //     }

  //     setproductState({
  //       ...productState,
  //       data: [...newArr],
  //     });
  //   }
  // }, [selectedRow]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...productState.data];
      const index = _.findIndex(newArr, function (o) {
        return o.ProductId == updateData.ProductId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setproductState({ ...productState, data: [...newArr] });
    }
  }, [updateData]);

  const getModel = async () => {
    const res = await productService.getProductModel();
    return res;
  };

  const getproductType = async () => {
    const res = await productService.getProductType();
    return res;
  };

  async function fetchData() {
    setproductState({ ...productState, isLoading: true });
    const params = {
      page: productState.page,
      pageSize: productState.pageSize,
      ModelId: productState.searchData.ModelId,
      ProductCode: productState.searchData.ProductCode,
      ProductType: productState.searchData.ProductType,
      Description: productState.searchData.Description,
      showDelete: productState.searchData.showDelete,
    };
    const res = await productService.getProductList(params);
    setproductState({
      ...productState,
      data: [...res.Data],

      totalRow: res.TotalRow,
      isLoading: false,
    });
  }

  // const handleRowSelection = (arrIds) => {
  //   const rowSelected = productState.data.filter(function (item) {
  //     return item.ProductId === arrIds[0];
  //   });
  //   if (rowSelected && rowSelected.length > 0) {
  //     setSelectedRow({ ...rowSelected[0] });
  //   } else {
  //     setSelectedRow({ ...ProductDto });
  //   }
  // };

  const handleDelete = async (row) => {
    let message = productState.searchData.showDelete
      ? intl.formatMessage({ id: 'general.confirm_delete' })
      : intl.formatMessage({ id: 'general.confirm_redo_deleted' });
    if (window.confirm(message)) {
      try {
        let res = await productService.deleteProduct({
          ProductId: row.ProductId,
          row_version: row.row_version,
        });
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...productState.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      //  console.log(productState, inputName)
      setproductState({
        ...productState,
        page: 1,
        searchData: { ...newSearchData },
      });
    } else {
      setproductState({ ...productState, searchData: { ...newSearchData } });
    }
  };

  const columns = [
    { field: 'ProductId', headerName: '', flex: 0.3, hide: true },
    { field: 'Model', headerName: '', flex: 0.3, hide: true },
    // { field: 'ProductType', headerName: '', flex: 0.3, hide: true },

    {
      field: 'id',
      headerName: '',
      width: 70,
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.ProductId) + 1 + (productState.page - 1) * productState.pageSize,
    },

    {
      field: 'action',
      headerName: '',
      width: 80,
      // headerAlign: 'center',
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6}>
              <IconButton
                aria-label="edit"
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                onClick={() => toggleModifyDialog(params.row)}
              >
                {params.row.isActived ? <EditIcon fontSize="inherit" /> : ''}
              </IconButton>
            </Grid>
            {/* <Grid item xs={6}>
              <IconButton
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid> */}
          </Grid>
        );
      },
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'product.product_code' }),
      width: 150,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      width: 150,
    },
    {
      field: 'ModelName',
      headerName: intl.formatMessage({ id: 'product.Model' }),
      width: 150,
    },

    {
      field: 'ProjectName',
      headerName: intl.formatMessage({ id: 'product.project_name' }),
      width: 150,
    },
    {
      field: 'SSVersion',
      headerName: intl.formatMessage({ id: 'product.SS_Version' }),
      width: 130,
    },
    {
      field: 'ProductTypeName',
      headerName: intl.formatMessage({ id: 'product.product_type' }),
      width: 130,
    },
    {
      field: 'Vendor',
      headerName: intl.formatMessage({ id: 'product.vendor' }),
      width: 110,
    },
    {
      field: 'Stamps',
      headerName: intl.formatMessage({ id: 'product.Product_stamps' }),
      width: 130,
    },
    {
      field: 'PackingAmount',
      headerName: intl.formatMessage({ id: 'product.Packing_amount' }),
      width: 140,
    },
    {
      field: 'ExpiryMonth',
      headerName: intl.formatMessage({ id: 'product.ExpiryMonth' }),
      width: 120,
    },
    {
      field: 'Temperature',
      headerName: intl.formatMessage({ id: 'product.Temperature' }),
      width: 130,
    },
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

    // { field: "isActived", headerName: "isActived", flex: 0.3, hide: true },
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

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          {/* <MuiButton text="create" color="success" onClick={toggleCreateDialog} /> */}
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            {/* <Grid item style={{ width: "21%" }}>
              <Autocomplete
                options={modelArr}
                autoHighlight
                openOnFocus
                getOptionLabel={(option) => option.commonDetailName}
                isOptionEqualToValue={(option, value) =>
                  option.commonDetailId === value.commonDetailId
                }
                onChange={(e, item) =>
                  handleSearch(
                    item ? item.commonDetailId ?? null : null,
                    "Model"
                  )
                }
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label={intl.formatMessage({ id: "product.Model" })}
                      variant="standard"
                    />
                  );
                }}
              />
            </Grid> */}
            {/* <Grid item style={{ width: "21%"}}>
              <Autocomplete
                fullWidth
                options={productTypeArr}
                autoHighlight
                openOnFocus
                getOptionLabel={(option) => option.commonDetailName}
                isOptionEqualToValue={(option, value) =>
                  option.commonDetailId === value.commonDetailId
                }
                onChange={(e, item) =>
                  handleSearch(
                    item ? item.commonDetailId ?? null : null,
                    "ProductType"
                  )
                }
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label={intl.formatMessage({ id: "product.product_type" })}
                      variant="standard"
                    />
                  );
                }}
              />
            </Grid> */}

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
            <Grid item style={{}}>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mb: 1 }} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch
                defaultChecked={true}
                color="primary"
                onChange={(e) => handleSearch(e.target.checked, 'showDelete')}
              />
            }
            label={productState.searchData.showDelete ? 'Active Data' : 'Delete Data'}
          />
        </Grid>
      </Grid>
      <MuiDataGrid
        //getData={productService.getProductList}
        showLoading={productState.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        gridHeight={736}
        rows={productState.data}
        page={productState.page - 1}
        pageSize={productState.pageSize}
        rowCount={productState.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setproductState({ ...productState, page: newPage + 1 })}
        onPageSizeChange={(newPageSize) => setproductState({ ...productState, pageSize: newPageSize, page: 1 })}
        // onSelectionModelChange={(newSelectedRowId) => {
        //   setSelectedRow(newSelectedRowId[0]);
        // }}
        getRowId={(rows) => rows.ProductId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) {
            return `Mui-created`;
          }
        }}
        initialState={{ pinnedColumns: { left: ['id', 'ProductCode'], right: ['action'] } }}
      />

      <CreateDialog
        initModal={ProductDto}
        setNewData={setNewData}
        isOpen={isOpenCreateDialog}
        onClose={toggleCreateDialog}
        fetchData={fetchData}
      />
      <ModifyDialog
        initModal={selectedRow}
        setModifyData={setUpdateData}
        isOpen={isOpenModifyDialog}
        onClose={toggleModifyDialog}
      />
    </React.Fragment>
  );
};

User_Operations.toString = function () {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
