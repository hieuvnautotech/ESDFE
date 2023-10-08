import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiDateField, MuiSearchInput } from '@controls';
import { Grid, TextField } from '@mui/material';
import { materialService } from '@services';
import { ErrorAlert, SuccessAlert, addDays } from '@utils';
import { useFormik } from 'formik';
import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { IQCReceivingService } from '@services';
import { useModal2 } from '@basesShared';
import moment from 'moment';
import MaterialDialog from './MaterialDialog';
import { match } from 'ramda';

const IQCReceivingDialog = ({ initModal, isOpen, onClose, setNewData, setUpdateData, mode, fetchData }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [materialSelected, setMaterialSelected] = useState({ MaterialCode: '' });
  const { isShowing2, toggle2 } = useModal2();

  const schemaY = yup.object().shape({
    // MaterialCode: yup
    //   .string()
    //   .trim()
    //   .required(intl.formatMessage({ id: 'general.field_required' })),
    Width: yup
      .number()
      .integer()
      .nullable()
      .when('width', (value) => {
        if (materialSelected?.MaterialUnit == 'm2')
          return yup
            .number()
            .integer()
            .nullable()
            .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
            .lessThan(
              materialSelected?.Width + 1,
              intl.formatMessage({ id: 'general.field_max' }, { max: materialSelected?.Width })
            )
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    Length: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    LotNo: yup
      .string()
      .trim()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    Month: yup
      .number()
      .integer()
      .nullable()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ManufactureDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    CuttingDate: yup
      .date()
      .nullable()
      .when('MaterialType', (value) => {
        if (value == 'M' && materialSelected?.MaterialUnit != 'EA' && values?.MaterialUnit != 'EA')
          return yup
            .date()
            .nullable()
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    ReceivedDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ExportDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    ExpirationDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    MaterialType: yup
      .string()
      .nullable()
      .when('MaterialTypeName', (value) => {
        if (materialSelected?.MaterialUnit != 'EA' && values?.MaterialUnit != 'EA')
          return yup
            .string()
            .nullable()
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    QuantityBundle: yup
      .number()
      .nullable()
      .integer()
      .when('quantityBundle', (value) => {
        if (mode == CREATE_ACTION)
          return yup
            .number()
            .nullable()
            .integer()
            .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    QuantityInBundle: yup
      .number()
      .nullable()
      .integer()
      .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
      .required(intl.formatMessage({ id: 'general.field_required' })),

    TotalQuantityInBundle: yup
      .number()
      .nullable()
      .integer()
      .when('quantityInBundle', (value) => {
        if (materialSelected?.QuantityRoll && mode == CREATE_ACTION)
          return yup
            .number()
            .nullable()
            .integer()
            .moreThan(0, intl.formatMessage({ id: 'general.field_min' }, { min: 1 }))
            .lessThan(
              materialSelected?.QuantityRoll + 1,
              intl.formatMessage({ id: 'general.field_max' }, { max: materialSelected?.QuantityRoll })
            )
            .required(intl.formatMessage({ id: 'general.field_required' }));
      }),
    QCIQCMasterId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' }))
      .when('MaterialType', (value) => {
        if (value == null)
          return yup
            .number()
            .nullable()
            .required(intl.formatMessage({ id: 'IQCReceiving.Error_SelectMaterialTypeFirst' }));
      }),
    IQCCheck: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const handleSelectMaterialCode = async () => {
    toggle2();
  };

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == CREATE_ACTION ? defaultValue : initModal,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  const handleReset = () => {
    setMaterialSelected({ MaterialCode: '' });
    resetForm();
  };

  const handleCloseDialog = () => {
    handleReset();
    onClose();
  };

  const onSubmit = async (data) => {
    setDialogState({ ...dialogState, isSubmit: true });

    if (mode == CREATE_ACTION) {
      const res = await IQCReceivingService.create({
        ...data,
        Width: Number(data.Width),
        MaterialId: materialSelected?.MaterialId,
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        //setNewData({ ...res.Data });
        fetchData();
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    } else {
      const res = await IQCReceivingService.modify({
        ...data,
        //  Width: Number(data.Width),
        //MaterialId: materialSelected?.MaterialId
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setUpdateData({ ...res.Data });
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
  };

  useEffect(() => {
    if (values.Month > 0) {
      if (mode == CREATE_ACTION) {
        if (!materialSelected?.Expiration && values?.ManufactureDate != '' && values?.ManufactureDate != null) {
          let value = new Date(moment(values.ManufactureDate).add(values.Month, 'months'));
          setFieldValue('ExpirationDate', value);
        }
        if (materialSelected?.Expiration && values?.ReceivedDate != '' && values?.ReceivedDate != null) {
          let value = new Date(moment(values.ReceivedDate).add(values.Month, 'months'));
          setFieldValue('ExpirationDate', value);
        }
      } else {
        if (!initModal?.Expiration && values?.ManufactureDate != '' && values?.ManufactureDate != null) {
          let value = new Date(moment(values.ManufactureDate).add(values.Month, 'months'));
          setFieldValue('ExpirationDate', value);
        }
        if (initModal?.Expiration && values?.ReceivedDate != '' && values?.ReceivedDate != null) {
          let value = new Date(moment(values.ReceivedDate).add(values.Month, 'months'));
          setFieldValue('ExpirationDate', value);
        }
      }
    }
  }, [values.Month, values.ManufactureDate, values.ReceivedDate]);

  useEffect(() => {
    if (Number(values.QuantityBundle) > 0 && Number(values.QuantityInBundle) > 0) {
      if (materialSelected?.MaterialUnit == 'EA') {
        if (Number(values.Length) > 0) {
          let value = Number(values.QuantityBundle) * Number(values.QuantityInBundle) * Number(values.Length);
          setFieldValue('TotalQuantityInBundle', value);
        }
      } else {
        let value = Number(values.QuantityBundle) * Number(values.QuantityInBundle);
        setFieldValue('TotalQuantityInBundle', value);
      }
    }
  }, [values.QuantityBundle, values.QuantityInBundle, values.Length]);

  useEffect(() => {
    setFieldValue('POId', materialSelected?.POId ?? null);

    if (materialSelected?.MaterialUnit == 'EA') {
      setFieldValue('QCIQCMasterName', '');
      setFieldValue('QCIQCMaster', null);
      setFieldValue('MaterialType', 'M');
      setFieldValue('QuantityBundle', '1');
      setFieldValue('QuantityInBundle', '1');
      setFieldValue('Length', materialSelected?.QuantityRoll);
    }
    if (materialSelected?.MaterialUnit == 'm2') {
      setFieldValue('QuantityBundle', materialSelected?.QuantityRoll ? '1' : '');
      setFieldValue('QuantityInBundle', materialSelected?.QuantityRoll ?? '');
      if (materialSelected?.Length > 0) setFieldValue('Length', materialSelected?.Length);
      if (materialSelected?.Width > 0) setFieldValue('Width', materialSelected?.Width);
    }
  }, [materialSelected]);

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
          <Grid item xs={6}>
            <MuiSearchInput
              disabled={true}
              sx={{ width: 210 }}
              fullWidth
              size="small"
              name="MaterialCode"
              label="material.MaterialCode"
              onClick={() => handleSelectMaterialCode()}
              value={mode == UPDATE_ACTION ? values.MaterialCode : materialSelected?.MaterialCode}
              error={touched.MaterialCode && Boolean(errors.MaterialCode)}
              helperText={touched.MaterialCode && errors.MaterialCode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="LotNo"
              disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
              value={values.LotNo}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'IQCReceiving.LotNo' }) + ' *'}
              error={touched.LotNo && Boolean(errors.LotNo)}
              helperText={touched.LotNo && errors.LotNo}
            />
          </Grid>
          {materialSelected?.MaterialUnit == 'm2' || values.MaterialUnit == 'm2' ? (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="Width"
                  type="number"
                  inputProps={{ min: 0, step: 'any' }}
                  disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
                  value={values.Width}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'IQCReceiving.Width' }) + ' *'}
                  error={touched.Width && Boolean(errors.Width)}
                  helperText={touched.Width && errors.Width}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="Length"
                  type="number"
                  inputProps={{ min: 0, step: 'any' }}
                  disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
                  value={values.Length}
                  onChange={handleChange}
                  label={intl.formatMessage({ id: 'IQCReceiving.Length' }) + ' *'}
                  error={touched.Length && Boolean(errors.Length)}
                  helperText={touched.Length && errors.Length}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                name="Length"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
                disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
                value={values.Length}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'IQCReceiving.LengthEA' }) + ' *'}
                error={touched.Length && Boolean(errors.Length)}
                helperText={touched.Length && errors.Length}
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <MuiDateField
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'IQCReceiving.ExportDate' })}
              value={values.ExportDate ?? null}
              onChange={(e) => setFieldValue('ExportDate', e)}
              error={touched.ExportDate && Boolean(errors.ExportDate)}
              helperText={touched.ExportDate && errors.ExportDate}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiDateField
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' })}
              value={values.ReceivedDate ?? null}
              onChange={(e) => setFieldValue('ReceivedDate', e)}
              error={touched.ReceivedDate && Boolean(errors.ReceivedDate)}
              helperText={touched.ReceivedDate && errors.ReceivedDate}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={values.IQCCheck ? { UnitId: values.IQCCheck, UnitName: values.IQCCheckName } : null}
              disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
              label={intl.formatMessage({ id: 'IQCReceiving.CheckIQC' })}
              fetchDataFunc={() => {
                if (materialSelected?.MaterialCode.includes('SUS')) {
                  return {
                    Data: [
                      { UnitId: '1', UnitName: 'Check' },
                      { UnitId: '0', UnitName: 'No Check' },
                    ],
                  };
                } else {
                  return {
                    Data: [
                      { UnitId: '2', UnitName: 'Sampling' },
                      { UnitId: '1', UnitName: 'Check' },
                      { UnitId: '0', UnitName: 'No Check' },
                    ],
                  };
                }
              }}
              displayLabel="UnitName"
              displayValue="UnitId"
              onChange={(e, value) => {
                setFieldValue('IQCCheck', value?.UnitId || '');
                setFieldValue('IQCCheckName', value?.UnitName || '');
              }}
              error={touched.IQCCheck && Boolean(errors.IQCCheck)}
              helperText={touched.IQCCheck && errors.IQCCheck}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiDateField
              required
              disabled={dialogState.isSubmit}
              label={intl.formatMessage({ id: 'IQCReceiving.ManufactureDate' })}
              value={values.ManufactureDate ?? null}
              onChange={(e) => setFieldValue('ManufactureDate', e)}
              error={touched.ManufactureDate && Boolean(errors.ManufactureDate)}
              helperText={touched.ManufactureDate && errors.ManufactureDate}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="Month"
              type="number"
              disabled={dialogState.isSubmit}
              value={values.Month}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'IQCReceiving.Month' }) + ' *'}
              error={touched.Month && Boolean(errors.Month)}
              helperText={touched.Month && errors.Month}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiDateField
              required
              disabled={true}
              label={intl.formatMessage({ id: 'IQCReceiving.ExpirationDate' })}
              value={values.ExpirationDate}
              onChange={(e) => setFieldValue('ExpirationDate', e)}
              error={touched.ExpirationDate && Boolean(errors.ExpirationDate)}
              helperText={touched.ExpirationDate && errors.ExpirationDate}
            />
          </Grid>
          {materialSelected?.MaterialUnit != 'EA' && values?.MaterialUnit != 'EA' && (
            <Grid item xs={6}>
              <MuiAutocomplete
                required
                translationLabel
                value={
                  values.MaterialType
                    ? { commonDetailCode: values.MaterialType, commonDetailLanguge: values.MaterialTypeName }
                    : null
                }
                // disabled={
                //   mode == UPDATE_ACTION
                //     ? true
                //     : values.LotCheckStatus
                //     ? true
                //     : materialSelected?.MaterialUnit == 'EA' || values?.MaterialUnit == 'EA'
                //     ? true
                //     : dialogState.isSubmit
                // }
                disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
                label={intl.formatMessage({ id: 'material.MaterialType' })}
                fetchDataFunc={IQCReceivingService.getMaterialType}
                displayLabel="commonDetailLanguge"
                displayValue="commonDetailCode"
                onChange={(e, value) => {
                  setFieldValue('QCIQCMasterName', '');
                  setFieldValue('QCIQCMaster', null);
                  setFieldValue('MaterialTypeName', value?.commonDetailLanguge || '');
                  setFieldValue('MaterialType', value?.commonDetailCode || '');
                }}
                error={touched.MaterialType && Boolean(errors.MaterialType)}
                helperText={touched.MaterialType && errors.MaterialType}
              />
            </Grid>
          )}

          <Grid item xs={6}>
            <MuiAutocomplete
              required
              value={
                values.QCIQCMasterId
                  ? { QCIQCMasterId: values.QCIQCMasterId, QCIQCMasterName: values.QCIQCMasterName }
                  : null
              }
              disabled={mode == UPDATE_ACTION || values.MaterialType == null ? true : dialogState.isSubmit}
              label={intl.formatMessage({ id: 'IQCReceiving.IQCForm' })}
              fetchDataFunc={() => IQCReceivingService.getIQCForm(values.MaterialType)}
              displayLabel="QCIQCMasterName"
              displayValue="QCIQCMasterId"
              onChange={(e, value) => {
                setFieldValue('QCIQCMasterName', value?.QCIQCMasterName || '');
                setFieldValue('QCIQCMasterId', value?.QCIQCMasterId || '');
              }}
              error={touched.QCIQCMasterId && Boolean(errors.QCIQCMasterId)}
              helperText={touched.QCIQCMasterId && errors.QCIQCMasterId}
            />
          </Grid>

          {mode == CREATE_ACTION && (
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                name="QuantityBundle"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
                disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
                value={values.QuantityBundle}
                onChange={handleChange}
                label={intl.formatMessage({ id: 'IQCReceiving.QuantityBundle' }) + ' *'}
                error={touched.QuantityBundle && Boolean(errors.QuantityBundle)}
                helperText={touched.QuantityBundle && errors.QuantityBundle}
              />
            </Grid>
          )}

          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              name="QuantityInBundle"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
              value={values.QuantityInBundle}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'IQCReceiving.QuantityInBundle' }) + ' *'}
              error={touched.QuantityInBundle && Boolean(errors.QuantityInBundle)}
              helperText={touched.QuantityInBundle && errors.QuantityInBundle}
            />
          </Grid>

          {mode == CREATE_ACTION && (
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                size="small"
                name="Total"
                type="number"
                value={values.TotalQuantityInBundle}
                label={intl.formatMessage({ id: 'IQCReceiving.TotalQuantityInBundle' }) + ' *'}
                error={touched.TotalQuantityInBundle && Boolean(errors.TotalQuantityInBundle)}
                helperText={touched.TotalQuantityInBundle && errors.TotalQuantityInBundle}
              />
            </Grid>
          )}

          {values?.MaterialType == 'M' && materialSelected?.MaterialUnit != 'EA' && values?.MaterialUnit != 'EA' && (
            <>
              <Grid item xs={6}>
                <MuiDateField
                  required
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'IQCReceiving.CuttingDate' })}
                  value={values.CuttingDate ?? null}
                  onChange={(e) => setFieldValue('CuttingDate', e)}
                  error={touched.CuttingDate && Boolean(errors.CuttingDate)}
                  helperText={touched.CuttingDate && errors.CuttingDate}
                />
              </Grid>
            </>
          )}

          <Grid
            item
            xs={
              values?.MaterialType == 'M' && materialSelected?.MaterialUnit != 'EA' && values?.MaterialUnit != 'EA'
                ? 12
                : 6
            }
          >
            <TextField
              fullWidth
              size="small"
              name="Description"
              disabled={dialogState.isSubmit}
              value={values.Description}
              onChange={handleChange}
              label={intl.formatMessage({ id: 'general.description' })}
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

      <MaterialDialog isOpen={isShowing2} onClose={toggle2} setMaterialSelected={setMaterialSelected} />
    </MuiDialog>
  );
};

const defaultValue = {
  MaterialCode: '',
  MaterialReceiveId: null,
  MaterialId: null,
  MaterialType: null,
  LotNo: '',
  BundleCode: '',
  QuantityBundle: '',
  QuantityInBundle: '',
  TotalQuantityInBundle: '',
  ManufactureDate: null,
  ReceivedDate: null,
  CuttingDate: null,
  ExportDate: moment(),
  ExpirationDate: null,
  Description: '',
  Width: '',
  Length: '',
  Month: '',
  IQCCheck: '',
  CutSlit: '',
  QCIQCMasterId: null,
};

export default IQCReceivingDialog;
