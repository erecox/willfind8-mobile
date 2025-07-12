import { create } from "zustand";

interface ColumnLayoutState {
    columns: number;
    toggleColumns: () => void;
}

const useColumnLayout = create<ColumnLayoutState>((set) => ({
    columns: 2,
    toggleColumns: () => set((state) => ({ columns: state.columns === 1 ? 2 : 1 }))
}))

export { useColumnLayout };