import {
  MuiAutocomplete,
  MuiButton,
  MuiDataGrid,
  MuiDialog,
  MuiResetButton,
  MuiSearchField,
  MuiSubmitButton,
} from '@controls';
import { Grid } from '@mui/material';
import { SlitSOService, WOService } from '@services';
import { ErrorAlert, SuccessAlert, isNumber } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const MaterialDialog = ({ initModal, isOpen, onClose, setNewData, fetchDataDetail, mode, SlitSOId }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [MaterialList, setMaterialList] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 15,
    searchData: {
      MaterialCode: '',
      ProductCode: '',
      ProductId: null,
      BomVersion: '',
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MaterialId', hide: true },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'SlitSO.ProductId' }),
      flex: 0.5,
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'SlitSO.MaterialId' }),
      flex: 0.5,
    },
    {
      field: 'OrderQty',
      headerName: intl.formatMessage({ id: 'SlitSO.OrderQty' }),
      description: intl.formatMessage({ id: 'SlitSO.OrderQty_tip' }),
      flex: 0.4,
      editable: true,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialSO.Width' }),
      description: intl.formatMessage({ id: 'materialSO.OrderQty_tip' }),
      flex: 0.4,
      editable: true,
    },
    {
      field: 'LengthOrEA',
      headerName: intl.formatMessage({ id: 'SlitSO.LengthOrEA' }),
      description: intl.formatMessage({ id: 'SlitSO.OrderQty_tip' }),
      flex: 0.4,
      editable: true,
    },
    {
      field: 'StockQty',
      headerName: intl.formatMessage({ id: 'materialLot.StockQty' }),
      flex: 0.4,
    },
    {
      field: 'StockLength',
      headerName: intl.formatMessage({ id: 'materialLot.StockLength' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
  ];

  //useEffect
  useEffect(() => {
    if (isOpen) fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      SlitSOId: SlitSOId,
      MaterialCode: state.searchData.MaterialCode,
      ProductCode: state.searchData.ProductCode,
      BomVersion: state.searchData.BomVersion,
    };

    const res = await SlitSOService.getMaterialList(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const formik = useFormik({
    initialValues: 0,
    enableReinitialize: true,
    onSubmit: async () => onSubmit(),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  const handleReset = () => {
    resetForm();
    setMaterialList([]);
  };

  const handleCloseDialog = () => {
    resetForm();
    setState({
      isLoading: false,
      data: [],
      totalRow: 0,
      page: 1,
      pageSize: 15,
      searchData: {
        MaterialCode: '',
        ProductCode: '',
        ProductId: null,
        BomVersion: '',
      },
    });
    onClose();
  };

  const onSubmit = async () => {
    const res = await SlitSOService.createSlitSODetail(SlitSOId, MaterialList);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchDataDetail();
      fetchData();
      setMaterialList([]);
      setDialogState({ ...dialogState, isSubmit: false });
      handleReset();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  const handleRowUpdate = async (newRow) => {
    if (!isNumber(newRow.OrderQty)) {
      newRow.OrderQty = null;
    } else {
      newRow.OrderQty = newRow.OrderQty > 0 ? parseInt(newRow.OrderQty) : null;
    }

    if (!isNumber(newRow.LengthOrEA)) {
      newRow.LengthOrEA = null;
    } else {
      newRow.LengthOrEA = newRow.LengthOrEA > 0 ? parseInt(newRow.LengthOrEA) : null;
    }

    if (!isNumber(newRow.Width)) {
      newRow.Width = null;
    }

    let newArr = [...MaterialList];
    const index = _.findIndex(newArr, (x) => {
      return x.MaterialId == newRow.MaterialId;
    });
    if (index !== -1) {
      newArr[index] = newRow;
      setMaterialList([...newArr]);
    } else {
      setMaterialList([...newArr, newRow]);
    }
    if (newRow.LengthOrEA > 0 && newRow.OrderQty > 0 && newRow.Width >= 0) {
      newRow.isSelected = true;
    } else {
      const filtered = newArr.filter((user) => user.MaterialId !== newRow.MaterialId);
      setMaterialList([...filtered]);
      newRow.isSelected = false;
    }

    return newRow;
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);

  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="width-end">
            <Grid item xs={12} sx={{ textAlign: 'left' }}>
              <Grid container columnSpacing={2} direction="row">
                <Grid item>
                  <MuiAutocomplete
                    variant="standard"
                    label={intl.formatMessage({ id: 'bom.ProductId' })}
                    fetchDataFunc={() => WOService.getProduct()}
                    displayLabel="ProductCode"
                    displayValue="ProductId"
                    sx={{ width: 350 }}
                    onChange={(e, value) => {
                      // handleSearch(value?.ProductId ?? null, 'ProductId');
                      // handleSearch(value?.BomVersion ?? '', 'BomVersion');
                      let newSearchData = {
                        ...state.searchData,
                        ProductId: value?.ProductId ?? null,
                        ProductCode: value?.ProductCodeTemp ?? '',
                        BomVersion: value?.BomVersion ?? '',
                      };
                      setState({ ...state, searchData: newSearchData });
                    }}
                  />
                </Grid>
                <Grid item>
                  <MuiAutocomplete
                    variant="standard"
                    value={state.searchData.BomVersion != '' ? { BomVersion: state.searchData.BomVersion } : null}
                    label={intl.formatMessage({ id: 'WO.BomId' })}
                    fetchDataFunc={() => WOService.getBom(state.searchData.ProductId)}
                    displayLabel="BomVersion"
                    displayValue="BomVersion"
                    sx={{ width: 150 }}
                    onChange={(e, value) => {
                      handleSearch(value?.BomVersion ?? '', 'BomVersion');
                    }}
                  />
                </Grid>

                <Grid item>
                  <MuiSearchField
                    variant="standard"
                    label="SlitSO.MaterialId"
                    onClick={fetchData}
                    onChange={(e) => handleSearch(e.target.value, 'MaterialCode')}
                  />
                </Grid>
                <Grid item>
                  <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 1 }} />
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs sx={{ textAlign: 'right' }}></Grid> */}
          </Grid>

          <Grid item xs={12}>
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
              getRowId={(rows) => rows.MaterialId}
              getRowClassName={(params) => {
                if (params.row?.isSelected) return `Mui-created`;
              }}
              processRowUpdate={handleRowUpdate}
              //isCellEditable={(params) => params.row.QCResult === true}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton
                text="save"
                loading={dialogState.isSubmit}
                disabled={MaterialList.length > 0 ? false : true}
              />
              <MuiResetButton onClick={handleReset} disabled={dialogState.isSubmit} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default MaterialDialog;
