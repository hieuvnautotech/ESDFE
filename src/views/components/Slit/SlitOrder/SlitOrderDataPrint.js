import React, { useEffect, useRef, useState } from 'react';
import { MuiDialog } from '@controls';
import { useIntl } from 'react-intl';
import { DialogContent, Typography } from '@mui/material';
import { SlitOrderService } from '@services';
import moment from 'moment';

export const SlitOrderDataPrint = ({ isShowing, onClose, rowMaster }) => {
  const intl = useIntl();
  const [dataPrint, setDataPrint] = useState([]);
  const componentPringtRef = React.useRef();

  useEffect(async () => {
    if (isShowing && rowMaster?.SlitOrderId) {
      const res = await SlitOrderService.getSlitOrderDetailList({
        SlitOrderId: rowMaster.SlitOrderId,
        page: 0,
        pageSize: 0,
        isActived: true,
      });
      setDataPrint(res.Data);
    }
  }, [rowMaster, isShowing]);

  const style = {
    header: {
      padding: '5px 15px',
      fontWeight: 600,
      maxWidth: '250px',
    },
    cell: {
      maxWidth: '250px',
    },
  };
  return (
    <MuiDialog
      maxWidth="xl"
      title={intl.formatMessage({ id: 'general.print' })}
      isOpen={isShowing}
      disable_animate={300}
      onClose={onClose}
      isShowButtonPrint
    >
      <DialogContent ref={componentPringtRef} sx={{ justifyContent: 'center' }}>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '1.5rem', textAlign: 'center' }}>
          Kế hoạch slit - cut vật tư ngày {moment(rowMaster?.OrderDate).format('DD/MM/YYYY')}
        </Typography>
        <table className="table-simple" style={{ width: '100%', marginTop: '20px' }}>
          <tbody>
            <tr>
              <td rowSpan="2" style={style.header}>
                STT
              </td>
              <td rowSpan="2" style={style.header}>
                PRODUCT
              </td>
              <td rowSpan="2" style={style.header}>
                TÊN VẬT TƯ
              </td>
              <td colSpan="2" style={style.header}>
                KÍCH THƯỚC
              </td>
              <td rowSpan="2" style={style.header}>
                SL ROLL
              </td>
              {/* <td rowSpan="2" style={style.header}>
                MÁY
              </td>
              <td rowSpan="2" style={style.header}>
                CÔNG NHÂN
              </td> */}
              <td rowSpan="2" style={style.header}>
                GHI CHÚ
              </td>
            </tr>
            <tr>
              <td style={style.header}>Rộng</td>
              <td style={style.header}>Dài (m)</td>
            </tr>
            {dataPrint?.map((item, index) => {
              return (
                <tr key={`LIST_${index}`}>
                  <td style={style.cell}>{index + 1}</td>
                  <td style={style.cell}>{item?.ProductCode}</td>
                  <td style={style.cell}>{item?.MaterialCode}</td>
                  <td style={style.cell}>{item?.Width}</td>
                  <td style={style.cell}>{item?.Length}</td>
                  <td style={style.cell}>{item?.OrderQty}</td>
                  {/* <td style={style.cell}>{item?.LineNames}</td>
                  <td style={style.cell}>{item?.StaffNames}</td> */}
                  <td style={style.cell}>{item?.Description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DialogContent>
    </MuiDialog>
  );
};
