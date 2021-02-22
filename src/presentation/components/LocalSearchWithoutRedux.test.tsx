import React from 'react';
import {
    act,
    fireEvent,
    render,
    screen
} from '@testing-library/react';
import Issue from '../../domain/entities/Issue';
import IssueInteractor from '../../domain/interactors/IssueInteractor';
import IssueRepository from '../../domain/data/IssueRepository';
import LocalSearchWithoutRedux from './LocalSearchWithoutRedux';

const flushPromises = () => new Promise(setImmediate);

class MockIssueRepository implements IssueRepository {
    public getAll = () :Promise<Issue[]> => {
        return Promise.resolve([]);
    }
    public search = (text: string) : Promise<Issue[]> => {
        return Promise.resolve([]);
    }
}

const mockIssues : Issue[] = [
    new Issue(
        1, 'ReallyBigIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'open', new Date(), null, null, 'This is a reallyBigIssue'),
    new Issue(
        2, 'ReallySmallIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallySmallIssue'),
];

class MockIssueInteractor extends IssueInteractor {
    constructor(){
        super(new MockIssueRepository());
    }
    public getAll = () : Promise<Issue[]> => Promise.resolve(mockIssues);
    public getSuggestions = (text: string, issues: Issue[]) : string[] => [text, text];
}

class MockEmptyIssueInteractor extends IssueInteractor {
    constructor(){
        super(new MockIssueRepository());
    }
    public getAll = () : Promise<Issue[]> => Promise.resolve([]);
    public getSuggestions = (text: string, issues: Issue[]) : string[] => [];
}

beforeEach(function(){
    jest.useFakeTimers();
});

test('LocalSearchWithoutRedux renders without data', async () => {
    const promise = Promise.resolve();
    const mockIssueInteractor : IssueInteractor = new MockEmptyIssueInteractor();
    const {asFragment} = render(<LocalSearchWithoutRedux issueInteractor={mockIssueInteractor} />);
    expect(asFragment()).toMatchSnapshot();
    await act(() => promise);

    expect(screen.queryByTestId(`card-title-1`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`card-title-2`)).not.toBeInTheDocument();
});

test('LocalSearchWithoutRedux renders with data', async () => {
    const promise = Promise.resolve();
    const mockIssueInteractor : IssueInteractor = new MockIssueInteractor();
    const {asFragment} = render(<LocalSearchWithoutRedux issueInteractor={mockIssueInteractor} />);
    expect(asFragment()).toMatchSnapshot();
    await act(() => promise);

    expect(screen.getByTestId(`card-title-1`)).toHaveTextContent('ReallyBigIssue');
    expect(screen.getByTestId(`card-title-2`)).toHaveTextContent('ReallySmallIssue');
});

test('LocalSearchWithoutRedux autocomplete with data', async () => {
    const promise = Promise.resolve();
    
    const mockIssueInteractor : IssueInteractor = new MockIssueInteractor();
    render(<LocalSearchWithoutRedux issueInteractor={mockIssueInteractor} />);
    await act(async ()=>{
        await flushPromises();
    });

    expect(screen.queryByText(/superText/)).toBeNull();
    fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'superText' },
    });
    act(()=>{
        jest.runAllTimers();
    });
    expect(screen.queryAllByText(`superText`)).toHaveLength(2);
    
    await act(() => promise);
});

test('LocalSearchWithoutRedux autocomplete without data', async () => {
    const promise = Promise.resolve();
    
    const mockIssueInteractor : IssueInteractor = new MockEmptyIssueInteractor();
    render(<LocalSearchWithoutRedux issueInteractor={mockIssueInteractor} />);
    await act(async () => {
        await flushPromises();
    });
    expect(screen.queryByText(/superText/)).toBeNull();
    
    fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'superText' },
    });    
    act(()=>{
        jest.runAllTimers();
    });
    expect(screen.queryAllByText(`superText`)).toHaveLength(0);
    
    await act(() => promise);
});