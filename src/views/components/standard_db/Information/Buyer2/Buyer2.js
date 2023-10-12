import { useModal } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Switch, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { buyer2Service } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import Buyer2Dialog from './Buyer2Dialog';

const Buyer2 = (props) => {
  let isRendered = useRef(false);
  const intl = useIntl();
  const { isShowing, toggle } = useModal();
  const [mode, setMode] = useState(CREATE_ACTION);
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [showActivedData, setShowActivedData] = useState(true);
  const [buyerState, setbuyerState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 20,
    searchData: {
      BuyerCode: null,
      BuyerName: null,
    },
  });

  

  

  

  async function fetchData() {
    setbuyerState({
      ...buyerState,
      isLoading: true,
    });
    const params = {
      page: buyerState.page,
      pageSize: buyerState.pageSize,
      BuyerCode: buyerState.searchData.BuyerCode,
      BuyerName: buyerState.searchData.BuyerName,
      isActived: showActivedData,
    };

    const res = await buyer2Service.getBuyerList(params);

    if (res && isRendered)
      setbuyerState({
        ...buyerState,
        data: !res.Data ? [] : [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  

  

  useEffect(() => {
    isRendered = true;
    if (isRendered) fetchData();

    return () => {
      isRendered = false;
    };
  }, [buyerState.page, buyerState.pageSize, showActivedData]);

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...buyerState.data];
      const index = _.findIndex(newArr, function (o) {
        return o.BuyerId == updateData.BuyerId;
      });

      if (index !== -1) {
        newArr[index] = updateData;
      } else {
        newArr = [{ ...updateData, isNew: true }, ...newArr];
        if (newArr.length > buyerState.pageSize) {
          data.pop();
        }
      }

      setbuyerState({ ...buyerState, data: [...newArr] });
    }
  }, [updateData]);

  const columns = [
    { field: 'BuyerId', headerName: '', hide: true },
    {
      field: 'id',
      headerName: '',
      align: 'center',
      width: 40,
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BuyerId) + 1 + (buyerState.page - 1) * buyerState.pageSize,
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
            <Grid item xs={6}>
              <IconButton
                aria-label="edit"
                color="warning"
                size="small"
                sx={[{ '&:hover': { border: '1px solid orange' } }]}
                onClick={() => handleUpdate(params.row)}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            {/* <Grid item xs={6}>
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={[{ '&:hover': { border: '1px solid red' } }]}
                onClick={() => handleDeleteBuyer(params.row)}
              >
                {showActivedData ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
              </IconButton>
            </Grid> */}
          </Grid>
        );
      },
    },
    {
      field: 'BuyerCode',
      headerName: intl.formatMessage({ id: 'buyer.BuyerCode' }),
      width: 150,
    },
    {
      field: 'BuyerName',
      headerName: intl.formatMessage({ id: 'buyer.BuyerName' }),
      width: 250,
    },
    {
      field: 'BrandName',
      headerName: intl.formatMessage({ id: 'buyer.BrandName' }),
      width: 200,
    },
    {
      field: 'Website',
      headerName: intl.formatMessage({ id: 'buyer.Website' }),
      width: 200,
    },
    {
      field: 'PhoneNumber',
      headerName: intl.formatMessage({ id: 'buyer.PhoneNumber' }),
      width: 150,
    },
    {
      field: 'Email',
      headerName: intl.formatMessage({ id: 'buyer.Email' }),
      width: 200,
    },
    {
      field: 'Fax',
      headerName: intl.formatMessage({ id: 'buyer.Fax' }),
      width: 130,
    },
    {
      field: 'Tax',
      headerName: intl.formatMessage({ id: 'buyer.Tax' }),
      width: 130,
    },
    {
      field: 'Address',
      headerName: intl.formatMessage({ id: 'buyer.Address' }),
      width: 250,
    },
    {
      field: 'DateSignContract',
      headerName: intl.formatMessage({ id: 'buyer.DateSignContract' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'buyer.Description' }),
      width: 250,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.Description ?? ''} className="col-text-elip">
            <Typography sx={{ fontSize: 14, maxWidth: 1500 }}>{params.row.Description}</Typography>
          </Tooltip>
        );
      },
    },
    { field: 'createdName', headerName: 'User Create', width: 150 },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.created_date' }),
      width: 150,
      valueFormatter: (params) => {
        if (params.value !== null) {
          return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    { field: 'modifiedName', headerName: 'User Update', width: 150 },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modified_date' }),
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
      <Grid container spacing={2} direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item xs={5}>
          {/* <MuiButton text="create" color="success" onClick={handleAdd} /> */}
        </Grid>

        

        

        
      </Grid>

      <MuiDataGrid
        getData={buyer2Service.getBuyerList}
        showLoading={buyerState.isLoading}
        isPagingServer={true}
        headerHeight={45}
        columns={columns}
        rows={buyerState.data}
        page={buyerState.page - 1}
        pageSize={buyerState.pageSize}
        rowCount={buyerState.totalRow}
        disableGrid={buyerState.isLoading}
        onPageChange={(newPage) => setbuyerState({ ...buyerState, page: newPage + 1 })}
        getRowId={(rows) => rows.BuyerId}
        getRowClassName={(params) => {
          if (params.row.isNew) return `Mui-created`;
        }}
        initialState={{ pinnedColumns: { left: ['id', 'BuyerCode', 'BuyerName'], right: ['action'] } }}
      />

      <Buyer2Dialog mode={mode} initModal={rowData} setUpdateData={setUpdateData} isOpen={isShowing} onClose={toggle} />
    </React.Fragment>
  );
};

export default Buyer2;
