import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDialog, MuiResetButton, MuiTextField } from '@controls';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, TextField } from '@mui/material';
import { SlitOrderService, SplitSizeService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const SplitSizeDialog = ({ isOpen, onClose, fetchData }) => {
  const intl = useIntl();
  const lotInputRef = useRef();
  const [dialogState, setDialogState] = useState({ isSubmit: false });
  const [lotSplit, setLotSplit] = useState({ MaterialLotId: null, Width: 0, Length: 0, ActualWidth: 0 });
  const [SplitList, setSplitList] = useState([]);

  const columns = [
    { field: 'index', headerName: '', flex: 0.3, hide: true },
    {
      field: 'id',
      headerName: '',
      align: 'center',
      width: 40,
      filterable: false,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: (params) => <AddIcon onClick={handleAddRow} />,
      renderCell: (index) => index.api.getRowIndex(index.row.index) + 1,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'WO.ProductCode' }),
      flex: 0.5,

      renderCell: (params) => {
        return (
          <MuiAutocomplete
            value={
              params.row.ProductId ? { ProductId: params.row.ProductId, ProductCode: params.row.ProductCode } : null
            }
            label={intl.formatMessage({ id: 'product.product_code' })}
            fetchDataFunc={SlitOrderService.getProductList}
            displayLabel="ProductCode"
            displayValue="ProductId"
            onChange={(e, value) => {
              handleChangeRowProduct(params.row, value);
            }}
          />
        );
      },
    },
    {
      field: 'Width',
      headerName: intl.formatMessage({ id: 'materialLot.Width' }),
      flex: 0.5,
      renderCell: (params) => {
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            value={params.row.Width}
            onChange={(e) => handleChangeRowWidth(params.row, e.target.value)}
            label={intl.formatMessage({ id: 'slitOrder.OriginWidth' })}
          />
        );
      },
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
                onClick={() => handleDeleteRow(params.row)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  const handleReset = () => {
    setLotSplit({ Width: 0, Length: 0, ActualWidth: 0 });
    setSplitList([]);
    lotInputRef.current.value = '';
    lotInputRef.current.focus();
  };

  const handleCloseDialog = () => {
    handleReset();
    onClose();
  };

  const handleAddRow = () => {
    const randomNum = Math.floor(Math.random() * 5000) + 1;

    setSplitList([...SplitList, { index: randomNum, ProductId: null, ProductCode: '', Width: 0 }]);
  };

  const handleDeleteRow = (row) => {
    let data = SplitList.filter((x) => x.index != row.index);
    setSplitList(data);
  };

  const handleChangeRowWidth = (row, value) => {
    if (value >= 0) {
      var newArr = [...SplitList];
      const index = _.findIndex(newArr, function (o) {
        return o.index == row.index;
      });
      if (index !== -1) {
        newArr[index].Width = value;

        let total = 0;
        newArr.forEach((item) => {
          total = total + Number(item?.Width);
        });

        if (total > lotSplit.Width) {
          ErrorAlert(intl.formatMessage({ id: 'slitOrder.width_notEnough' }));
        } else {
          let remain = lotSplit.Width - total;
          setLotSplit({ ...lotSplit, ActualWidth: remain });
          setSplitList(newArr);
        }
      }
    }
  };

  const handleChangeRowProduct = (row, value) => {
    let newArr = [...SplitList];
    const index = _.findIndex(newArr, function (o) {
      return o.index == row.index;
    });
    if (index !== -1) {
      newArr[index].ProductId = value?.ProductId ?? null;
      newArr[index].ProductCode = value?.ProductCodeTemp ?? null;
    }

    setSplitList(newArr);
  };

  const onSubmit = async () => {
    let total = 0;
    let error = null;
    SplitList.forEach((item) => {
      if (item.ProductId == null) {
        error = 1;
        return;
      }
      if (Number(item.Width) == 0) {
        error = 2;
        return;
      }
      total = total + Number(item?.Width);
    });
    if (error == 1) {
      ErrorAlert(intl.formatMessage({ id: 'product.productCode_required' }));
    } else if (error == 2) {
      ErrorAlert(intl.formatMessage({ id: 'mold.min_value' }));
    } else if (total > lotSplit.Width) {
      ErrorAlert(intl.formatMessage({ id: 'slitOrder.width_notEnough' }));
    } else {
      setDialogState({ ...dialogState, isSubmit: true });
      const res = await SplitSizeService.split(lotSplit.MaterialLotId, SplitList);

      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        fetchData();
        setDialogState({ ...dialogState, isSubmit: false });
        handleReset();
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setDialogState({ ...dialogState, isSubmit: false });
      }
    }
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

    if (lot !== '') {
      const res = await SplitSizeService.scanCode(lot);

      if (res.HttpResponseCode === 200) {
        SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
        setLotSplit({
          ...lotSplit,
          Width: res.Data.Width,
          Length: res.Data.Length,
          ActualWidth: res.Data.Width,
          MaterialLotId: res.Data.MaterialLotId,
        });
        setSplitList([]);
      } else {
        ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
      }
    }
  };

  return (
    <MuiDialog
      maxWidth="md"
      title={intl.formatMessage({ id: 'general.split' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item container direction="row" xs={12}>
          <Grid item>
            <MuiTextField
              size="small"
              ref={lotInputRef}
              sx={{ mt: 1, width: 350 }}
              onChange={handleLotInputChange}
              onKeyDown={keyPress}
              label={intl.formatMessage({ id: 'WO.MaterialLotCode' })}
            />
          </Grid>
          <Grid item>
            <MuiButton text="scan" color="info" onClick={scanBtnClick} sx={{ ml: 1, mr: 1, marginTop: '10px' }} />
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            disabled={true}
            value={lotSplit.Width}
            label={intl.formatMessage({ id: 'slitOrder.OriginWidth' })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            disabled={true}
            value={lotSplit.Length}
            label={intl.formatMessage({ id: 'slitOrder.OriginLength' })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            disabled={true}
            value={SplitList.length}
            label={intl.formatMessage({ id: 'actual.Qty' })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            disabled={true}
            value={lotSplit.ActualWidth}
            label={intl.formatMessage({ id: 'material.Width' })}
          />
        </Grid>

        <Grid item xs={12}>
          <MuiDataGrid
            isPagingServer={true}
            headerHeight={40}
            rowHeight={55}
            columns={columns}
            gridHeight={320}
            rows={SplitList}
            pageSize={8}
            getRowId={(rows) => rows.index}
            hideFooter
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row-reverse">
            <MuiButton onClick={onSubmit} text="save" loading={dialogState.isSubmit} />
            <MuiResetButton onClick={handleReset} disabled={dialogState.isSubmit} />
          </Grid>
        </Grid>
      </Grid>
    </MuiDialog>
  );
};

export default SplitSizeDialog;
