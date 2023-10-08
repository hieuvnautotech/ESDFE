import { useModal } from '@basesShared';
import { CREATE_ACTION, UPDATE_ACTION } from '@constants/ConfigConstants';
import { MuiAutocomplete, MuiButton, MuiDataGrid, MuiDateField, MuiSearchField } from '@controls';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UndoIcon from '@mui/icons-material/Undo';
import { TreeItem, TreeView } from '@mui/lab';
import { FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import { bomService } from '@services';
import { ErrorAlert, SuccessAlert } from '@utils';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import BomDialog from './BomDialog';
import BomProcess from './BomProcess';

export default function Bom() {
  const intl = useIntl();
  let isRendered = useRef(true);
  const [mode, setMode] = useState(CREATE_ACTION);
  const { isShowing, toggle } = useModal();
  const [state, setState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 8,
    searchData: {
      keyWord: '',
      ProductId: null,
      ProductCode: '',
      showDelete: true,
      StartDate: null,
      EndDate: null,
    },
  });
  const [newData, setNewData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [rowData, setRowData] = useState({});
  const [Bom, setBom] = useState(null);
  const [ModelTree, setModelTree] = useState([]);
  const [ProductTree, setProductTree] = useState({ ProductId: null, ProductCode: '' });
  const [expanded, setExpanded] = React.useState([]);

  const columns = [
    {
      field: 'id',
      headerName: '',
      width: 40,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.BomId) + 1 + (state.page - 1) * state.pageSize,
    },
    { field: 'BomId', hide: true },
    { field: 'row_version', hide: true },
    // {
    //   field: 'action',
    //   headerName: '',
    //   width: 80,
    //   disableClickEventBubbling: true,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Grid container spacing={1} alignItems="center" justifyContent="center">
    //         <Grid item xs={6} style={{ textAlign: 'center' }}>
    //           <IconButton
    //             aria-label="delete"
    //             color="error"
    //             size="small"
    //             sx={[{ '&:hover': { border: '1px solid red' } }]}
    //             onClick={() => handleDelete(params.row)}
    //           >
    //             {params.row.isActived ? <DeleteIcon fontSize="inherit" /> : <UndoIcon fontSize="inherit" />}
    //           </IconButton>
    //         </Grid>
    //         <Grid item xs={6} style={{ textAlign: 'center' }}>
    //           <IconButton
    //             aria-label="edit"
    //             color="warning"
    //             size="small"
    //             sx={[{ '&:hover': { border: '1px solid orange' } }]}
    //             onClick={() => handleUpdate(params.row)}
    //           >
    //             <EditIcon fontSize="inherit" />
    //           </IconButton>
    //         </Grid>
    //       </Grid>
    //     );
    //   },
    // },
    {
      field: 'ModelCode',
      headerName: intl.formatMessage({ id: 'product.Model' }),
      width: 200,
    },
    {
      field: 'ProductCode',
      headerName: intl.formatMessage({ id: 'bom.ProductId' }),
      width: 200,
    },
    {
      field: 'ProductName',
      headerName: intl.formatMessage({ id: 'product.product_name' }),
      width: 200,
    },
    {
      field: 'BuyerCode',
      headerName: intl.formatMessage({ id: 'bom.BuyerCode' }),
      width: 200,
    },
    {
      field: 'BomVersion',
      headerName: intl.formatMessage({ id: 'bom.BomVersion' }),
      width: 150,
    },
    // {
    //   field: 'Ver',
    //   headerName: intl.formatMessage({ id: 'bom.Ver' }),
    //   width: 150,
    // },
    {
      field: 'DateApply',
      headerName: intl.formatMessage({ id: 'bom.DateApply' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD') : null),
    },
    {
      field: 'Description',
      headerName: intl.formatMessage({ id: 'bom.Description' }),
      width: 250,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.Description ?? ''} className="col-text-elip">
            <Typography sx={{ fontSize: 14 }}>{params.row.Description}</Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'createdName',
      headerName: intl.formatMessage({ id: 'general.createdName' }),
      width: 150,
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
      width: 150,
    },
    {
      field: 'modifiedDate',
      headerName: intl.formatMessage({ id: 'general.modifiedDate' }),
      width: 150,
      valueFormatter: (params) => (params?.value ? moment(params?.value).format('YYYY-MM-DD HH:mm:ss') : null),
    },
  ];

  //useEffect
  useEffect(() => {
    handleGetModelTree();
    return () => {
      isRendered = false;
    };
  }, []);

  useEffect(() => {
    fetchData(null);
    return () => {
      isRendered = false;
    };
  }, [state.page, state.pageSize, state.searchData.showDelete]);

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

  useEffect(() => {
    if (!_.isEmpty(updateData) && !_.isEqual(updateData, rowData)) {
      let newArr = [...state.data];
      const index = _.findIndex(newArr, function (o) {
        return o.BomId == updateData.BomId;
      });
      if (index !== -1) {
        newArr[index] = updateData;
      }

      setState({ ...state, data: [...newArr] });
    }
  }, [updateData]);

  //handle
  const handleDelete = async (item) => {
    if (
      window.confirm(
        intl.formatMessage({
          id: item.isActived ? 'general.confirm_delete' : 'general.confirm_redo_deleted',
        })
      )
    ) {
      try {
        let res = await bomService.deleteBom(item);
        if (res && res.HttpResponseCode === 200) {
          SuccessAlert(intl.formatMessage({ id: 'general.success' }));
          await fetchData(null);
        } else {
          ErrorAlert(intl.formatMessage({ id: res.ResponseMessage }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleGetModelTree = async () => {
    let res = await bomService.getModelTree();
    if (res && res.HttpResponseCode === 200) {
      setModelTree(res.Data);
      setExpanded([]);
    }
  };

  const handleGetProductTree = async (ModelId) => {
    let newArr = [...ModelTree];
    const index = _.findIndex(newArr, function (o) {
      return o.ModelId == ModelId;
    });
    if (index !== -1 && !newArr[index].Child) {
      let res = await bomService.getProduct(ModelId);
      if (res && res.HttpResponseCode === 200) {
        newArr[index] = { ...newArr[index], Child: res.Data };
        setModelTree(newArr);
      }
    }
  };

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

  const handleSearch = (e, inputName) => {
    let newSearchData = { ...state.searchData };
    newSearchData[inputName] = e;
    if (inputName == 'showDelete') {
      setState({ ...state, page: 1, searchData: { ...newSearchData } });
    } else {
      setState({ ...state, searchData: { ...newSearchData } });
    }
  };

  async function fetchData(item) {
    setBom(null);
    setState({ ...state, isLoading: true });
    const params = {
      page: state.page,
      pageSize: state.pageSize,
      ProductId: item ? item.ProductId : ProductTree.ProductId,
      StartDate: state.searchData.StartDate,
      EndDate: state.searchData.EndDate,
      isActived: state.searchData.showDelete,
    };

    const res = await bomService.getBomList(params);

    if (item)
      setProductTree({ ProductId: item.ProductId, ProductCode: item.ProductCode, ProductLabel: item.ProductCode });
    if (res && isRendered)
      setState({
        ...state,
        data: res.Data ?? [],
        totalRow: res.TotalRow,
        isLoading: false,
      });
  }

  return (
    <React.Fragment>
      <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
        <Grid item xs={2}>
          <div
            style={{
              maxWidth: 400,
              border: '1px solid rgba(224, 224, 224, 1)',
              padding: '4px',
              borderRadius: '4px',
              marginRight: '8px',
              boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 0px, rgb(0 0 0 / 10%) 0px 0px 1px 0px',
            }}
          >
            <div
              style={{
                height: '45px',
                background: '#616365',
                textAlign: 'center',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', color: '#fff', fontWeight: '500' }}>
                {ProductTree.ProductId == null ? 'View All' : ProductTree.ProductCode}
                {ProductTree.ProductId != null && (
                  <ClearIcon
                    sx={{ ml: '5px', mt: '-2px' }}
                    fontSize="small"
                    onClick={() => {
                      setProductTree({ ProductId: null, ProductCode: '' });
                    }}
                  />
                )}
              </span>
            </div>
            <TreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              expanded={expanded}
              onNodeToggle={(e, nodeIds) => setExpanded(nodeIds)}
              sx={{
                height: '79vh',
                flexGrow: 1,
                overflowY: 'auto',
              }}
            >
              {ModelTree.length > 0 &&
                ModelTree.map((item, index) => {
                  return (
                    <TreeItem
                      key={index}
                      nodeId={`${item.ModelId}`}
                      // label={`${item.ModelCode} [${item.ProductQty}]`}
                      label={
                        <>
                          {item.ModelCode}
                          <span style={{ float: 'right' }}>{item.ProductQty}</span>
                        </>
                      }
                      onClick={() => handleGetProductTree(item.ModelId)}
                    >
                      {item.Child ? (
                        item.Child.map((item, index) => {
                          return (
                            <TreeItem
                              key={index}
                              nodeId={`${item.ProductId}`}
                              label={item.ProductCode}
                              onClick={() => fetchData(item)}
                            />
                          );
                        })
                      ) : (
                        <TreeItem nodeId="2" label="" />
                      )}
                    </TreeItem>
                  );
                })}
            </TreeView>
          </div>
        </Grid>

        <Grid item xs={10}>
          <Grid container direction="row" justifyContent="space-between" alignItems="width-end">
            <Grid item xs={2}>
              {/* <MuiButton text="create" color="success" onClick={handleAdd} sx={{ mt: 1 }} /> */}
            </Grid>
            <Grid item xs>
              <Grid container columnSpacing={2} direction="row" justifyContent="flex-end" alignItems="flex-end">
                <Grid item style={{ width: '21%' }}>
                  <MuiAutocomplete
                    label={intl.formatMessage({ id: 'bom.ProductId' })}
                    fetchDataFunc={bomService.getProductAll}
                    displayLabel="ProductLabel"
                    displayValue="ProductId"
                    onChange={(e, item) => {
                      setProductTree(
                        item
                          ? {
                              ProductId: item.ProductId,
                              ProductCode: item.ProductCode,
                              ProductLabel: item.ProductLabel,
                            }
                          : { ProductId: null, ProductCode: '', ProductLabel: '' }
                      );
                    }}
                    variant="standard"
                    value={ProductTree.ProductId ? ProductTree : null}
                  />
                </Grid>
                <Grid item style={{ width: '21%' }}>
                  <MuiDateField
                    disabled={state.isLoading}
                    label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
                    value={state.searchData.StartDate}
                    onChange={(e) => handleSearch(e, 'StartDate')}
                    variant="standard"
                  />
                </Grid>
                <Grid item style={{ width: '21%' }}>
                  <MuiDateField
                    disabled={state.isLoading}
                    label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
                    value={state.searchData.EndDate}
                    onChange={(e) => handleSearch(e, 'EndDate')}
                    variant="standard"
                  />
                </Grid>
                <Grid item>
                  <MuiButton text="search" color="info" onClick={() => fetchData(null)} sx={{ mr: 3, mt: 1 }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Switch
                    defaultChecked={true}
                    color="primary"
                    onChange={(e) => handleSearch(e.target.checked, 'showDelete')}
                  />
                }
                label={intl.formatMessage({
                  id: state.searchData.showDelete ? 'general.data_actived' : 'general.data_deleted',
                })}
              />
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
            getRowId={(rows) => rows.BomId}
            //onSelectionModelChange={(Ids) => setBom(Ids[0])}
            onRowClick={(params, event) => setBom(params.row)}
            getRowClassName={(params) => {
              if (_.isEqual(params.row, newData)) return `Mui-created`;
            }}
            initialState={{ pinnedColumns: { right: ['action'] } }}
          />
          <BomProcess Bom={Bom} />
        </Grid>
      </Grid>

      <BomDialog
        setNewData={setNewData}
        setUpdateData={setUpdateData}
        initModal={rowData}
        isOpen={isShowing}
        onClose={toggle}
        mode={mode}
        refeshModelTree={handleGetModelTree}
      />
    </React.Fragment>
  );
}
