import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import { MuiButton, MuiDataGrid, MuiDateField, MuiDialog, MuiSearchField } from '@controls';
import { ErrorAlert, SuccessAlert } from '@utils';
import { Grid, Tooltip, Typography } from '@mui/material';
import { WOService } from '@services';
import { addDays } from '@utils';
import moment from 'moment';
import { useTokenStore } from '@stores';

const MaterialLotCodeDialog = ({ isOpen, dialogState, onClose, setDialogState }) => {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRowSemi, setSelectedRowSemi] = useState();
  const [value, setValue] = React.useState('tab1');
  const WOProcessId = useTokenStore((state) => state.WOProcessId);
  const WOSemiLotMMSId = useTokenStore((state) => state.WOSemiLotMMSId);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    searchData: {
      keyWord: '',
    },
  });
  const [stateSemi, setStateSemi] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    searchData: {
      keyWord: '',
      WOProcessId: WOProcessId,
    },
  });
  //useEffect
  useEffect(() => {
    if (isOpen) {
      if (value == 'tab1') {
        fetchData();
      } else {
        fetchDataSemi();
      }
    }
    return () => (isRendered = false);
  }, [isOpen, value]);
  //useEffect
  useEffect(() => {
    fetchData();
  }, [state.page]);

  useEffect(() => {
    fetchDataSemi();
  }, [stateSemi.page]);
  const handleCloseDialog = () => {
    setState({
      ...state,
      page: 1,
      searchData: {
        keyWord: '',
      },
    });
    setStateSemi({
      ...stateSemi,
      page: 1,
      searchData: {
        keyWord: '',
        WOProcessId: WOProcessId,
      },
    });
    onClose();
    setValue('tab1');
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      MaterialLotCode: state.searchData.keyWord,
    };

    const res = await WOService.getMaterialLotCodeList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  async function fetchDataSemi() {
    setStateSemi({ ...stateSemi, isLoading: true });
    const params = {
      page: stateSemi.page,
      pageSize: stateSemi.pageSize,
      WOProcessId: WOProcessId,
      SemiLotCode: stateSemi.searchData.keyWord,
    };

    const res = await WOService.getSemilotList(params);

    if (res && res.Data && isRendered)
      setStateSemi({
        ...stateSemi,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleRowSelection = (rowSelected) => {
    setSelectedRow({ ...rowSelected });
  };
  const handleRowSelectionSemi = (rowSelected) => {
    setSelectedRowSemi({ ...rowSelected });
  };
  const handleSelectedMaterial = async () => {
    if (selectedRow != null && selectedRow != '') {
      const res = await WOService.createSemiLotDetail({
        WOSemiLotMMSId: WOSemiLotMMSId,
        MaterialLotCode: selectedRow.MaterialLotCode,
        WOProcessId: WOProcessId,
      });
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
      setSelectedRow(null);
      setSelectedRowSemi(null);
      handleCloseDialog();
    } else {
      ErrorAlert(intl.formatMessage({ id: 'general.one_data_at_least' }));
    }
  };
  const handleSelectedSemiLot = async () => {
    if (selectedRowSemi != null && selectedRowSemi != '') {
      const res = await WOService.createSemiLotDetailSemi({
        WOSemiLotMMSId: WOSemiLotMMSId, //Output
        MaterialLotCode: selectedRowSemi.SemiLotCode, //Input
        WOProcessId: WOProcessId,
      });
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setSelectedRow(null);
        setSelectedRowSemi(null);
        handleCloseDialog();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    } else {
      ErrorAlert(intl.formatMessage({ id: 'general.one_data_at_least' }));
    }
  };
  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };
  const handleSearchSemi = (e, inputName) => {
    let newSearchData = { ...stateSemi.searchData };
    newSearchData[inputName] = e;
    setStateSemi({ ...stateSemi, searchData: { ...newSearchData } });
  };
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MaterialLotId', hide: true },
    { field: 'row_version', hide: true },

    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'WO.MaterialLotCode' }),
      width: 380,
    },
    {
      field: 'LotNo',
      headerName: intl.formatMessage({ id: 'IQCReceiving.LotNo' }),
      width: 150,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'IQCReceiving.Width' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'OriginLength',
      headerName: intl.formatMessage({ id: 'IQCReceiving.OriginLength' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'IQCReceiving.Length' }),
      width: 100,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },

    {
      field: 'ExpirationDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ExpirationDate' }),
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
      width: 120,
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'IQCReceiving.ReceivedDate' }),
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
      width: 120,
    },
  ];
  const columnsSemi = [
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
      width: 400,
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.OriginQty' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'ActualQty',
      headerName: intl.formatMessage({ id: 'WO.ActualQty' }),
      width: 120,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
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
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab label="Material Lot Code" value="tab1" />
            <Tab label="Semi Lot" value="tab2" />
          </TabList>
        </Box>
        <TabPanel value="tab1" sx={{ p: 0 }}>
          <Grid container direction="row" justifyContent="space-between" alignItems="width-start" sx={{ mb: 3 }}>
            <Grid item xs>
              <Grid container columnSpacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={4}>
                  <MuiSearchField
                    variant="keyWord"
                    label="WO.MaterialLotCode"
                    onClick={fetchData}
                    onChange={(e) => handleSearch(e.target.value, 'keyWord')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
                  <MuiButton text="selected" color="info" onClick={handleSelectedMaterial} sx={{ mr: 3, mt: 1 }} />
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
            getRowId={(rows) => rows.MaterialLotId}
            onRowClick={(params) => {
              handleRowSelection(params.row);
            }}
            initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'] } }}
          />
        </TabPanel>
        <TabPanel value="tab2" sx={{ p: 0 }}>
          <Grid container direction="row" justifyContent="space-between" alignItems="width-start" sx={{ mb: 3 }}>
            <Grid item xs>
              <Grid container columnSpacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Grid item xs={4}>
                  <MuiSearchField
                    variant="keyWord"
                    label="WO.SemiLotCode"
                    onClick={fetchDataSemi}
                    onChange={(e) => handleSearchSemi(e.target.value, 'keyWord')}
                  />
                </Grid>
                <Grid item xs={4}>
                  <MuiButton text="search" color="info" onClick={fetchDataSemi} sx={{ mr: 3, mt: 1 }} />
                  <MuiButton text="selected" color="info" onClick={handleSelectedSemiLot} sx={{ mr: 3, mt: 1 }} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <MuiDataGrid
            showLoading={stateSemi.isLoading}
            isPagingServer={true}
            headerHeight={45}
            columns={columnsSemi}
            rows={stateSemi.data}
            page={stateSemi.page - 1}
            pageSize={stateSemi.pageSize}
            rowCount={stateSemi.totalRow}
            onPageChange={(newPage) => setStateSemi({ ...stateSemi, page: newPage + 1 })}
            getRowId={(rows) => rows.WOSemiLotMMSId}
            onRowClick={(params) => {
              handleRowSelectionSemi(params.row);
            }}
            initialState={{ pinnedColumns: { left: ['id', 'SemiLotCode'] } }}
          />
        </TabPanel>
      </TabContext>
    </MuiDialog>
  );
};

export default MaterialLotCodeDialog;
