import { MuiButton, MuiDataGrid, MuiDialog, MuiSearchField } from '@controls';
import { Grid } from '@mui/material';
import { ActualService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const WOProcessSemiLotDetailOQCDialog = ({ WOSemiLotFQCId, isOpen, onClose, WOId, setNewData }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    searchData: {
      SemiLotCode: '',
    },
  });

  //useEffect
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
    return () => (isRendered = false);
  }, [isOpen]);

  const handleCloseDialog = () => {
    onClose();
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOId: WOId,
      SemiLotCode: state.searchData.SemiLotCode,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await ActualService.getWOSemiLot(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleSelectedMaterial = async () => {
    if (selectedRow != null && selectedRow) {
      if (window.confirm(intl.formatMessage({ id: 'general.confirm_create' }))) {
        try {
          const res = await ActualService.createSemiLotDetail({
            WOSemiLotFQCId: WOSemiLotFQCId,
            MaterialLotCode: selectedRow?.SemiLotCode,
          });
          if (res.HttpResponseCode === 200 && res.Data) {
            SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
            setNewData({ ...res.Data });
            onClose();
          } else {
            ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotMMSId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOSemiLotMMSId', hide: true },
    { field: 'row_version', hide: true },

    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 0.6,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      flex: 0.3,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];
  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({ id: 'menu.material' })}
      isOpen={isOpen}
      disabledCloseBtn={false}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container direction="row" justifyContent="space-between" alignItems="width-start" sx={{ mb: 3 }}>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item>
              <MuiSearchField
                variant="keyWord"
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
              <MuiButton
                text="create"
                color="success"
                onClick={handleSelectedMaterial}
                sx={{ mr: 3, mt: 1 }}
                disabled={selectedRow == null ? true : false}
              />
            </Grid>
          </Grid>
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
        getRowId={(rows) => rows.WOSemiLotMMSId}
        onRowClick={(params) => {
          setSelectedRow(params.row);
        }}
        initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'] } }}
      />
    </MuiDialog>
  );
};

export default WOProcessSemiLotDetailOQCDialog;
