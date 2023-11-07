import {StaggeredItemSpan} from "./StaggeredGridModel";
import {createContext, useContext} from "solid-js";

export type StaggeredGridContextType = {
    updateItem: (index: number, itemColumnSpan: StaggeredItemSpan | number, height: number, update: (width: number, x: number, y: number) => void) => void,
    removeItem: (index: number) => void,
}

const defaultValue = {
    updateItem: () => {
    },
    removeItem: () => {
    },
}

export const StaggeredGridContext = createContext<StaggeredGridContextType>(defaultValue)

export function useStaggeredGrid() {
    return useContext(StaggeredGridContext)
}

