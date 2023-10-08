import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { MuiAutocomplete, MuiButton, MuiDialog } from '@controls';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, TextField } from '@mui/material';
import { qcMoldService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import * as yup from 'yup';

const QCMasterMoldDetailDialog = ({ isOpen, onClose, QCMoldMasterId }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  const [state, setState] = useState({
    data: [],
  });

  const defaultValue = {
    QCMoldMasterId: QCMoldMasterId,
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
  }, [isOpen, QCMoldMasterId]);

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
        let res = await qcMoldService.deleteMoldDetail(item);
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
    const params = { page: 0, pageSize: 0, QCMoldMasterId: QCMoldMasterId };

    const res = await qcMoldService.getMoldDetail(params);
    if (res && isRendered) {
      setState({ ...state, data: res.Data });
    }
  }

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    const res = await qcMoldService.createMoldDetail(data);
    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      setDialogState({ ...dialogState, isSubmit: false });
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const handleClear = async () => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await qcMoldService.clearMoldDetail(QCMoldMasterId);
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

  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'qcOQC.Detail' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={3} container spacing={2}>
            <Grid item xs={12}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'standardQC.QCType' }) + ' *'}
                fetchDataFunc={qcMoldService.getType}
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
                fetchDataFunc={() => qcMoldService.getItem(values.QCTypeId)}
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
                fetchDataFunc={() => qcMoldService.getStandard(values.QCTypeId, values.QCItemId)}
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
            <table style={{ width: '100%', display: 'block', overflowY: 'auto', overflowY: 'auto', height: '300px' }}>
              <tbody style={{ width: '100%', display: 'table' }}>
                <tr>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.QCId_Type' })}</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.QCId_Item' })}</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.QCId_Standard' })}</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcOQC.Input' })}</th>
                  <th style={{ ...style.th }}>
                    {state.data.length > 0 && (
                      <IconButton aria-label="clear" color="error" size="small" onClick={() => handleClear()}>
                        <ClearIcon fontSize="inherit" />
                      </IconButton>
                    )}
                  </th>
                </tr>
                {state.data.length > 0 &&
                  state.data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ ...style.td }}>{item.QCTypeName}</td>
                        <td style={{ ...style.td }}>{item.QCItemName}</td>
                        <td style={{ ...style.td }}>{item.QCStandardName}</td>
                        <td style={{ ...style.td, maxWidth: 100 }}>
                          <MuiAutocomplete
                            sx={{ m: 0 }}
                            defaultValue={index % 2 == 0 ? { item: 'OK' } : { item: 'NG' }}
                            label="Result"
                            fetchDataFunc={() => {
                              return { Data: [{ item: 'OK' }, { item: 'NG' }] };
                            }}
                            displayLabel="item"
                            displayValue="item"
                          />
                        </td>
                        <td style={{ ...style.td, textAlign: 'center' }}>
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
    </MuiDialog>
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

export default QCMasterMoldDetailDialog;
