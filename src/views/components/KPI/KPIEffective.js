import { Store } from '@appstate';
import { User_Operations } from '@appstate/user';
import { MuiAutocomplete, MuiButton, MuiDateField } from '@controls';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Button, Divider, Grid, TextField, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { CombineDispatchToProps, CombineStateToProps } from '@plugins/helperJS';
import { KPIEffectiveService } from '@services';
import React, { useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDays } from '@utils';

const KPIEffective = (props) => {
  const intl = useIntl();
  const handle = useFullScreenHandle();
  const date = new Date();
  const [WO, setWO] = useState({
    ProductId: null,
    ProductCode: '',
    ModelCode: '',
    Target: '',
    StartDate: null,
    EndDate: null,
    ProcessCodeMMS: null,
    ProcessCodeFQC: null,
  });

  const [StartDate, setStartDate] = useState(addDays(date, -7));
  const [EndDate, setEndDate] = useState(date);

  const [MMSValue, setMMSValue] = useState(null);
  const [FQCValue, setFQCValue] = useState(null);

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const isFullScreen = handle.active;
  const styles = {
    title: {
      width: '100%',
      height: isFullScreen ? '175px' : '150px',
      color: 'white',
      backgroundColor: '#170000',
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '25px',
      alignItems: 'center',
    },
    tableCell: {
      color: 'white',
      fontSize: isFullScreen ? '45px' : '40px',
      border: '1px solid gray',
      backgroundColor: '#1310D1',
      textAlign: 'center',
      fontWeight: '600',
    },
    heightRowCell: {
      height: isFullScreen ? '100px' : '75px',
    },
    heightRow: {
      height: isFullScreen ? '175px' : '150px',
    },
    titleRow: {
      fontSize: isFullScreen ? '45px' : '40px',
      fontWeight: '600',
      // color: 'white'
      // paddingBottom: isFullScreen ? '20px' : '10px',
    },
    titleText: {
      fontSize: isFullScreen ? '45px' : '40px',
      fontWeight: '600',
    },
    text: {
      fontSize: isFullScreen ? '55px' : '50px',
      fontWeight: '600',
    },
    textEffec: {
      border: '1px solid gray',
      fontSize: isFullScreen ? '90px' : '80px',
      fontWeight: '600',
    },
    cellActual: {
      width: '50%',
      padding: 0,
    },
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (WO?.ProcessCodeMMS != null) getMMSValue();
    else setMMSValue(null);
  }, [WO?.ProcessCodeMMS, EndDate, StartDate]);

  useEffect(() => {
    if (WO?.ProcessCodeFQC != null) getFQCValue();
    else setFQCValue(null);
  }, [WO?.ProcessCodeFQC, EndDate, StartDate]);

  useEffect(() => {
    if (WO.ProductId != null) getNewValue();
  }, [EndDate, StartDate]);

  async function getNewValue() {
    const res = await KPIEffectiveService.getWO({ StartDate: StartDate, EndDate: EndDate });
    if (res.Data) {
      const data = res.Data.find((x) => x.ProductId == WO.ProductId);
      setWO({ ...WO, Target: data.Target });
    }
  }

  async function getMMSValue() {
    const params = {
      ProductCode: WO?.ProductCode,
      ProcessCode: WO?.ProcessCodeMMS,
      StartDate: StartDate,
      EndDate: EndDate,
    };

    const res = await KPIEffectiveService.GetValueMMS(params);
    if (res.Data) setMMSValue(res.Data);
  }

  async function getFQCValue() {
    const params = {
      ProductCode: WO?.ProductCode,
      ProcessCode: WO?.ProcessCodeFQC,
      StartDate: StartDate,
      EndDate: EndDate,
    };

    const res = await KPIEffectiveService.GetValueFQC(params);
    if (res.Data) setFQCValue(res.Data);
  }

  const handleDownload = async () => {
    try {
      await KPIEffectiveService.download({ ...WO, StartDate: StartDate, EndDate: EndDate });
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const convertNumber = (number) => {
    var roundedNumber = number.toFixed(2);
    var displayNumber = roundedNumber.endsWith('.00') ? roundedNumber.slice(0, -3) : roundedNumber;
    return displayNumber;
  };

  const getProcessMMSList = async (ProductCode) => {
    try {
      var res = await KPIEffectiveService.GetProcessMMS(ProductCode);
      let data = [{ ProcessCode: 'FINISH GOOD' }];
      return {
        Data: [...data, ...res.Data],
      };
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const getProcessFQCList = async (ProductCode) => {
    try {
      var res = await KPIEffectiveService.GetProcessFQC(ProductCode);
      let data = [{ ProcessCode: 'FINISH GOOD' }];
      return {
        Data: [...data, ...res.Data],
      };
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={4} sx={{ mb: 1, pr: 3, pl: 3 }}>
        <Button variant="contained" startIcon={<FullscreenIcon />} onClick={handle.enter}>
          Full Screen
        </Button>
        <MuiButton
          text="download"
          color="warning"
          onClick={handleDownload}
          sx={{ float: 'right' }}
          disabled={WO?.ProductId != null ? false : true}
        />
      </Grid>
      <FullScreen handle={handle} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: '20px',
            height: isFullScreen ? screenHeight : 'none',
            backgroundColor: 'white',
            paddingTop: isFullScreen ? '100px' : '10px',
          }}
        >
          <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: 3 }}>
            <Grid item xs={2.4}>
              <MuiAutocomplete
                label={intl.formatMessage({ id: 'WO.ProductCode' })}
                fetchDataFunc={() =>
                  KPIEffectiveService.getWO({
                    StartDate: StartDate,
                    EndDate: EndDate,
                  })
                }
                displayLabel="ProductCode"
                displayValue="ProductId"
                onChange={(e, value) =>
                  value
                    ? setWO(value)
                    : setWO({ ProductCode: '', ModelCode: '', Target: '', ProcessCodeMMS: null, ProcessCodeFQC: null })
                }
              />
            </Grid>
            <Grid item xs={2.4}>
              <MuiDateField
                label={intl.formatMessage({ id: 'general.StartSearchingDate' })}
                value={StartDate}
                onChange={(e) => setStartDate(e)}
              />
            </Grid>
            <Grid item xs={2.4}>
              <MuiDateField
                label={intl.formatMessage({ id: 'general.EndSearchingDate' })}
                value={EndDate}
                onChange={(e) => setEndDate(e)}
              />
            </Grid>
            <Grid item xs={2.4}>
              <TextField
                fullWidth
                size="small"
                value={WO?.ModelCode}
                disabled
                label={intl.formatMessage({ id: 'WO.Model' })}
              />
            </Grid>
            <Grid item xs={2.4}>
              <TextField
                fullWidth
                size="small"
                value={WO?.Target}
                disabled
                label={intl.formatMessage({ id: 'WO.Target' })}
              />
            </Grid>
          </Grid>
          <Divider />
          <div style={{ paddingTop: isFullScreen ? '70px' : '10px' }}>
            {/* table Effective */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: 2 }}>
                <Grid item xs={9}>
                  <Typography variant="h4" component="h4" style={{ ...styles.titleText }}>
                    Effective MMS
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <MuiAutocomplete
                    disabled={WO?.ProductId == null}
                    label={intl.formatMessage({ id: 'History.process' })}
                    fetchDataFunc={() => getProcessMMSList(WO.ProductCode)}
                    value={
                      WO?.ProcessCodeMMS != null
                        ? {
                            ProcessCode: WO.ProcessCodeMMS,
                          }
                        : null
                    }
                    displayLabel="ProcessCode"
                    displayValue="ProcessCode"
                    onChange={(e, value) =>
                      setWO({
                        ...WO,
                        ProcessCodeMMS: value?.ProcessCode ?? null,
                      })
                    }
                  />
                </Grid>
              </Grid>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={styles.tableCell}>Actual Qty</TableCell>
                      <TableCell style={styles.tableCell}>Effective (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      style={{ border: '1px solid gray', ...styles.heightRow }}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell style={{ width: '66%', padding: 0 }}>
                        <TableContainer component={Paper} style={{ borderRadius: 0 }}>
                          <Table>
                            <TableHead style={{ borderBottom: '1px solid gray' }}>
                              <TableRow style={{ ...styles.heightRowCell }}>
                                <TableCell
                                  style={{
                                    borderRight: '1px solid gray',
                                    backgroundColor: '#63FE00',
                                    ...styles.titleRow,
                                  }}
                                  align="center"
                                >
                                  OK (EA)
                                </TableCell>
                                <TableCell style={{ backgroundColor: '#ED008C', ...styles.titleRow }} align="center">
                                  NG (EA)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                  style={{ borderRight: '1px solid gray', ...styles.heightRowCell, ...styles.text }}
                                >
                                  {MMSValue?.OKQty ? Number(MMSValue?.OKQty).toLocaleString() : 0}
                                </TableCell>
                                <TableCell align="center" style={{ ...styles.text }}>
                                  {MMSValue?.NGQty ? Number(MMSValue?.NGQty).toLocaleString() : 0}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TableCell>
                      <TableCell align="center" style={{ ...styles.textEffec }}>
                        {MMSValue?.OKQty != null && WO?.Target != null && WO?.Target > 0
                          ? convertNumber((Number(MMSValue?.OKQty) / Number(WO?.Target)) * 100)
                          : 0}{' '}
                        %
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* table OQC */}
            <div
              style={{
                paddingTop: isFullScreen ? '90px' : '50px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: 2 }}>
                <Grid item xs={9}>
                  <Typography variant="h4" component="h4" style={{ ...styles.titleText }}>
                    Effective FQC
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <MuiAutocomplete
                    disabled={WO?.ProductId == null}
                    label={intl.formatMessage({ id: 'History.process' })}
                    fetchDataFunc={() => getProcessFQCList(WO.ProductCode)}
                    displayLabel="ProcessCode"
                    displayValue="ProcessCode"
                    value={
                      WO?.ProcessCodeFQC != null
                        ? {
                            ProcessCode: WO.ProcessCodeFQC,
                          }
                        : null
                    }
                    onChange={(e, value) =>
                      setWO({
                        ...WO,
                        ProcessCodeFQC: value?.ProcessCode ?? null,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={styles.tableCell}>Actual Qty</TableCell>
                      <TableCell style={styles.tableCell}>Effective (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      style={{ border: '1px solid gray', ...styles.heightRow }}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell style={{ width: '75%', padding: 0 }}>
                        <TableContainer component={Paper} style={{ borderRadius: 0 }}>
                          <Table>
                            <TableHead style={{ borderBottom: '1px solid gray' }}>
                              <TableRow style={{ ...styles.heightRowCell }}>
                                <TableCell
                                  align="center"
                                  style={{
                                    borderRight: '1px solid gray',
                                    backgroundColor: '#63FE00',
                                    ...styles.titleRow,
                                  }}
                                >
                                  OK (EA)
                                </TableCell>
                                <TableCell align="center" style={{ backgroundColor: '#ED008C', ...styles.titleRow }}>
                                  NG (EA)
                                </TableCell>
                                <TableCell align="center" style={{ backgroundColor: '#E4FF00', ...styles.titleRow }}>
                                  Waiting (EA)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow
                                style={{ ...styles.heightRowCell }}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                  style={{ borderRight: '1px solid gray', ...styles.text }}
                                >
                                  {FQCValue?.OKQty ? Number(FQCValue?.OKQty).toLocaleString() : 0}
                                </TableCell>
                                <TableCell align="center" style={{ borderRight: '1px solid gray', ...styles.text }}>
                                  {FQCValue?.NGQty ? Number(FQCValue?.NGQty).toLocaleString() : 0}
                                </TableCell>
                                <TableCell align="center" style={styles.text}>
                                  {FQCValue?.WaitingQty ? Number(FQCValue?.WaitingQty).toLocaleString() : 0}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TableCell>
                      <TableCell align="center" style={{ ...styles.textEffec }}>
                        {FQCValue?.OKQty && WO?.Target && WO?.Target > 0
                          ? convertNumber((Number(FQCValue?.OKQty) / Number(WO?.Target)) * 100)
                          : 0}{' '}
                        %
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </FullScreen>
    </React.Fragment>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(KPIEffective);
