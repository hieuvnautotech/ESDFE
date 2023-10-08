import { useModal, useModal2 } from '@basesShared';
import { CREATE_ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, Paper, Stack } from '@mui/material';
import { MaterialSOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import MaterialDialog from './MaterialDialog';

export default function MaterialSODetail({ MSOId }) {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
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
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
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
      flex: 0.6,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      flex: 0.6,
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
  }, [state.page, state.pageSize, state.searchData.showDelete, MSOId]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.MaterialId == updateData.MaterialId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleAdd = () => {
    setRowData();
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
    ({ row }) => <DetailPanelContent row={row} intl={intl} fetchData={fetchData} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 260, []);

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={3}>
          <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} disabled={MSOId ? false : true} />
        </Grid>
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
        getRowId={(rows) => rows.MaterialId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        detailPanelExpandedRowIds={openDetailIds}
        onDetailPanelExpandedRowIdsChange={(ids) => setOpenDetailIds(ids)}
      />

      <MaterialDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        MSOId={MSOId}
        fetchDataDetail={fetchData}
      />
      {/*
      <BomProcessMaterialDialog MaterialId={MaterialId} isOpen={isShowing2} onClose={toggle2} /> */}
    </React.Fragment>
  );
}

const DetailPanelContent = ({ row: rowProp, intl, fetchData }) => {
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
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDelete(params.row)}
                disabled={params.row.DeliveryScanQty > 0 ? true : false}
              >
                <DeleteIcon fontSize="inherit" />
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
      flex: 0.4,
    },
  ];

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await MaterialSOService.deleteMaterialSODetail(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData(rowProp.MSOId);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchDetailData();
    return () => {
      isDetailRendered = false;
    };
  }, [detailPanelState.page, detailPanelState.pageSize, rowProp]);

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
