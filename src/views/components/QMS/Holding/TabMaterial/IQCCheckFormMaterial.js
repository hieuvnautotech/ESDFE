import { MuiTextField } from '@controls';
import { IQCReceivingService, HoldMaterialService } from '@services';
import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

const IQCCheckFormMaterial = ({ RowCheck, state, setState, view, reCheck }) => {
  const intl = useIntl();
  let isRendered = useRef(true);

  async function fetchData() {
    //const res = await IQCReceivingService.getCheckIQC(RowCheck?.QCIQCMasterId, RowCheck?.MaterialLotId);

    const res =
      reCheck == true
        ? await IQCReceivingService.getCheckIQC(RowCheck?.QCIQCMasterId, RowCheck?.MaterialLotId)
        : await HoldMaterialService.getReCheck(RowCheck?.QCIQCMasterId, RowCheck?.MaterialLotId);

    if (res && isRendered) {
      setState({
        ...state,
        data: res.Data,
      });
    }
  }

  useEffect(() => {
    if (RowCheck.QCIQCMasterId && RowCheck.MaterialLotId) {
      fetchData();
    }
    return () => (isRendered = false);
  }, [RowCheck]);

  return (
    <table style={{ width: '100%', display: 'block', overflowY: 'auto', overflowY: 'auto', minHeight: '300px' }}>
      <tbody style={{ width: '100%', display: 'table' }}>
        <tr>
          <th style={{ ...style.th }}>{intl.formatMessage({ id: 'standardQC.QCType' })}</th>
          <th style={{ ...style.th }}>{intl.formatMessage({ id: 'standardQC.QCItem' })}</th>
          <th style={{ ...style.th }}>{intl.formatMessage({ id: 'standardQC.QCStandard' })}</th>
          <th style={{ ...style.th, width: '25%' }}>{intl.formatMessage({ id: 'qcIQC.Input' })}</th>
        </tr>
        {state.data.length > 0 &&
          state.data.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ ...style.td }}>{item.QCTypeName}</td>
                <td style={{ ...style.td }}>{item.QCItemName}</td>
                <td style={{ ...style.td }}>{item.QCStandardName}</td>
                <td style={{ ...style.td }}>
                  <MuiTextField
                    sx={{ m: 0 }}
                    fullWidth
                    label="Result"
                    type="number"
                    size="small"
                    value={item.TextValue}
                    onChange={(e) => {
                      let newArr = [...state.data];
                      const index = _.findIndex(newArr, function (o) {
                        return o.QCIQCDetailMId == item.QCIQCDetailMId;
                      });
                      if (index !== -1) {
                        newArr[index] = {
                          ...newArr[index],
                          TextValue: e.target.value != null ? Number(e.target.value) : null,
                        };
                        setState({ ...state, data: newArr });
                      }
                    }}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

const style = {
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    background: '#dad8d8',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  N_Values: {
    margin: '0 10px',
  },
  itemValue: {
    width: '79px',
    height: '120px',
    background: 'rgb(255 255 255)',
    border: '1px solid rgb(52 58 64 / 80%)',
    height: '25px',
  },
};

export default IQCCheckFormMaterial;
