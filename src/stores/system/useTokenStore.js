import { create } from 'zustand';

const useTokenStore = create((set) => ({
  WOId: null,
  setWOId: (inputToken) => set((state) => ({ WOId: inputToken })),
  WOProcessId: null,
  setWOProcessId: (inputToken) => set((state) => ({ WOProcessId: inputToken })),
  QCPQCMasterId: null,
  setQCPQCMasterId: (inputToken) => set((state) => ({ QCPQCMasterId: inputToken })),
  WOSemiLotMMSId: null,
  setWOSemiLotMMSId: (inputToken) => set((state) => ({ WOSemiLotMMSId: inputToken })),
  BomId: null,
  setBomId: (inputToken) => set((state) => ({ BomId: inputToken })),
  // listSemi: {
  //   WOSemiLotMMSId1: null,
  //   SemiLotCode1: null,
  // },
  // setWOSemiLotMMS: (inputToken) => set((state) => ({ listSemi: inputToken })),
}));

export default useTokenStore;
