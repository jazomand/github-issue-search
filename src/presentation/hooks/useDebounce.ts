import React, {useState, useEffect } from 'react';

export default (value: string, delay: number) : string => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(()=>{
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    return debouncedValue;
};