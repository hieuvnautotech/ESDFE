import { MuiButton, MuiDataGrid, MuiDialog, MuiSearchField } from '@controls';
import { Grid } from '@mui/material';
import { ActualService } from '@services';
import { ErrorAlert, SuccessAlert, isNumber } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const WOProcessSemiLotMergeDialog = ({ WOSemiLotFQCId, isOpen, onClose, WOId, setNewData }) => {
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
  }, [state.page, state.pageSize, isOpen]);

  const handleCloseDialog = () => {
    setState({
      isLoading: false,
      data: [],
      totalRow: 0,
      page: 1,
      pageSize: 10,
      searchData: {
        SemiLotCode: '',
      },
    });
    onClose();
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOSemiLotFQCId: WOSemiLotFQCId,
      SemiLotCode: state.searchData.SemiLotCode,
      page: state.page,
      pageSize: state.pageSize,
    };

    const res = await ActualService.getWOSemiLotListReplace(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    setState({ ...state, searchData: { ...newSearchData } });
  };
  const handleRowUpdate = async (newRow) => {
    console.log(newRow);
    if (!isNumber(newRow.AddQty)) {
      newRow.AddQty = null;
    } else {
      newRow.AddQty = newRow.AddQty > 0 ? parseInt(newRow.AddQty) : null;
    }

    if (newRow.AddQty > newRow.ActualQty) {
      ErrorAlert(intl.formatMessage({ id: 'semiFqc.Error_ActualQty' }));
      const index = _.findIndex(state.data, (x) => {
        return x.WOSemiLotFQCId == newRow.WOSemiLotFQCId;
      });
      return state.data[index];
    } else {
      newRow.WOSemiLotFQCIdOutput = WOSemiLotFQCId;
      if (window.confirm(intl.formatMessage({ id: 'general.confirm_modify' }))) {
        const res = await ActualService.createSemiLotReplacement(newRow);
        if (res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          await fetchData();
        } else {
          let textA = res.ResponseMessage.split('|')[0];
          let textB = res.ResponseMessage.split('|')[1] ?? ' ';

          ErrorAlert(intl.formatMessage({ id: textA }) + textB);
        }
      }

      return newRow;
    }
  };
  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotFQCId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOSemiLotFQCId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'WOCode',
      headerName: intl.formatMessage({ id: 'WO.WOCode' }),
      width: 200,
    },
    {
      field: 'SemiLotCode',
      headerName: intl.formatMessage({ id: 'WO.SemiLotCode' }),
      width: 300,
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
      width: 150,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    // {
    //   field: 'AddQty',
    //   headerName: intl.formatMessage({ id: 'semiFqc.AddQty' }),
    //   width: 150,
    //   editable: true,
    // },
  ];
  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({ id: 'semiFqc.semilot' })}
      isOpen={isOpen}
      disabledCloseBtn={false}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container direction="row" justifyContent="space-between" alignItems="width-start" sx={{ mb: 3 }}>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={6}>
              <MuiSearchField
                variant="keyWord"
                label="WO.SemiLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'SemiLotCode')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mr: 3, mt: 1 }} />
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
        getRowId={(rows) => rows.WOSemiLotFQCId}
        onRowClick={(params) => {
          setSelectedRow(params.row);
        }}
        initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode'] } }}
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </MuiDialog>
  );
};

export default WOProcessSemiLotMergeDialog;
