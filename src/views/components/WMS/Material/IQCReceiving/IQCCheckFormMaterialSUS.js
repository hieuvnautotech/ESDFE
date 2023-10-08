import { MuiAutocomplete, MuiDateField, MuiDialog, MuiSubmitButton, MuiTextField } from '@controls';
import { Chip, Grid, TextField } from '@mui/material';
import { IQCReceivingService, SelectOptionService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const IQCCheckFormMaterialSUS = ({ RowCheck, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isSubmit: false,
    data: [],
  });
  const [total, setTotal] = useState({
    TotalQty: 0,
    NGQty: 0,
    OKQty: 0,
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
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: RowCheck,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  async function fetchData() {
    const res = await IQCReceivingService.getCheckIQC(RowCheck?.QCIQCMasterId, RowCheck?.MaterialLotId);

    if (res && isRendered) {
      setState({
        ...state,
        data: res.Data,
      });
    }
  }

  useEffect(() => {
    if (RowCheck.QCIQCMasterId && RowCheck.MaterialLotId) {
      fetchData();
    }
    setTotal({ ...total, TotalQty: RowCheck.OriginLength });
    if (RowCheck.CheckDate == null || RowCheck.CheckDate == undefined) {
      setFieldValue('CheckDate', new Date());
    }
    return () => (isRendered = false);
  }, [isOpen, RowCheck]);

  useEffect(() => {
    if (state.data.length > 0) {
      var NGQty = 0;
      state.data.map((e) => (NGQty += Number(e?.TextValue)));
      setTotal({ ...total, NGQty: NGQty, OKQty: total.TotalQty - NGQty });
    }
  }, [state.data]);

  const handleCloseDialog = () => {
    setState({
      isSubmit: false,
      data: [],
    });
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    if (total.NGQty > total.TotalQty) {
      ErrorAlert(intl.formatMessage({ id: 'IQCReceiving.Error_CheckSUSNGMoreThanTotal' }));
    } else {
      setState({ ...state, isSubmit: true });
      const res = await IQCReceivingService.checkIQCSUS({
        ...data,
        ...total,
        CheckValue: state.data,
      });

      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setState({ ...state, isSubmit: false });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setState({ ...state, isSubmit: false });
      }
    }
  };

  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={state.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              name="MaterialLotCode"
              type="text"
              value={values?.MaterialLotCode ?? ''}
              label={intl.formatMessage({ id: 'IQCReceiving.MaterialLotCode' })}
            />
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <MuiDateField
              label={intl.formatMessage({ id: 'mold.CheckDate' })}
              value={values.CheckDate ?? null}
              onChange={(e) => setFieldValue('CheckDate', e)}
              error={touched.CheckDate && Boolean(errors.CheckDate)}
              helperText={touched.CheckDate && errors.CheckDate}
              disabled={values.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <Chip label={`Total Qty: ${total.TotalQty} EA`} variant="outlined" color="primary" />
            <Chip label={`NG Qty: ${total.NGQty} EA`} variant="outlined" color="error" sx={{ ml: 2 }} />
            <Chip label={`OK Qty: ${total.OKQty} EA`} variant="outlined" color="success" sx={{ ml: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <table
              style={{ width: '100%', display: 'block', overflowY: 'auto', overflowY: 'auto', minHeight: '300px' }}
            >
              <tbody style={{ width: '100%', display: 'table' }}>
                <tr>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Type' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Item' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>
                    {intl.formatMessage({ id: 'qcPQC.QCId_Standard' })}
                  </th>
                  {/* <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Tool' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>
                    {intl.formatMessage({ id: 'qcPQC.QCFrequencyId' })}
                  </th> */}
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcIQC.Input' })}</th>
                </tr>
                {state.data.length > 0 &&
                  state.data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ ...style.td, minWidth: '150px' }}>{item.QCTypeName}</td>
                        <td style={{ ...style.td, minWidth: '150px' }}>{item.QCItemName}</td>
                        <td style={{ ...style.td, minWidth: '150px' }}>{item.QCStandardName}</td>
                        {/* <td style={{ ...style.td, minWidth: '150px' }}>{item.QCToolName}</td>
                        <td style={{ ...style.td, minWidth: '150px' }}>{item.QCFrequencyName}</td> */}
                        <td style={{ ...style.td }}>
                          <MuiTextField
                            sx={{ m: 0 }}
                            fullWidth
                            label="Result"
                            type="number"
                            size="small"
                            value={item.TextValue}
                            onChange={(e) => {
                              let newArr = [...state.data];
                              const index = _.findIndex(newArr, function (o) {
                                return o.QCIQCDetailMId == item.QCIQCDetailMId;
                              });
                              if (index !== -1) {
                                newArr[index] = {
                                  ...newArr[index],
                                  TextValue:
                                    e.target.value != null && Number(e.target.value) > 0 ? Number(e.target.value) : 0,
                                };
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

export default IQCCheckFormMaterialSUS;
