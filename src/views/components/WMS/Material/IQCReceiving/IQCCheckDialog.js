import { MuiAutocomplete, MuiDateField, MuiDialog, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { IQCReceivingService, SelectOptionService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import IQCCheckFormMaterial from './IQCCheckFormMaterial';
import IQCCheckFormRawMaterial from './IQCCheckFormRawMaterial';

const IQCCheckDialog = ({ RowCheck, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isSubmit: false,
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

  useEffect(() => {
    if (RowCheck.CheckDate == null || RowCheck.CheckDate == undefined) {
      setFieldValue('CheckDate', new Date());
    }
    return () => (isRendered = false);
  }, [isOpen, RowCheck]);

  const handleCloseDialog = () => {
    setState({
      isSubmit: false,
      data: [],
    });
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
      const res =
        RowCheck.MaterialType == 'RM'
          ? await IQCReceivingService.checkIQCRaw({
              ...data,
              CheckResult: data.CheckResultName != '' ? (data.CheckResultName == 'OK' ? true : false) : null,
              CheckValue: state.data,
            })
          : await IQCReceivingService.checkIQC({
              ...data,
              CheckResult: data.CheckResultName != '' ? (data.CheckResultName == 'OK' ? true : false) : null,
              CheckValue: state.data,
            });

      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        // setUpdateData(res.Data);
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
        CheckTemplate.push({ ...item, TextValue: RowCheck.MaterialType == 'RM' ? '1' : '0' });
      });
      setState({ ...state, data: CheckTemplate });
    }

    setFieldValue('CheckResultName', value || '');
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
          <Grid item xs={3}>
            <TextField
              fullWidth
              size="small"
              name="MaterialLotCode"
              type="text"
              value={values?.MaterialLotCode ?? ''}
              label={intl.formatMessage({ id: 'IQCReceiving.MaterialLotCode' })}
            />
          </Grid>
          <Grid item xs={3}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'staff.StaffCode' })}
              fetchDataFunc={IQCReceivingService.getStaffQC}
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
            {RowCheck.MaterialType == 'RM' ? (
              <IQCCheckFormRawMaterial RowCheck={RowCheck} state={state} setState={setState} />
            ) : (
              <IQCCheckFormMaterial RowCheck={RowCheck} state={state} setState={setState} />
            )}
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

export default IQCCheckDialog;
