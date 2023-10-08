import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { MuiButton, MuiDataGrid, MuiDateField, MuiDialog, MuiSearchField } from '@controls';
import { Grid, Tooltip, Typography } from '@mui/material';
import { IQCReceivingService } from '@services';
import { addDays } from '@utils';
import moment from 'moment';

const MaterialDialog = ({ isOpen, dialogState, onClose, setDialogState, setMaterialSelected }) => {
  const intl = useIntl();
  const date = new Date();
  let isRendered = useRef(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 10,
    searchData: {
      keyWord: '',
      showDelete: true,
      StartDate: null,
      EndDate: null,
    },
  });
  //useEffect
  useEffect(() => {
    if (isOpen) {
      fetchData();
      setMaterialSelected('');
    }
    return () => (isRendered = false);
  }, [isOpen, state.page]);

  const handleCloseDialog = () => {
    setState({
      isLoading: false,
      data: [],
      totalRow: 0,
      page: 1,
      pageSize: 10,
      searchData: {
        keyWord: '',
        MaterialCode: '',
        showDelete: true,
      },
    });
    if (selectedRow == null) {
      setMaterialSelected({ MaterialCode: '' });
    }
    setSelectedRow(null);
    onClose();
  };

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      POOrderCode: state.searchData.keyWord,
      MaterialCode: state.searchData.MaterialCode,
      isActived: state.searchData.showDelete,
    };

    const res = await IQCReceivingService.getPOList(params);

    if (res && res.Data && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleRowSelection = (rowSelected) => {
    setSelectedRow({ ...rowSelected });
  };
  const handleSelectedMaterial = () => {
    setMaterialSelected(selectedRow);
    if (selectedRow != null && selectedRow != '') {
      handleCloseDialog();
    } else {
      alert('vui long chon 1 material');
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
      align: 'center',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.POId) + 1 + (state.page - 1) * state.pageSize,
    },
    {
      field: 'POOrderCode',
      headerName: intl.formatMessage({ id: 'PO.POOrderCode' }),
      width: '180',
    },
    {
      field: 'PONumber',
      headerName: intl.formatMessage({ id: 'PO.PONumber' }),
      width: '120',
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'PO.MaterialCode' }),
      width: '180',
    },
    {
      field: 'MaterialUnit',
      headerName: intl.formatMessage({ id: 'PO.MaterialUnit' }),
      width: '100',
    },
    {
      field: 'Qty',
      headerName: intl.formatMessage({ id: 'PO.Qty' }),
      width: '100',
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'PO.Width' }),
      width: '100',
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'PO.Length' }),
      width: '100',
    },
    {
      field: 'QuantityRoll',
      headerName: intl.formatMessage({ id: 'PO.QuantityRoll' }),
      width: '100',
    },
    {
      field: 'SupplierCode',
      headerName: intl.formatMessage({ id: 'PO.SupplierCode' }),
      width: '100',
    },
    {
      field: 'PODATE',
      headerName: intl.formatMessage({ id: 'PO.PODate' }),
      width: '100',
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD');
        }
      },
    },
    {
      field: 'DeliveryDate',
      headerName: intl.formatMessage({ id: 'PO.DeliveryDate' }),
      width: '100',
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD');
        }
      },
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
                label="PO.POOrderCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'keyWord')}
              />
            </Grid>
            <Grid item>
              <MuiSearchField
                variant="keyWord"
                label="PO.MaterialCode"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'MaterialCode')}
              />
            </Grid>

            <Grid item>
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
        getRowId={(rows) => rows.POId}
        onRowClick={(params) => {
          handleRowSelection(params.row);
        }}
        initialState={{ pinnedColumns: { left: ['id', 'POOrderCode', 'PONumber', 'MaterialCode'], right: ['action'] } }}
      />
    </MuiDialog>
  );
};

export default MaterialDialog;
