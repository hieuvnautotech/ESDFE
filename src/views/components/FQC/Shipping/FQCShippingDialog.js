import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField, MuiTextField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { FQCShippingService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const FQCShippingDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    FQCSOName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ProductId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    OrderQty: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ShippingDate: yup
      .date()
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
      const res = await FQCShippingService.createFQCSO(data);
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
      const res = await FQCShippingService.modifyFQCSO(data);
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
            <MuiTextField
              fullWidth
              size="small"
              name="FQCSOName"
              disabled={dialogState.isSubmit}
              value={values.FQCSOName}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'FQCSO.FQCSOName' }) + ' *'}
              error={touched.FQCSOName && Boolean(errors.FQCSOName)}
              helperText={touched.FQCSOName && errors.FQCSOName}
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
              disabled={initModal?.ScanQty > 0 || dialogState.isSubmit}
              label={intl.formatMessage({ id: 'returnMaterial.ProductId' })}
              fetchDataFunc={FQCShippingService.getProductList}
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
            <MuiTextField
              fullWidth
              size="small"
              name="OrderQty"
              type="number"
              disabled={dialogState.isSubmit}
              value={values.OrderQty}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'FQCSO.OrderQty' }) + ' *'}
              error={touched.OrderQty && Boolean(errors.OrderQty)}
              helperText={touched.OrderQty && errors.OrderQty}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiDateField
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'FQCSO.ShippingDate' })}
              value={values.ShippingDate}
              onChange={(e) => setFieldValue('ShippingDate', e)}
              error={touched.ShippingDate && Boolean(errors.ShippingDate)}
              helperText={touched.ShippingDate && errors.ShippingDate}
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
              label={intl.formatMessage({ id: 'FQCSO.Description' })}
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
  FQCSOName: '',
  ProductId: null,
  ProductCode: '',
  OrderQty: '',
  ShippingDate: null,
};

export default FQCShippingDialog;
