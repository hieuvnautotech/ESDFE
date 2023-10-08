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
import { ProductDto } from '@models';

const CreateDialog = (props) => {
  const intl = useIntl();
  const { initModal, isOpen, onClose, setNewData, fetchData } = props;
  const regex = /^([a-z0-9]{4})-([a-z0-9]{6})+$/gi;
  const dataModalRef = useRef({ ...initModal });
  const refFile = useRef();
  const [dialogState, setDialogState] = useState({
    isSubmit: false,
  });
  const schemaY = yup.object().shape({
    ProductCode: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),

    ProductName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),

    ModelId: yup
      .number()
      .min(1, intl.formatMessage({ id: 'general.field_required' }))
      .required(intl.formatMessage({ id: 'general.field_required' })),

    ProjectName: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),

    ProductType: yup
      .number()
      .min(1, intl.formatMessage({ id: 'general.field_required' }))
      .required(intl.formatMessage({ id: 'general.field_required' })),

    SSVersion: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),
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

    // PackingAmount: yup
    //   .number()
    //   .required(intl.formatMessage({ id: 'general.field_required' }))
    //   .moreThan(0, intl.formatMessage({ id: 'bom.min_value' })),

    // Description: yup.string().trim(),
    // Product_stamps: yup.number().test('is-decimal', 'Invalid decimal', (value) => (value + '').match(/^\d*\.{1}\d*$/)),
  });
  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: ProductDto,

    onSubmit: async (values) => {
      const res = await productService.createProduct({
        ...values,
        PackingAmount: Number(values.PackingAmount),
        ExpiryMonth: Number(values.ExpiryMonth),
      });
      if (res.HttpResponseCode === 200) {
        debugger;
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        setDialogState({
          ...dialogState,
        });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    },
  });
  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

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
  useEffect(() => {
    resetForm({ ...initModal });
  }, [initModal]);

  const handleReset = () => {
    resetForm();
    setDialogState({
      ...dialogState,
    });
  };

  const handleCloseDialog = () => {
    setSelectedFile(null);
    resetForm();
    setDialogState({
      ...dialogState,
    });
    onClose();
  };
  const [value, setValue] = React.useState('tab1');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataReadFile, setDataReadFile] = useState([]);
  const schema = {
    'PRODUCT CODE': {
      prop: 'ProductCode',
      type: String,
      required: true,
    },
    MODEL: {
      prop: 'ModelId',
      type: String,
      required: true,
    },
    INCH: {
      prop: 'Inch',
      type: String,
      required: true,
    },
    'PRODUCT TYPE CODE': {
      prop: 'ProductTypeCode',
      type: String,
      required: true,
    },
    DESCRIPTION: {
      prop: 'Description',
      type: String,
    },
  };
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);

    // if (event.target.files[0]?.name !== 'Product.xlsx') {
    //   ErrorAlert(intl.formatMessage({ id: 'Files.Product' }));
    // }

    readXlsxFile(event.target.files[0]).then(function (data) {
      setDataReadFile(data);
    });
  };

  const handleSubmitFile = async (rows) => {
    const res = await productService.createProductByExcel(rows);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      handleCloseDialog();
    } else {
      if (res.HttpResponseCode === 400 && res.ResponseMessage === 'general.duplicated_code') {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
      if (res.HttpResponseCode === 400 && res.ResponseMessage === '') {
        ErrorAlert(intl.formatMessage({ id: 'Files.Data_Invalid' }));
      }
    }
  };

  const handleUpload = async () => {
    setDialogState({ ...dialogState, isSubmit: true });
    if (!selectedFile) {
      ErrorAlert('Chưa chọn file update');
    }

    readXlsxFile(selectedFile, { schema }).then(({ rows, errors }) => {
      errors.length === 0;

      handleSubmitFile(rows);
    });

    // document.getElementById('upload-excel').value = '';
    document.getElementById('upload-excel-product').text = '';
    setSelectedFile(null);
    refFile.current.value = '';
    refFile.current.text = '';
    setDataReadFile([]);
    setDialogState({ ...dialogState, isSubmit: false });
  };

  // const getQCMasterList = async () => {
  //   const res = await productService.GetQCMasterModel();
  //   return res;
  // };

  return (
    <MuiDialog
      maxWidth="md"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <TabContext value={value}>
        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Single" value="tab1" />
            <Tab label="Excel" value="tab2" />
          </TabList>
        </Box> */}
        {/* <TabPanel value="tab1"> */}
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
                    disabled={dialogState.isSubmit}
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
                    disabled={dialogState.isSubmit}
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
                    value={values.ExpiryMonth}
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
                    value={values.PackingAmount}
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
        {/* </TabPanel> */}
        {/* <TabPanel value="tab2">
          <Grid>
            <Grid item xs={12} sx={{ p: 3 }}>
              <input type="file" name="file" onChange={changeHandler} id="upload-excel-product" ref={refFile} />
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="row-reverse">
                <MuiButton
                  text="upload"
                  color="success"
                  onClick={handleUpload}
                  disabled={selectedFile ? false : true}
                />
                <MuiButton
                  text="excel"
                  variant="outlined"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `${BASE_URL}/TemplateImport/Product.xlsx`;
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  {dataReadFile[0] && <th scope="col">STT</th>}
                  {dataReadFile[0]?.map((item, index) => {
                    return (
                      <th key={`TITLE ${index}`} scope="col">
                        {item}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {dataReadFile?.slice(1).length > 0 ? (
                  dataReadFile?.slice(1)?.map((item, index) => {
                    return (
                      <tr key={`ITEM${index}`}>
                        <td scope="col">{index + 1}</td>
                        {item?.map((data, index) => {
                          return (
                            <td key={`DATA${index}`} scope="col">
                              {data}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="100" className="text-center">
                      <i className="fa fa-database" aria-hidden="true" style={{ fontSize: '35px', opacity: 0.6 }} />
                      <h3 style={{ opacity: 0.6, marginTop: '5px' }}>No Data</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </TabPanel> */}
      </TabContext>
    </MuiDialog>
  );
};

export default CreateDialog;
