import moment from 'moment';
const QCIQCMasterDto = {
  QCIQCMasterId: 0,
  QCIQCMasterName: '',
  IQCType: '',
  Explain: '',
  IsConfirm: false,
  IsUse: false,
  isActived: true,
  createdBy: null,
  createdDate: moment(),
  modifiedDate: moment(),
  modifiedBy: null,
  row_version: null,
};

export default QCIQCMasterDto;
