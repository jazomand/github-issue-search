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
import AsyncSearchWithRedux from './AsyncSearchWithRedux';
import configureStore from './redux/store';
import { Provider } from 'react-redux';

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
    public search = async (text: string) : Promise<Issue[]> => Promise.resolve(mockIssues);
    public getSuggestions = (text: string, issues: Issue[]) : string[] => [text, text];
}

class MockEmptyIssueInteractor extends IssueInteractor {
    constructor(){
        super(new MockIssueRepository());
    }
    public search = (text: string) : Promise<Issue[]> => Promise.resolve([]);
    public getSuggestions = (text: string, issues: Issue[]) : string[] => [];
}

beforeEach(function(){
    jest.useFakeTimers();
});

test('AsyncSearchWithRedux renders without data', async () => {
    const promise = Promise.resolve();
    const mockIssueInteractor : IssueInteractor = new MockEmptyIssueInteractor();
    const store = configureStore(mockIssueInteractor);
    const {asFragment} = render(
        <Provider store={store}>
            <AsyncSearchWithRedux />
        </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    await act(() => promise);
    
    expect(screen.queryByTestId(`card-title-1`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`card-title-2`)).not.toBeInTheDocument();
});

test('AsyncSearchWithRedux renders with data', async () => {
    const promise = Promise.resolve();
    const mockIssueInteractor : IssueInteractor = new MockIssueInteractor();
    const store = configureStore(mockIssueInteractor);
    const {asFragment} = render(
        <Provider store={store}>
            <AsyncSearchWithRedux />
        </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    await act(() => promise);
    
    expect(screen.getByTestId(`card-title-1`)).toHaveTextContent('ReallyBigIssue');
    expect(screen.getByTestId(`card-title-2`)).toHaveTextContent('ReallySmallIssue');
});

test('AsyncSearchWithRedux autocomplete with data', async () => {
    const promise = Promise.resolve();
    const mockIssueInteractor : IssueInteractor = new MockIssueInteractor();
    const store = configureStore(mockIssueInteractor);
    render(
        <Provider store={store}>
            <AsyncSearchWithRedux />
        </Provider>
    );
    expect(screen.queryByText(/superText/)).toBeNull();
    
    //write text
    fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'superText' },
    });
    //debounce text
    act(()=>{
        jest.runAllTimers();
    });
    //wait for all async calls to finish
    await act(async ()=>{
        await flushPromises();
    });
    expect(screen.queryAllByText(`superText`)).toHaveLength(2);
    
    await act(() => promise);
});

test('AsyncSearchWithRedux autocomplete without data', async () => {
    const promise = Promise.resolve();
    
    const mockIssueInteractor : IssueInteractor = new MockEmptyIssueInteractor();
    const store = configureStore(mockIssueInteractor);
    render(
        <Provider store={store}>
            <AsyncSearchWithRedux />
        </Provider>
    );
    expect(screen.queryByText(/superText/)).toBeNull();
    
    //write text
    fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'superText' },
    });
    //debounce text
    act(()=>{
        jest.runAllTimers();
    });
    //wait for all async calls to finish
    await act(async ()=>{
        await flushPromises();
    });
    expect(screen.queryAllByText(`superText`)).toHaveLength(0);
    
    await act(() => promise);
});