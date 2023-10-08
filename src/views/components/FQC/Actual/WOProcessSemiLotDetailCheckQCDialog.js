import { MuiButton, MuiDataGrid, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField, IconButton, InputAdornment } from '@mui/material';
import { ActualService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';

const WOProcessSemiLotDetailCheckQCDialog = ({ WOSemiLotFQCDetail, WOSemiLotFQCId, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 2,
    searchData: {
      SemiLotCode: '',
    },
  });
  const [stateQC, setStateQC] = useState({
    dataMaterial: [],
    reload: false,
  });
  const schemaY = yup.object().shape({
    OKQty: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .when('NGQty', (value) => {
        let remain = values.ActualQty - value;
        if (remain > values.ActualQty || remain < 0) remain = values.ActualQty;
        return yup
          .number()
          .integer()
          .nullable()
          .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
          .lessThan(remain + 1, intl.formatMessage({ id: 'general.field_max' }, { max: remain }))
          .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    NGQty: yup
      .number()
      .integer()
      .nullable()
      .moreThan(-1, intl.formatMessage({ id: 'general.field_min' }, { min: 0 }))
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .when('oKQty', (value) => {
        let remain = values.ActualQty - values.OKQty;
        if (remain > values.ActualQty || remain < 0) remain = values.ActualQty;
        return yup
          .number()
          .integer()
          .nullable()
          .moreThan(-1, intl.formatMessage({ id: 'general.field_min' }, { min: 0 }))
          .lessThan(remain + 1, intl.formatMessage({ id: 'general.field_max' }, { max: remain }))
          .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: {
      ...WOSemiLotFQCDetail,
      ActualQty: WOSemiLotFQCDetail?.ActualQty,
      OKQty: 0,
      NGQty: 0,
      RemainQty: 0,
      NGRemainQty: 0,
    },
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;
  //useEffect
  useEffect(() => {
    if (isOpen) {
      fetchData();
      fetchDataListQC();
    }
    return () => (isRendered = false);
  }, [isOpen]);

  useEffect(() => {
    let value = values.ActualQty - (values.OKQty + values.NGQty);
    setFieldValue('RemainQty', value > -1 ? value : 0);

    let kqNG = (values.NGQty / (values.OKQty + values.NGQty)) * 100;
    kqNG = Number.parseFloat(kqNG).toFixed(2);

    setFieldValue('NGPhanTram', kqNG > -1 ? kqNG : 0);

    const sumNGQty = stateQC.dataMaterial.reduce((accumulator, object) => {
      return accumulator + object.TextValue;
    }, 0);

    const NumberMax = values.NGQty - sumNGQty;

    setFieldValue('NGRemainQty', NumberMax > -1 ? NumberMax : 0);
    if (stateQC.dataMaterial.length > 0) {
      let list = stateQC.dataMaterial.map((item) => {
        let NGItem = (Number(item.TextValue) / (values?.OKQty + Number(item.TextValue))) * 100;
        NGItem = Number.parseFloat(NGItem).toFixed(2);
        return {
          ...item,
          phanTramNG: NGItem > -1 ? NGItem : 0,
        };
      });
      setStateQC({ ...stateQC, dataMaterial: list });
    }
  }, [values.OKQty, values.NGQty, stateQC.reload]);

  const handleCloseDialog = () => {
    setState({
      isLoading: false,
      data: [],
      totalRow: 0,
      page: 1,
      pageSize: 2,
      searchData: {
        SemiLotCode: '',
      },
    });
    onClose();
  };

  const handleReset = () => {
    resetForm();
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      SemiLotCode: WOSemiLotFQCDetail.SemiLotCode,
      MaterialLotCode: WOSemiLotFQCDetail.MaterialLotCode,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await ActualService.getWOSemiLotQC(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
    setFieldValue('ActualQty', res?.Data[0]?.CheckQty ?? WOSemiLotFQCDetail.ActualQty);
    setFieldValue('OKQty', res?.Data[0]?.OKQty ?? 0);
    setFieldValue('NGQty', res?.Data[0]?.NGQty ?? 0);
    setFieldValue('RemainQty', res?.Data[0]?.RemainQty ?? 0);
  }
  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await ActualService.deleteWOSemiLotQC(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData(null);
          await fetchDataListQC(null);
          handleCloseDialog();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  async function fetchDataListQC() {
    const params = {
      SemiLotCode: WOSemiLotFQCDetail.SemiLotCode,
      MaterialLotCode: WOSemiLotFQCDetail.MaterialLotCode,
      QCFQCMasterId: WOSemiLotFQCDetail.QCFQCMasterId,
    };

    const res = await ActualService.getFQCQCDetail(params);
    if (res && isRendered) {
      setStateQC({
        ...stateQC,
        dataMaterial: res.Data,
        reload: !stateQC.reload,
      });
    }
  }
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotFQCQCId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOSemiLotFQCQCId', hide: true },
    { field: 'row_version', hide: true },
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
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.6,
    },
    {
      field: 'CheckQty',
      headerName: intl.formatMessage({ id: 'semiFqc.CheckQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'OKQty',
      headerName: intl.formatMessage({ id: 'semiFqc.OKQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'NGQty',
      headerName: intl.formatMessage({ id: 'semiFqc.NGQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'RemainQty',
      headerName: intl.formatMessage({ id: 'semiFqc.RemainQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
  ];

  const onSubmit = async (data) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_save' }))) {
      const sumNGQty = stateQC.dataMaterial.reduce((accumulator, object) => {
        return accumulator + object.TextValue;
      }, 0);
      if (sumNGQty > 0 && sumNGQty != values.NGQty) {
        ErrorAlert(intl.formatMessage({ id: 'semiFqc.Error_TotalNGNotEnough' }));
        return;
      }
      const res = await ActualService.createWOSemiLotQC({
        ...data,
        CheckValue: stateQC.dataMaterial,
      });
      if (res.HttpResponseCode === 200) {
        fetchData();
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    }
  };
  const handleResetFormNG = () => {
    fetchDataListQC();
  };
  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'semiFqc.CheckQty' })}
      isOpen={isOpen}
      disabledCloseBtn={false}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container columnSpacing={2} direction="row" sx={{ mb: 2, mt: 2 }}>
          <Grid item xs={4}>
            <TextField
              disabled
              fullWidth
              size="small"
              value={values.SemiLotCode}
              label={intl.formatMessage({ id: 'WO.SemiLotCode' })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              disabled
              fullWidth
              size="small"
              value={values.MaterialLotCode}
              label={intl.formatMessage({ id: 'WO.MaterialLotCode' })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              disabled
              fullWidth
              size="small"
              value={moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
              label={intl.formatMessage({ id: 'mold.CheckDate' })}
            />
          </Grid>
        </Grid>
        <Grid container columnSpacing={2} direction="row" sx={{ mb: 2 }}>
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              name="ActualQty"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled
              value={values.ActualQty}
              label={intl.formatMessage({ id: 'semiFqc.CheckQty' })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              name="OKQty"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={state.isLoading}
              value={values.OKQty}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'semiFqc.OKQty' }) + ' *'}
              error={touched.OKQty && Boolean(errors.OKQty)}
              helperText={touched.OKQty && errors.OKQty}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              name="NGQty"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={state.isLoading}
              value={values.NGQty}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'semiFqc.NGQty' }) + ' *'}
              error={touched.NGQty && Boolean(errors.NGQty)}
              helperText={touched.NGQty && errors.NGQty}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ color: 'red !important' }} style={{ color: 'red !important' }}>
                    <p style={{ margin: 0 }}>{`(${values?.NGRemainQty})`}</p>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              name="NGPhanTram"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled
              value={values.NGPhanTram ?? 0}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'semiFqc.NGPhanTram' })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              disabled
              fullWidth
              size="small"
              name="RemainQty"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              value={values.RemainQty}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'semiFqc.RemainQty' })}
            />
          </Grid>
        </Grid>

        <MuiDataGrid
          showLoading={state.isLoading}
          isPagingServer={true}
          headerHeight={45}
          columns={columns}
          rows={state.data}
          hideFooterPagination
          hideFooterSelectedRowCount
          page={state.page - 1}
          pageSize={state.pageSize}
          rowCount={state.totalRow}
          onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
          getRowId={(rows) => rows.WOSemiLotFQCQCId}
          initialState={{ pinnedColumns: { right: ['action'] } }}
        />

        <table style={{ width: '100%', display: 'block', overflowX: 'auto', height: '200px' }}>
          <tbody style={{ width: '100%', display: 'table' }}>
            <tr>
              {stateQC.dataMaterial &&
                stateQC.dataMaterial.map((item, index) => {
                  return (
                    <th key={index} style={{ ...style.th, minWidth: '150px' }}>
                      {item.QCStandardName}
                      <br />
                      {`(${item.phanTramNG ?? 0})%`}
                    </th>
                  );
                })}
            </tr>
            <tr>
              {stateQC.dataMaterial &&
                stateQC.dataMaterial.map((item2, index2) => {
                  return (
                    <td key={index2} style={{ ...style.td }}>
                      <div style={{ ...style.N_Values }}>
                        <TextField
                          size="small"
                          name="textValue"
                          type="number"
                          label="Input"
                          inputProps={{ min: 0, step: 'any' }}
                          value={item2.TextValue}
                          error={item2.ErrorAlertNG && item2.ErrorAlertNG != '' ? true : false}
                          helperText={item2.ErrorAlertNG}
                          onChange={(e) => {
                            let newArr = [...stateQC.dataMaterial];
                            const index = _.findIndex(newArr, function (o) {
                              return o.QCFQCDetailId == item2.QCFQCDetailId;
                            });
                            const sumNGQty = stateQC.dataMaterial
                              .filter((x) => x.QCFQCDetailId != item2.QCFQCDetailId)
                              .reduce((accumulator, object) => {
                                return accumulator + object.TextValue;
                              }, 0);

                            const NumberMax = values.NGQty - sumNGQty;
                            if (index !== -1) {
                              let errorNG = '';
                              if (e.target.value > NumberMax) errorNG = intl.formatMessage({ id: 'general.field_max' });

                              newArr[index] = {
                                ...newArr[index],
                                TextValue: Number(e.target.value),
                                ErrorAlertNG: errorNG,
                                phanTramNG: (
                                  (Number(e.target.value) / (values.OKQty + Number(e.target.value))) *
                                  100
                                ).toFixed(2),
                              };
                              setStateQC({ ...stateQC, dataMaterial: newArr });
                            }
                          }}
                        />
                      </div>
                    </td>
                  );
                })}
            </tr>
          </tbody>
        </table>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Grid container direction="row-reverse">
            <MuiSubmitButton text="save" loading={state.isLoading} />
            <MuiResetButton onClick={handleResetFormNG} />
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};
const style = {
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    background: '#dad8d8',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  },

  itemValue: {
    width: '79px',
    height: '120px',
    background: 'rgb(255 255 255)',
    border: '1px solid rgb(52 58 64 / 80%)',
    height: '25px',
  },
};
export default WOProcessSemiLotDetailCheckQCDialog;
