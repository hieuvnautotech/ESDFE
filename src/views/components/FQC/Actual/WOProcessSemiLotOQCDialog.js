import { useModal, useModal2 } from '@basesShared';
import { MuiButton, MuiDataGrid, MuiDialog } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button, Grid, IconButton } from '@mui/material';
import { ActualService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import WOSemiLotListWaitOQCDialog from './WOSemiLotListWaitOQCDialog';
import WOSemiCheckOQCDialog from './WOSemiCheckOQCDialog';

const WOProcessSemiLotOQCDialog = ({ WOProcessStaff, isOpen, onClose }) => {
  // console.log(WOProcessStaff);
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
  });
  const [stateDetail, setStateDetail] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
  });
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [newData, setNewData] = useState({});
  const [newDataDetail, setNewDataDetail] = useState({});
  const [WOSemiLotFQCId, setWOSemiLotFQCId] = useState(null);
  const [WOSemiLotFQCDetail, setWOSemiLotFQCDetail] = useState(null);
  const [RowCheck, setRowCheck] = useState({});

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (state.page - 1) * state.pageSize,
    },
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
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
                disabled={params.row.LotStatus != '012' ? true : false}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    { field: 'WOSemiLotFQCId', hide: true },
    { field: 'row_version', hide: true },
    { field: 'LotStatus', hide: true },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      width: 350,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      width: 150,
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      width: 150,
    },
    {
      field: 'LotStatusName',
      headerName: intl.formatMessage({ id: 'semiFqc.LotStatus' }),
      width: 150,
    },
    {
      field: 'MappingOQCDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 200,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'CheckAfterFQC',
      headerName: 'Check',
      width: 100,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleCheckOQC(params.row)}
            sx={{ paddingTop: '1px', paddingBottom: '1px' }}
            disabled={params.row.QCOQCMasterId != null ? false : true}
          >
            {intl.formatMessage({ id: 'WO.Check' })}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (isOpen && WOProcessStaff != null) {
      fetchData();
    }
    return () => (isRendered = false);
  }, [isOpen, WOProcessStaff]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOProcessOQCId: WOProcessStaff.WOProcessId,
      WOProcessStaffOQCId: WOProcessStaff.WOProcessStaffId,
      page: state.page,
      pageSize: state.pageSize,
    };
    const res = await ActualService.getSemiLotOQCList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await ActualService.deleteSemiLotOQC(item);
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
  const handleClose = () => {
    onClose();
  };

  const handleCheckOQC = async (row) => {
    setRowCheck(row);
    toggle();
  };

  const handleCloseCheckOQCDialog = () => {
    toggle();
    fetchData();
  };

  const handleCloseWOSemiLotListWaitOQCDialog = () => {
    toggle2();
    fetchData();
  };

  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={state.isLoading}
      disable_animate={300}
      onClose={handleClose}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <MuiButton text="create" color="success" onClick={() => toggle2()} />
        </Grid>
        <Grid item xs={12}>
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
            getRowId={(rows) => rows.WOSemiLotFQCId}
            onSelectionModelChange={(Ids) => setWOSemiLotFQCId(Ids[0])}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
              if (params.row.LotStatus != '012') return `Mui-finish-data`;
            }}
            initialState={{ pinnedColumns: { right: ['action', 'CheckAfterFQC'], left: ['id', 'WOCode'] } }}
          />
        </Grid>
      </Grid>
      <WOSemiLotListWaitOQCDialog
        initModal={WOProcessStaff}
        isOpen={isShowing2}
        onClose={handleCloseWOSemiLotListWaitOQCDialog}
      />

      <WOSemiCheckOQCDialog RowCheck={RowCheck} isOpen={isShowing} onClose={handleCloseCheckOQCDialog} />
    </MuiDialog>
  );
};

export default WOProcessSemiLotOQCDialog;
