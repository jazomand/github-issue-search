import GithubIssue from './entities/GithubIssue';
import GithubIssuesRepository from './GithubIssuesRepository';

const mockIssues : GithubIssue[] = [
    new GithubIssue(
        1, 'ReallyBigIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 'https://labelsurl.com', 
        'https://commentsurl.com', 'https://eventsurl.com', 'httpe://htmlurl.com', 'nodeId', 1,
        'open', '2020-01-01T01:01:01', null, null, 'This is a reallyBigIssue', 1),
    new GithubIssue(
        2, 'ReallySmallIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 'https://labelsurl.com', 
        'https://commentsurl.com', 'https://eventsurl.com', 'httpe://htmlurl.com', 'nodeId', 1,
        'open', '2020-02-02T02:0@:02', null, null, 'This is a reallySmallIssue', 1)
];

test('GithubIssuesRepository getAll', async () => {
    const originalFetch = (<any>global).fetch;
    const fetchMock = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(mockIssues),
    }));
    (<any>global).fetch = fetchMock;
    const repo = new GithubIssuesRepository();
    const all = await repo.getAll();
    expect(all).toHaveLength(2);
    (<any>global).fetch = originalFetch;
});

test('GithubIssuesRepository search', async () => {
    const originalFetch = (<any>global).fetch;
    const fetchMock = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({items: mockIssues}),
    }));
    (<any>global).fetch = fetchMock;
    const repo = new GithubIssuesRepository();
    const search = await repo.search('dummy');
    expect(search).toHaveLength(2);
    (<any>global).fetch = originalFetch;
});