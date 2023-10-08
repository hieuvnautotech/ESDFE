import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { MuiAutocomplete, MuiButton } from '@controls';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, TextField } from '@mui/material';
import { qcIQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import * as yup from 'yup';

const QCIQCDetailRawMaterial = ({ QCIQCMasterId, isOpen, dialogState, setDialogState }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    dataRM: [],
    N_Values: [],
    dataSL: [],
  });

  const defaultValue = {
    QCIQCMasterId: QCIQCMasterId,
    QCTypeId: null,
    QCItemId: null,
    QCStandardId: null,
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
  }, [isOpen, QCIQCMasterId]);

  //handle
  const handleDelete = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await qcIQCService.deleteIQCRM(item);
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
        let res = await qcIQCService.clearIQCRM(QCIQCMasterId);
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
    const params = { page: 0, pageSize: 0, QCIQCMasterId: QCIQCMasterId };

    const res = await qcIQCService.getIQCDetailRM(params);
    if (res && isRendered) {
      setState({
        ...state,
        dataRM: res.Data,
      });
    }
  }

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    const res = await qcIQCService.createDetailRM(data);
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
      <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={3}>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCType' }) + ' *'}
              fetchDataFunc={qcIQCService.getType}
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
          <Grid item xs={12} sx={{ mb: 3 }}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCItem' }) + ' *'}
              fetchDataFunc={() => qcIQCService.getItem(values.QCTypeId)}
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
          <Grid item xs={12} sx={{ mb: 3 }}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'standardQC.QCStandard' }) + ' *'}
              fetchDataFunc={() => qcIQCService.getStandard(values.QCTypeId, values.QCItemId)}
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
          <Grid item xs={12} sx={{ mb: 3 }}>
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
                <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'standardQC.QCType' })}</th>
                <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'standardQC.QCItem' })}</th>
                <th style={{ ...style.th, minWidth: '150px' }}>
                  {intl.formatMessage({ id: 'standardQC.QCStandard' })}
                </th>
                <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcIQC.Input' })}</th>
                <th style={{ ...style.th }}>
                  {state.dataRM && (
                    <IconButton aria-label="clear" color="error" size="small" onClick={() => handleClear()}>
                      <ClearIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </th>
              </tr>
              {state.dataRM &&
                state.dataRM.map((item, index) => {
                  let ArrayValue = [];
                  for (var i = 1; i <= item.N_Values; i++) {
                    ArrayValue.push(`N` + i);
                  }
                  return (
                    <tr key={index}>
                      <td style={{ ...style.td, minWidth: '150px' }}>{item.QCTypeName}</td>
                      <td style={{ ...style.td, minWidth: '150px' }}>{item.QCItemName}</td>
                      <td style={{ ...style.td, minWidth: '150px' }}>{item.QCStandardName}</td>
                      <td style={{ ...style.td }}>
                        <MuiAutocomplete
                          sx={{ m: 0 }}
                          defaultValue={index % 2 == 0 ? { item: 'OK' } : { item: 'NG' }}
                          label={intl.formatMessage({ id: 'qcIQC.Input' })}
                          fetchDataFunc={() => {
                            return { Data: [{ item: 'OK' }, { item: 'NG' }] };
                          }}
                          displayLabel="item"
                          displayValue="item"
                        />
                      </td>
                      <td style={{ ...style.td, textAlign: 'center' }} rowSpan={state.dataRM.Samples}>
                        <IconButton aria-label="delete" color="error" size="small" onClick={() => handleDelete(item)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </td>
                    </tr>
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
  N_Values: {
    margin: '0 10px',
  },
  itemValue: {
    width: '79px',
    height: '120px',
    background: 'rgb(255 255 255)',
    border: '1px solid rgb(52 58 64 / 80%)',
    height: '25px',
  },
};

export default QCIQCDetailRawMaterial;
