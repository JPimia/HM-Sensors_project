import { createContext, Dispatch, SetStateAction } from 'react';

export function createSensorContext() {
    return createContext<{
        selectedSensors: any[];
        setSelectedSensors: Dispatch<SetStateAction<any[]>> | undefined;
    }>({
        selectedSensors: [],
        setSelectedSensors: undefined,
    });
}
