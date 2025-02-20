import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StoreState {
    ocularMotilitySketchOD: string | null;
    ocularMotilitySketchOS: string | null;
    cornealImgUrl: string | null;
    selectedModuleId: string | null;
    setCornealImgUrl: (uri: string) => void;
    removeCornealImgUrl: () => void;
    setOcularMotilitySketchOD: (uri: string) => void;
    setOcularMotilitySketchOS: (uri: string) => void;
    removeOcularMotilitySketchOD: () => void;
    removeOcularMotilitySketchOS: () => void;
    removeSketchesUrl: () => void;
    setSelectedModuleId: (id: string) => void;
    loadSelectedModuleId: () => void;
    clearSelectedModuleId: () => void;
}

const useStore = create<StoreState>((set) => ({
    ocularMotilitySketchOD: null,
    ocularMotilitySketchOS: null,
    cornealImgUrl: null,
    selectedModuleId: null,
    setOcularMotilitySketchOD: (uri) => set({ ocularMotilitySketchOD: uri }),
    setOcularMotilitySketchOS: (uri) => set({ ocularMotilitySketchOS: uri }),
    setCornealImgUrl: (uri) => set({ cornealImgUrl: uri }),
    removeOcularMotilitySketchOD: () => set({ ocularMotilitySketchOD: null }),
    removeOcularMotilitySketchOS: () => set({ ocularMotilitySketchOS: null }),
    removeCornealImgUrl: () => set({ cornealImgUrl: null }),
    removeSketchesUrl: () => set({ ocularMotilitySketchOD: null, ocularMotilitySketchOS: null }),
    setSelectedModuleId: async (id: string) => {
        await AsyncStorage.setItem('selectedModuleId', id);
        set({ selectedModuleId: id });
    },
    loadSelectedModuleId: async () => {
        const id = await AsyncStorage.getItem('selectedModuleId');
        if (id) {
            set({ selectedModuleId: id });
        }
    },
    clearSelectedModuleId: async () => {
        await AsyncStorage.removeItem('selectedModuleId');
        set({ selectedModuleId: null });
    }
}));

export default useStore;
