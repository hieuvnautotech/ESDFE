import { BASE_URL, CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import {
  MuiAutocomplete,
  MuiButton,
  MuiDateField,
  MuiDialog,
  MuiResetButton,
  MuiSubmitButton,
  MuiTextField,
  MuiDataGrid,
} from '@controls';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Grid } from '@mui/material';
import Tab from '@mui/material/Tab';
import { moldService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import readXlsxFile from 'read-excel-file';
import * as yup from 'yup';

import { MoldDto } from '@models';

const MoldHistoryDialog = ({ initModal, isOpen, onClose }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {},
  });
  useEffect(() => {
    if (isOpen) fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen]);

  async function fetchData() {
    if (isRendered) {
      setState({ ...state, isLoading: true });
    }

    const params = {
      page: state.page,
      pageSize: state.pageSize,
      MoldId: initModal?.MoldId,
    };
    const res = await moldService.getMoldHistory(params);
    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleCloseDialog = () => {
    onClose();
  };
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOMoldPressingId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MoldId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'MoldName',
      headerName: intl.formatMessage({ id: 'mold.MoldName' }),
      flex: 0.6,
    },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      flex: 0.6,
    },
    {
      field: 'Model',
      headerName: intl.formatMessage({ id: 'WO.Model' }),
      flex: 0.4,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'mold.ProductCode' }),
      flex: 0.6,
    },
    {
      field: 'LineName',
      headerName: intl.formatMessage({ id: 'WO.LineName' }),
      flex: 0.4,
    },
    {
      field: 'CurrentNumber',
      headerName: intl.formatMessage({ id: 'mold.CurrentNumber' }),
      flex: 0.4,
      renderCell: (params) => {
        {
          {
            return Number(params?.row?.PressingTimes + params?.row?.Step).toLocaleString() ?? 0;
          }
        }
      },
    },
    {
      field: 'PressingTimes',
      headerName: intl.formatMessage({ id: 'mold.PressingTimes' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'Step',
      headerName: intl.formatMessage({ id: 'WO.MoldAccumulated' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
  ];
  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({
        id: 'general.create',
      })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        gridHeight={736}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        onPageSizeChange={(newPageSize) => setState({ ...state, pageSize: newPageSize, page: 1 })}
        getRowId={(rows) => rows.WOMoldPressingId}
        getRowClassName={(params) => {}}
        initialState={{
          pinnedColumns: {
            left: ['id', 'check-history', 'MoldStatusName', 'MoldSerial', 'MoldName'],
            right: ['action'],
          },
        }}
      />
    </MuiDialog>
  );
};
export default MoldHistoryDialog;
