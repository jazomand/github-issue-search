import React from 'react';
import { 
  render,
  screen
} from '@testing-library/react';
import SearchResults from './SearchResults';
import Issue from '../../domain/entities/Issue';

test('SearchResults renders correctly', () => {
    const mockIssues : Array<Issue> = [
        new Issue(
            1, 'ReallyBigIssue', [], 
            'https://issueurl.com', 'https://repositoryurl.com', 
            'open', new Date(), null, null, 'This is a reallyBigIssue'),
        new Issue(
            2, 'ReallySmallIssue', [], 
            'https://issueurl.com', 'https://repositoryurl.com', 
            'closed', new Date(), null, null, 'This is a reallySmallIssue'),
    ];
    const {asFragment} = render(<SearchResults issues={mockIssues} selectResult={false} setSelectResult={()=>{}} />);
    
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByTestId(`card-title-1`)).toHaveTextContent('ReallyBigIssue');
    expect(screen.getByTestId(`card-title-2`)).toHaveTextContent('ReallySmallIssue');
});