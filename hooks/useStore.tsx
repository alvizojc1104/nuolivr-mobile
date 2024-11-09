import { create } from 'zustand';

interface StoreState {
    ocularMotilitySketchOD: string | null;
    ocularMotilitySketchOS: string | null;
    cornealImgUrl: string | null;
    setCornealImgUrl: (uri: string) => void;
    removeCornealImgUrl: () => void;
    setOcularMotilitySketchOD: (uri: string) => void;
    setOcularMotilitySketchOS: (uri: string) => void;
    removeOcularMotilitySketchOD: () => void;
    removeOcularMotilitySketchOS: () => void;
    removeSketchesUrl: () => void;
}

const useStore = create<StoreState>((set) => ({
    ocularMotilitySketchOD: null,
    ocularMotilitySketchOS: null,
    cornealImgUrl: null,
    setOcularMotilitySketchOD: (uri) => set({ ocularMotilitySketchOD: uri }),
    setOcularMotilitySketchOS: (uri) => set({ ocularMotilitySketchOS: uri }),
    setCornealImgUrl: (uri) => set({ cornealImgUrl: uri }),
    removeOcularMotilitySketchOD: () => set({ ocularMotilitySketchOD: null }),
    removeOcularMotilitySketchOS: () => set({ ocularMotilitySketchOS: null }),
    removeCornealImgUrl: () => set({ cornealImgUrl: null }),
    removeSketchesUrl: () => set({ ocularMotilitySketchOD: null, ocularMotilitySketchOS: null })
}));

export default useStore;
