import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { Grid, TextField } from '@mui/material';
import { bomService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const BomDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, refeshModelTree }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    BomVersion: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ProductId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    BuyerId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    DateApply: yup
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
      const res = await bomService.createBom(data);
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        refeshModelTree();
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await bomService.modifyBom(data);
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
            <MuiAutocomplete
              required
              value={values.ProductId ? { ProductId: values.ProductId, ProductCode: values.ProductCode } : null}
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.ProductId' })}
              fetchDataFunc={bomService.getProductAll}
              displayLabel="ProductCode"
              displayValue="ProductId"
              onChange={(e, value) => {
                setFieldValue('ProductCode', value?.ProductCode || '');
                setFieldValue('ProductName', value?.ProductName || '');
                setFieldValue('ModelCode', value?.ModelCode || '');
                setFieldValue('ProductId', value?.ProductId || '');
              }}
              error={touched.ProductId && Boolean(errors.ProductId)}
              helperText={touched.ProductId && errors.ProductId}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled
              fullWidth
              size="small"
              name="ProductName"
              value={values.ProductName}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'product.product_name' }) + ' *'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled
              fullWidth
              size="small"
              name="ModelCode"
              value={values.ModelCode}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'product.Model' }) + ' *'}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              required
              value={values.BuyerId ? { BuyerId: values.BuyerId, BuyerCode: values.BuyerCode } : null}
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.BuyerCode' })}
              fetchDataFunc={bomService.getBuyer}
              displayLabel="BuyerCode"
              displayValue="BuyerId"
              onChange={(e, value) => {
                setFieldValue('BuyerCode', value?.BuyerCode || '');
                setFieldValue('BuyerId', value?.BuyerId || '');
              }}
              error={touched.BuyerId && Boolean(errors.BuyerId)}
              helperText={touched.BuyerId && errors.BuyerId}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="BomVersion"
              disabled={dialogState.isSubmit}
              value={values.BomVersion}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.BomVersion' }) + ' *'}
              error={touched.BomVersion && Boolean(errors.BomVersion)}
              helperText={touched.BomVersion && errors.BomVersion}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Ver"
              disabled={dialogState.isSubmit}
              value={values.Ver}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.Ver' })}
              error={touched.Ver && Boolean(errors.Ver)}
              helperText={touched.Ver && errors.Ver}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiDateField
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.DateApply' })}
              value={values.DateApply ?? null}
              onChange={(e) => setFieldValue('DateApply', e)}
              error={touched.DateApply && Boolean(errors.DateApply)}
              helperText={touched.DateApply && errors.DateApply}
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
              label={intl.formatMessage({ id: 'bom.Description' })}
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
  BomId: null,
  BomVersion: '',
  Ver: '',
  BuyerId: null,
  BuyerCode: '',
  ProductId: null,
  ProductCode: '',
  ProductName: '',
  ModelCode: '',
  DateApply: '',
  Description: '',
};

export default BomDialog;
