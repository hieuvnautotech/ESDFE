import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDialog, MuiResetButton, MuiSubmitButton, MuiSearchField, MuiDataGrid } from '@controls';
import { Grid, TextField } from '@mui/material';
import { ReturnMaterialService } from '@services';
import { ErrorAlert, isNumber, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const MaterialDialog = ({ initModal, isOpen, onClose, setNewData, fetchDataDetail, mode, RMId }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [MaterialLotList, setMaterialLotList] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 15,
    searchData: {
      MaterialLotCode: '',
      MaterialCode: '',
      ProductCode: '',
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'materialSO.ProductId' }),
      flex: 0.5,
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'materialSO.MaterialId' }),
      flex: 0.5,
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      flex: 0.7,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Width' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Length' }),
      width: 150,
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
      RMId: RMId,
      MaterialLotCode: state.searchData.MaterialLotCode,
      MaterialCode: state.searchData.MaterialCode,
      ProductCode: state.searchData.ProductCode,
    };

    const res = await ReturnMaterialService.getMaterialList(params);

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
    setMaterialLotList([]);
  };

  const handleCloseDialog = () => {
    handleReset();
    setState({
      isLoading: false,
      data: [],
      totalRow: 0,
      page: 1,
      pageSize: 15,
      searchData: {
        MaterialLotCode: '',
        MaterialCode: '',
        ProductCode: '',
      },
    });
    onClose();
  };

  const onSubmit = async () => {
    const res = await ReturnMaterialService.createReturnMaterialDetail(RMId, MaterialLotList);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      fetchDataDetail();
      setDialogState({ ...dialogState, isSubmit: false });
      handleReset();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

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
            <Grid item xs={9} sx={{ textAlign: 'left' }}>
              <Grid container columnSpacing={2} direction="row">
                <Grid item>
                  <MuiSearchField
                    variant="standard"
                    label="materialSO.ProductId"
                    onClick={fetchData}
                    onChange={(e) => handleSearch(e.target.value, 'ProductCode')}
                  />
                </Grid>
                <Grid item>
                  <MuiSearchField
                    variant="standard"
                    label="materialSO.MaterialId"
                    onClick={fetchData}
                    onChange={(e) => handleSearch(e.target.value, 'MaterialCode')}
                  />
                </Grid>
                <Grid item>
                  <MuiSearchField
                    variant="standard"
                    label="materialLot.MaterialLotCode"
                    onClick={fetchData}
                    onChange={(e) => handleSearch(e.target.value, 'MaterialLotCode')}
                  />
                </Grid>
                <Grid item>
                  <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 1 }} />
                </Grid>
              </Grid>
            </Grid>
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
              getRowId={(rows) => rows.MaterialLotId}
              checkboxSelection
              onSelectionModelChange={(ids) => setMaterialLotList(ids)}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton
                text="save"
                loading={dialogState.isSubmit}
                disabled={MaterialLotList.length > 0 ? false : true}
              />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default MaterialDialog;
