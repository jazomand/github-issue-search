import React from 'react';
import { 
  render,
} from '@testing-library/react';
import App from './App';
import configureStore from './presentation/components/redux/store';
import IssueInteractor from './domain/interactors/IssueInteractor';
import Issue from './domain/entities/Issue';
import IssueRepository from './domain/data/IssueRepository';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';

class MockIssueRepository implements IssueRepository {
  public getAll = () :Promise<Issue[]> => {
      return Promise.resolve([]);
  }
  public search = (text: string) : Promise<Issue[]> => {
      return Promise.resolve([]);
  }
}

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

class MockIssueInteractor extends IssueInteractor {
  constructor(){
      super(new MockIssueRepository());
  }
  public getAll = () : Promise<Issue[]> => Promise.resolve(mockIssues);
  public getMatchingWords = (text: string, issues: Issue[]) : string[] => [text, text];
}

test('App renders correctly', async () => {
  const promise = Promise.resolve();
  const mockIssueInteractor : IssueInteractor = new MockIssueInteractor();
  const store = configureStore(mockIssueInteractor);
  const {asFragment} = render(
    <Provider store={store}>
      <App issueInteractor={mockIssueInteractor} />
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();
  await act(() => promise);
});
