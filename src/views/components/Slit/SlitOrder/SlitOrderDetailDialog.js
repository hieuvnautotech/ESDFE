import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { SlitOrderService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const SlitOrderDetailDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, SlitOrderId }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const defaultValue = {
    SlitOrderDetailId: null,
    SlitOrderId: SlitOrderId,
    ProductId: null,
    ModelCode: '',
    MaterialId: null,
    MaterialCode: '',
    Width: '',
    Length: '',
    OrderQty: '',
    Description: '',
  };

  const schemaY = yup.object().shape({
    // ProductId: yup
    //   .number()
    //   .nullable()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),
    MaterialId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Width: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Length: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    OrderQty: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
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
      const res = await SlitOrderService.createSlitOrderDetail(data);
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
      const res = await SlitOrderService.modifySlitOrderDetail(data);
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
            <MuiAutocomplete
              value={values.ProductId ? { ProductId: values.ProductId, ProductCode: values.ProductCode } : null}
              disabled={initModal?.DeleteStatus || dialogState.isSubmit}
              label={intl.formatMessage({ id: 'product.product_code' })}
              fetchDataFunc={SlitOrderService.getProductList}
              displayLabel="ProductCode"
              displayValue="ProductId"
              onChange={(e, value) => {
                setFieldValue('ProductId', value?.ProductId || null);
                setFieldValue('ProductCode', value?.ProductCode || '');
              }}
              error={touched.ProductId && Boolean(errors.ProductId)}
              helperText={touched.ProductId && errors.ProductId}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={values.MaterialId ? { MaterialId: values.MaterialId, MaterialCode: values.MaterialCode } : null}
              disabled={initModal?.DeleteStatus || dialogState.isSubmit}
              label={intl.formatMessage({ id: 'material.MaterialCode' })}
              fetchDataFunc={SlitOrderService.getMaterial}
              displayLabel="MaterialCode"
              displayValue="MaterialId"
              onChange={(e, value) => {
                setFieldValue('MaterialCode', value?.MaterialCode || '');
                setFieldValue('MaterialId', value?.MaterialId || '');
              }}
              error={touched.MaterialId && Boolean(errors.MaterialId)}
              helperText={touched.MaterialId && errors.MaterialId}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="Width"
              disabled={dialogState.isSubmit}
              value={values.Width}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'slitOrder.Width' }) + ' *'}
              error={touched.Width && Boolean(errors.Width)}
              helperText={touched.Width && errors.Width}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="Length"
              disabled={dialogState.isSubmit}
              value={values.Length}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'slitOrder.Length' }) + ' *'}
              error={touched.Length && Boolean(errors.Length)}
              helperText={touched.Length && errors.Length}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="OrderQty"
              disabled={dialogState.isSubmit}
              value={values.OrderQty}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'slitOrder.OrderQty' }) + ' *'}
              error={touched.OrderQty && Boolean(errors.OrderQty)}
              helperText={touched.OrderQty && errors.OrderQty}
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

export default SlitOrderDetailDialog;
