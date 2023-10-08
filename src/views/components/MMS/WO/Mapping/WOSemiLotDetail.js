import { useModal, useModal2, useModal3 } from '@basesShared';
import { MuiButton, MuiDataGrid } from '@controls';
import { Button, Grid, ButtonGroup } from '@mui/material';
import { WOService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import MaterialLotCodeDialog from './MaterialLotCodeDialog';
import WOSemiLotRemainDialog from './WOSemiLotRemainDialog';
import { useTokenStore } from '@stores';

export default function WOSemiLotDetail() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [rowDataWOSemiLotDetail, setRowDataWOSemiLotDetail] = useState({});
  const WOProcessId = useTokenStore((state) => state.WOProcessId);
  const WOSemiLotMMSId = useTokenStore((state) => state.WOSemiLotMMSId);

  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 6,
    searchData: {
      keyWord: '',
      ProcessId: null,
      showDelete: true,
    },
  });
  const defaultValue = {
    WOSemiLotMMSId: WOSemiLotMMSId,
    MaterialLotCode: '',
  };
  const [newData, setNewData] = useState({});

  const formik = useFormik({
    initialValues: defaultValue,
    enableReinitialize: true,
    onSubmit: async (values) => onSubmit(values),
  });

  const { handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, resetForm } = formik;
  const onSubmit = async (data) => {
    const res = await WOService.createSemiLotDetail({
      ...data,
      MaterialLotCode: selectedRowMaterial?.MaterialLotCode,
      WOProcessId: WOProcessId,
    });
    if (res.HttpResponseCode === 200 && res.Data) {
      SuccessAlert(intl.formatMessage({ id: res.ResponseMessage }));
      setNewData({ ...res.Data });
    } else {
      ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
    }
  };
  const handleDelete = async (item) => {
    if (window.confirm(intl.formatMessage({ id: 'general.confirm_delete' }))) {
      try {
        let res = await WOService.deleteSemiLotDetail({ ...item, WOProcessId: WOProcessId });
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
  const handleFinish = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.IsFinish ? 'general.confirm_unfinish' : 'general.confirm_finish',
        })
      )
    ) {
      try {
        let res = await WOService.finishSemiLotDetail(item);
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
  const handleReturn = async (item) => {
    setRowDataWOSemiLotDetail(item);
    toggle2();
  };
  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 50,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.WOSemiLotDetailId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'WOSemiLotDetailId', hide: true },
    { field: 'WOSemiLotMMSId', hide: true },
    { field: 'row_version', hide: true },
    {
      field: 'action',
      headerName: '',
      width: 150,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <ButtonGroup variant="contained" aria-label="outlined button group">
                <Button
                  aria-label="edit"
                  color="success"
                  sx={{ mr: 1 }}
                  size="small"
                  onClick={() => handleFinish(params.row)}
                >
                  {params.row.IsFinish ? 'UF' : 'F'}
                </Button>
                <Button
                  aria-label="edit"
                  color="warning"
                  size="small"
                  sx={{ mr: 1, BorderRight: '0px !important' }}
                  disabled={params?.row?.MaterialType != 'NVL'}
                  onClick={() => handleReturn(params.row)}
                >
                  R
                </Button>
                <Button aria-label="edit" color="error" size="small" onClick={() => handleDelete(params.row)}>
                  D
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        );
      },
    },
    {
      field: 'MaterialLotCode',
      headerName: intl.formatMessage({ id: 'WO.MaterialLotCode' }),
      width: 400,
    },
    {
      field: 'MappingDate',
      headerName: intl.formatMessage({ id: 'WO.timeMapping' }),
      width: 180,
      textAlign: 'center',
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'OriginQty',
      headerName: intl.formatMessage({ id: 'WO.Total' }),
      width: 90,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },

    {
      field: 'UsedQty',
      headerName: intl.formatMessage({ id: 'WO.Used' }),
      width: 90,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'RemainQty',
      headerName: intl.formatMessage({ id: 'WO.Remain' }),
      width: 90,
      valueFormatter: (params) => (params?.value ? Number(params?.value).toLocaleString() : 0),
    },
    {
      field: 'IsFinish',
      headerName: intl.formatMessage({ id: 'WO.Using' }),
      width: 90,
      renderCell: (params) => {
        if (params.row.IsFinish) {
          return <div>{intl.formatMessage({ id: 'WO.No' })}</div>;
        } else {
          return <div>{intl.formatMessage({ id: 'WO.Yes' })}</div>;
        }
      },
    },
  ];

  //useEffect
  useEffect(() => {
    if (WOSemiLotMMSId) {
      fetchData();
    }
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete, WOSemiLotMMSId]);

  useEffect(() => {
    if (!_.isEmpty(newData)) {
      const data = [newData, ...state.data];
      if (data.length > state.pageSize) {
        data.pop();
      }
      setState({
        ...state,
        data: [...data],
        totalRow: state.totalRow + 1,
      });
    }
  }, [newData]);

  async function fetchData() {
    setState({ ...state, isLoading: true });
    const params = {
      WOSemiLotMMSId: WOSemiLotMMSId,
      page: state.page,
      pageSize: state.pageSize,
    };
    const res = await WOService.getWOSemiLotDetail(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }
  const handleCloseMaterialLotCodeDialog = () => {
    toggle();
    fetchData();
  };
  const handleCloseReturn = () => {
    toggle2();
    fetchData();
  };
  return (
    <React.Fragment>
      <Grid sx={{ mt: 3 }} />
      {/* <form onSubmit={handleSubmit}> */}
      <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* <Grid item xs={6}>
          <MuiSearchInput
            disabled={true}
            sx={{ width: 210 }}
            fullWidth
            size="small"
            name="MaterialLotCode"
            label="WO.MaterialLotCode"
            onClick={() => toggle()}
            value={selectedRowMaterial?.MaterialLotCode}
            error={touched.MaterialLotCode && Boolean(errors.MaterialLotCode)}
            helperText={touched.MaterialLotCode && errors.MaterialLotCode}
          />
        </Grid> */}
        <Grid item xs={6}>
          <MuiButton
            text="create"
            onClick={() => toggle()}
            color="success"
            sx={{ mt: 1 }}
            disabled={WOSemiLotMMSId == null}
          />
          {/* <MuiSubmitButton text="save" /> */}
        </Grid>
      </Grid>
      {/* </form> */}
      <MuiDataGrid
        showLoading={state.isLoading}
        isPagingServer={true}
        headerHeight={35}
        columns={columns}
        rows={state.data}
        page={state.page - 1}
        pageSize={state.pageSize}
        rowCount={state.totalRow}
        onPageChange={(newPage) => setState({ ...state, page: newPage + 1 })}
        getRowId={(rows) => rows.WOSemiLotDetailId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
          if (params.row.IsFinish) return `Mui-finish-data`;
        }}
        initialState={{ pinnedColumns: { left: ['id', 'MaterialLotCode', 'MappingDate'], right: ['action'] } }}
      />
      <MaterialLotCodeDialog isOpen={isShowing} onClose={handleCloseMaterialLotCodeDialog} />
      <WOSemiLotRemainDialog initModal={rowDataWOSemiLotDetail} isOpen={isShowing2} onClose={handleCloseReturn} />
    </React.Fragment>
  );
}
