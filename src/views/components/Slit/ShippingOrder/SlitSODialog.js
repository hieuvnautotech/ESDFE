import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { SlitSOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const SlitSODialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    SlitSOName: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ProductId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    WOId: yup
      .number()
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
      const res = await SlitSOService.createSlitSO(data);
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
      const res = await SlitSOService.modifySlitSO(data);
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
              name="SlitSOName"
              disabled={dialogState.isSubmit}
              value={values.SlitSOName}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'SlitSO.SlitSOName' }) + ' *'}
              error={touched.SlitSOName && Boolean(errors.SlitSOName)}
              helperText={touched.SlitSOName && errors.SlitSOName}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              required
              value={
                values.ProductId
                  ? { ProductId: values.ProductId, ProductCode: values.ProductCode + ' - ' + values?.ProductName }
                  : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'SlitSO.ProductId' })}
              fetchDataFunc={SlitSOService.getProductList}
              displayLabel="ProductCode"
              displayValue="ProductId"
              onChange={(e, value) => {
                setFieldValue('ProductCode', value?.ProductCodeTemp || '');
                setFieldValue('ProductName', value?.ProductName || '');
                setFieldValue('ProductId', value?.ProductId || '');
              }}
              error={touched.ProductId && Boolean(errors.ProductId)}
              helperText={touched.ProductId && errors.ProductId}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Description"
              disabled={dialogState.isSubmit}
              value={values.Description}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'SlitSO.Description' })}
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

const defaultValue = {
  SlitSOId: null,
  SlitSOName: '',
  ProductId: null,
  ProductCode: '',
  WOId: 0, //null
  LocationName: '',
};

export default SlitSODialog;
