import React from 'react';

import { MuiDataGrid } from '@controls';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';

import { useIntl } from 'react-intl';
import { dateToTicks, ErrorAlert, isNullUndefinedEmptyStr } from '@utils';

const MoldCheckFormValue = (props) => {
  const {
    moldCheckForm,
    setMoldCheckForm,
    pageValue,
    setPageValue,
    pageValueSize,
    setPageValueSize,
    disableValue,
    setDisableValue,
    tabCheckNo,
  } = props;

  const intl = useIntl();

  const columnsValue = [
    {
      field: 'id',
      headerName: '',
      width: 70,
      align: 'center',
      filterable: false,
      renderCell: (index) => index.api.getRowIndex(index.row.QCDetailValueId) + 1,
    },

    {
      field: 'QCTypeName',
      headerName: intl.formatMessage({ id: 'mold.QCId_TypeName' }),
      flex: 1,
    },

    {
      field: 'QCValue',
      headerName: intl.formatMessage({ id: 'mold.QCValue' }),
      flex: 0.6,
    },
    {
      field: 'ToleranceUp',
      headerName: intl.formatMessage({ id: 'standardQC.ToleranceUp' }),
      flex: 0.6,
    },
    {
      field: 'ToleranceDown',
      headerName: intl.formatMessage({ id: 'standardQC.ToleranceDown' }),
      flex: 0.6,
    },
    {
      field: 'FirstCheckValue',
      headerName: intl.formatMessage({ id: 'mold.QCValue_First' }),
      flex: 0.3,
      minWidth: 50,
      editable: tabCheckNo == 0,
      // preProcessEditCellProps: preProcessEditCellProps('FirstCheckValue'),
      // renderCell: (params) => (
      //   <MuiTextField
      //     type="number"
      //     variant="standard"
      //     onChange={(e) => changeMoldCheckDetailValue(e, 'FirstCheckValue', params.row)}
      //   />
      // ),
      renderCell: (params) => {
        return (
          <TextField
            variant="standard"
            fullWidth
            disabled={disableValue}
            // value={params.row.FirstCheckValue ?? undefined}
            value={params.row.FirstCheckValue ?? ''}
            inputProps={{
              onDoubleClick: () => {
                setDisableValue(false);
              },
            }}
          />
        );
      },
    },

    {
      field: 'SecondCheckValue',
      headerName: intl.formatMessage({ id: 'mold.QCValue_Second' }),
      flex: 0.3,
      minWidth: 50,
      editable: tabCheckNo == 0,
      // preProcessEditCellProps: preProcessEditCellProps('SecondCheckValue'),
      // renderCell: (params) => (
      //   <MuiTextField
      //     type="number"
      //     variant="standard"
      //     onChange={(e) => changeMoldCheckDetailValue(e, 'SecondCheckValue', params.row)}
      //   />
      // ),
      renderCell: (params) => {
        return (
          <TextField
            variant="standard"
            fullWidth
            disabled={disableValue}
            value={params.row.SecondCheckValue ?? ''}
            inputProps={{
              onDoubleClick: () => {
                setDisableValue(false);
              },
            }}
          />
        );
      },
    },

    {
      field: 'ThirdCheckValue',
      headerName: intl.formatMessage({ id: 'mold.QCValue_Third' }),
      flex: 0.3,
      minWidth: 50,
      editable: tabCheckNo == 0,
      // preProcessEditCellProps: preProcessEditCellProps('ThirdCheckValue'),
      // renderCell: (params) => (
      //   <MuiTextField
      //     type="number"
      //     variant="standard"
      //     onChange={(e) => changeMoldCheckDetailValue(e, 'ThirdCheckValue', params.row)}
      //   />
      // ),
      renderCell: (params) => {
        return (
          <TextField
            variant="standard"
            fullWidth
            disabled={disableValue}
            // value={params.row.ThirdCheckValue ?? undefined}
            value={params.row.ThirdCheckValue ?? ''}
            inputProps={{
              onDoubleClick: () => {
                setDisableValue(false);
              },
            }}
          />
        );
      },
    },
  ];

  const handleRowValueUpdate = async (newRow) => {
    const checkValidObj = {
      FirstCheckValue:
        newRow.FirstCheckValue && !isNaN(parseFloat(newRow.FirstCheckValue))
          ? parseFloat(newRow.FirstCheckValue)
          : null,
      SecondCheckValue:
        newRow.SecondCheckValue && !isNaN(parseFloat(newRow.SecondCheckValue))
          ? parseFloat(newRow.SecondCheckValue)
          : null,
      ThirdCheckValue:
        newRow.ThirdCheckValue && !isNaN(parseFloat(newRow.ThirdCheckValue))
          ? parseFloat(newRow.ThirdCheckValue)
          : null,
    };

    const index = moldCheckForm.MoldCheckDetailValueDtos.findIndex(
      (item) => item.QCDetailValueId === newRow.QCDetailValueId
    );

    const updatedArray = [...moldCheckForm.MoldCheckDetailValueDtos];
    if (index !== -1) {
      if (updatedArray[index].MoldCheckMasterId === 0 || !updatedArray[index].MoldCheckMasterId) {
        updatedArray[index] = {
          ...updatedArray[index],
          MoldCheckMasterId: moldCheckForm.MoldCheckMasterId,
        };
      }

      if (updatedArray[index].MoldCheckDetailValueId === 0 || !updatedArray[index].MoldCheckDetailValueId) {
        updatedArray[index] = {
          ...updatedArray[index],
          MoldCheckDetailValueId: dateToTicks(new Date()),
        };
      }

      updatedArray[index] = {
        ...updatedArray[index],
        FirstCheckValue: checkValidObj.FirstCheckValue,
        SecondCheckValue: checkValidObj.SecondCheckValue,
        ThirdCheckValue: checkValidObj.ThirdCheckValue,
      };
      setMoldCheckForm({
        ...moldCheckForm,
        MoldCheckDetailValueDtos: [...updatedArray],
      });
    }
    return newRow;
  };

  const handleProcessRowValueUpdateError = React.useCallback((error) => {
    console.log('update error', error);
    ErrorAlert(intl.formatMessage({ id: 'general.system_error' }));
  }, []);

  return (
    <Grid xs={12}>
      <MuiDataGrid
        // showLoading={false}
        headerHeight={45}
        // rowHeight={30}
        gridHeight={736}
        columns={columnsValue}
        rows={moldCheckForm.MoldCheckDetailValueDtos}
        page={pageValue - 1}
        pageSize={pageValueSize}
        rowCount={moldCheckForm.MoldCheckDetailValueDtos.length}
        onPageChange={(newPage) => {
          setPageValue(newPage + 1);
        }}
        getRowId={(rows) => rows.QCDetailValueId}
        // onSelectionModelChange={(newSelectedRowId) => handleRowSelection(newSelectedRowId)}
        onPageSizeChange={(newPageSize) => {
          setPageValueSize(newPageSize);
          setPageValue(1);
        }}
        rowsPerPageOptions={[5, 10, 15]}
        processRowUpdate={handleRowValueUpdate}
        //isCellEditable={(params) => params.row.Id}
        onProcessRowUpdateError={handleProcessRowValueUpdateError}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Grid>
  );
};

export default MoldCheckFormValue;
