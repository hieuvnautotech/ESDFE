import { useModal, useModal2, useModal3 } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid } from '@controls';
import { Grid, IconButton } from '@mui/material';
import { ActualService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import WOProcessDialog from './WOProcessDialog';
import WOProcessStaff from './WOProcessStaff';
import DeleteIcon from '@mui/icons-material/Delete';

export default function WOProcess({ WOId }) {
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
  const [WOProcessId, setWOProcessId] = useState(null);
  const [ProcessCode, setProcessCode] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
    { field: 'ProcessCode', hide: true },
    { field: 'WOId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 40,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'ProcessName',
      headerName: intl.formatMessage({ id: 'bom.ProcessId' }),
      width: 300,
    },
    {
      field: 'ProcessLevel',
      headerName: intl.formatMessage({ id: 'semiFqc.level' }),
      width: 100,
    },
    {
      field: 'OKQty',
      headerName: intl.formatMessage({ id: 'WO.OKQty' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'NGQty',
      headerName: intl.formatMessage({ id: 'WO.NGQty' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      width: 150,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    // {
    //   field: 'modifiedName',
    //   headerName: intl.formatMessage({ id: 'general.modifiedName' }),
    //   flex: 0.4,
    // },
    // {
    //   field: 'modifiedDate',
    //   headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
    //   flex: 0.4,
    //   valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    // },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    setSelectedRow(null);
    return () => {
      isRendered = false;
    };
  }, [state.page, state.searchData.showDelete, WOId]);

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
    console.log(item);
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await ActualService.deleteProcessFQC(item);
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

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  const handleAdd = () => {
    setMode(CREATE_ACTION);
    setRowData();
    toggle();
  };

  const handleUpdate = async (row) => {
    setMode(UPDATE_ACTION);
    setRowData(row);
    toggle();
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    setWOProcessId(null);
    const params = {
      WOId: WOId,
      ProcessId: state.searchData.ProcessId,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await ActualService.getWOProcessList(params);

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
      <Grid container direction="row" justifyContent="space-between" columnSpacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Grid item xs={2}>
            <MuiButton
              text="create"
              color="success"
              onClick={handleAdd}
              sx={{ mt: 1 }}
              disabled={WOId == null ? true : false}
            />
          </Grid>
          <MuiDataGrid
            showLoading={state.isLoading}
            isPagingServer={true}
            headerHeight={30}
            columns={columns}
            rows={state.data}
            page={state.page - 1}
            pageSize={state.pageSize}
            rowCount={state.totalRow}
            onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
            getRowId={(rows) => rows.WOProcessId}
            // onSelectionModelChange={(Ids) => setWOProcessId(Ids[0])}
            onRowClick={(params) => {
              setSelectedRow(params.row);
            }}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { left: ['ProcessCode'], right: ['action'] } }}
          />
          <WOProcessDialog
            setNewData={setNewData}
            setUpdateData={setUpdateData}
            initModal={rowData}
            isOpen={isShowing}
            onClose={toggle}
            mode={mode}
            WOId={WOId}
          />
        </Grid>
        <Grid item xs={6}>
          <WOProcessStaff WOProcessId={selectedRow?.WOProcessId} ProcessCode={selectedRow?.ProcessCode} WOId={WOId} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
