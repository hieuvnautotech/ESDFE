import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { MuiAutocomplete, MuiButton } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, TextField } from '@mui/material';
import { qcPQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import * as yup from 'yup';

const QCMasterPQCDetailAS = ({ QCPQCMasterId, isOpen, dialogState, setDialogState }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    dataAS: null,
    Samples: [],
  });

  const defaultValue = {
    QCPQCMasterId: QCPQCMasterId,
    QCTypeId: null,
    QCItemId: null,
    QCItemIdName: '',
    QCStandardId: null,
    QCToolId: null,
    QCFrequencyId: null,
    Samples: '',
  };

  const schemaY = yup.object().shape({
    QCTypeId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    QCItemId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    QCStandardId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    QCToolId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    QCFrequencyId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Samples: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .lessThan(51, intl.formatMessage({ id: 'general.field_max' }, { max: 50 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: defaultValue,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
    return () => (isRendered = false);
  }, [isOpen, QCPQCMasterId]);

  //handle
  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await qcPQCService.deletePQCAS(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function fetchData() {
    const params = { page: 0, pageSize: 0, QCPQCMasterId: QCPQCMasterId };

    const res = await qcPQCService.getPQCAS(params);
    if (res && isRendered) {
      setState({
        ...state,
        dataAS: res.Data,
      });
    }
  }

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    const res = await qcPQCService.createPQCAS(data);
    if (res.HttpResponseCode === 200) {
      setDialogState({ ...dialogState, isSubmit: false });
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={3} container spacing={2}>
          <Grid item xs={12}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCType' }) + ' *'}
              fetchDataFunc={qcPQCService.getType}
              displayLabel="QCTypeName"
              displayValue="QCTypeId"
              value={values.QCTypeId ? { QCTypeId: values.QCTypeId, QCTypeName: values.QCTypeName } : null} //gán value option lại khi đã chọn thay đổi
              disabled={dialogState.isSubmit}
              onChange={(e, value) => {
                setFieldValue('QCItemName', '');
                setFieldValue('QCItemId', '');
                setFieldValue('QCTypeName', value?.QCTypeName || '');
                setFieldValue('QCTypeId', value?.QCTypeId || '');
              }}
              error={touched.QCTypeId && Boolean(errors.QCTypeId)}
              helperText={touched.QCTypeId && errors.QCTypeId}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCItem' }) + ' *'}
              fetchDataFunc={() => qcPQCService.getItem(values.QCTypeId)}
              displayLabel="QCItemName"
              displayValue="QCItemId"
              value={values.QCItemId ? { QCItemId: values.QCItemId, QCItemName: values.QCItemName } : null}
              disabled={dialogState.isSubmit}
              onChange={(e, value) => {
                setFieldValue('QCStandardName', '');
                setFieldValue('QCStandardId', '');
                setFieldValue('QCItemName', value?.QCItemName || '');
                setFieldValue('QCItemId', value?.QCItemId || '');
              }}
              error={touched.QCItemId && Boolean(errors.QCItemId)}
              helperText={touched.QCItemId && errors.QCItemId}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCStandard' }) + ' *'}
              fetchDataFunc={() => qcPQCService.getStandard(values.QCTypeId, values.QCItemId)}
              displayLabel="QCStandardName"
              displayValue="QCStandardId"
              value={
                values.QCStandardId
                  ? { QCStandardId: values.QCStandardId, QCStandardName: values.QCStandardName }
                  : null
              }
              disabled={dialogState.isSubmit}
              onChange={(e, value) => {
                setFieldValue('QCStandardName', value?.QCStandardName || '');
                setFieldValue('QCStandardId', value?.QCStandardId || '');
              }}
              error={touched.QCStandardId && Boolean(errors.QCStandardId)}
              helperText={touched.QCStandardId && errors.QCStandardId}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCTool' }) + ' *'}
              fetchDataFunc={() => qcPQCService.getTool(values.QCTypeId, values.QCItemId, values.QCStandardId)}
              displayLabel="QCToolName"
              displayValue="QCToolId"
              value={values.QCToolId ? { QCToolId: values.QCToolId, QCToolName: values.QCToolName } : null}
              disabled={dialogState.isSubmit}
              onChange={(e, value) => {
                setFieldValue('QCToolName', value?.QCToolName || '');
                setFieldValue('QCToolId', value?.QCToolId || '');
              }}
              error={touched.QCToolId && Boolean(errors.QCToolId)}
              helperText={touched.QCToolId && errors.QCToolId}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <MuiAutocomplete
              required
              value={
                values.QCFrequencyId ? { QCFrequencyId: values.QCFrequencyId, QCName: values.QCFrequencyName } : null
              }
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'qcPQC.QCFrequencyId' })}
              fetchDataFunc={qcPQCService.getFrequency}
              displayLabel="QCName"
              displayValue="QCFrequencyId"
              onChange={(e, value) => {
                setFieldValue('QCFrequencyName', value?.QCName || '');
                setFieldValue('QCFrequencyId', value?.QCFrequencyId || null);
              }}
              error={touched.QCId_Tool && Boolean(errors.QCId_Tool)}
              helperText={touched.QCId_Tool && errors.QCId_Tool}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="Samples"
              type="number"
              inputProps={{ step: 'any' }}
              disabled={dialogState.isSubmit}
              value={values.Samples}
              onChange={handleChange}
              label={'# *'}
              error={touched.Samples && Boolean(errors.Samples)}
              helperText={touched.Samples && errors.Samples}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiButton
              text="create"
              type="submit"
              color="success"
              disabled={dialogState.isSubmit}
              sx={{ width: '100%', m: 0 }}
            />
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <table style={{ width: '100%', display: 'block', overflowY: 'auto', overflowY: 'auto', height: '335px' }}>
            <tbody style={{ width: '100%', display: 'table' }}>
              <tr>
                <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Type' })}</th>
                <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Item' })}</th>
                <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Standard' })}</th>
                <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Tool' })}</th>
                <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCFrequencyId' })}</th>
                <th style={{ ...style.th }}>#</th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcIQC.Input' })}</th>
                <th style={{ ...style.th }}></th>
              </tr>
              {state.dataAS &&
                state.dataAS.map((dataAS, index) => {
                  let SamplesList = [];
                  for (var i = 2; i <= dataAS.Samples; i++) {
                    SamplesList.push(`${i}`);
                  }

                  return (
                    <>
                      <tr>
                        <td style={{ ...style.td, minWidth: '150px' }} rowSpan={dataAS.Samples}>
                          {dataAS.QCTypeName}
                        </td>
                        <td style={{ ...style.td, minWidth: '150px' }} rowSpan={dataAS.Samples}>
                          {dataAS.QCItemName}
                        </td>
                        <td style={{ ...style.td, minWidth: '150px' }} rowSpan={dataAS.Samples}>
                          {dataAS.QCStandardName}
                        </td>
                        <td style={{ ...style.td, minWidth: '150px' }} rowSpan={dataAS.Samples}>
                          {dataAS.QCToolName}
                        </td>
                        <td style={{ ...style.td, minWidth: '150px' }} rowSpan={dataAS.Samples}>
                          {dataAS.QCFrequencyName}
                        </td>
                        <td style={{ ...style.td, textAlign: 'center', minWidth: 80 }}>{`1`}</td>
                        <td style={{ ...style.td }}>
                          <MuiAutocomplete
                            sx={{ m: 0, width: '100px' }}
                            defaultValue={{ item: 'OK' }}
                            label="Result"
                            fetchDataFunc={() => {
                              return { Data: [{ item: 'OK' }, { item: 'NG' }] };
                            }}
                            displayLabel="item"
                            displayValue="item"
                          />
                        </td>
                        <td style={{ ...style.td, textAlign: 'center' }} rowSpan={dataAS.Samples}>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(dataAS)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </td>
                      </tr>

                      {SamplesList.map((item, index) => {
                        return (
                          <tr key={`${index}`}>
                            <td style={{ ...style.td, textAlign: 'center', minWidth: 80 }}>{item}</td>
                            <td style={{ ...style.td }}>
                              <MuiAutocomplete
                                sx={{ m: 0, width: '100px' }}
                                defaultValue={index % 2 != 0 ? { item: 'OK' } : { item: 'NG' }}
                                label="Result"
                                fetchDataFunc={() => {
                                  return { Data: [{ item: 'OK' }, { item: 'NG' }] };
                                }}
                                displayLabel="item"
                                displayValue="item"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
            </tbody>
          </table>
        </Grid>
      </Grid>
    </form>
  );
};

const style = {
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    background: '#dad8d8',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

User_Operations.toString = function () {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(QCMasterPQCDetailAS);
