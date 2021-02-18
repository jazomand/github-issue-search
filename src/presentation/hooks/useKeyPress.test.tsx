import React from 'react';
import {act, render, screen } from '@testing-library/react';
import useKeyPress, {keys} from './useKeyPress'; 

function TestComponent (){
    const downKeyPress = useKeyPress(keys.arrowDown.keyCode);
    return <div data-testid="keyPressValue">{downKeyPress ? 'keyDown' : 'keyUp'}</div>;
};

test('useKeyPress should handle a key press', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('keyPressValue')).toHaveTextContent('keyUp');
    act(()=>{
        window.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': keys.arrowDown.keyCode}));
    });
    expect(screen.getByTestId('keyPressValue')).toHaveTextContent('keyDown');
    act(()=>{
        window.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': keys.arrowDown.keyCode}));
    });
    expect(screen.getByTestId('keyPressValue')).toHaveTextContent('keyUp');
});