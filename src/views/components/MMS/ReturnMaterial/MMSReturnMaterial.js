import { MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import { Badge, Button, Grid, Typography } from '@mui/material';
import { MMSReturnMaterialService, SplitMergeService } from '@services';
import { ErrorAlert, PrintMaterial, SuccessAlert, isNumber } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export default function MMSReturnMaterial(props) {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [rowSelectedPrint, setRowSelectedPrint] = useState([]);
  const [rowSelected, setRowSelected] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      MaterialLotCode: '',
    },
  });

  const fetchData = async () => {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      MaterialLotCode: state.searchData.MaterialLotCode,
    };
    const res = await MMSReturnMaterialService.getMaterialList(params);
    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  };

  useEffect(() => {
    return () => {
      isRendered = false;
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [state.page, state.pageSize]);

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({
        ...state,
        page: 1,
        searchData: { ...newSearchData },
      });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  const columns = [
    { field: 'MaterialLotId', headerName: '', hide: true },
    {
      field: 'id',
      headerName: '',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },

    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      width: 500,
    },
    {
      field: 'MaterialLength',
      headerName: intl.formatMessage({ id: 'general.Qty(R/EA)' }),
      width: 150,
      align: 'center',
      renderCell: (params) => {
        return (
          <Typography sx={{ fontSize: 14 }}>{(params.row.Length / params.row.MaterialLength).toFixed(2)}</Typography>
        );
      },
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'IQCReceiving.standard_Length' }),
      description: intl.formatMessage({ id: 'materialSO.OrderQty_tip' }),
      width: 150,
      editable: true,
    },
    {
      field: 'Size',
      headerName: 'Size',
      width: 200,
      renderCell: (params) => {
        return (
          <Typography sx={{ fontSize: 14 }}>
            {params.row.Length}*{params.row.MaterialLength}
          </Typography>
        );
      },
    },
    {
      field: 'createdDate',
      headerName: 'Return Date',
      width: 150,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    {
      field: 'machine',
      headerName: 'Machine',
      width: 300,
    },
    // {
    //   field: 'createdName',
    //   headerName: intl.formatMessage({ id: 'general.createdName' }),
    //   width: 150,
    // },
    // {
    //   field: 'createdDate',
    //   headerName: appRouting.WONo
    //   width: 150,
    //   valueFormatter: (params) => {
    //     if (params.value !== null) {
    //       return moment(params?.value).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
    //     }
    //   },
    // },
    // {
    //   field: 'modifiedName',
    //   headerName: intl.formatMessage({ id: 'general.modifiedName' }),
    //   width: 150,
    // },
    // {
    //   field: 'modifiedDate',
    //   headerName: intl.formatMessage({ id: 'general.modified_date' }),
    //   width: 150,
    //   valueFormatter: (params) => {
    //     if (params.value !== null) {
    //       return moment(params?.value).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
    //     }
    //   },
    // },
  ];
  const handleConfirm = async () => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_save' }))) {
      const res = await MMSReturnMaterialService.confirm(rowSelected);
      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        await fetchData();
        setRowSelected([]);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    }
  };

  const handlePrint = async () => {
    const res = await MMSReturnMaterialService.GetListPrintQR(rowSelectedPrint);
    PrintMaterial(res.Data);
  };

  const handleRowUpdate = async (newRow) => {
    const index = _.findIndex(state.data, (x) => {
      return x.MaterialLotId == newRow.MaterialLotId;
    });

    if (!isNumber(newRow.Length) || newRow.Length <= 0) {
      ErrorAlert(intl.formatMessage({ id: 'general.field_min' }, { min: 1 }));
      return state.data[index];
    } else {
      newRow.Length = newRow.Length > 0 ? parseInt(newRow.Length) : null;
    }

    if (newRow.Length > newRow.OriginLength - 1) {
      ErrorAlert(intl.formatMessage({ id: 'materialLot.Error_OriginLength' }));
      const index = _.findIndex(state.data, (x) => {
        return x.MaterialLotId == newRow.MaterialLotId;
      });
      return state.data[index];
    } else {
      if (window.confirm(intl.formatMessage({ id: 'general.confirm_modify' }))) {
        const res = await MMSReturnMaterialService.editLength(newRow);
        if (res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      }

      return newRow;
    }
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1, pr: 1 }}>
        <Grid item xs={3}>
          <Badge badgeContent={rowSelected.length} color="success">
            <Button
              disabled={!rowSelected.length > 0}
              variant="contained"
              color="success"
              onClick={handleConfirm}
              sx={{ mt: 1 }}
            >
              Confirm
            </Button>
          </Badge>
          <Badge badgeContent={rowSelectedPrint.length} color="success">
            <Button
              variant="contained"
              color="secondary"
              disabled={!rowSelected.length > 0}
              sx={{ whiteSpace: 'nowrap', mt: 1, ml: 2 }}
              onClick={handlePrint}
            >
              {intl.formatMessage({ id: 'general.print' })}
            </Button>
          </Badge>
        </Grid>
        <Grid item xs>
          <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
            <Grid item style={{ width: '30%' }}>
              <MuiSearchField
                fullWidth
                disabled={state.isLoading}
                size="small"
                label="IQCReceiving.MaterialLotCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialLotCode')}
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} sx={{ mt: 0 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <MuiDataGrid
        checkboxSelection
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={45}
        className="hidden-checkbox-all"
        // rowHeight={30}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        // rowsPerPageOptions={[5, 10, 20, 30]}
        onSelectionModelChange={(ids) => {
          setRowSelectedPrint(ids);
        }}
        disableRowSelectionOnClick
        onCellClick={(row) => {
          const checkContain = rowSelected.find((i) => i.MaterialLotId === row.id);
          if (checkContain?.MaterialLotId > 0) {
            const arrayFilter = rowSelected.filter((item) => item.MaterialLotId !== checkContain?.MaterialLotId);
            setRowSelected(arrayFilter);
          } else {
            // !checkContain?.MaterialLotId > 0 &&
            setRowSelected([
              ...rowSelected,
              { MaterialLotId: row.row?.MaterialLotId, row_version: row.row?.row_version },
            ]);
          }
        }}
        onPageChange={(newPage) => {
          setState({ ...state, page: newPage + 1 });
        }}
        getRowId={(rows) => rows.MaterialLotId}
        getRowClassName={(params) => {
          //   if (_.isEqual(params.row, deleteData)) return `Mui-deleted-data`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  );
}
