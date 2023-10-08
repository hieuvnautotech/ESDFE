import { dateToTicks } from '@utils';
import moment from 'moment';

const BladeCheckFormDto = {
  BladeId: 0,
  QCMoldMasterId: 0,
  QCMoldMasterName: '',
  CheckNo: 0,
  BladeCheckMasterId: dateToTicks(new Date()),
  UpdateAvailable: true,
  StaffId: 0,
  StaffName: '',
  CheckDate: moment(),
  CheckResult: true,
  QCMoldDetailId: 0,
  QCTypeId: 0,
  QCItemId: 0,
  QCStandardId: 0,
  QCTypeName: '',
  QCItemName: '',
  QCStandardName: '',
  TextValue: 0,
};

export default BladeCheckFormDto;
