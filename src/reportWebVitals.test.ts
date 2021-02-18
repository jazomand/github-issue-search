import React from 'react';
import reportWebVitals from './reportWebVitals'; 

test('reportWebVitals should report to passing function', () => {
    const onPerfEntry = jest.fn();
    reportWebVitals(onPerfEntry);
});