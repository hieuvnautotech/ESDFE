import React, { memo } from 'react';
import moment from 'moment';
import QRCode from 'react-qr-code';

const MaterialLabel = memo((props) => {
  const { info, printRef } = props;
  return (
    <React.Fragment>
      {info && (
        <table className="table-material-label" ref={printRef}>
          <tbody>
            <tr>
              <td rowSpan={4}>{info?.MaterialLotCode && <QRCode value={`${info?.MaterialLotCode}`} size={80} />}</td>
              <td>NAME</td>
              <td>{info?.MaterialName}</td>
            </tr>
            <tr>
              <td>QTY</td>
              <td>{info?.Length}</td>
            </tr>
            <tr>
              <td>RECEIVED DATE</td>
              <td> {moment(info?.ReceivedDate).format('DD/MM/YYYY')}</td>
            </tr>
            <tr>
              <td>SN</td>
              <td>{info?.MaterialLotCode.slice(-3)}</td>
            </tr>
            <tr>
              <td style={{ minWidth: '250px' }}>{info?.MaterialLotCode}</td>
              <td>LOT NO</td>
              <td>{info?.LotNo}</td>
            </tr>
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
});
export default MaterialLabel;
