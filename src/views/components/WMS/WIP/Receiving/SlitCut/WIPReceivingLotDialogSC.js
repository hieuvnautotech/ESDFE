import { MuiButton, MuiDataGrid, MuiDialog, MuiTextField } from '@controls';
import { Grid, IconButton } from '@mui/material';
import { MaterialSOService, WIPSOService, wipReceivingService, SlitSOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import DeleteIcon from '@mui/icons-material/Delete';

const WIPReceivingLotDialogSC = ({ isOpen, onClose, fetchDataDetail, SlitSODetailId }) => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const lotInputRef = useRef();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
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
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.MaterialLotId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'MaterialLotId', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 60,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              sx={[{ '&:hover': { border: '1px solid red' } }]}
              disabled={
                (params.row?.AreaCode != 'SLIT' && params.row?.AreaCode != 'WIP') ||
                !params.row?.LotStatus ||
                params.row.WOProcessId != null
              }
              onClick={() => handleDelete(params.row)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        );
      },
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'materialLot.MaterialLotCode' }),
      flex: 0.7,
    },
    {
      field: 'LotStatus',
      headerName: intl.formatMessage({ id: 'materialLot.LotStatus' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? 'Received' : ''),
    },
    {
      field: 'Length',
      headerName: intl.formatMessage({ id: 'materialLot.Length' }),
      flex: 0.3,
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialLot.Width' }),
      flex: 0.3,
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.scannedName' }),
      flex: 0.4,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.scannedDate' }),
      flex: 0.4,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    if (isOpen) fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, isOpen, SlitSODetailId]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      SlitSODetailId: SlitSODetailId,
    };

    const res = await SlitSOService.getSlitSODetailLot(params);

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

    // const res = await MaterialSOService.receivingMaterialSODetailLot({
    //   SlitSODetailId: SlitSODetailId,
    //   MaterialLotCode: lot,
    // });
    const res = await wipReceivingService.scanWIPDetailLot({ SlitSODetailId: SlitSODetailId, MaterialLotCode: lot });

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
  const handleDelete = async (row) => {
    let message = intl.formatMessage({ id: 'general.confirm_delete' });
    if (window.confirm(message)) {
      try {
        let res = await wipReceivingService.deleteScan({
          SlitSODetailId: row.SlitSODetailId,
          MaterialLotId: row.MaterialLotId,
          row_version: row.row_version,
        });
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData();
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
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
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sx={{ mt: 1 }} container direction="row" justifyContent="space-between">
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
            <MuiButton text="scan" color="success" onClick={scanBtnClick} sx={{ marginTop: '1px', ml: 2 }} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
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

export default WIPReceivingLotDialogSC;
