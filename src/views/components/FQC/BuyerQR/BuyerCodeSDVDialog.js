import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import { Grid, TextField } from '@mui/material';
import { BuyerQRService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

const BuyerCodeSDVDialog = ({ isOpen, onClose, handleSetNewData }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const defaultValue = {
    ProductId: null,
    ProductCode: '',
    Vendor: '',
    Packing: '',
    SSVersion: '',
    VendorLine: '',
    LabelPrinter: '',
    IsSample: '',
    PCN: '',
    LotNo: '',
    MachineLine: '',
    LabelQty: '',
    Shift: '',
    RemarkBuyer: '',
  };

  const schemaY = yup.object().shape({
    ProductId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    VendorLine: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Vendor: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    LabelPrinter: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    IsSample: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    PCN: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    LotNo: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    RemarkBuyer: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    MachineLine: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .lessThan(100, intl.formatMessage({ id: 'general.field_max' }, { max: 99 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Packing: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      //.lessThan(3501, intl.formatMessage({ id: 'general.field_max' }, { max: 3500 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    LabelQty: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .lessThan(201, intl.formatMessage({ id: 'general.field_max' }, { max: 200 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Shift: yup
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

    const res = await BuyerQRService.createBuyerQR({
      ...data,
      MachineLine: Number(data.MachineLine) > 9 ? String(data.MachineLine) : `0${data.MachineLine}`,
    });
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      handleSetNewData(res.Data);
      setDialogState({ ...dialogState, isSubmit: false });
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <MuiAutocomplete
            value={values.ProductId ? { ProductId: values.ProductId, ProductCode: values.ProductCode } : null}
            disabled={dialogState.isSubmit}
            label={intl.formatMessage({ id: 'product.product_code' }) + ' *'}
            fetchDataFunc={BuyerQRService.getProduct}
            displayLabel="ProductCode"
            displayValue="ProductId"
            onChange={(e, value) => {
              setFieldValue('VendorLine', 'A');
              setFieldValue('LabelPrinter', '1');
              setFieldValue('IsSample', 'N');
              setFieldValue('PCN', '0');
              setFieldValue('MachineLine', '1');
              setFieldValue('Shift', '0');
              setFieldValue('Vendor', value?.Vendor || '');
              setFieldValue('Packing', value?.PackingAmount || '');
              setFieldValue('SSVersion', value?.SSVersion || '');
              setFieldValue('Stamps', value?.Stamps || '');
              setFieldValue('RemarkBuyer', value?.RemarkBuyer || '');
              setFieldValue('ProductCode', value?.ProductCodeTemp || '');
              setFieldValue('ProductId', value?.ProductId || null);
            }}
            error={touched.ProductId && Boolean(errors.ProductId)}
            helperText={touched.ProductId && errors.ProductId}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            label={intl.formatMessage({ id: 'product.vendor' })}
            name="Vendor"
            value={values.Vendor}
            disabled={true}
            error={touched.Vendor && Boolean(errors.Vendor)}
            helperText={touched.Vendor && errors.Vendor}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiAutocomplete
            required
            value={values.VendorLine ? { item: values.VendorLine } : null}
            disabled={dialogState.isSubmit}
            label={intl.formatMessage({ id: 'BuyerQR.VendorLine' })}
            fetchDataFunc={() => {
              return { Data: [{ item: 'A' }] };
            }}
            displayLabel="item"
            displayValue="item"
            onChange={(e, value) => setFieldValue('VendorLine', value?.item || '')}
            error={touched.VendorLine && Boolean(errors.VendorLine)}
            helperText={touched.VendorLine && errors.VendorLine}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiAutocomplete
            required
            value={values.LabelPrinter ? { item: values.LabelPrinter } : null}
            disabled={dialogState.isSubmit}
            label={intl.formatMessage({ id: 'BuyerQR.LabelPrinter' })}
            fetchDataFunc={() => {
              return { Data: [{ item: '1' }, { item: '2' }, { item: '3' }] };
            }}
            displayLabel="item"
            displayValue="item"
            onChange={(e, value) => setFieldValue('LabelPrinter', value?.item || '')}
            error={touched.LabelPrinter && Boolean(errors.LabelPrinter)}
            helperText={touched.LabelPrinter && errors.LabelPrinter}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiAutocomplete
            required
            value={values.IsSample ? { item: values.IsSample } : null}
            disabled={dialogState.isSubmit}
            label={intl.formatMessage({ id: 'BuyerQR.IsSample' })}
            fetchDataFunc={() => {
              return { Data: [{ item: 'N' }] };
            }}
            displayLabel="item"
            displayValue="item"
            onChange={(e, value) => setFieldValue('IsSample', value?.item || '')}
            error={touched.IsSample && Boolean(errors.IsSample)}
            helperText={touched.IsSample && errors.IsSample}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            label={intl.formatMessage({ id: 'product.Packing_amount' })}
            name="Packing"
            onChange={handleChange}
            value={values.Packing}
            disabled={dialogState.isSubmit}
            error={touched.Packing && Boolean(errors.Packing)}
            helperText={touched.Packing && errors.Packing}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiAutocomplete
            required
            value={values.PCN ? { item: values.PCN } : null}
            disabled={dialogState.isSubmit}
            label={intl.formatMessage({ id: 'BuyerQR.PCN' })}
            fetchDataFunc={() => {
              return {
                Data: [
                  { item: '0' },
                  { item: '1' },
                  { item: '2' },
                  { item: '3' },
                  { item: '4' },
                  { item: '5' },
                  { item: '6' },
                  { item: '7' },
                  { item: '8' },
                  { item: '9' },
                ],
              };
            }}
            displayLabel="item"
            displayValue="item"
            onChange={(e, value) => setFieldValue('PCN', value?.item || '')}
            error={touched.PCN && Boolean(errors.PCN)}
            helperText={touched.PCN && errors.PCN}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            type="number"
            name="MachineLine"
            disabled={dialogState.isSubmit}
            value={values.MachineLine}
            onChange={handleChange}
            label={intl.formatMessage({ id: 'BuyerQR.MachineLine' }) + ' *'}
            error={touched.MachineLine && Boolean(errors.MachineLine)}
            helperText={touched.MachineLine && errors.MachineLine}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            name="RemarkBuyer"
            disabled={dialogState.isSubmit}
            value={values.RemarkBuyer}
            onChange={handleChange}
            label={intl.formatMessage({ id: 'product.RemarkBuyer' }) + ' *'}
            error={touched.RemarkBuyer && Boolean(errors.RemarkBuyer)}
            helperText={touched.RemarkBuyer && errors.RemarkBuyer}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiAutocomplete
            required
            value={values.Shift ? { item: values.Shift, label: values.Shift == '0' ? 'Ca ngày' : 'Ca đêm' } : null}
            disabled={dialogState.isSubmit}
            label={intl.formatMessage({ id: 'BuyerQR.Shift' })}
            fetchDataFunc={() => {
              return {
                Data: [
                  { item: '0', label: 'Ca ngày' },
                  { item: '1', label: 'Ca đêm' },
                ],
              };
            }}
            displayLabel="label"
            displayValue="item"
            onChange={(e, value) => setFieldValue('Shift', value?.item || '')}
            error={touched.Shift && Boolean(errors.Shift)}
            helperText={touched.Shift && errors.Shift}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            name="LotNo"
            disabled={dialogState.isSubmit}
            value={values.LotNo}
            onChange={handleChange}
            label={intl.formatMessage({ id: 'BuyerQR.LotNo' }) + ' *'}
            error={touched.LotNo && Boolean(errors.LotNo)}
            helperText={touched.LotNo && errors.LotNo}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            type="number"
            name="LabelQty"
            disabled={dialogState.isSubmit}
            value={values.LabelQty}
            onChange={handleChange}
            label={intl.formatMessage({ id: 'BuyerQR.LabelQty' }) + ' *'}
            error={touched.LabelQty && Boolean(errors.LabelQty)}
            helperText={touched.LabelQty && errors.LabelQty}
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
  );
};

export default BuyerCodeSDVDialog;
