import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

function useCompareState<T>(initialState?: T) {
    const [currentState, setCurrentState] = useState<T | undefined>(initialState);
    const originalStateRef = useRef<T | undefined>(initialState ? _.cloneDeep(initialState) : undefined);

    const isModified = originalStateRef.current !== undefined && !_.isEqual(originalStateRef.current, currentState);

    const updateCurrentState = (newState: T | ((prevState: T | undefined) => T)) => {
        setCurrentState((prev) =>
            typeof newState === 'function' ? (newState as (prev: T | undefined) => T)(prev) : newState
        );
    };

    const setReference = (newReference: T) => {
        originalStateRef.current = _.cloneDeep(newReference);
        setCurrentState(newReference);
    };

    const resetState = () => {
        if (originalStateRef.current) {
            setCurrentState(_.cloneDeep(originalStateRef.current));
        }
    };

    useEffect(() => {
        if (initialState !== undefined) {
            originalStateRef.current = _.cloneDeep(initialState);
            setCurrentState(initialState);
        }
    }, [initialState]);

    return {
        currentState,
        setCurrentState: updateCurrentState,
        setReference,
        isModified,
        resetState,
    };
}

export default useCompareState;
