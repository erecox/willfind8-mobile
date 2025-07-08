import { ThemeMode } from '@/types';
import { create } from 'zustand';

// Zustand store for managing theme mode

interface ThemeModeState {
    themeMode: ThemeMode;
    toggleThemeMode: () => void;
}

const useThemeMode = create<ThemeModeState>((set) => ({
    themeMode: 'light',
    toggleThemeMode: () => set((state) => ({
        themeMode: state.themeMode === 'light' ? 'dark' : 'light'
    }))
}));

export default useThemeMode;
