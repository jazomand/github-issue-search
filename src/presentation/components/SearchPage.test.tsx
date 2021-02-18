import React from 'react';
import { 
    act,
  render,
} from '@testing-library/react';
import SearchPage from './SearchPage';
import IssueInteractor from '../../domain/interactors/IssueInteractor';
import IssueRepository from '../../domain/data/IssueRepository';
import Issue from '../../domain/entities/Issue';

class MockIssueRepository implements IssueRepository {
    public getAll = () :Promise<Issue[]> => {
        return Promise.resolve([]);
    }
    public search = (text: string) : Promise<Issue[]> => {
        return Promise.resolve([]);
    }
}

class MockIssueInteractor extends IssueInteractor {
    constructor(){
        super(new MockIssueRepository());
    }
    public getAll = () : Promise<Issue[]> => Promise.resolve([]);
    public getMatchingWords = (text: string, issues: Issue[]) : string[] => [];
}

test('SearchPage renders correctly', async () => {
    const promise = Promise.resolve();
    const mockIssueInteractor : IssueInteractor = new MockIssueInteractor();
    const {asFragment} = render(<SearchPage issueInteractor={mockIssueInteractor} />);
    expect(asFragment()).toMatchSnapshot();
    await act(() => promise);
});