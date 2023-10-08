import { useModal, useModal2 } from '@basesShared';
import { MuiDataGrid } from '@controls';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Grid, IconButton, Paper, Stack } from '@mui/material';
import { MaterialSOService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import MaterialSCLotDialog from './MaterialSCLotDialog';

export default function MaterialSCDetail({ MSOId }) {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      keyWord: '',
      ProcessId: null,
      showDelete: true,
    },
  });
  const [MSODetailId, setMSODetailId] = useState(null);
  const [openDetailIds, setOpenDetailIds] = useState([]);

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
    { field: 'MSOId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'materialSO.MaterialId' }),
      flex: 0.5,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      flex: 0.5,
    },
    {
      field: 'LengthOrEA',
      headerName: intl.formatMessage({ id: 'materialSO.LengthOrEA' }),
      flex: 0.5,
    },
    {
      field: 'OrderQty',
      headerName: intl.formatMessage({ id: 'materialSO.OrderQty' }),
      flex: 0.5,
    },
    {
      field: 'DeliveryScanQty',
      headerName: intl.formatMessage({ id: 'materialSO.DeliveryScanQty' }),
      flex: 0.4,
    },
    {
      field: 'WattingDeliveryQty',
      headerName: intl.formatMessage({ id: 'materialSO.WattingDeliveryQty' }),
      flex: 0.4,
    },
    {
      field: 'ReceivedQty',
      headerName: intl.formatMessage({ id: 'materialSO.ReceivedQty' }),
      flex: 0.4,
    },
    {
      field: 'WattingReceivedQty',
      headerName: intl.formatMessage({ id: 'materialSO.WattingReceivedQty' }),
      flex: 0.4,
    },
  ];

  //useEffect
  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete, MSOId, isShowing2]);

  //handle
  const handleScan = (MSODetailId) => {
    setMSODetailId(MSODetailId);
    toggle();
  };

  async function fetchData(Id) {
    setOpenDetailIds([]);
    setState({ ...state, isLoading: true });
    const params = {
      MSOId: Id ?? MSOId,
      page: state.page,
      pageSize: state.pageSize,
      isActived: state.searchData.showDelete,
    };

    const res = await MaterialSOService.getMaterialSODetail(params);

    if (res)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} intl={intl} handleScan={handleScan} isShowing={isShowing2} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 260, []);

  return (
    <React.Fragment>
      <Grid sx={{ mt: 3 }}>
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
          getRowId={(rows) => rows.MaterialId}
          initialState={{ pinnedColumns: { right: ['action'] } }}
          rowThreshold={0}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
          detailPanelExpandedRowIds={openDetailIds}
          onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
        />
      </Grid>

      <MaterialSCLotDialog isOpen={isShowing} onClose={toggle} MSODetailId={MSODetailId} fetchDataDetail={toggle2} />
    </React.Fragment>
  );
}

const DetailPanelContent = ({ row: rowProp, intl, isShowing, handleScan }) => {
  let isDetailRendered = useRef(true);

  const [detailPanelState, setDetailPanelState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 5,
    MSOId: rowProp.MSOId,
    MaterialId: rowProp.MaterialId,
  });

  const fetchDetailData = async () => {
    if (isDetailRendered) {
      setDetailPanelState({ ...detailPanelState, isLoading: true });
      const params = {
        page: detailPanelState.page,
        pageSize: detailPanelState.pageSize,
        MSOId: detailPanelState.MSOId,
        MaterialId: detailPanelState.MaterialId,
      };

      const res = await MaterialSOService.getMaterialSODetailHistory(params);

      setDetailPanelState({
        ...detailPanelState,
        data: !res.Data ? [] : [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
    }
  };

  const detailPanelColumns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.MSODetailId) + 1 + (detailPanelState.page - 1) * detailPanelState.pageSize,
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
                color="success"
                size="small"
                sx={[{ '&:hover': { border: '1px solid green' } }]}
                onClick={() => handleScan(params.row.MSODetailId)}
              >
                <QrCodeIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      flex: 0.5,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'LengthOrEA',
      headerName: intl.formatMessage({ id: 'materialSO.LengthOrEA' }),
      flex: 0.5,
    },
    {
      field: 'OrderQty',
      headerName: intl.formatMessage({ id: 'materialSO.OrderQty' }),
      flex: 0.5,
    },
    {
      field: 'DeliveryScanQty',
      headerName: intl.formatMessage({ id: 'materialSO.DeliveryScanQty' }),
      flex: 0.4,
    },
    {
      field: 'WattingDeliveryQty',
      headerName: intl.formatMessage({ id: 'materialSO.WattingDeliveryQty' }),
      flex: 0.4,
    },
    {
      field: 'ReceivedQty',
      headerName: intl.formatMessage({ id: 'materialSO.ReceivedQty' }),
      flex: 0.4,
    },
    {
      field: 'WattingReceivedQty',
      headerName: intl.formatMessage({ id: 'materialSO.WattingReceivedQty' }),
      flex: 0.4,
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      flex: 0.5,
    },
  ];

  useEffect(() => {
    fetchDetailData();
    return () => {
      isDetailRendered = false;
    };
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp, isShowing]);

  return (
    <Stack sx={{ py: 2, height: '100%', boxSizing: 'border-box', p: 0, paddingLeft: '50px' }} direction="column">
      <Paper sx={{ flex: 1, mx: 'auto', width: '100%', p: 0 }}>
        <MuiDataGrid
          showLoading={detailPanelState.isLoading}
          isPagingServer={true}
          headerHeight={35}
          columns={detailPanelColumns}
          rows={detailPanelState.data}
          page={detailPanelState.page - 1}
          pageSize={detailPanelState.pageSize}
          rowCount={detailPanelState.totalRow}
          onPageChange={(newPage) => setDetailPanelState({ ...detailPanelState, page: newPage + 1 })}
          getRowId={(rows) => rows.MSODetailId}
          initialState={{ pinnedColumns: { right: ['action'] } }}
        />
      </Paper>
    </Stack>
  );
};
