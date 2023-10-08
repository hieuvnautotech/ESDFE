import React from 'react';
import ReactDOMServer from 'react-dom/server';
import QRCode from 'react-qr-code';
import moment from 'moment';

const style = {
  cell: {
    border: 'solid 3px black',
    fontWeight: '600',
    fontSize: '18',
  },
};

export const PrintMaterial = async (data) => {
  const style = {
    cell: {
      border: 'solid 3px black',
      fontWeight: '600',
      fontSize: '18',
    },
  };

  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '500px',
            height: '350px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          {item.MaterialUnit == 'EA' ? (
            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <tbody>
                <tr>
                  <td style={{ border: 'solid 3px black', width: '34%' }} rowSpan={7}>
                    {item?.LotStatus == '003' && (
                      <p style={{ fontWeight: '600', fontSize: '20', marginBottom: 10, marginTop: 0 }}>NG</p>
                    )}
                    {item?.MaterialLotCode && <QRCode value={`${item?.MaterialLotCode}`} size={140} />}
                    <p style={{ fontWeight: '600', fontSize: '18', marginBottom: 0 }}> {item?.MaterialLotCode}</p>
                  </td>
                  <td style={{ ...style.cell, width: '33%' }}>NAME</td>
                  <td style={{ ...style.cell, width: '33%' }}>{item?.MaterialName}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>QTY</td>
                  <td style={{ ...style.cell }}>{Number(item?.Length).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>RECEIVED DATE</td>
                  <td style={{ ...style.cell }}>{moment(item?.ReceivedDate).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>SN</td>
                  <td style={{ ...style.cell }}>{item?.MaterialLotCode.slice(-3)}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>LOT NO</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>MANUFACTURE DATE</td>
                  <td style={{ ...style.cell }}>{moment(item?.ManufactureDate).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>EXPIRATION DATE</td>
                  <td style={{ ...style.cell }}>{moment(item?.ExpirationDate).format('DD/MM/YYYY')}</td>
                </tr>
              </tbody>
            </table>
          ) : item.isSupplierSlit ? (
            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <tbody>
                <tr>
                  <td style={{ border: 'solid 3px black', width: '34%' }} rowSpan={7}>
                    {item?.LotStatus == '003' && (
                      <p style={{ fontWeight: '600', fontSize: '20', marginBottom: 10, marginTop: 0 }}>NG</p>
                    )}
                    {item?.MaterialLotCode && <QRCode value={`${item?.MaterialLotCode}`} size={140} />}
                    <p style={{ fontWeight: '600', fontSize: '18', marginBottom: 0 }}> {item?.MaterialLotCode}</p>
                  </td>
                  <td style={{ ...style.cell, width: '33%' }}>LOT NO</td>
                  <td style={{ ...style.cell, width: '33%' }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>NAME</td>
                  <td style={{ ...style.cell }}>{item?.MaterialName}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>SIZE(mm*m)</td>
                  <td style={{ ...style.cell }}>{`${item?.Width} x ${item?.Length}`}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>EXPIRATE DATE</td>
                  <td style={{ ...style.cell }}>{moment(item?.ExpirationDate).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>{'SLIT DATE'}</td>
                  <td style={{ ...style.cell }}>{moment(item?.createdDate).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>{'SLIT WORKER'}</td>
                  <td style={{ ...style.cell }}>{item?.StaffNameSlit}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>PRODUCT</td>
                  <td style={{ ...style.cell }}>{item?.ProductCodeSlit}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <tbody>
                <tr>
                  <td style={{ border: 'solid 3px black', width: '34%' }} rowSpan={7}>
                    {item?.LotStatus == '003' && (
                      <p style={{ fontWeight: '600', fontSize: '20', marginBottom: 10, marginTop: 0 }}>NG</p>
                    )}
                    {item?.MaterialLotCode && <QRCode value={`${item?.MaterialLotCode}`} size={140} />}
                    <p style={{ fontWeight: '600', fontSize: '18', marginBottom: 0 }}> {item?.MaterialLotCode}</p>
                  </td>
                  <td style={{ ...style.cell, width: '33%' }}>NAME</td>
                  <td style={{ ...style.cell, width: '33%' }}>{item?.MaterialName}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>{item.MaterialUnit == 'EA' ? 'QTY' : 'SIZE(mm*m)'}</td>
                  <td style={{ ...style.cell }}>
                    {item.MaterialUnit == 'EA'
                      ? Number(item?.Length).toLocaleString()
                      : `${item?.Width} x ${item?.Length}`}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>RECEIVED DATE</td>
                  <td style={{ ...style.cell }}>{moment(item?.ReceivedDate).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>SN</td>
                  <td style={{ ...style.cell }}>{item?.MaterialLotCode.slice(-3)}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>LOT NO</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>MANUFACTURE DATE</td>
                  <td style={{ ...style.cell }}>{moment(item?.ManufactureDate).format('DD/MM/YYYY')}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>EXPIRATION DATE</td>
                  <td style={{ ...style.cell }}>{moment(item?.ExpirationDate).format('DD/MM/YYYY')}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintMaterialSlit = async (data) => {
  const style = {
    cell: {
      border: 'solid 3px black',
      fontWeight: '600',
      fontSize: '18',
    },
  };

  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '500px',
            height: '350px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ border: 'solid 3px black', width: '34%' }} rowSpan={7}>
                  {item?.LotStatus == '003' && (
                    <p style={{ fontWeight: '600', fontSize: '20', marginBottom: 10, marginTop: 0 }}>NG</p>
                  )}
                  {item?.MaterialLotCode && <QRCode value={`${item?.MaterialLotCode}`} size={140} />}
                  <p style={{ fontWeight: '600', fontSize: '18', marginBottom: 0 }}> {item?.MaterialLotCode}</p>
                </td>
                <td style={{ ...style.cell, width: '33%' }}>LOT NO</td>
                <td style={{ ...style.cell, width: '33%' }}>{item?.LotNo}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>NAME</td>
                <td style={{ ...style.cell }}>{item?.MaterialName}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>SIZE(mm*m)</td>
                <td style={{ ...style.cell }}>{`${item?.Width} x ${item?.Length}`}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>EXPIRATE DATE</td>
                <td style={{ ...style.cell }}>{moment(item?.ExpirationDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>{'SLIT DATE'}</td>
                <td style={{ ...style.cell }}>{moment(item?.createdDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>{'SLIT WORKER'}</td>
                <td style={{ ...style.cell }}>{item?.StaffNameSlit}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>PRODUCT</td>
                <td style={{ ...style.cell }}>{item?.ProductCode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintMaterialCut = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '400px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ border: 'solid 3px black', width: '200px' }} rowSpan={7}>
                  {item?.LotStatus == '003' && (
                    <p style={{ fontWeight: '600', fontSize: '23', marginBottom: 10, marginTop: 0 }}>NG</p>
                  )}
                  {item?.MaterialLotCode && <QRCode value={`${item?.MaterialLotCode}`} size={160} />}
                  <p className="mt-5" style={{ fontWeight: '600', fontSize: '23' }}>
                    {item?.MaterialLotCode}
                  </p>
                </td>
                <td style={{ ...style.cell, width: '200px' }}>LOT NO</td>
                <td style={{ ...style.cell, width: '200px' }}>{item?.LotNo}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>NAME</td>
                <td style={{ ...style.cell }}>{item?.MaterialName}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>SIZE(mm*m)</td>
                <td style={{ ...style.cell }}>{`${item?.Width} x ${item?.Length}`}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>RECEIVED DATE</td>
                <td style={{ ...style.cell }}>{moment(item?.ReceivedDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>CUT DATE</td>
                <td style={{ ...style.cell }}>{moment(item?.createdDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>CUT WORKER</td>
                <td style={{ ...style.cell }}>{item?.StaffNameCut}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>PRODUCT</td>
                <td style={{ ...style.cell }}>{item?.ProductCode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintBundle = async (data) => {
  const style = {
    cell: {
      border: 'solid 3px black',
      fontWeight: '600',
      fontSize: '20',
    },
  };

  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '400px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td rowSpan={9} style={{ ...style.cell, width: '200px' }}>
                  <QRCode value={`${item?.BundleCode}`} size={180} />
                  <p className="mt-5">{item?.BundleCode}</p>
                </td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>NAME</td>
                <td style={{ ...style.cell }}>{item?.MaterialName}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>CODE</td>
                <td style={{ ...style.cell }}>{item?.MaterialCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>{item.MaterialUnit === 'EA' ? 'QTY' : 'SIZE(mm*m)'}</td>
                <td style={{ ...style.cell }}>
                  {item.MaterialUnit === 'EA'
                    ? item?.BundleLength * item?.QuantityInBundle
                    : `${item?.BundleWidth} x ${item?.BundleLength}`}
                </td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>LOT</td>
                <td style={{ ...style.cell }}>{item?.LotNo}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>
                  QUANTITY
                  <span style={{ display: 'block', marginTop: '-3px' }}>SỐ LƯỢNG</span>
                </td>
                <td style={{ ...style.cell }}>
                  {item?.QuantityInBundle}{' '}
                  {item.MaterialUnit === 'EA' ? 'BOX' : item?.QuantityInBundle > 1 ? 'ROLLS' : 'ROLL'}
                </td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>
                  MANUFACTURE DATE
                  <span style={{ display: 'block', marginTop: '-3px' }}>NGÀY SẢN XUẤT</span>
                </td>
                <td style={{ ...style.cell }}>{moment(item?.ManufactureDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>
                  EXPIRATION DATE
                  <span style={{ display: 'block', marginTop: '-3px' }}>NGÀY HẾT HẠN</span>
                </td>
                <td style={{ ...style.cell }}>{moment(item?.ExpirationDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>
                  RECEIVED DATE
                  <span style={{ display: 'block', marginTop: '-3px' }}>NGÀY NHẬN</span>
                </td>
                <td style={{ ...style.cell }}>{moment(item?.ReceivedDate).format('DD/MM/YYYY')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintSemiMMS = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '500px',
            height: '350px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td rowSpan={9} style={{ ...style.cell, width: '34%' }}>
                  {item?.LotStatus == '003' && (
                    <p style={{ fontWeight: '600', fontSize: '18', marginBottom: 10, marginTop: 0 }}>NG</p>
                  )}
                  <QRCode value={`${item?.SemiLotCode}`} size={140} />
                  <p className="mt-5">{item?.SemiLotCode}</p>
                </td>
                <td style={{ ...style.cell, width: '33%' }}>MODEL CODE</td>
                <td style={{ ...style.cell, width: '33%' }}>{item?.ProductCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>MODEL NAME</td>
                <td style={{ ...style.cell }}>{item?.ModelCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>PART NAME</td>
                <td style={{ ...style.cell }}>{item?.ProductName}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>DATE</td>
                <td style={{ ...style.cell }}>{moment(item?.createdDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>WORK SHIFT</td>
                <td style={{ ...style.cell }}>{item?.Shift == 'D' ? 'Day' : 'Night'}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>SERIAL</td>
                <td style={{ ...style.cell }}>{item?.SemiLotCode.slice(-3)}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>LINE</td>
                <td style={{ ...style.cell }}>{item?.LineName}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>QTY</td>
                <td style={{ ...style.cell }}>{Number(item?.ActualQty).toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>WO</td>
                <td style={{ ...style.cell }}>{item?.WOCode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintSemiAPP = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '500px',
            height: '350px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td rowSpan={7} style={{ ...style.cell, width: '34%' }}>
                  {item?.LotStatus == '003' && (
                    <p style={{ fontWeight: '600', fontSize: '18', marginBottom: 10, marginTop: 0 }}>NG</p>
                  )}
                  <QRCode value={`${item?.SemiLotCode}`} size={140} />
                  <p className="mt-5">{item?.SemiLotCode}</p>
                </td>
                <td style={{ ...style.cell, width: '33%' }}>MODEL CODE</td>
                <td style={{ ...style.cell, width: '33%' }}>{item?.ProductCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>MODEL NAME</td>
                <td style={{ ...style.cell }}>{item?.ModelCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>PART NAME</td>
                <td style={{ ...style.cell }}>{item?.ProductName}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>DATE</td>
                <td style={{ ...style.cell }}>{moment(item?.createdDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>WORK SHIFT</td>
                <td style={{ ...style.cell }}>{item?.Shift == 'D' ? 'Day' : 'Night'}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>SERIAL</td>
                <td style={{ ...style.cell }}>{item?.SemiLotCode.slice(-3)}</td>
              </tr>
              {/* <tr>
                <td style={{ ...style.cell }}>LINE</td>
                <td style={{ ...style.cell }}>{item?.LineName}</td>
              </tr> */}
              <tr>
                <td style={{ ...style.cell }}>QTY</td>
                <td style={{ ...style.cell }}> {Number(item?.ActualQty).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintSemiFQC = async (data) => {
  const style = {
    cell: {
      border: 'solid 3px black',
      fontWeight: '600',
      fontSize: '21',
    },
  };

  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '400px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td rowSpan={6} style={{ ...style.cell, width: '36%' }}>
                  {item?.LotStatus == '003' && (
                    <p style={{ fontWeight: '600', fontSize: '23', marginBottom: 10, marginTop: 0 }}>NG</p>
                  )}
                  <QRCode value={`${item?.SemiLotCode}`} size={170} />
                  <p className="mt-5">{item?.SemiLotCode}</p>
                </td>
                <td style={{ ...style.cell, width: '32%' }}>PRODUCT CODE</td>
                <td style={{ ...style.cell, width: '32%' }}>{item?.ProductCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>DATE</td>
                <td style={{ ...style.cell }}>{moment(item?.createdDate).format('DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>WORK SHIFT</td>
                <td style={{ ...style.cell }}>{item?.Shift == 'D' ? 'Day' : 'Night'}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>SERIAL</td>
                <td style={{ ...style.cell }}>{item?.SemiLotCode.slice(-3)}</td>
              </tr>
              {/* <tr>
                <td style={{ ...style.cell }}>LINE</td>
                <td style={{ ...style.cell }}>{item?.LineName}</td>
              </tr> */}
              <tr>
                <td style={{ ...style.cell }}>QTY</td>
                <td style={{ ...style.cell }}>{Number(item?.ActualQty).toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>WO</td>
                <td style={{ ...style.cell }}>{item?.WOCode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintBuyer = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '300px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            {item.Stamps == 'SDV1' ? (
              <tbody>
                <tr>
                  <td style={{ ...style.cell }} colSpan={3}>
                    {item.BuyerQR}
                  </td>
                </tr>
                <tr>
                  <td rowSpan={7} style={{ ...style.cell, width: '26%' }}>
                    <QRCode value={item.BuyerQR} size={120} />
                  </td>
                  <td style={{ ...style.cell, width: '37%' }}>Material Code</td>
                  <td style={{ ...style.cell, width: '37%' }}>{item?.ProductCode}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>SDV Product</td>
                  <td style={{ ...style.cell }}>{item?.ModelName}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Supplier (Factory)</td>
                  <td style={{ ...style.cell }}>{item?.Vendor}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Quantity</td>
                  <td style={{ ...style.cell }}>{Number(item?.PackingAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Lot No</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Expiration date</td>
                  <td style={{ ...style.cell }}>
                    {item?.ExpiryDate != null && moment(item?.ExpiryDate).format('YYYY-MM-DD')}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>REV</td>
                  <td style={{ ...style.cell }}>{item?.SSVersion}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}></td>
                  <td style={{ ...style.cell }}>Remarks</td>
                  <td style={{ ...style.cell }}>{item?.RemarkBuyer}</td>
                </tr>
              </tbody>
            ) : item.Stamps == 'SDV3' ? (
              <tbody>
                <tr>
                  <td rowSpan={2} style={{ ...style.cell, width: '26%' }}></td>
                  <td style={{ ...style.cell, width: '37%' }}>Material Code</td>
                  <td style={{ ...style.cell, width: '37%' }}>{item?.ProductCode}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>SDV Product</td>
                  <td style={{ ...style.cell }}>{item?.ModelName}</td>
                </tr>
                <tr>
                  <td rowSpan={6} style={{ ...style.cell, width: '26%' }}>
                    <QRCode value={item.BuyerQR} size={120} />
                  </td>
                  <td style={{ ...style.cell }}>Supplier (Factory)</td>
                  <td style={{ ...style.cell }}>{item?.Vendor}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Quantity</td>
                  <td style={{ ...style.cell }}>{Number(item?.PackingAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Lot No</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Expiration date</td>
                  <td style={{ ...style.cell }}>
                    {item?.ExpiryDate != null && moment(item?.ExpiryDate).format('YYYY-MM-DD')}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Remarks</td>
                  <td style={{ ...style.cell }}>{item?.RemarkBuyer}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>REV</td>
                  <td style={{ ...style.cell }}>{item?.SSVersion}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }} colSpan={3}>
                    {item.BuyerQR}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody style={{ backgroundColor: 'yellow' }}>
                <tr>
                  <td
                    rowSpan={3}
                    style={{ ...style.cell, width: '26%', backgroundColor: 'white', borderBottom: 'none' }}
                  >
                    <img
                      src={require('@static/dist/img/logo-company.png')}
                      alt="Company Logo"
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td style={{ ...style.cell, width: '74%', backgroundColor: 'white' }} colSpan={2}>
                    ESD
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Model code</td>
                  <td style={{ ...style.cell }}>{item?.ProductCode}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>SDV Product</td>
                  <td style={{ ...style.cell }}>{item?.ModelName}</td>
                </tr>
                <tr>
                  <td rowSpan={7} style={{ ...style.cell, width: '26%', backgroundColor: 'white', borderTop: 'none' }}>
                    <QRCode value={item.BuyerQR} size={120} />
                  </td>
                  <td style={{ ...style.cell, width: '37%', textAlign: 'left' }}>Supplier (Factory)</td>
                  <td style={{ ...style.cell, width: '37%' }}>{item?.Vendor}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Quantity</td>
                  <td style={{ ...style.cell }}>{Number(item?.PackingAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Lot No</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Expiration date</td>
                  <td style={{ ...style.cell }}>
                    {item?.ExpiryDate != null && moment(item?.ExpiryDate).format('DD/MM/YYYY')}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>REV</td>
                  <td style={{ ...style.cell }}>{item?.SSVersion}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Remarks</td>
                  <td style={{ ...style.cell }}>{item?.RemarkBuyer}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }} colSpan={2}>
                    {item.BuyerQR}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintBoxQR = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '300px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            {item.Stamps == 'SDV1' ? (
              <tbody>
                <tr>
                  <td style={{ ...style.cell }} colSpan={3}>
                    {item.BoxQR}
                  </td>
                </tr>
                <tr>
                  <td rowSpan={7} style={{ ...style.cell, width: '30%' }}>
                    <QRCode value={item.BoxQR} size={150} />
                  </td>
                  <td style={{ ...style.cell, width: '35%' }}>Material Code</td>
                  <td style={{ ...style.cell, width: '35%' }}>{item?.ProductCode}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>SDV Product</td>
                  <td style={{ ...style.cell }}>{item?.ModelName}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Supplier (Factory)</td>
                  <td style={{ ...style.cell }}>{item?.Vendor}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Quantity</td>
                  <td style={{ ...style.cell }}>{Number(item?.PackingAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Lot No</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Expiration date</td>
                  <td style={{ ...style.cell }}>
                    {item?.ExpiryDate != null && moment(item?.ExpiryDate).format('YYYY-MM-DD')}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>REV</td>
                  <td style={{ ...style.cell }}>{item?.SSVersion}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}></td>
                  <td style={{ ...style.cell }}>Remarks</td>
                  <td style={{ ...style.cell }}>{item?.RemarkBuyer}</td>
                </tr>
              </tbody>
            ) : item.Stamps == 'SDV3' ? (
              <tbody>
                <tr>
                  <td rowSpan={7} style={{ ...style.cell, width: '30%' }}>
                    <QRCode value={item.BoxQR} size={150} />
                  </td>
                  <td style={{ ...style.cell, width: '35%' }}>Material Code</td>
                  <td style={{ ...style.cell, width: '35%' }}>{item?.ProductCode}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>SDV Product</td>
                  <td style={{ ...style.cell }}>{item?.ModelName}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Supplier (Factory)</td>
                  <td style={{ ...style.cell }}>{item?.Vendor}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Quantity</td>
                  <td style={{ ...style.cell }}>{Number(item?.PackingAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Lot No</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>Expiration date</td>
                  <td style={{ ...style.cell }}>
                    {item?.ExpiryDate != null && moment(item?.ExpiryDate).format('YYYY-MM-DD')}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}>REV</td>
                  <td style={{ ...style.cell }}>{item?.SSVersion}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }}></td>
                  <td style={{ ...style.cell }}>Remarks</td>
                  <td style={{ ...style.cell }}>{item?.RemarkBuyer}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }} colSpan={3}>
                    {item.BoxQR}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody style={{ backgroundColor: 'yellow' }}>
                <tr>
                  <td
                    rowSpan={3}
                    style={{ ...style.cell, width: '26%', backgroundColor: 'white', borderBottom: 'none' }}
                  >
                    <img
                      src={require('@static/dist/img/logo-company.png')}
                      alt="Company Logo"
                      style={{ width: '100px' }}
                    />
                  </td>
                  <td style={{ ...style.cell, width: '74%' }} colSpan={2}>
                    ESD
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Model code</td>
                  <td style={{ ...style.cell }}>{item?.ProductCode}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>SDV Product</td>
                  <td style={{ ...style.cell }}>{item?.ModelName}</td>
                </tr>
                <tr>
                  <td rowSpan={8} style={{ ...style.cell, width: '26%', backgroundColor: 'white', borderTop: 'none' }}>
                    <QRCode value={item.BoxQR} size={120} />
                  </td>
                  <td style={{ ...style.cell, width: '37%', textAlign: 'left' }}>Supplier (Factory)</td>
                  <td style={{ ...style.cell, width: '37%' }}>{item?.Vendor}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Quantity</td>
                  <td style={{ ...style.cell }}>{Number(item?.PackingAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Expiration date</td>
                  <td style={{ ...style.cell }}>
                    {item?.ExpiryDate != null && moment(item?.ExpiryDate).format('DD/MM/YYYY')}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>REV</td>
                  <td style={{ ...style.cell }}>{item?.SSVersion}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Remarks</td>
                  <td style={{ ...style.cell }}>{item?.RemarkBuyer}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Delivery date</td>
                  <td style={{ ...style.cell }}>
                    {item?.DeliveryDate != null && moment(item?.DeliveryDate).format('DD/MM/YYYY')}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...style.cell, textAlign: 'left' }}>Delivery Lot</td>
                  <td style={{ ...style.cell }}>{item?.LotNo}</td>
                </tr>
                <tr>
                  <td style={{ ...style.cell }} colSpan={2}>
                    {item.BoxQR}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintLine = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '400px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ border: 'solid 3px black', width: '200px' }}>
                  {item?.LineId && <QRCode value={`${item?.LineId}`} size={250} />}
                </td>
              </tr>
              <tr>
                <td style={{ ...style.cell, fontSize: '30' }}>{item?.LineName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintStaff = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '400px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ border: 'solid 3px black', width: '200px' }}>
                  {item?.StaffId && <QRCode value={`${item?.StaffId}`} size={220} />}
                </td>
              </tr>
              <tr>
                <td style={{ ...style.cell, fontSize: '30' }}>{item?.StaffCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell, fontSize: '30' }}>{item?.StaffName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintLocation = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '600px',
            height: '400px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ border: 'solid 3px black', width: '200px' }}>
                  {item?.LocationId && <QRCode value={`${item?.LocationId}`} size={220} />}
                </td>
              </tr>
              <tr>
                <td style={{ ...style.cell, fontSize: '30' }}>{item?.AreaCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell, fontSize: '30' }}>{item?.LocationCode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};

export const PrintPressLot = async (data) => {
  if (data) {
    const newWindow = window.open('', '', 'width=2000,height=1000');
    const componentContent = data?.map((item, index) => {
      return (
        <div
          style={{
            pageBreakAfter: 'always',
            width: '500px',
            height: '350px',
            marginLeft: '-8px',
            marginTop: index == 0 ? '-8px' : '0px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}
        >
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td rowSpan={4} style={{ ...style.cell, width: '34%' }}>
                  <QRCode value={`${item?.PressLotCode}`} size={140} />
                </td>
                <td style={{ ...style.cell, width: '33%' }}>MODEL</td>
                <td style={{ ...style.cell, width: '33%' }}>{item?.ModelCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>LOT</td>
                <td style={{ ...style.cell }}>{item?.PressLotCode}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>SERIAL</td>
                <td style={{ ...style.cell }}>{item?.Serial}</td>
              </tr>
              <tr>
                <td style={{ ...style.cell }}>Qty</td>
                <td style={{ ...style.cell }}>{item?.OriginQty}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
    const htmlContent = ReactDOMServer.renderToString(componentContent);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};
