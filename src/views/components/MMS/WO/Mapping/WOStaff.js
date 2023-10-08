import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { useModal } from '@basesShared';
import {
  MuiAutocomplete,
  MuiDialog,
  MuiButton,
  MuiSubmitButton,
  MuiDateField,
  MuiDataGrid,
  MuiDateTimeField,
} from '@controls';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import { SlitOrderService, WOService, qcPQCService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';

const WOStaff = ({ WOProcessId, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [mode, setMode] = useState(CREATE_ACTION);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
  });
  const { isShowing, toggle } = useModal();
  const [rowData, setRowData] = useState({});
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const handleCloseDialog = () => {
    onClose();
    handleReset();
  };
  const handleReset = () => {
    setMode(CREATE_ACTION);
    resetForm();
  };
  const defaultValue = {
    WOProcessStaffId: null,
    WOProcessId: WOProcessId,
    StartDate: null,
    EndDate: null,
    StaffId: '',
  };
  const schemaY = yup.object().shape({
    StaffId: yup
      .number()
      .nullable()
      .required(intl.formatMessage({ id: 'general.field_required' })),
  });
  const formik = useFormik({
    validationSchema: schemaY,
    initialValues: mode == CREATE_ACTION ? defaultValue : rowData,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });
  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOProcessStaffId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOProcessStaffId', hide: true },
    { field: 'WOProcessId', hide: true },
    { field: 'StaffId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 80,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
              >
                {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="edit"
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                onClick={() => handleUpdate(params.row)}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'StaffName',
      headerName: intl.formatMessage({ id: 'staff.StaffCode' }),
      flex: 0.6,
    },
    {
      field: 'StartDate',
      headerName: intl.formatMessage({ id: 'WO.StartDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'EndDate',
      headerName: intl.formatMessage({ id: 'WO.EndDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];
  //useEffect
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }

    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen, WOProcessId]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOProcessId: WOProcessId,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await WOService.getWOProcessStaffList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  // const handleAdd = () => {
  //   setMode(CREATE_ACTION);
  //   setRowData();
  //   toggle();
  // };
  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...state.data];
      if (data.length > state.pageSize) {
        data.pop();
      }
      setState({
        ...state,
        data: [...data],
        totalRow: state.totalRow + 1,
      });
    }
  }, [newData]);
  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.WOProcessStaffId == updateData.WOProcessStaffId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleUpdate = async (row) => {
    setMode(UPDATE_ACTION);
    setRowData(row);
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await WOService.deleteProcessStaff(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData(null);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onSubmit = async (data) => {
    if (mode == CREATE_ACTION) {
      const res = await WOService.createProcessStaff(data);
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setNewData({ ...res.Data });
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    } else {
      const res = await WOService.modifyProcessStaff({
        ...data,
        row_version: rowData.row_version,
      });
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setUpdateData({ ...res.Data });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    }
  };
  return (
    <MuiDialog
      maxWidth="md"
      title={intl.formatMessage({ id: 'WO.staff' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form onSubmit={handleSubmit}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ alignItems: 'center' }}>
          <Grid item xs={mode == UPDATE_ACTION ? 4 : 6}>
            <MuiAutocomplete
              disabled={mode == UPDATE_ACTION ? true : dialogState.isSubmit}
              label={intl.formatMessage({ id: 'WO.staff' })}
              fetchDataFunc={WOService.getStaff}
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
            />
          </Grid>
          {mode == UPDATE_ACTION && (
            <>
              <Grid item xs={3}>
                <MuiDateTimeField
                  required
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'WO.StartDate' })}
                  value={values.StartDate ?? null}
                  onChange={(e) => setFieldValue('StartDate', e)}
                  error={touched.StartDate && Boolean(errors.StartDate)}
                  helperText={touched.StartDate && errors.StartDate}
                />
              </Grid>
              <Grid item xs={3}>
                <MuiDateTimeField
                  required
                  disabled={dialogState.isSubmit}
                  label={intl.formatMessage({ id: 'WO.EndDate' })}
                  value={values.EndDate ?? null}
                  onChange={(e) => setFieldValue('EndDate', e)}
                  error={touched.EndDate && Boolean(errors.EndDate)}
                  helperText={touched.EndDate && errors.EndDate}
                />
              </Grid>
            </>
          )}
          <Grid item xs={2} sx={{ marginTop: '-3px' }}>
            <MuiSubmitButton text="save" loading={dialogState.isSubmit} />
          </Grid>
        </Grid>
      </form>
      <MuiDataGrid
        sx={{ mt: 3 }}
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.WOProcessStaffId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
    </MuiDialog>
  );
};
export default WOStaff;
