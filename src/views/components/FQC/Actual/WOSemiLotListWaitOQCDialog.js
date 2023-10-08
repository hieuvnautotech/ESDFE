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
import { ActualService } from '@services';
import { addDays } from '@utils';
import moment from 'moment';
import { useTokenStore } from '@stores';

const WOSemiLotListWaitOQCDialog = ({ initModal, isOpen, dialogState, onClose, setDialogState }) => {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRowSemi, setSelectedRowSemi] = useState();

  const [stateSemi, setStateSemi] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    searchData: {
      keyWord: '',
      WOProcessId: initModal?.WOProcessId,
    },
  });
  //useEffect
  useEffect(() => {
    if (isOpen) {
      fetchDataSemi();
    }
    return () => (isRendered = false);
  }, [isOpen]);

  const handleCloseDialog = () => {
    onClose();
  };

  async function fetchDataSemi() {
    setStateSemi({ ...stateSemi, isLoading: true });
    const params = {
      page: stateSemi.page,
      pageSize: stateSemi.pageSize,
      WOProcessId: initModal?.WOProcessId,
      SemiLotCode: stateSemi.searchData.keyWord,
    };

    const res = await ActualService.getSemilotWaitOQCList(params);

    if (res && res.Data && isRendered)
      setStateSemi({
        ...stateSemi,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleRowSelectionSemi = (rowSelected) => {
    setSelectedRowSemi({ ...rowSelected });
  };
  const handleSelectedSemiLot = async () => {
    if (selectedRowSemi != null && selectedRowSemi != '') {
      const res = await ActualService.createSemiLotWaitOQC({
        SemiLotCode: selectedRowSemi.SemiLotCode, //Input
        WOProcessId: initModal?.WOProcessId,
        WOProcessStaffOQCId: initModal?.WOProcessStaffId,
        row_version: selectedRowSemi.row_version,
      });
      if (res.HttpResponseCode === 200 && res.Data) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        // setNewData({ ...res.Data });
        onClose();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    } else {
      ErrorAlert(intl.formatMessage({ id: 'general.one_data_at_least' }));
    }
  };
  const handleSearchSemi = (e, inputName) => {
    let newSearchData = { ...stateSemi.searchData };
    newSearchData[inputName] = e;
    setStateSemi({ ...stateSemi, searchData: { ...newSearchData } });
  };
  const columnsSemi = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (stateSemi.page - 1) * stateSemi.pageSize,
    },
    { field: 'WOSemiLotFQCId', hide: true },
    { field: 'row_version', hide: true },

    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      flex: 1,
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
      title={intl.formatMessage({ id: 'WO.SemiLotCode' })}
      isOpen={isOpen}
      disabledCloseBtn={false}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
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
        getRowId={(rows) => rows.WOSemiLotFQCId}
        onRowClick={(params) => {
          handleRowSelectionSemi(params.row);
        }}
        initialState={{ pinnedColumns: { left: ['id', 'SemiLotCode'] } }}
      />
    </MuiDialog>
  );
};

export default WOSemiLotListWaitOQCDialog;
