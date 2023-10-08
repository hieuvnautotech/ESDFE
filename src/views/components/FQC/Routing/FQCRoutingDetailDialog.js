import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { FQCRoutingService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const FQCRoutingDetailDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, ProductCode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const defaultValue = {
    RoutingId: 0,
    ProductCode: ProductCode,
    ProcessCode: '',
    ProcessName: '',
    RoutingLevel: '',
    Description: '',
  };

  const schemaY = yup.object().shape({
    ProcessCode: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    RoutingLevel: yup
      .number()
      .nullable()
      .integer()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .max(10, intl.formatMessage({ id: 'general.field_max' }, { max: 10 }))
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
      const res = await FQCRoutingService.createRoutingDetail(data);
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
      const res = await FQCRoutingService.modifyRoutingDetail(data);
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
      maxWidth="md"
      title={intl.formatMessage({ id: mode == CREATE_ACTION ? 'general.create' : 'general.modify' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="Product Code"
              name="ProductCode"
              value={ProductCode}
              disabled={true}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              value={
                values.ProcessCode
                  ? { commonDetailCode: values.ProcessCode, commonDetailLanguge: values.ProcessName }
                  : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'fqcRouting.ProcessName' }) + ' *'}
              fetchDataFunc={FQCRoutingService.getProcess}
              displayLabel="commonDetailLanguge"
              displayValue="commonDetailCode"
              onChange={(e, value) => {
                setFieldValue('ProcessName', value?.commonDetailLanguge || '');
                setFieldValue('ProcessCode', value?.commonDetailCode || '');
              }}
              error={touched.ProcessCode && Boolean(errors.ProcessCode)}
              helperText={touched.ProcessCode && errors.ProcessCode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              size="small"
              name="RoutingLevel"
              disabled={dialogState.isSubmit}
              value={values.RoutingLevel}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'fqcRouting.Level' }) + ' *'}
              error={touched.RoutingLevel && Boolean(errors.RoutingLevel)}
              helperText={touched.RoutingLevel && errors.RoutingLevel}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="Description"
              disabled={dialogState.isSubmit}
              value={values.Description}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'general.description' })}
              error={touched.Description && Boolean(errors.Description)}
              helperText={touched.Description && errors.Description}
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

export default FQCRoutingDetailDialog;
