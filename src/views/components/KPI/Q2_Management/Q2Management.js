import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiButton, MuiDataGrid, MuiSearchField, MuiDateField, MuiAutocomplete } from '@controls';
import Grid from '@mui/material/Grid';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { Q2ManagementService, PolicyService } from '@services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const Q2Management = () => {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      keyWord: '',
      TRAND_TP: '',
      StartDate: null,
      EndDate: null,
    },
  });

  async function fetchData() {
    setState({
      ...state,
      isLoading: true,
    });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      keyword: state.searchData.keyWord,
      TRAND_TP: state.searchData.TRAND_TP,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
    };
    const res = await Q2ManagementService.getQ2ManagementList(params);

    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  useEffect(() => {
    fetchData();
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize]);

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;

    setState({
      ...state,
      searchData: { ...newSearchData },
    });
  };

  const handleDownload = async () => {
    try {
      const params = {
        page: state.page,
        pageSize: state.pageSize,
        keyword: state.searchData.keyWord,
        StartDate: state.searchData.StartDate ?? '',
        EndDate: state.searchData.EndDate ?? '',
      };

      await Q2ManagementService.downloadEDI(params);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'BUYER_COMPANY', headerName: intl.formatMessage({ id: 'q2Management.Buyer_Company' }), width: 150 },
    {
      field: 'BUYER_DIVISION',
      headerName: intl.formatMessage({ id: 'q2Management.Buyer_Division' }),
      width: 150,
    },
    {
      field: 'SELLER_COMPANY',
      headerName: intl.formatMessage({ id: 'q2Management.Seller_Company' }),
      width: 150,
    },
    {
      field: 'PPORTAL_ITEM_GROUP',
      headerName: intl.formatMessage({ id: 'q2Management.PportalItemGroup' }),
      width: 150,
    },
    {
      field: 'QMS_ITEM_GROUP',
      headerName: intl.formatMessage({ id: 'q2Management.Item_Group' }),
      width: 150,
    },
    {
      field: 'ITEM_CODE',
      headerName: intl.formatMessage({ id: 'q2Management.Item_Code' }),
      width: 150,
    },
    {
      field: 'TRAND_TP_NAME',
      headerName: intl.formatMessage({ id: 'q2Management.Send_Type' }),
      width: 150,
    },
    {
      field: 'CTQ_NO',
      headerName: intl.formatMessage({ id: 'q2Management.CTQ_NO' }),
      width: 150,
    },
    {
      field: 'YYYYMMDDHH',
      headerName: intl.formatMessage({ id: 'q2Management.YYYYMMDDHH' }),
      width: 150,
    },
    {
      field: 'PRC_QUAL_INFO01',
      headerName: intl.formatMessage({ id: 'q2Management.PrcQ01' }),
      width: 200,
    },
    {
      field: 'TRANSACTION_ID',
      headerName: intl.formatMessage({ id: 'q2Management.Transaction_Id' }),
      width: 150,
    },
    {
      field: 'SUP_SEND_TIME',
      headerName: intl.formatMessage({ id: 'q2Management.Sup_Send_Date' }),
      width: 150,
    },
    {
      field: 'reg_dt',
      headerName: 'Created Date',
      width: 150,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
  ];

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, pr: 1 }}>
        <Grid item>
          <MuiButton text="download" color="warning" onClick={handleDownload} />
        </Grid>
        <Grid item>
          <Grid container columnSpacing={2} direction="row" justifyContent="space-between" alignItems="flex-end">
            <Grid item>
              <MuiSearchField
                variant="Item_Code"
                label="q2Management.Item_Code"
                onClick={fetchData}
                onChange={(e) => handleSearch(e.target.value, 'ITEM_CODE')}
              />
            </Grid>
            <Grid item>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
                value={state.searchData.StartDate}
                onChange={(e) => handleSearch(e, 'StartDate')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiDateField
                disabled={state.isLoading}
                label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
                value={state.searchData.EndDate}
                onChange={(e) => handleSearch(e, 'EndDate')}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <MuiButton text="search" color="info" onClick={fetchData} />
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
        getRowId={(rows) => rows.id}
        initialState={{ pinnedColumns: { right: ['action'] } }}
      />
    </React.Fragment>
  );
};

export default Q2Management;
