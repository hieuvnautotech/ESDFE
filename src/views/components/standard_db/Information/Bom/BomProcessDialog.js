import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { bomService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const BomProcessDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, BomId }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const defaultValue = {
    BomProcessId: null,
    BomId: BomId,
    CHA: '',
    ProcessCode: '',
    ProcessName: '',
  };

  const schemaY = yup.object().shape({
    CHA: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ProcessCode: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == CREATE_ACTION ? defaultValue : initModal,
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

    if (mode == CREATE_ACTION) {
      const res = await bomService.createBomProcess(data);
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await bomService.modifyBomProcess(data);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setUpdateData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };

  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: mode == CREATE_ACTION ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              name="CHA"
              disabled={dialogState.isSubmit}
              value={values.CHA}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.Step' }) + ' *'}
              error={touched.CHA && Boolean(errors.CHA)}
              helperText={touched.CHA && errors.CHA}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              required
              value={
                values.ProcessCode
                  ? { commonDetailCode: values.ProcessCode, commonDetailCode: values.ProcessName }
                  : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.ProcessId' })}
              fetchDataFunc={bomService.getProcess}
              displayLabel="commonDetailCode"
              displayValue="commonDetailCode"
              onChange={(e, value) => {
                setFieldValue('ProcessName', value?.commonDetailCode || '');
                setFieldValue('ProcessCode', value?.commonDetailCode || '');
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

export default BomProcessDialog;
