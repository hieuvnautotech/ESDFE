import { dateToTicks } from '@utils';
import moment from 'moment';

const MoldCheckFormDto = {
  MoldId: 0,
  QCMasterId: 0,
  QCMasterName: '',
  CheckNo: 0,
  MoldCheckMasterId: dateToTicks(new Date()),
  UpdateAvailable: true,
  StaffId: 0,
  StaffName: '',
  CheckDate: moment(),
  CheckResult: true,
  MoldCheckDetailTextDtos: [],
  MoldCheckDetailValueDtos: [],
};

export default MoldCheckFormDto;
