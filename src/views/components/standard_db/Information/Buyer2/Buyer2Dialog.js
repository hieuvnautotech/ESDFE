import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiDateField, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { buyer2Service } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const Buyer2Dialog = ({ initModal, isOpen, onClose, setUpdateData, mode }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const schemaY = yup.object().shape({
    BuyerCode: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    BuyerName: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    Description: yup.string().trim(),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == CREATE_ACTION ? defaultValue : initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const onSubmit = async (data) => {
    setDialogState({ isSubmit: true });
    const res = mode == CREATE_ACTION ? await buyer2Service.createBuyer(data) : await buyer2Service.modifyBuyer(data);
    if (res.HttpResponseCode === 200 && res.Data) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setUpdateData(res.Data);
      resetForm();
      if (mode == UPDATE_ACTION) handleCloseDialog();
      setDialogState({ isSubmit: false });
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ isSubmit: false });
    }
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
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
          <Grid item xs={12}>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  fullWidth
                  size="small"
                  disabled={false}
                  label={intl.formatMessage({ id: 'buyer.BuyerCode' }) + ' *'}
                  name="BuyerCode"
                  value={values.BuyerCode}
                  onChange={handleChange}
                  error={touched.BuyerCode && Boolean(errors.BuyerCode)}
                  helperText={touched.BuyerCode && errors.BuyerCode}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={false}
                  label={intl.formatMessage({ id: 'buyer.BuyerName' }) + ' *'}
                  name="BuyerName"
                  value={values.BuyerName}
                  onChange={handleChange}
                  error={touched.BuyerName && Boolean(errors.BuyerName)}
                  helperText={touched.BuyerName && errors.BuyerName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.BrandName' })}
                  name="BrandName"
                  value={values.BrandName}
                  onChange={handleChange}
                  error={touched.BrandName && Boolean(errors.BrandName)}
                  helperText={touched.BrandName && errors.BrandName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.Website' })}
                  name="Website"
                  value={values.Website}
                  onChange={handleChange}
                  error={touched.Website && Boolean(errors.Website)}
                  helperText={touched.Website && errors.Website}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.PhoneNumber' })}
                  name="PhoneNumber"
                  value={values.PhoneNumber}
                  onChange={handleChange}
                  error={touched.PhoneNumber && Boolean(errors.PhoneNumber)}
                  helperText={touched.PhoneNumber && errors.PhoneNumber}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.Email' })}
                  name="Email"
                  value={values.Email}
                  onChange={handleChange}
                  error={touched.Email && Boolean(errors.Email)}
                  helperText={touched.Email && errors.Email}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.Fax' })}
                  name="Fax"
                  value={values.Fax}
                  onChange={handleChange}
                  error={touched.Fax && Boolean(errors.Fax)}
                  helperText={touched.Fax && errors.Fax}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.Tax' })}
                  name="Tax"
                  value={values.Tax}
                  onChange={handleChange}
                  error={touched.Tax && Boolean(errors.Tax)}
                  helperText={touched.Tax && errors.Tax}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.Address' })}
                  name="Address"
                  value={values.Address}
                  onChange={handleChange}
                  error={touched.Address && Boolean(errors.Address)}
                  helperText={touched.Address && errors.Address}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiDateField
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.DateSignContract' })}
                  value={values.DateSignContract ?? null}
                  onChange={(e) => setFieldValue('DateSignContract', e)}
                  error={touched.DateSignContract && Boolean(errors.DateSignContract)}
                  helperText={touched.DateSignContract && errors.DateSignContract}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'buyer.Description' })}
                  name="Description"
                  value={values.Description}
                  onChange={handleChange}
                  error={touched.Description && Boolean(errors.Description)}
                  helperText={touched.Description && errors.Description}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
              <MuiResetButton onClick={resetForm} disabled={dialogState.isSubmit} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

const defaultValue = {
  BuyerCode: '',
  BuyerName: '',
  BrandName: '',
  Description: '',
  Website: '',
  PhoneNumber: '',
  Email: '',
  Fax: '',
  Tax: '',
  Address: '',
  DateSignContract: null,
};

export default Buyer2Dialog;
