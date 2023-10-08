import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiButton } from '@controls';
import { Box, Grid, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { BASE_URL } from '@constants/ConfigConstants';
import { productService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import readXlsxFile from 'read-excel-file';

const ModifyProductDialog = (props) => {
  const intl = useIntl();
  const { initModal, isOpen, onClose, setModifyData } = props;
  //console.log(initModal)
  const clearParent = useRef(null);
  const regex = /^([a-z0-9]{4})-([a-z0-9]{6})+$/gi;
  const dataModalRef = useRef({ ...initModal });
  const [dialogState, setDialogState] = useState({
    ...initModal,
    isSubmit: false,
  });

  const schema = yup.object().shape({
    ProductCode: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),

    ProductName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),

    // ModelId: yup
    //   .number()
    //   .min(1, intl.formatMessage({ id: 'general.field_required' }))
    //   .required(intl.formatMessage({ id: 'general.field_required' })),

    // ProjectName: yup
    //   .string()
    //   .trim()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),

    // ProductType: yup
    //   .number()
    //   .min(1, intl.formatMessage({ id: 'general.field_required' }))
    //   .required(intl.formatMessage({ id: 'general.field_required' })),

    // SSVersion: yup
    //   .string()
    //   .trim()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),
    // ExpiryMonth: yup
    //   .number()
    //   .integer()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),
    // Temperature: yup
    //   .string()
    //   .trim()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),
    // Vendor: yup
    //   .string()
    //   .trim()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),

    // Stamps: yup.string().required(intl.formatMessage({ id: 'general.field_required' })),

    // PackingAmount: yup.number().default(0),
    //   .required(intl.formatMessage({ id: 'general.field_required' }))
    //   .moreThan(0, intl.formatMessage({ id: 'bom.min_value' })),
  });
  const formik = useFormik({
    validationSchema: schema,
    initialValues: { ...initModal },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const res = await productService.modifyProduct({
        ...values,
        PackingAmount: Number(values.PackingAmount),
        ExpiryMonth: Number(values.ExpiryMonth),
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        handleCloseDialog();
        setModifyData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        handleCloseDialog();
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      }
    },
  });
  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  useEffect(() => {
    resetForm({ ...initModal });
  }, [initModal]);

  const handleCloseDialog = () => {
    resetForm();
    setDialogState({
      ...dialogState,
    });
    onClose();
  };

  const getModel = async () => {
    const res = await productService.getProductModel();
    return res;
  };
  const getproductType = async () => {
    const res = await productService.getProductType();
    return res;
  };
  const getproductStamps = async () => {
    const res = await productService.GetProductStapms();
    return res;
  };
  const handleReset = () => {
    resetForm();
    setDialogState({
      ...dialogState,
    });
  };
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
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  fullWidth
                  type="text"
                  size="small"
                  name="ProductCode"
                  disabled={true}
                  value={values.ProductCode}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'product.product_code' }) + ' *'}
                  error={touched.ProductCode && Boolean(errors.ProductCode)}
                  helperText={touched.ProductCode && errors.ProductCode}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="ProductName"
                  label={intl.formatMessage({ id: 'product.product_name' }) + ' *'}
                  disabled={true}
                  value={values.ProductName}
                  onChange={handleChange}
                  error={touched.ProductName && Boolean(errors.ProductName)}
                  helperText={touched.ProductName && errors.ProductName}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MuiAutocomplete
                  label={intl.formatMessage({ id: 'product.Model' }) + ' *'}
                  fetchDataFunc={getModel}
                  displayLabel="ModelCode"
                  displayValue="ModelId"
                  value={values.ModelId ? { ModelId: values.ModelId, ModelCode: values.ModelName } : null}
                  disabled={dialogState.isSubmit}
                  onChange={(e, value) => {
                    setFieldValue('ModelName', value?.ModelCode || '');
                    setFieldValue('ModelId', value?.ModelId || '');
                  }}
                  error={touched.ModelId && Boolean(errors.ModelId)}
                  helperText={touched.ModelId && errors.ModelId}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="ProjectName"
                  label={intl.formatMessage({ id: 'product.project_name' }) + ' *'}
                  disabled={dialogState.isSubmit}
                  value={values.ProjectName}
                  onChange={handleChange}
                  error={touched.ProjectName && Boolean(errors.ProjectName)}
                  helperText={touched.ProjectName && errors.ProjectName}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <MuiAutocomplete
                  label={intl.formatMessage({ id: 'product.product_type' }) + ' *'}
                  fetchDataFunc={getproductType}
                  displayLabel="commonDetailLanguge"
                  displayValue="commonDetailId"
                  value={
                    values.ProductType
                      ? { commonDetailId: values.ProductType, commonDetailLanguge: values.ProductTypeName }
                      : null
                  }
                  disabled={dialogState.isSubmit}
                  onChange={(e, value) => {
                    setFieldValue('ProductTypeName', value?.commonDetailLanguge || '');
                    setFieldValue('ProductType', value?.commonDetailId || '');
                  }}
                  error={touched.ProductType && Boolean(errors.ProductType)}
                  helperText={touched.ProductType && errors.ProductType}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="SSVersion"
                  label={intl.formatMessage({ id: 'product.SS_Version' }) + ' *'}
                  disabled={dialogState.isSubmit}
                  value={values.SSVersion}
                  onChange={handleChange}
                  error={touched.SSVersion && Boolean(errors.SSVersion)}
                  helperText={touched.SSVersion && errors.SSVersion}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="ExpiryMonth"
                  label={intl.formatMessage({ id: 'product.ExpiryMonth' })}
                  disabled={dialogState.isSubmit}
                  value={values.ExpiryMonth ?? 0}
                  onChange={handleChange}
                  error={touched.ExpiryMonth && Boolean(errors.ExpiryMonth)}
                  helperText={touched.ExpiryMonth && errors.ExpiryMonth}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="Temperature"
                  disabled={dialogState.isSubmit}
                  value={values.Temperature}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'product.Temperature' })}
                  error={touched.Temperature && Boolean(errors.Temperature)}
                  helperText={touched.Temperature && errors.Temperature}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <MuiAutocomplete
                  label={intl.formatMessage({ id: 'product.Product_stamps' })}
                  fetchDataFunc={getproductStamps}
                  displayLabel="commonDetailLanguge"
                  displayValue="commonDetailLanguge"
                  value={values.Stamps ? { commonDetailLanguge: values.Stamps } : null}
                  disabled={dialogState.isSubmit}
                  onChange={(e, value) => {
                    setFieldValue('Stamps', value?.commonDetailLanguge || '');
                  }}
                  error={touched.Stamps && Boolean(errors.Stamps)}
                  helperText={touched.Stamps && errors.Stamps}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  name="PackingAmount"
                  label={intl.formatMessage({ id: 'product.Packing_amount' })}
                  disabled={dialogState.isSubmit}
                  value={values.PackingAmount ?? 0}
                  onChange={handleChange}
                  error={touched.PackingAmount && Boolean(errors.PackingAmount)}
                  helperText={touched.PackingAmount && errors.PackingAmount}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container item spacing={2}>
              <Grid item xs={6}>
                <MuiAutocomplete
                  value={values.Vendor ? { item: values.Vendor } : null}
                  disabled={dialogState.isSubmit}
                  label="Vendor"
                  fetchDataFunc={() => {
                    return { Data: [{ item: 'E1YG' }] };
                  }}
                  displayLabel="item"
                  displayValue="item"
                  onChange={(e, value) => setFieldValue('Vendor', value?.item || '')}
                  error={touched.Vendor && Boolean(errors.Vendor)}
                  helperText={touched.Vendor && errors.Vendor}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  name="RemarkBuyer"
                  disabled={dialogState.isSubmit}
                  value={values.RemarkBuyer}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'product.RemarkBuyer' })}
                  error={touched.RemarkBuyer && Boolean(errors.RemarkBuyer)}
                  helperText={touched.RemarkBuyer && errors.RemarkBuyer}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              size="small"
              name="Description"
              disabled={dialogState.isSubmit}
              value={values.Description}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'product.Description' })}
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

export default ModifyProductDialog;
