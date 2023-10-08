import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton } from '@mui/material';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { POService } from '@services';
import { ErrorAlert, SuccessAlert, minusDays } from '@utils';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

const PO = memo((props) => {
  let isRendered = useRef(true);
  const intl = useIntl();
  const initETDLoad = new Date();
  const [newData, setNewData] = useState({});
  const [data, setData] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      searchStartDay: null,
      searchEndDay: null,
      POOrderCode: '',
    },
  });

  const fetchData = async () => {
    setData({ ...data, isLoading: true });

    const params = {
      page: data.page,
      pageSize: data.pageSize,
      searchStartDay: data.searchData.searchStartDay,
      searchEndDay: data.searchData.searchEndDay,
      POOrderCode: data.searchData.POOrderCode,
    };

    const res = await POService.get(params);
    if (res && isRendered)
      setData({
        ...data,
        data: !res.Data ? [] : [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  };

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [data.page, data.pageSize]);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 80,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.POId) + 1 + (data.page - 1) * data.pageSize,
    },
    {
      field: 'POOrderCode',
      headerName: intl.formatMessage({ id: 'PO.POOrderCode' }),
      width: 125,
    },
    {
      field: 'MaterialCode',
      headerName: intl.formatMessage({ id: 'PO.MaterialCode' }),
      width: 140,
    },
    {
      field: 'MaterialName',
      headerName: intl.formatMessage({ id: 'material.MaterialName' }),
      width: 150,
    },
    {
      field: 'MaterialUnit',
      headerName: intl.formatMessage({ id: 'PO.MaterialUnit' }),
      width: 120,
    },
    {
      field: 'Qty',
      headerName: intl.formatMessage({ id: 'PO.Qty' }),
      width: 90,
    },
    {
      field: 'QuantityRoll',
      headerName: intl.formatMessage({ id: 'PO.QuantityRoll' }),
      width: 140,
    },
    {
      field: 'ActualQtyRoll',
      headerName: intl.formatMessage({ id: 'PO.QtyReceived' }),
      width: 120,
    },
    {
      field: 'QtyRemain',
      headerName: intl.formatMessage({ id: 'PO.QtyRemain' }),
      width: 140,
      renderCell: (params) => {
        return params.row?.QuantityRoll - params.row?.ActualQtyRoll;
      },
    },
    {
      field: 'Status',
      headerName: intl.formatMessage({ id: 'general.status' }),
      width: 120,
      renderCell: (params) => {
        if (params.row?.ActualQtyRoll === 0) {
          return <span>{intl.formatMessage({ id: 'general.notyet' })}</span>;
        }
        if (params.row?.ActualQtyRoll > 0 && params.row?.ActualQtyRoll < params?.row?.QuantityRoll) {
          return <span>{intl.formatMessage({ id: 'general.waiting' })}</span>;
        }
        if (params.row?.ActualQtyRoll >= params?.row?.QuantityRoll) {
          return <span>{intl.formatMessage({ id: 'general.finished' })}</span>;
        }
      },
    },
    {
      field: 'SupplierCode',
      headerName: intl.formatMessage({ id: 'PO.SupplierCode' }),
      width: 120,
    },
    {
      field: 'ReceivedDate',
      headerName: intl.formatMessage({ id: 'materialLot.ReceivedDate' }),
      width: 120,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD');
        }
      },
    },
    {
      field: 'PODATE',
      headerName: intl.formatMessage({ id: 'PO.PODate' }),
      width: 120,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD');
        }
      },
    },
    {
      field: 'DeliveryDate',
      headerName: intl.formatMessage({ id: 'PO.DeliveryDate' }),
      width: 120,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD');
        }
      },
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      width: 120,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.createdDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'general.modifiedName' }),
      width: 120,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...data.searchData };
    newSearchData[inputName] = e;
    setData({ ...data, searchData: { ...newSearchData } });
  };

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
        <Grid item>
          <MuiSearchField
            label="PO.POOrderCode"
            onClick={fetchData}
            onChange={(e) => handleSearch(e.target.value, 'POOrderCode')}
          />
        </Grid>
        <Grid item>
          <MuiDateField
            disabled={data.isLoading}
            label="From Delivery Date"
            value={data.searchData.searchStartDay}
            onChange={(e) => {
              handleSearch(e ? moment(e).format('YYYY-MM-DD') : null, 'searchStartDay');
            }}
            variant="standard"
          />
        </Grid>
        <Grid item>
          <MuiDateField
            disabled={data.isLoading}
            label="To Delivery Date"
            value={data.searchData.searchEndDay}
            onChange={(e) => {
              handleSearch(e ? moment(e).format('YYYY-MM-DD') : null, 'searchEndDay');
            }}
            variant="standard"
          />
        </Grid>
        <Grid item>
          <MuiButton text="search" color="info" onClick={fetchData} />
        </Grid>
      </Grid>

      <MuiDataGrid
        showLoading={data.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={data.data}
        page={data.page - 1}
        pageSize={data.pageSize}
        rowCount={data.totalRow}
        rowsPerPageOptions={[5, 10, 15, 20]}
        onPageChange={(newPage) => {
          setData({ ...data, page: newPage + 1 });
        }}
        getRowId={(rows) => rows.POId}
        getRowClassName={(params) => {
          if (_.isEqual(params.row, newData)) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
    </React.Fragment>
  );
});

User_Operations.toString = function () {
  return 'User_Operations';
};

const mapStateToProps = (state) => {
  const {
    User_Reducer: { language },
  } = CombineStateToProps(state.AppReducer, [[Store.User_Reducer]]);

  return { language };
};

const mapDispatchToProps = (dispatch) => {
  const {
    User_Operations: { changeLanguage },
  } = CombineDispatchToProps(dispatch, bindActionCreators, [[User_Operations]]);

  return { changeLanguage };
};

export default connect(mapStateToProps, mapDispatchToProps)(PO);
