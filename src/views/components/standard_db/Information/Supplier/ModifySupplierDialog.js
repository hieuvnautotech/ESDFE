import { Grid, TextField } from '@mui/material';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField } from '@controls';
import { supplierService } from '@services';
const regex = /^[-+]?\d+(\.\d+)?$/;

const ModifySupplierDialog = (props) => {
  const intl = useIntl();
  let isRendered = useRef(true);

  const { initModal, isOpen, onClose, setModifyData, fetchData } = props;
  const [dialogState, setDialogState] = useState({
    ...initModal,
    isSubmit: false,
  });

  const schema = yup.object().shape({
    SupplierCode: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    SupplierName: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),
    // PhoneNumber: yup
    //   .string()
    //   .nullable()
    //   .matches(regex, intl.formatMessage({ id: 'forecast.Required_Int' })),
  });

  const formik = useFormik({
    validationSchema: schema,
    initialValues: { ...initModal },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const res = await supplierService.modify(values);

      if (res && isRendered)
        if (res.HttpResponseCode === 200 && res.Data) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          fetchData();
          setDialogState({ ...dialogState, isSubmit: false });
          handleCloseDialog();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleCloseDialog = () => {
    setDialogState({
      ...dialogState,
    });
    resetForm();
    onClose();
  };

  useEffect(() => {
    formik.initialValues = { ...initModal };

    return () => {
      isRendered = false;
    };
  }, [initModal]);

  return (
    <MuiDialog
      maxWidth="md"
      title={intl.formatMessage({ id: 'general.modify' })}
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
              disabled={true}
              label={intl.formatMessage({ id: 'supplier.SupplierCode' }) + ' *'}
              name="SupplierCode"
              value={values.SupplierCode}
              onChange={handleChange}
              error={touched.SupplierCode && Boolean(errors.SupplierCode)}
              helperText={touched.SupplierCode && errors.SupplierCode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              disabled={true}
              label={intl.formatMessage({ id: 'supplier.SupplierName' }) + ' *'}
              name="SupplierName"
              value={values.SupplierName}
              onChange={handleChange}
              error={touched.SupplierName && Boolean(errors.SupplierName)}
              helperText={touched.SupplierName && errors.SupplierName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'supplier.SupplierType' })}
              name="SupplierType"
              value={values.SupplierType}
              onChange={handleChange}
              error={touched.SupplierType && Boolean(errors.SupplierType)}
              helperText={touched.SupplierType && errors.SupplierType}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'supplier.Description' })}
              name="Description"
              value={values.Description}
              onChange={handleChange}
              error={touched.Description && Boolean(errors.Description)}
              helperText={touched.Description && errors.Description}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'supplier.Website' })}
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
              label={intl.formatMessage({ id: 'supplier.PhoneNumber' })}
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
              label={intl.formatMessage({ id: 'supplier.Email' })}
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
              label={intl.formatMessage({ id: 'supplier.Fax' })}
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
              label={intl.formatMessage({ id: 'supplier.Tax' })}
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
              label={intl.formatMessage({ id: 'supplier.Address' })}
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
              label={intl.formatMessage({ id: 'supplier.DateSignContract' })}
              value={values.DateSignContract ?? null}
              onChange={(e) => setFieldValue('DateSignContract', e)}
              error={touched.DateSignContract && Boolean(errors.DateSignContract)}
              helperText={touched.DateSignContract && errors.DateSignContract}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiDateField
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'supplier.DebtDate' })}
              value={values.DebtDate ?? null}
              onChange={(e) => setFieldValue('DebtDate', e)}
              error={touched.DebtDate && Boolean(errors.DebtDate)}
              helperText={touched.DebtDate && errors.DebtDate}
            />
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

export default ModifySupplierDialog;
