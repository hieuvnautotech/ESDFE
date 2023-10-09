import DashBoard from './dashBoard';
import NavBar from './dashBoard/navbar';
import ChangeLanguage from './dashBoard/ChangeLanguage';
import Login from './login/Login';
import LanguageSelect from './login/LanguageSelect';
import ContentBox from './dashBoard/ContentBox';
import SuperAdminDashboard from './dashBoard/SuperAdminDashboard';
import TabListContent from './dashBoard/TabListContent';

//Apk app
import VersionApp from './standard_db/Configuration/VersionApp/VersionApp';

//STANDARD
//STANDARD - Configuration
import Menu from './standard_db/Configuration/Menu/Menu';
import Permission from './standard_db/Configuration/Permission/Permission';
import User from './standard_db/Configuration/User/User';
import Role from './standard_db/Configuration/Role/Role';
import Document from './standard_db/Configuration/Document/Document';
import Common from './standard_db/Configuration/Common/CommonMaster';

//STANDARD - Information
import Staff from './standard_db/Information/Staff/Staff';
import Material from './standard_db/Information/Material/Material';
import Mold from './standard_db/Information/Mold/Mold';
import Line from './standard_db/Information/Line/Line';
import Buyer from './standard_db/Information/Buyer/Buyer';
import Supplier from './standard_db/Information/Supplier/Supplier';
import Bom from './standard_db/Information/Bom/Bom';
import Product from './standard_db/Information/Product/Product';
import Model from './standard_db/Information/Model/Model';
import Blade from './standard_db/Information/Blade/Blade';
import Location from './standard_db/Information/Location/Location';
import Routing from './standard_db/Information/Routing/Routing';
import Staff2 from './standard_db/Information/Staff2/Staff2';

// WMS - Material
import IQCReceiving from './WMS/Material/IQCReceiving/IQCReceiving';
import MaterialPutAway from './WMS/Material/PutAway/MaterialPutAway';
import MaterialSO from './WMS/Material/ShippingOrder/MaterialSO';
import MaterialSC from './WMS/Material/Shipping/MaterialSC';
import MaterialStock from './WMS/Material/Stock/MaterialStock';
import MaterialReturn from './WMS/Material/Return/MaterialReturn';
import SplitMergeMaterial from './WMS/Material/Split_Merge/SplitMergeMaterial';

//QMS
import StandardQC from './QMS/StandardQC/StandardQC';
import QCMaster from './QMS/QCSOP/QCMaster';
import Holding from './QMS/Holding/Holding';
import QMSReport from './QMS/QMSReport/QMSReport';

// SLIT
import SlitReceiving from './Slit/Receiving/SlitReceiving';
import SlitPutAway from './Slit/PutAway/SlitPutAway';
import SlitSO from './Slit/ShippingOrder/SlitShippingOrder';
import SlitShippingScan from './Slit/ShippingScan/SlitShippingScan';
import SlitStock from './Slit/Stock/SlitStock';
import SlitReturn from './Slit/Return/SlitReturn';
import SlitOrder from './Slit/SlitOrder/SlitOrder';
import SplitSize from './Slit/SplitSize/SplitSize';

//PO
import PO from './standard_db/Information/PO/PO';

// WMS - WIP
import WIPReceiving from './WMS/WIP/Receiving/WIPReceiving';
import WIPStock from './WMS/WIP/Stock/WIPStock';
import WIPReturn from './WMS/WIP/Return/WIPReturn';

//MMS - WO
import WorkOrder from './MMS/WO/WorkOrder';
import LineStock from './MMS/LineStock/LineStock';
import MMSReturnMaterial from './MMS/ReturnMaterial/MMSReturnMaterial';

//FQC
import FQCRouting from './FQC/Routing/FQCRouting';
import FQCReceiving from './FQC/Receiving/FQCReceiving';
import FQCOQC from './FQC/OQC/FQCOQC';
import FQCActual from './FQC/Actual/FQCActual';
import FQCStock from './FQC/Stock/FQCStock';
import BuyerMapping from './FQC/BuyerMapping/BuyerMapping';
import BuyerCode from './FQC/BuyerQR/BuyerCode';
import FQCShipping from './FQC/Shipping/FQCShipping';

//KPI
import KPIProductivity from './KPI/KPIProductivity';
import QCKPI from './KPI/QCKPI/QCKPI';
import KPIEffective from './KPI/KPIEffective';
import Q2Management from './KPI/Q2_Management/Q2Management';

//FG
import FGReceiving from './WMS/FG/Receiving/FGReceiving';
import FGMapping from './WMS/FG/Mapping/FGMapping';
import FGStock from './WMS/FG/Stock/FGStock';
import FGShippingOrder from './WMS/FG/ShippingOrder/FGShippingOrder';

//History
import HistoryReplacementSemiLot from './History/Replacement/HistoryReplacementSemiLot';
import LotTracking from './History/LotTracking/LotTracking';
import Status from './History/Status/Status';

export {
  //SYSTEM
  TabListContent,
  DashBoard,
  NavBar,
  ChangeLanguage,
  Login,
  LanguageSelect,
  ContentBox,
  SuperAdminDashboard,

  //STANDARD
  //STANDARD - Configuration
  Menu,
  Permission,
  User,
  Common,
  Role,
  VersionApp,
  Document,

  //STANDARD - Information
  Staff,
  Material,
  Mold,
  Line,
  Buyer,
  Supplier,
  Bom,
  Product,
  Model,
  Blade,
  Location,
  Routing,
  //WMS - Material
  IQCReceiving,
  MaterialPutAway,
  MaterialSO,
  MaterialSC,
  MaterialStock,
  MaterialReturn,
  SplitMergeMaterial,
  Staff2,
  //QMS
  StandardQC,
  QCMaster,
  QMSReport,
  Holding,
  //SLIT
  SlitReceiving,
  SlitPutAway,
  SlitSO,
  SlitShippingScan,
  SlitStock,
  SlitReturn,
  SlitOrder,
  SplitSize,

  //PO
  PO,

  // WMS - WIP
  WIPReceiving,
  WIPStock,
  WIPReturn,

  //MMS - WO
  WorkOrder,
  LineStock,
  MMSReturnMaterial,

  //FQC
  FQCRouting,
  FQCReceiving,
  FQCActual,
  FQCOQC,
  FQCStock,
  FQCShipping,
  BuyerMapping,
  BuyerCode,

  //KPI
  KPIProductivity,
  QCKPI,
  KPIEffective,
  Q2Management,

  //FG
  FGReceiving,
  FGMapping,
  FGStock,
  FGShippingOrder,

  //History
  HistoryReplacementSemiLot,
  LotTracking,
  Status,
};
