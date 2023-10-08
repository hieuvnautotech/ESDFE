import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid } from '@mui/material';
import { WOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const WOProcessDialog = ({ isOpen, onClose, setNewData, WOId }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const defaultValue = {
    WOProcessId: null,
    WOId: WOId,
    ProcessCode: '',
    ProcessName: '',
  };

  const schemaY = yup.object().shape({
    ProcessCode: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: defaultValue,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleReset = () => {
    resetForm();
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    const res = await WOService.createWOProcess(data);
    if (res.HttpResponseCode === 200 && res.Data) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setNewData({ ...res.Data });
      setDialogState({ ...dialogState, isSubmit: false });
      handleReset();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <MuiAutocomplete
              required
              value={values.ProcessCode ? { ProcessCode: values.ProcessName, ProcessName: values.ProcessName } : null}
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.ProcessId' })}
              fetchDataFunc={WOService.getProcess}
              displayLabel="ProcessName"
              displayValue="ProcessCode"
              onChange={(e, value) => {
                setFieldValue('ProcessName', value?.ProcessName || '');
                setFieldValue('ProcessCode', value?.ProcessName || '');
              }}
              error={touched.ProcessCode && Boolean(errors.ProcessCode)}
              helperText={touched.ProcessCode && errors.ProcessCode}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
              <MuiResetButton onClick={handleReset} disabled={dialogState.isSubmit} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default WOProcessDialog;
