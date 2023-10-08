import { MuiAutocomplete, MuiDateField, MuiDialog, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { WOService, qcPQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const WOProcessPQCDialog = ({ RowCheck, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [state, setState] = useState({ data: null });
  const [table, setTable] = useState([]);

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
      ...RowCheck,
      CheckResultName: RowCheck.CheckResult != null ? (RowCheck.CheckResult ? 'OK' : 'NG') : '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleReset = () => {
    resetForm();
  };

  const handleCloseDialog = () => {
    resetForm();
    setState({ data: null });
    onClose();
  };

  const onSubmit = async (data) => {
    var status = 0;
    if (data.CheckResultName != '') {
      const index = _.findIndex(table, function (o) {
        return o.TextValue == null;
      });
      if (index !== -1) {
        status = -1;
      }
    }

    const index2 = _.findIndex(table, function (o) {
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
      setDialogState({ ...dialogState, isSubmit: true });

      const res = await WOService.checkPQC({
        ...data,
        ValueCheck: table,
        CheckResult: data.CheckResultName != '' ? (data.CheckResultName == 'OK' ? true : false) : null,
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };

  const handleSetAllResult = (value) => {
    if (value == 'OK') {
      let data = [];
      state.data.forEach((item) => {
        for (var i = 1; i <= item.Samples; i++) {
          data.push({ QCPQCDetailASId: item.QCPQCDetailASId, Sample: i, TextValue: '1' });
        }
      });
      setTable(data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }

    if (RowCheck.CheckDate == null || RowCheck.CheckDate == undefined) {
      setFieldValue('CheckDate', new Date());
    }

    return () => (isRendered = false);
  }, [isOpen, RowCheck.CheckDate]);

  async function fetchData() {
    const params = { page: 0, pageSize: 0, QCPQCMasterId: RowCheck.QCPQCMasterId, WOProcessId: RowCheck.WOProcessId };

    const res = await qcPQCService.getPQCAS(params);
    const res2 = await WOService.getPQCAS(params);
    if (res && isRendered) {
      setState({ ...state, data: res.Data });

      if (res2 && isRendered) {
        let data = [];
        res.Data.forEach((item) => {
          for (var i = 1; i <= item.Samples; i++) {
            let rowValue = res2.Data.find((x) => x.QCPQCDetailASId == item.QCPQCDetailASId && x.Sample == i);
            let checkValue = rowValue?.TextValue ?? null;
            data.push({ QCPQCDetailASId: item.QCPQCDetailASId, Sample: i, TextValue: checkValue });
          }
        });

        setTable(data);
      }
    }
  }

  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              name="ModelCode"
              type="text"
              value={values?.ModelCode ?? ''}
              label={intl.formatMessage({ id: 'WO.Model' })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              name="ProductCode"
              type="text"
              value={values?.ProductCode ?? ''}
              label={intl.formatMessage({ id: 'bom.ProductId' })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              size="small"
              name="ProcessCode"
              type="text"
              value={values?.ProcessCode ?? ''}
              label={intl.formatMessage({ id: 'bom.ProcessId' })}
            />
          </Grid>
          <Grid item xs={2}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'staff.StaffCode' })}
              fetchDataFunc={WOService.getStaffQC}
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
              disabled={RowCheck.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={2}>
            <MuiDateField
              label={intl.formatMessage({ id: 'mold.CheckDate' })}
              value={values.CheckDate ?? null}
              onChange={(e) => setFieldValue('CheckDate', e)}
              error={touched.CheckDate && Boolean(errors.CheckDate)}
              helperText={touched.CheckDate && errors.CheckDate}
              disabled={RowCheck.CheckResult != null ? true : false}
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
                setFieldValue('CheckResultName', value?.CheckResultName || '');
                handleSetAllResult(value?.CheckResultName);
              }}
              error={touched.CheckResultName && Boolean(errors.CheckResultName)}
              helperText={touched.CheckResultName && errors.CheckResultName}
              disabled={RowCheck.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <table
              style={{ width: '100%', display: 'block', overflowY: 'auto', overflowY: 'auto', minHeight: '335px' }}
            >
              <tbody style={{ width: '100%', display: 'table' }}>
                <tr>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Type' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Item' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>
                    {intl.formatMessage({ id: 'qcPQC.QCId_Standard' })}
                  </th>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Tool' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>
                    {intl.formatMessage({ id: 'qcPQC.QCFrequencyId' })}
                  </th>
                  <th style={{ ...style.th }}>#</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcIQC.Input' })}</th>
                </tr>
                {state.data &&
                  state.data.map((item, index) => {
                    let SamplesList = [];
                    for (var i = 1; i <= item.Samples; i++) {
                      SamplesList.push(`${i}`);
                    }

                    return SamplesList.map((sample, index1) => {
                      let rowValue = table.find((x) => x.QCPQCDetailASId == item.QCPQCDetailASId && x.Sample == sample);
                      return (
                        <tr key={index1}>
                          {sample == SamplesList[0] && (
                            <>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={item.Samples}>
                                {item.QCTypeName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={item.Samples}>
                                {item.QCItemName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={item.Samples}>
                                {item.QCStandardName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={item.Samples}>
                                {item.QCToolName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={item.Samples}>
                                {item.QCFrequencyName}
                              </td>
                            </>
                          )}
                          <td style={{ ...style.td, textAlign: 'center', minWidth: 80 }}>{sample}</td>
                          <td style={{ ...style.td }}>
                            <MuiAutocomplete
                              sx={{ m: 0 }}
                              fullWidth
                              value={
                                rowValue?.TextValue != null
                                  ? { value: rowValue.TextValue, item: rowValue.TextValue == '1' ? 'OK' : 'NG' }
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
                                let newArr = [...table];
                                const index = _.findIndex(newArr, function (o) {
                                  return o.QCPQCDetailASId == item.QCPQCDetailASId && o.Sample == sample;
                                });
                                if (index !== -1) {
                                  newArr[index] = { ...newArr[index], TextValue: value?.value ?? null };
                                  setTable(newArr);
                                } else {
                                  let newItem = {
                                    QCPQCDetailASId: item.QCPQCDetailASId,
                                    Sample: sample,
                                    TextValue: value?.value ?? null,
                                  };
                                  setTable([...table, newItem]);
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    });
                  })}
              </tbody>
            </table>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              {RowCheck.CheckResult == null && <MuiSubmitButton text="save" loading={dialogState.isSubmit} />}
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
};

const defaultValue = {
  SlitOrderId: null,
  OrderDate: moment(),
  OrderStatus: null,
  Description: '',
};

export default WOProcessPQCDialog;
