import { MuiButton, MuiDataGrid, MuiDialog, MuiTextField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import { Badge, Button, Grid, IconButton } from '@mui/material';
import { MaterialSOService, IQCReceivingService } from '@services';
import { ErrorAlert, SuccessAlert, PrintMaterial } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const MaterialSCLotDialog = ({ initModal, isOpen, onClose, setNewData, fetchDataDetail, mode, MSODetailId }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const lotInputRef = useRef();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [rowSelected, setRowSelected] = useState([]);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 7,
    searchData: {
      MaterialCode: '',
      ProductCode: '',
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
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
                disabled={params.row.LotStatus}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
    { field: 'MaterialLotId', hide: true },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      flex: 0.7,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialLot.Width' }),
      flex: 0.4,
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'materialLot.Length' }),
      flex: 0.4,
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.scannedName' }),
      flex: 0.4,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.scannedDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    setRowSelected([]);
    if (isOpen) fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen, MSODetailId]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      MSODetailId: MSODetailId,
    };

    const res = await MaterialSOService.getMaterialSODetailLot(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleCloseDialog = () => {
    onClose();
  };

  const handleLotInputChange = (e) => {
    lotInputRef.current.value = e.target.value;
  };

  const keyPress = async (e) => {
    if (e.key === 'Enter') {
      await scanBtnClick();
    }
  };

  const scanBtnClick = async () => {
    const lot = lotInputRef.current.value.trim();

    const res = await MaterialSOService.scanMaterialSODetailLot({ MSODetailId: MSODetailId, MaterialLotCode: lot });

    lotInputRef.current.value = '';
    lotInputRef.current.focus();

    if (res.HttpResponseCode === 200) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      fetchData();
      fetchDataDetail();
      setDialogState({ ...dialogState, isSubmit: false });
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setDialogState({ ...dialogState, isSubmit: false });
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await MaterialSOService.deleteMaterialSODetailLot(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
          fetchDataDetail();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handlePrintLot = async () => {
    const list = await IQCReceivingService.PrintMaterialLot(rowSelected);
    PrintMaterial(list.Data);
  };
  return (
    <MuiDialog
      maxWidth="lg"
      title={intl.formatMessage({ id: 'general.create' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 1 }}>
        <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <MuiTextField
              ref={lotInputRef}
              label="Lot"
              //sx={{ width: '80%' }}
              onChange={handleLotInputChange}
              onKeyDown={keyPress}
            />
          </Grid>
          <Grid item xs={6}>
            <MuiButton text="scan" color="success" onClick={scanBtnClick} sx={{ ml: 2 }} />
            <Badge badgeContent={rowSelected.length} color="success" sx={{ ml: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                disabled={!rowSelected.length > 0}
                sx={{ whiteSpace: 'nowrap' }}
                onClick={handlePrintLot}
              >
                {intl.formatMessage({ id: 'general.print' })}
              </Button>
            </Badge>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <MuiDataGrid
            checkboxSelection
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
            onSelectionModelChange={(ids) => {
              setRowSelected(ids);
            }}
            getRowClassName={(params) => {
              if (params.row?.isSelected) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { right: ['action'] } }}
          />
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

export default MaterialSCLotDialog;
