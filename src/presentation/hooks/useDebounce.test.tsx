import React from 'react';
import {act, render, screen } from '@testing-library/react';
import useDebounce from './useDebounce'; 

function TestComponent ({value}:{value:string}){
    const debouncedValue = useDebounce(value, 1000);
    return <div data-testid="debouncedValue">{debouncedValue}</div>;
};

beforeEach(function(){
    jest.useFakeTimers();
});

test('useDebounce should debounce value', () => {
    const { rerender } = render(<TestComponent value="abc" />)
    expect(screen.getByTestId('debouncedValue')).toHaveTextContent('abc');
    
    rerender(<TestComponent value="defg" />);
    expect(screen.getByTestId('debouncedValue')).toHaveTextContent('abc');
    
    act(()=>{
        jest.runAllTimers();
    });
    expect(screen.getByTestId('debouncedValue')).toHaveTextContent('defg');
});