import { useModal, useModal2, useModal3 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiSubmitButton, MuiSearchInput } from '@controls';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Paper, Select, Stack, Switch, TextField } from '@mui/material';
import { WOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useFormik } from 'formik';
import MaterialLotCodeDialog from './MaterialLotCodeDialog';
import { useTokenStore } from '@stores';

export default function WOProcessMaterial() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const WOId = useTokenStore((state) => state.WOId);
  const WOProcessId = useTokenStore((state) => state.WOProcessId);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 6,
    searchData: {
      keyWord: '',
      ProcessId: null,
      showDelete: true,
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MaterialId', hide: true },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialCode' }),
      flex: 0.5,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      flex: 0.5,
    },
    {
      field: 'CuttingSize',
      headerName: intl.formatMessage({ id: 'bom.CuttingSize' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete, WOId]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOId: WOId,
      WOProcessId: WOProcessId,
      page: state.page,
      pageSize: state.pageSize,
    };
    const res = await WOService.getListMateialLotByBOM(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  return (
    <React.Fragment>
      <Grid sx={{ mt: 10 }} />
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={35}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.MaterialId}
        initialState={{ pinnedColumns: { left: ['id', 'MaterialCode'] } }}
      />
    </React.Fragment>
  );
}
