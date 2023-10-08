import { BASE_URL, CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDialog, MuiResetButton, MuiSubmitButton } from '@controls';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Grid, Tab, TextField } from '@mui/material';
import { bomService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import readXlsxFile from 'read-excel-file';
import * as yup from 'yup';

const BomProcessMaterialDialog = ({ mode, initModal, isOpen, onClose, BomProcess, handleReload }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataReadFile, setDataReadFile] = useState([]);
  const refFile = useRef();
  const [ExcelHistory, setExcelHistory] = useState([]);
  const [value, setValue] = React.useState('tab1');

  const defaultValue = {
    ProcessMaterialId: null,
    MaterialCode: null,
    MaterialCode: '',
    CuttingSize: '',
    BomProcessType: '',
    Pitch: '',
    RollUse: '',
    Cavity: '',
    Note: '',
  };

  const schemaY = yup.object().shape({
    MaterialCode: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    CuttingSize: yup
      .number()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    BomProcessType: yup
      .string()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Pitch: yup
      .number()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    RollUse: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Cavity: yup
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
  //   handleReset();
  //   setMode(UPDATE_ACTION);
  //   setRowData(row);
  //   setFieldValue('ProcessMaterialId', row.ProcessMaterialId);
  //   setFieldValue('BomProcessId', row.BomProcessId);
  //   setFieldValue('MaterialId', row.MaterialId);
  //   setFieldValue('MaterialCode', row.MaterialCode);
  //   setFieldValue('Cavity', row.Cavity);
  //   setFieldValue('SlitOrCut', row.SlitOrCut);
  //   setFieldValue('Pitch', row.Pitch);
  //   setFieldValue('row_version', row.row_version);
  // };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    if (mode == CREATE_ACTION) {
      const res = await bomService.createBomProcessMaterial({ ...BomProcess, ...data });
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        handleReload();
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await bomService.modifyBomProcessMaterial({ ...BomProcess, ...data });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        handleReload();
        setDialogState({ ...dialogState, isSubmit: false });
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };

  const handleCloseDialog = () => {
    handleReset();
    setValue('tab1');
    onClose();
  };

  const handleReset = () => {
    setDialogState({ ...dialogState, isSubmit: false });
    resetForm();
  };

  const schema = {
    'MATERIAL CODE': {
      prop: 'MaterialCode',
      type: String,
      required: true,
    },
    'CUTTING SIZE': {
      prop: 'CuttingSize',
      type: String,
      required: true,
    },
    'PITCH 1PCS': {
      prop: 'Pitch',
      type: String,
    },
    CAVITY: {
      prop: 'Cavity',
      type: String,
    },
    'MAIN/PROCESS': {
      prop: 'BomProcessType',
      type: String,
    },
    'ROLL USE': {
      prop: 'RollUse',
      type: String,
    },
    NOTE: {
      prop: 'Note',
      type: String,
    },
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
    document.getElementById('excelinput').text = '';

    setSelectedFile(null);
    refFile.current.value = '';
    refFile.current.text = '';
    setDataReadFile([]);
    setDialogState({ ...dialogState, isSubmit: false });
  };

  const handleSubmitFile = async (rows) => {
    let Data = [];
    rows.forEach((item) => (Data = [...Data, { ...item }]));
    const res = await bomService.createBomProcessMaterialByExcel(Data);

    setExcelHistory([]);
    if (res.ResponseMessage !== '') {
      setExcelHistory(res.ResponseMessage.split(','));
      SuccessAlert(intl.formatMessage({ id: 'general.success' }));
    } else {
      ErrorAlert(intl.formatMessage({ id: 'Files.Data_Invalid' }));
    }
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    readXlsxFile(event.target.files[0]).then(function (data) {
      setDataReadFile(data);
    });
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
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
      {/* <TabContext value={value ?? 'tab1'}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label="Single" value="tab1" />
            <Tab label="Excel" value="tab2" />
          </TabList>
        </Box>
        <TabPanel value="tab1" sx={{ p: 0, pt: 2 }}> */}
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={
                values.MaterialCode ? { MaterialCode: values.MaterialCode, MaterialCode: values.MaterialCode } : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.MaterialId' })}
              fetchDataFunc={bomService.getMaterial}
              displayLabel="MaterialCode"
              displayValue="MaterialCode"
              onChange={(e, value) => {
                setFieldValue('MaterialCode', value?.MaterialCode || '');
                setFieldValue('MaterialCode', value?.MaterialCode || '');
              }}
              error={touched.MaterialCode && Boolean(errors.MaterialCode)}
              helperText={touched.MaterialCode && errors.MaterialCode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="CuttingSize"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={dialogState.isSubmit}
              value={values.CuttingSize}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.CuttingSize' }) + ' *'}
              error={touched.CuttingSize && Boolean(errors.CuttingSize)}
              helperText={touched.CuttingSize && errors.CuttingSize}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="Pitch"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={dialogState.isSubmit}
              value={values.Pitch}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.Pitch' }) + ' *'}
              error={touched.Pitch && Boolean(errors.Pitch)}
              helperText={touched.Pitch && errors.Pitch}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="Cavity"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={dialogState.isSubmit}
              value={values.Cavity}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.Cavity' }) + ' *'}
              error={touched.Cavity && Boolean(errors.Cavity)}
              helperText={touched.Cavity && errors.Cavity}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={
                values.BomProcessType
                  ? values.BomProcessType == 'MA'
                    ? { Value: 'MA', Label: 'Main' }
                    : values.BomProcessType == 'PR'
                    ? { Value: 'PR', Label: 'Process' }
                    : { Value: 'PA', Label: 'Packing' }
                  : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'bom.BomProcessType' })}
              fetchDataFunc={() => {
                return {
                  Data: [
                    { Value: 'MA', Label: 'Main' },
                    { Value: 'PR', Label: 'Process' },
                    { Value: 'PA', Label: 'Packing' },
                  ],
                };
              }}
              displayLabel="Label"
              displayValue="Value"
              onChange={(e, value) => {
                setFieldValue('BomProcessType', value?.Value || '');
              }}
              error={touched.BomProcessType && Boolean(errors.BomProcessType)}
              helperText={touched.BomProcessType && errors.BomProcessType}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="RollUse"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={dialogState.isSubmit}
              value={values.RollUse}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.RollUse' }) + ' *'}
              error={touched.RollUse && Boolean(errors.RollUse)}
              helperText={touched.RollUse && errors.RollUse}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Note"
              disabled={dialogState.isSubmit}
              value={values.Note}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'bom.Note' })}
              error={touched.Note && Boolean(errors.Note)}
              helperText={touched.Note && errors.Note}
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
      {/* </TabPanel>
        <TabPanel value="tab2" sx={{ p: 0 }}>
          <Grid>
            <Grid item xs={12} sx={{ p: 3 }}>
              <input type="file" name="file" id="excelinput" onChange={changeHandler} ref={refFile} />
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
                    window.location.href = `${BASE_URL}/TemplateImport/BomProcessMaterial.xlsx`;
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <table className="table table-striped" style={{ border: 'solid 1px #dee2e6' }}>
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
                              {_.isObject(data) ? moment(data).format('YYYY-MM-DD') : String(data)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : ExcelHistory.length > 0 ? (
                  <>
                    <tr>
                      <th colSpan={3}>History</th>
                    </tr>
                    {ExcelHistory.map((item, index) => {
                      if (item != '')
                        return (
                          <tr key={`ITEM${index}`}>
                            <td style={{ width: '15%' }}>{index + 1}</td>
                            <td style={{ width: '20%' }}>{item.split('|')[0]}</td>
                            <td style={{ width: '65%' }}>{item.split('|')[1]}</td>
                          </tr>
                        );
                    })}
                  </>
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
        </TabPanel>
      </TabContext> */}
    </MuiDialog>
  );
};

export default BomProcessMaterialDialog;
