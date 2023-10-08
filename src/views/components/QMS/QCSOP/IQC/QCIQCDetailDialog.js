import { MuiDialog } from '@controls';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import QCIQCDetailMaterial from './QCIQCDetailMaterial';
import QCIQCDetailRawMaterial from './QCIQCDetailRawMaterial';

const QCIQCDetailDialog = ({ isOpen, onClose, QCIQCMasterId, IQCType }) => {
  const intl = useIntl();
  const [dialogState, setDialogState] = useState({ isSubmit: false });

  return (
    <React.Fragment>
      <MuiDialog
        maxWidth="xl"
        title={intl.formatMessage({ id: 'qcIQC.Detail' })}
        isOpen={isOpen}
        disabledCloseBtn={dialogState.isSubmit}
        disable_animate={300}
        onClose={onClose}
      >
        {IQCType == 'RM' ? (
          <QCIQCDetailRawMaterial
            QCIQCMasterId={QCIQCMasterId}
            isOpen={isOpen}
            dialogState={dialogState}
            setDialogState={setDialogState}
          />
        ) : (
          <QCIQCDetailMaterial
            QCIQCMasterId={QCIQCMasterId}
            isOpen={isOpen}
            dialogState={dialogState}
            setDialogState={setDialogState}
          />
        )}
      </MuiDialog>
    </React.Fragment>
  );
};

export default QCIQCDetailDialog;
