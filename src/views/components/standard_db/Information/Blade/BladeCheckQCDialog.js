import { MuiAutocomplete, MuiDateField, MuiDialog, MuiSubmitButton, MuiButton } from '@controls';
import { Grid, Pagination, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { BladeService, SelectOptionService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const BladeCheckQCDialog = ({ RowCheck, isOpen, onClose, setUpdateData }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [page, setPage] = useState({ pageSize: 1, pagIndex: 1 });
  const [state, setState] = useState({
    isSubmit: false,
    master: {},
    data: [],
  });

  const schemaY = yup.object().shape({
    StaffId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    CheckDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    QCMoldMasterId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    CheckResultName: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: {
      ...RowCheck,
      CheckResultName: RowCheck.CheckResult != null ? (RowCheck.CheckResult ? 'OK' : 'NG') : '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  async function fetchData() {
    const resMaster = await BladeService.getCheckMaster(RowCheck?.BladeId, page.pagIndex);
    if (resMaster) {
      const res = await BladeService.getCheckQC(resMaster.Data.QCMoldMasterId, resMaster.Data.BladeId, page.pagIndex);

      if (res && isRendered) {
        setFieldValue('QCMoldMasterId', resMaster.Data.QCMoldMasterId);
        setFieldValue('QCMoldMasterName', resMaster.Data.QCMoldMasterName);
        setFieldValue('StaffId', resMaster.Data.StaffId);
        setFieldValue('StaffName', resMaster.Data.StaffName);
        setFieldValue('CheckDate', resMaster.Data.CheckDate ?? new Date());
        setFieldValue('CheckResult', resMaster.Data.CheckResult);
        setFieldValue(
          'CheckResultName',
          resMaster.Data.CheckResult != null ? (resMaster.Data.CheckResult ? 'OK' : 'NG') : ''
        );

        setState({
          ...state,
          master: resMaster.Data,
          data: res.Data,
        });
      }
    }
  }

  useEffect(() => {
    setPage({ pageSize: RowCheck.CheckNo == 0 ? 1 : RowCheck.CheckNo, pagIndex: 1 });
    if (RowCheck.CheckDate == null || RowCheck.CheckDate == undefined) {
      setFieldValue('CheckDate', new Date());
    }

    return () => (isRendered = false);
  }, [isOpen, RowCheck]);

  useEffect(() => {
    if (RowCheck.QCMoldMasterId && RowCheck.BladeId) {
      fetchData();
    }

    return () => (isRendered = false);
  }, [page]);

  const handleChangeForm = async (QCMoldMasterId) => {
    const res = await BladeService.getCheckQC(QCMoldMasterId, RowCheck.BladeId, page.pagIndex);

    if (res && isRendered) {
      setState({
        ...state,
        data: res.Data,
      });
    }
  };

  const handleCloseDialog = () => {
    setState({
      isSubmit: false,
      data: [],
    });
    setPage({ pageSize: 1, pagIndex: 1 });
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
      const res = await BladeService.checkQC({
        ...data,
        QCMoldMasterId: data.QCMoldMasterId,
        CheckResult: data.CheckResultName != '' ? (data.CheckResultName == 'OK' ? true : false) : null,
        CheckValue: state.data,
        CheckTime: page.pagIndex,
      });

      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setUpdateData(res.Data);
        setFieldValue('CheckResult', data.CheckResultName == 'OK' ? true : false);
        setState({ ...state, isSubmit: false });
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
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              size="small"
              name="BladeName"
              type="text"
              value={values?.BladeName ?? ''}
              label={intl.formatMessage({ id: 'Blade.BladeName' })}
            />
          </Grid>
          <Grid item xs={3}>
            <MuiAutocomplete
              required
              label={intl.formatMessage({ id: 'mold.QCMoldMasterName' })}
              fetchDataFunc={BladeService.getQCMasters}
              displayLabel="QCMoldMasterName"
              displayValue="QCMoldMasterId"
              disabled={values.StaffId != null}
              value={
                values?.QCMoldMasterId
                  ? {
                      QCMoldMasterId: values?.QCMoldMasterId,
                      QCMoldMasterName: values?.QCMoldMasterName,
                    }
                  : null
              }
              onChange={(e, value) => {
                handleChangeForm(value?.QCMoldMasterId);
                setFieldValue('QCMoldMasterName', value?.QCMoldMasterName || '');
                setFieldValue('QCMoldMasterId', value?.QCMoldMasterId || null);
              }}
              error={touched.QCMoldMasterId && Boolean(errors.QCMoldMasterId)}
              helperText={touched.QCMoldMasterId && errors.QCMoldMasterId}
            />
          </Grid>
          <Grid item xs={2}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'staff.StaffCode' })}
              fetchDataFunc={SelectOptionService.getStaff}
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
                setFieldValue('StaffName', value?.StaffName || '');
                setFieldValue('StaffId', value?.StaffId || null);
              }}
              error={touched.StaffId && Boolean(errors.StaffId)}
              helperText={touched.StaffId && errors.StaffId}
              disabled={values.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={2}>
            <MuiDateField
              label={intl.formatMessage({ id: 'mold.CheckDate' })}
              value={values.CheckDate ?? null}
              onChange={(e) => setFieldValue('CheckDate', e)}
              error={touched.CheckDate && Boolean(errors.CheckDate)}
              helperText={touched.CheckDate && errors.CheckDate}
              disabled={values.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={2}>
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
            <table
              style={{ width: '100%', display: 'block', overflowY: 'auto', overflowY: 'auto', minHeight: '300px' }}
            >
              <tbody style={{ width: '100%', display: 'table' }}>
                <tr>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'standardQC.QCType' })}</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'standardQC.QCItem' })}</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'standardQC.QCStandard' })}</th>
                  <th style={{ ...style.th, width: '25%' }}>{intl.formatMessage({ id: 'qcIQC.Input' })}</th>
                </tr>
                {state.data.length > 0 &&
                  state.data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ ...style.td }}>{item.QCTypeName}</td>
                        <td style={{ ...style.td }}>{item.QCItemName}</td>
                        <td style={{ ...style.td }}>{item.QCStandardName}</td>
                        <td style={{ ...style.td }}>
                          <MuiAutocomplete
                            sx={{ m: 0 }}
                            value={
                              item.TextValue != null
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
                              let newArr = [...state.data];
                              const index = _.findIndex(newArr, function (o) {
                                return o.QCMoldDetailId == item.QCMoldDetailId;
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
          <Grid item xs={6}>
            <Pagination
              count={page.pageSize}
              page={page.pagIndex}
              onChange={(e, index) => setPage({ ...page, pagIndex: index })}
            />
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="row-reverse">
              {values.CheckResult == null ? (
                <MuiSubmitButton text="save" loading={state.isSubmit} color="success" />
              ) : (
                <MuiButton
                  text="periodcheck"
                  loading={state.isSubmit}
                  disabled={page.pageSize == 5}
                  color="warning"
                  onClick={() => setPage({ pageSize: page.pageSize + 1, pagIndex: page.pageSize + 1 })}
                />
              )}
            </Grid>
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
  },

  itemValue: {
    width: '79px',
    height: '120px',
    background: 'rgb(255 255 255)',
    border: '1px solid rgb(52 58 64 / 80%)',
    height: '25px',
  },
};

export default BladeCheckQCDialog;
