import { useModal } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiButton, MuiDataGrid, MuiSearchField } from '@controls';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { FormControlLabel, Switch, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { buyerService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import Staff2Dialog from './Staff2Dialog';

const Staff2 = (props) => {
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

  const handleAdd = () => {
    setMode(CREATE_ACTION);
    setRowData();
    toggle();
  };

  const handleUpdate = async (row) => {
    setMode(UPDATE_ACTION);
    setRowData(row);
    toggle();
  };

  const changeSearchData = (e, inputName) => {
    let newSearchData = { ...buyerState.searchData };
    newSearchData[inputName] = e.target.value;

    setbuyerState({ ...buyerState, searchData: { ...newSearchData } });
  };

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

    const res = await buyerService.getBuyerList(params);

    if (res && isRendered)
      setbuyerState({
        ...buyerState,
        data: !res.Data ? [] : [...res.Data],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  const handleDeleteBuyer = async (buyer) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: showActivedData ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await buyerService.deleteBuyer(buyer);
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

  const handleshowActivedData = async (event) => {
    setShowActivedData(event.target.checked);
    if (!event.target.checked) {
      setbuyerState({
        ...buyerState,
        page: 1,
      });
    }
  };

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
      field: 'StaffCode',
      headerName: intl.formatMessage({ id: 'staff.StaffCode' }),
      width: 150,
    },
    {
      field: 'StaffName',
      headerName: intl.formatMessage({ id: 'staff.StaffName' }),
      width: 250,
    },
    {
      field: 'DeptCode',
      headerName: intl.formatMessage({ id: 'staff.DepartmentCode' }),
      width: 200,
    },
    {
      field: 'DeptNameVI',
      headerName: intl.formatMessage({ id: 'staff.DepartmentNameVI' }),
      width: 200,
    },
    {
      field: 'DeptNameEN',
      headerName: intl.formatMessage({ id: 'staff.DepartmentNameEN' }),
      width: 150,
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'User Create' }),
      width: 200,
    },
    {
      field: 'createdDate',
      headerName: intl.formatMessage({ id: 'general.created_date' }),
      width: 130,
    },
    {
      field: 'modifiedName',
      headerName: intl.formatMessage({ id: 'User Update' }),
      width: 130,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modified_date' }),
      width: 250,
    },
    // {
    //   field: 'DateSignContract',
    //   headerName: intl.formatMessage({ id: 'buyer.DateSignContract' }),
    //   width: 150,
    //   valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    // },
    // {
    //   field: 'Description',
    //   headerName: intl.formatMessage({ id: 'buyer.Description' }),
    //   width: 250,
    //   renderCell: (params) => {
    //     return (
    //       <Tooltip title={params.row.Description ?? ''} className="col-text-elip">
    //         <Typography sx={{ fontSize: 14, maxWidth: 1500 }}>{params.row.Description}</Typography>
    //       </Tooltip>
    //     );
    //   },
    // },
    // { field: 'createdName', headerName: 'User Create', width: 150 },
    // {
    //   field: 'createdDate',
    //   headerName: intl.formatMessage({ id: 'general.created_date' }),
    //   width: 150,
    //   valueFormatter: (params) => {
    //     if (params.value !== null) {
    //       return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
    //     }
    //   },
    // },
    // { field: 'modifiedName', headerName: 'User Update', width: 150 },
    // {
    //   field: 'modifiedDate',
    //   headerName: intl.formatMessage({ id: 'general.modified_date' }),
    //   width: 150,
    //   valueFormatter: (params) => {
    //     if (params.value !== null) {
    //       return moment(params?.value).format('YYYY-MM-DD HH:mm:ss');
    //     }
    //   },
    // },
  ];

  return (
    <React.Fragment>
      <Grid container spacing={2} direction="row" justifyContent="space-between" alignItems="flex-end">
        <Grid item xs={5}>
          {/* <MuiButton text="create" color="success" onClick={handleAdd} /> */}
        </Grid>

        <Grid item xs>
          <MuiSearchField
            label="general.code"
            name="StaffCode"
            onClick={fetchData}
            onChange={(e) => changeSearchData(e, 'StaffCode')}
          />
        </Grid>

        <Grid item xs>
          <MuiSearchField
            label="general.name"
            name="StaffName"
            onClick={fetchData}
            onChange={(e) => changeSearchData(e, 'StaffName')}
          />
        </Grid>

        <Grid item xs sx={{ display: 'flex', justifyContent: 'right' }}>
          <MuiButton text="search" color="info" onClick={fetchData} />
          <FormControlLabel
            sx={{ mb: 0, ml: '1px' }}
            control={<Switch defaultChecked={true} color="primary" onChange={(e) => handleshowActivedData(e)} />}
            label={showActivedData ? 'Actived' : 'Deleted'}
          />
        </Grid>
      </Grid>

      <MuiDataGrid
        getData={buyerService.getBuyerList}
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

      <Staff2Dialog mode={mode} initModal={rowData} setUpdateData={setUpdateData} isOpen={isShowing} onClose={toggle} />
    </React.Fragment>
  );
};

export default Staff2;
