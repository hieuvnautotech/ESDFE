import { useModal, useModal2, useModal3 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiIconButton } from '@controls';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Grid, IconButton, Paper, Select, Stack, Switch } from '@mui/material';
import { WOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
// import MappingDialog from './MappingDialog';
import WOProcessDialog from './WOProcessDialog';
// import WOProcessMaterialDialog from './WOProcessMaterialDialog';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import WOProcessPQCDialog from './WOProcessPQCDialog';
import WOProcessMappingDialog from './WOProcessMappingDialog';
import { useTokenStore } from '@stores';
// import WOProcessDialog from './WOProcessDialog';

export default function WOProcess({ WOId, finished, isActivedRow }) {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const { isShowing3, toggle3 } = useModal3();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
    searchData: {
      keyWord: '',
      ProcessId: null,
      showDelete: true,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [RowCheck, setRowCheck] = useState({});

  const setWOProcessId = useTokenStore((state) => state.setWOProcessId);
  const setQCPQCMasterId = useTokenStore((state) => state.setQCPQCMasterId);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOProcessId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOProcessId', hide: true },
    { field: 'WOId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 120,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      hide: !isActivedRow,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <MuiIconButton
                color="error"
                onClick={() => handleCheckPQC(params.row)}
                disabled={params.row.QCPQCMasterId != null ? false : true}
                text="checkqc"
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <MuiIconButton
                color="warning"
                onClick={() => handleMapping(params.row)}
                //disabled={!params.row.CheckResult}
                text="mapping"
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <MuiIconButton color="error" onClick={() => handleDelete(params.row)} text="delete" />
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'ProcessLevel',
      headerName: intl.formatMessage({ id: 'bom.Step' }),
      flex: 0.6,
    },
    {
      field: 'ProcessCode',
      headerName: intl.formatMessage({ id: 'bom.ProcessId' }),
      flex: 0.6,
    },
    {
      field: 'OKQty',
      headerName: intl.formatMessage({ id: 'WO.OKQty' }),
      flex: 0.6,
    },
    {
      field: 'CheckResult',
      headerName: intl.formatMessage({ id: 'WO.CheckResult' }),
      flex: 0.5,
      valueFormatter: (params) => (params?.value != null ? (params?.value ? 'OK' : 'NG') : ''),
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      flex: 0.4,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete, WOId, isShowing3]);

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
        return o.WOProcessId == updateData.WOProcessId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

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
        let res = await WOService.deleteWOProcess(item);
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

  const handleAdd = () => {
    setMode(CREATE_ACTION);
    setRowData();
    toggle();
  };

  const handleUpdate = async (row) => {
    //    setMode(UPDATE_ACTION);
    setRowCheck(row);
    toggle();
  };

  const handleCheckPQC = async (row) => {
    setRowCheck(row);
    toggle2();
  };
  const handleMapping = async (row) => {
    setRowCheck(row);
    setWOProcessId(row.WOProcessId);
    setQCPQCMasterId(row.QCPQCMasterId);
    toggle3();
  };

  const handleCloseCheckPQC = () => {
    fetchData();
    toggle2();
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOId: WOId,
      ProcessId: state.searchData.ProcessId,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await WOService.getWOProcessList(params);

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
      <Grid sx={{ mb: 1 }}>
        <MuiButton text="create" color="success" onClick={toggle} sx={{ mt: 1 }} disabled={WOId ? finished : true} />
      </Grid>
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.WOProcessId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />

      {/* <MappingDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
        WOId={WOId}
      /> */}
      <WOProcessDialog isOpen={isShowing} onClose={toggle} setNewData={setNewData} WOId={WOId} />
      <WOProcessMappingDialog RowCheck={RowCheck} isOpen={isShowing3} onClose={toggle3} />
      <WOProcessPQCDialog RowCheck={RowCheck} isOpen={isShowing2} onClose={handleCloseCheckPQC} />
    </React.Fragment>
  );
}
