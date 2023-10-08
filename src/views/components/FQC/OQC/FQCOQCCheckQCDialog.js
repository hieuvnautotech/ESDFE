import { MuiAutocomplete, MuiDateField, MuiDialog, MuiSubmitButton } from '@controls';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Grid, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import { FQCOQCService, WOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const FQCOQCCheckQCDialog = ({ RowCheck, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isSubmit: false,
    data: [],
    Master: null,
  });
  const [value, setValue] = useState('1');
  const [CheckStatus, setCheckStatus] = useState(false);

  async function fetchData(type) {
    const res = await FQCOQCService.getCheckQC({
      PressLotCode: RowCheck?.PressLotCode,
      CheckType: type,
    });

    if (res && isRendered) {
      if (res.Data != null) {
        let master = res.Data.Master;
        setFieldValue('StaffName', master?.StaffName || '');
        setFieldValue('StaffId', master?.StaffId || null);
        setFieldValue('CheckDate', master?.CheckDate != null ? master?.CheckDate : new Date());
        setFieldValue('CheckResult', master?.CheckResult || null);
        setFieldValue('CheckResultName', master?.CheckResult != null ? (master?.CheckResult ? 'OK' : 'NG') : '');

        if (value == '1' && master?.CheckResult == true) setCheckStatus(true);
      }

      setState({
        ...state,
        data: res.Data != null ? res.Data.Detail : null,
        Master: res.Data != null ? res.Data.Master : null,
      });
    }
  }

  const schemaY = yup.object().shape({
    StaffId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    CheckDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: {
      ...state.Master,
      CheckResultName: state.Master?.CheckResult != null ? (state.Master?.CheckResult ? 'OK' : 'NG') : '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  useEffect(() => {
    if (isOpen) {
      if (value == '1') fetchData(true);
      else fetchData(false);
    }

    return () => (isRendered = false);
  }, [isOpen, value]);

  useEffect(() => {
    if (state.Master?.CheckDate == null || state.Master?.CheckDate == undefined) {
      setFieldValue('CheckDate', new Date());
    }
  }, [isOpen, state.Master]);

  const handleCloseDialog = () => {
    setState({
      isSubmit: false,
      data: [],
    });
    setValue('1');
    setCheckStatus(false);
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    var status = 0;
    if (data.CheckResultName != '') {
      const index = _.findIndex(state.data, function (o) {
        return o.TextValue == null;
      });

      if (index !== -1) {
        status = -1;
      }
    }

    const index2 = _.findIndex(state.data, function (o) {
      return o.TextValue != null;
    });
    if (index2 == -1) {
      status = -2;
    }

    if (status == -1) {
      ErrorAlert(intl.formatMessage({ id: 'IQCReceiving.full_fill_form_detail' }));
    } else if (status == -2) {
      ErrorAlert(intl.formatMessage({ id: 'IQCReceiving.full_fill_form_detail_row' }));
    } else {
      setState({ ...state, isSubmit: true });
      const res = await FQCOQCService.checkQC({
        Master: {
          ...data,
          CheckResult: data.CheckResultName != '' ? (data.CheckResultName == 'OK' ? true : false) : null,
          CheckType: value == '1' ? true : false,
        },
        Detail: state.data,
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setState({ ...state, isSubmit: false });
        if (value == '1' && data.CheckResultName == 'OK') setCheckStatus(true);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setState({ ...state, isSubmit: false });
      }
    }
  };

  const handleSetAllResult = (value) => {
    if (value == 'OK') {
      let CheckTemplate = [];
      state.data.forEach((item) => {
        CheckTemplate.push({ ...item, TextValue: '1' });
      });
      setState({ ...state, data: CheckTemplate });
    }

    setFieldValue('CheckResultName', value || '');
  };

  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'general.checkqc' })}
      isOpen={isOpen}
      disabledCloseBtn={state.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={(e, value) => setValue(value)}>
              <Tab label={intl.formatMessage({ id: 'qcOQC.After_FQC' })} value="1" />
              <Tab label={intl.formatMessage({ id: 'qcOQC.After_Packing' })} value="2" />
            </TabList>
          </Box>
          {state.data ? (
            <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ pt: 2 }}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  disabled
                  value={values?.PressLotCode ?? ''}
                  label={intl.formatMessage({ id: 'WO.PressLot' })}
                />
              </Grid>
              <Grid item xs={3}>
                <MuiAutocomplete
                  label={intl.formatMessage({ id: 'staff.StaffCode' })}
                  fetchDataFunc={FQCOQCService.getStaffQC}
                  displayLabel="StaffName"
                  displayValue="StaffId"
                  value={
                    values.StaffId
                      ? {
                          StaffId: values.StaffId,
                          StaffName: values.StaffName,
                        }
                      : null
                  }
                  onChange={(e, value) => {
                    setFieldValue('StaffName', value?.StaffName || null);
                    setFieldValue('StaffId', value?.StaffId || null);
                  }}
                  error={touched.StaffId && Boolean(errors.StaffId)}
                  helperText={touched.StaffId && errors.StaffId}
                  disabled={values.CheckResult != null ? true : false}
                />
              </Grid>
              <Grid item xs={3}>
                <MuiDateField
                  label={intl.formatMessage({ id: 'mold.CheckDate' })}
                  value={values.CheckDate ?? null}
                  onChange={(e) => setFieldValue('CheckDate', e)}
                  error={touched.CheckDate && Boolean(errors.CheckDate)}
                  helperText={touched.CheckDate && errors.CheckDate}
                  disabled={values.CheckResult != null ? true : false}
                />
              </Grid>
              <Grid item xs={3}>
                <MuiAutocomplete
                  label={intl.formatMessage({ id: 'IQCReceiving.Result' })}
                  fetchDataFunc={() => {
                    return {
                      Data: [{ CheckResultName: 'OK' }, { CheckResultName: 'NG' }],
                    };
                  }}
                  value={values.CheckResultName != '' ? { CheckResultName: values.CheckResultName } : null}
                  displayLabel="CheckResultName"
                  displayValue="CheckResultName"
                  onChange={(e, value) => {
                    handleSetAllResult(value?.CheckResultName);
                  }}
                  error={touched.CheckResultName && Boolean(errors.CheckResultName)}
                  helperText={touched.CheckResultName && errors.CheckResultName}
                  disabled={values.CheckResult != null ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <table style={{ width: '100%', display: 'block', overflowY: 'auto', minHeight: '300px' }}>
                  <tbody style={{ width: '100%', display: 'table' }}>
                    <tr>
                      <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.QCId_Type' })}</th>
                      <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.QCId_Item' })}</th>
                      <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.QCId_Standard' })}</th>
                      <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.QCId_Tool' })}</th>
                      <th style={{ ...style.th }}>{intl.formatMessage({ id: 'standardQC.QCFrequency' })}</th>
                      <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.Input' })}</th>
                    </tr>
                    {state.data &&
                      state.data.length > 0 &&
                      state.data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ ...style.td }}>{item.QCTypeName}</td>
                            <td style={{ ...style.td }}>{item.QCItemName}</td>
                            <td style={{ ...style.td }}>{item.QCStandardName}</td>
                            <td style={{ ...style.td }}>{item.QCToolName}</td>
                            <td style={{ ...style.td }}>{item.QCFrequencyName}</td>
                            <td style={{ ...style.td }}>
                              <MuiAutocomplete
                                sx={{ m: 0 }}
                                fullWidth
                                value={
                                  item?.TextValue != null
                                    ? { value: item.TextValue, item: item.TextValue == '1' ? 'OK' : 'NG' }
                                    : null
                                }
                                label="Result"
                                fetchDataFunc={() => {
                                  return {
                                    Data: [
                                      { value: '1', item: 'OK' },
                                      { value: '0', item: 'NG' },
                                    ],
                                  };
                                }}
                                displayLabel="item"
                                displayValue="item"
                                onChange={(e, value) => {
                                  let newArr = state.data;
                                  const index = _.findIndex(newArr, function (o) {
                                    return o.QCOQCDetailId == item.QCOQCDetailId;
                                  });
                                  if (index !== -1) {
                                    newArr[index] = { ...newArr[index], TextValue: value?.value ?? null };
                                    setState({ ...state, data: newArr });
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row-reverse">
                  {values.CheckResult == null && <MuiSubmitButton text="save" loading={state.isSubmit} />}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ pt: 2 }}>
              <Grid
                item
                xs={12}
                sx={{ height: 300, textAlign: 'center', lineHeight: '300px', fontSize: 50, color: '#666666', p: 0 }}
              >
                {intl.formatMessage({ id: 'general.no_data' })}
              </Grid>
            </Grid>
          )}
        </TabContext>
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
  },

  itemValue: {
    width: '79px',
    height: '120px',
    background: 'rgb(255 255 255)',
    border: '1px solid rgb(52 58 64 / 80%)',
    height: '25px',
  },
};

export default FQCOQCCheckQCDialog;
