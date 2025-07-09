import Loader from "@/components/custom/loader";
import React, { createContext, useContext, useState } from "react";


interface LoaderContextType {
    loading: boolean;
    hideLoading: () => void;
    showLoading: () => void;
}
const LoadingContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderProviderProps {
    children: React.ReactNode;
}

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
    const [loading, setLoading] = useState(false);
    const showLoading = () => (setLoading(true));
    const hideLoading = () => (setLoading(false));

    return (
        <LoadingContext.Provider value={{ loading, hideLoading, showLoading }}>
            {children}
            {loading && <Loader />}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => useContext(LoadingContext);