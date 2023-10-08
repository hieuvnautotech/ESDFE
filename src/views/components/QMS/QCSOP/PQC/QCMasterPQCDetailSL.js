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
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { BASE_URL } from '@constants/ConfigConstants';
import ClearIcon from '@mui/icons-material/Clear';

const QCMasterPQCDetailSL = ({ QCPQCMasterId, isOpen, dialogState, setDialogState }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({ dataSL: [] });
  const [selectedFile, setSelectedFile] = useState(null);

  const defaultValue = {
    QCPQCMasterId: QCPQCMasterId,
    QCTypeId: null,
    QCItemId: null,
    QCItemIdName: '',
    QCStandardId: null,
    QCToolId: null,
    LocationToCheck: '',
    Locations: null,
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
    Locations: yup
      .array()
      .nullable()
      .min(1, intl.formatMessage({ id: 'general.field_required' }))
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
        let res = await qcPQCService.deletePQCSL(item);
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

  const handleClear = async () => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await qcPQCService.clearPQCSL(QCPQCMasterId);
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

    const res = await qcPQCService.getPQCSL(params);
    if (res && isRendered) {
      setState({ ...state, dataSL: res.Data });
    }
  }

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    let LocationToCheck = '';
    data.Locations.forEach(
      (item) =>
        (LocationToCheck += item == data.Locations[0] ? `${item.commonDetailCode}` : `|${item.commonDetailCode}`)
    );

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('QCPQCMasterId', data.QCPQCMasterId);
    formData.append('QCTypeId', data.QCTypeId);
    formData.append('QCItemId', data.QCItemId);
    formData.append('QCStandardId', data.QCStandardId);
    formData.append('QCToolId', data.QCToolId);
    formData.append('QCFrequencyId', data.QCFrequencyId);
    formData.append('LocationToCheck', LocationToCheck);

    const res = await qcPQCService.createPQCSL(formData);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      setDialogState({ ...dialogState, isSubmit: false });
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
            <MuiAutocomplete
              required
              translationLabel
              multiple={true}
              disabled={dialogState.isSubmit}
              value={values.Locations ? values.Locations : []}
              label={intl.formatMessage({ id: 'qcPQC.LocationToCheck' })}
              fetchDataFunc={qcPQCService.getLocation}
              displayLabel="commonDetailLanguge"
              displayValue="commonDetailCode"
              name="Locations"
              onChange={(e, value) => {
                setFieldValue('Locations', value || []);
              }}
              error={touched.Locations && Boolean(errors.Locations)}
              helperText={touched.Locations && errors.Locations}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <input type="file" name="file" onChange={changeHandler} />
          </Grid> */}
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
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.QCId_Type' })}</th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.QCId_Item' })}</th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.QCId_Standard' })}</th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.QCId_Tool' })}</th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.QCFrequencyId' })}</th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.LocationToCheck' })}</th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.Input' })}</th>
                <th style={{ ...style.th }}>
                  {state.dataSL.length > 0 && (
                    <IconButton aria-label="clear" color="error" size="small" onClick={() => handleClear()}>
                      <ClearIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </th>
              </tr>
              {state.dataSL &&
                state.dataSL.map((item, index) => {
                  let Locations = item.LocationToCheck.split('|');
                  return (
                    <>
                      <tr key={index}>
                        <td style={{ ...style.td }} rowSpan={Locations.length}>
                          {item.QCTypeName}
                        </td>
                        <td style={{ ...style.td }} rowSpan={Locations.length}>
                          {item.QCItemName}
                        </td>
                        <td style={{ ...style.td }} rowSpan={Locations.length}>
                          {item.QCStandardName}
                        </td>
                        <td style={{ ...style.td }} rowSpan={Locations.length}>
                          {item.QCToolName}
                        </td>
                        <td style={{ ...style.td }} rowSpan={Locations.length}>
                          {item.QCFrequencyName}
                        </td>
                        <td style={{ ...style.td }}>{Locations[0]}</td>
                        <td style={{ ...style.td }}>
                          <MuiAutocomplete
                            sx={{ m: 0, width: '100px' }}
                            defaultValue={index % 2 == 0 ? { item: 'OK' } : { item: 'NG' }}
                            label="Result"
                            fetchDataFunc={() => {
                              return { Data: [{ item: 'OK' }, { item: 'NG' }] };
                            }}
                            displayLabel="item"
                            displayValue="item"
                          />
                        </td>
                        <td style={{ ...style.td, textAlign: 'center' }} rowSpan={Locations.length}>
                          <IconButton aria-label="delete" color="error" size="small" onClick={() => handleDelete(item)}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </td>
                      </tr>
                      {Locations.map((item, index) => {
                        if (item != Locations[0])
                          return (
                            <tr key={`${index}`}>
                              <td style={{ ...style.td }}>{item}</td>
                              <td style={{ ...style.td }}>
                                <MuiAutocomplete
                                  sx={{ m: 0, width: '100px' }}
                                  defaultValue={index % 2 == 0 ? { item: 'OK' } : { item: 'NG' }}
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

export default connect(mapStateToProps, mapDispatchToProps)(QCMasterPQCDetailSL);
