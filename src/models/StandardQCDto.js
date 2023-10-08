import moment from 'moment';
const StandardQCDto = {
  QCId: 0,
  QCType: '',
  QCName: '',
  QCApply: 0,
  isActived: true,
  createdBy: null,
  createdDate: moment(),
  modifiedDate: moment(),
  modifiedBy: null,
  row_version: null,
};

export default StandardQCDto;
