import { CREATE_ACTION, CURRENT_USER } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiDialog, MuiResetButton, MuiSubmitButton, MuiButton, MuiDateField } from '@controls';
import { Grid, IconButton, TextField } from '@mui/material';
import { WOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { useTokenStore } from '@stores';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { BASE_URL } from '@constants/ConfigConstants';
import ClearIcon from '@mui/icons-material/Clear';

const WOSemiCheckPQCSLDialog = ({ RowCheck, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isSubmit: false,
    dataMaterial: [],
    valueCheck: [],
  });
  const [table, setTable] = useState([]);
  const QCPQCMasterId = useTokenStore((state) => state.QCPQCMasterId);

  async function fetchData() {
    const res = await WOService.getPQCDetailSL(QCPQCMasterId, RowCheck?.WOSemiLotMMSId);
    const value = await WOService.getPQCDetailSLValue(RowCheck?.WOSemiLotMMSId);

    let data = [];
    res.Data.forEach((item) => {
      let Locations = item.LocationToCheck.split('|');
      Locations.forEach((l) => {
        let rowValue = value.Data.find((x) => x.QCPQCDetailSLId == item.QCPQCDetailSLId && x.Location == l);
        let checkValue = rowValue?.TextValue ?? null;
        data.push({ QCPQCDetailSLId: item.QCPQCDetailSLId, Location: l, TextValue: checkValue });
      });
    });
    setTable(data);

    if (res && isRendered) {
      setState({
        ...state,
        dataMaterial: res.Data,
        valueCheck: value.Data,
      });
    }
  }

  const schemaY = yup.object().shape({
    StaffId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
    CheckDate: yup
      .date()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });

  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: {
      ...RowCheck,
      CheckResultName: RowCheck.CheckResult != null ? (RowCheck.CheckResult ? 'OK' : 'NG') : '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
    if (RowCheck.CheckDate == null || RowCheck.CheckDate == undefined) {
      setFieldValue('CheckDate', new Date());
    }
    return () => (isRendered = false);
  }, [isOpen, QCPQCMasterId, RowCheck?.WOSemiLotMMSId]);

  const handleReset = () => {
    setDataCheck([]);
    resetForm();
  };

  const handleCloseDialog = () => {
    setTable([]);
    setState({
      isSubmit: false,
      dataMaterial: [],
      valueCheck: [],
    });
    resetForm();
    onClose();
  };

  const onSubmit = async (data) => {
    var status = -1;
    if (data.CheckResultName != '') {
      const index = _.findIndex(table, function (o) {
        return o.TextValue == null;
      });
      if (index !== -1) {
        status = index;
      }
    }

    if (status > -1) {
      ErrorAlert(
        intl.formatMessage({ id: 'WO.Error_CheckPQCSL_NotFullFill' }, { location: ` ${table[status].Location}` })
      );
    } else {
      setState({ ...state, isSubmit: true });
      const res = await WOService.checkPQCSL({
        ...data,
        QCPQCMasterId: QCPQCMasterId,
        ValueCheck: table,
        CheckResult: data.CheckResultName != '' ? (data.CheckResultName == 'OK' ? true : false) : null,
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setState({ ...state, isSubmit: false });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setState({ ...state, isSubmit: false });
      }
    }
  };

  const handleSetAllResult = (value) => {
    if (value == 'OK') {
      let data = [];
      state.dataMaterial.forEach((item) => {
        let Locations = item.LocationToCheck.split('|');
        Locations.forEach((l) => {
          data.push({ QCPQCDetailSLId: item.QCPQCDetailSLId, Location: l, TextValue: '1' });
        });
      });
      setTable(data);
    }

    setFieldValue('CheckResultName', value || '');
  };

  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={state.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              size="small"
              name="SemiLotCode"
              type="text"
              value={values?.SemiLotCode ?? ''}
              label={intl.formatMessage({ id: 'WO.SemiLotCode' })}
            />
          </Grid>
          <Grid item xs={3}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'staff.StaffCode' })}
              fetchDataFunc={WOService.getStaffQC}
              displayLabel="StaffName"
              displayValue="StaffId"
              value={
                values.StaffId
                  ? {
                      StaffId: values.StaffId,
                      StaffName: values.StaffName,
                    }
                  : null
              }
              onChange={(e, value) => {
                setFieldValue('StaffName', value?.StaffName || '');
                setFieldValue('StaffId', value?.StaffId || null);
              }}
              error={touched.StaffId && Boolean(errors.StaffId)}
              helperText={touched.StaffId && errors.StaffId}
              disabled={values.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={3}>
            <MuiDateField
              label={intl.formatMessage({ id: 'mold.CheckDate' })}
              value={values.CheckDate != null ? values.CheckDate : null}
              onChange={(e) => setFieldValue('CheckDate', e)}
              error={touched.CheckDate && Boolean(errors.CheckDate)}
              helperText={touched.CheckDate && errors.CheckDate}
              disabled={values.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={3}>
            <MuiAutocomplete
              label={intl.formatMessage({ id: 'IQCReceiving.Result' })}
              fetchDataFunc={() => {
                return {
                  Data: [{ CheckResultName: 'OK' }, { CheckResultName: 'NG' }],
                };
              }}
              value={values.CheckResultName != '' ? { CheckResultName: values.CheckResultName } : null}
              displayLabel="CheckResultName"
              displayValue="CheckResultName"
              onChange={(e, value) => {
                handleSetAllResult(value?.CheckResultName);
              }}
              error={touched.CheckResultName && Boolean(errors.CheckResultName)}
              helperText={touched.CheckResultName && errors.CheckResultName}
              disabled={values.CheckResult != null ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <table style={{ width: '100%', display: 'block', overflowY: 'auto', overflowY: 'auto', height: '335px' }}>
              <tbody style={{ width: '100%', display: 'table' }}>
                <tr>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Type' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Item' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>
                    {intl.formatMessage({ id: 'qcPQC.QCId_Standard' })}
                  </th>
                  <th style={{ ...style.th, minWidth: '150px' }}>{intl.formatMessage({ id: 'qcPQC.QCId_Tool' })}</th>
                  <th style={{ ...style.th, minWidth: '150px' }}>
                    {intl.formatMessage({ id: 'qcPQC.QCFrequencyId' })}
                  </th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.ImageFile' })}</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.LocationToCheck' })}</th>
                  <th style={{ ...style.th }}>{intl.formatMessage({ id: 'qcPQC.Input' })}</th>
                </tr>
                {state.dataMaterial &&
                  state.dataMaterial.map((item, index) => {
                    let Locations = item.LocationToCheck.split('|');
                    return Locations.map((location, index2) => {
                      let rowValue = table.find(
                        (x) => x.QCPQCDetailSLId == item.QCPQCDetailSLId && x.Location == location
                      );
                      return (
                        <tr key={index2}>
                          {location == Locations[0] && (
                            <>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={Locations.length}>
                                {item.QCTypeName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={Locations.length}>
                                {item.QCItemName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={Locations.length}>
                                {item.QCStandardName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={Locations.length}>
                                {item.QCToolName}
                              </td>
                              <td style={{ ...style.td, minWidth: '150px' }} rowSpan={Locations.length}>
                                {item.QCFrequencyName}
                              </td>
                              <td style={{ ...style.td, textAlign: 'center' }} rowSpan={Locations.length}>
                                {item.ImageFile != null && (
                                  <PhotoProvider>
                                    <PhotoView src={`${BASE_URL}/Image/QCPQC/${item.ImageFile}`}>
                                      <img
                                        src={`${BASE_URL}/Image/QCPQC/${item.ImageFile}`}
                                        style={{ maxHeight: '100px' }}
                                      />
                                    </PhotoView>
                                  </PhotoProvider>
                                )}
                              </td>
                            </>
                          )}
                          <td style={{ ...style.td }}>{location}</td>
                          <td style={{ ...style.td }}>
                            <MuiAutocomplete
                              sx={{ m: 0, width: '100px' }}
                              label="Result"
                              // value={
                              //   rowValue.TextValue != null
                              //     ? rowValue.TextValue == '0'
                              //       ? { value: '0', item: 'O' }
                              //       : rowValue.TextValue == '1'
                              //       ? { value: '1', item: 'X' }
                              //       : { value: '2', item: 'Δ' }
                              //     : null
                              // }
                              value={
                                rowValue?.TextValue != null
                                  ? { value: rowValue.TextValue, item: rowValue.TextValue == '1' ? 'OK' : 'NG' }
                                  : null
                              }
                              fetchDataFunc={() => {
                                return {
                                  Data: [
                                    // { value: '0', item: 'O' },
                                    // { value: '1', item: 'X' },
                                    // { value: '2', item: 'Δ' },

                                    { value: '1', item: 'OK' },
                                    { value: '0', item: 'NG' },
                                  ],
                                };
                              }}
                              displayLabel="item"
                              displayValue="value"
                              onChange={(e, value) => {
                                let newArr = [...table];
                                const index = _.findIndex(newArr, function (o) {
                                  return o.QCPQCDetailSLId == item.QCPQCDetailSLId && o.Location == location;
                                });
                                if (index !== -1) {
                                  newArr[index] = { ...newArr[index], TextValue: value?.value ?? null };
                                  setTable(newArr);
                                } else {
                                  let newItem = {
                                    QCPQCDetailSLId: item.QCPQCDetailSLId,
                                    Location: location,
                                    TextValue: value?.value ?? null,
                                  };
                                  setTable([...table, newItem]);
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    });
                  })}
              </tbody>
            </table>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              {values.CheckResult == null && <MuiSubmitButton text="save" loading={state.isSubmit} />}
            </Grid>
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

  itemValue: {
    width: '79px',
    height: '120px',
    background: 'rgb(255 255 255)',
    border: '1px solid rgb(52 58 64 / 80%)',
    height: '25px',
  },
};

export default WOSemiCheckPQCSLDialog;
