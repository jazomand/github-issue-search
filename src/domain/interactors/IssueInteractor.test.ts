import Issue from '../../domain/entities/Issue';
import IssueRepository from '../../domain/data/IssueRepository';
import IssueInteractor from './IssueInteractor';

const mockIssues : Array<Issue> = [
    new Issue(
        1, 'ReallyBigIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'open', new Date(), null, null, 'This is a reallyBigIssue'),
    new Issue(
        2, 'ReallySmallIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallySmallIssue'),
    new Issue(
        3, 'ReallyAnIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallyAnIssue'),
    new Issue(
        4, 'ReallyYIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallyYIssue'),
    new Issue(
        5, 'ReallyZIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallyZIssue'),
    new Issue(
        6, 'ReallyXIssue', [], 
            'https://issueurl.com', 'https://repositoryurl.com', 
            'closed', new Date(), null, null, 'This is a reallyXIssue'),
];

class MockIssueRepository implements IssueRepository {
    public getAll = () :Promise<Issue[]> => {
        return Promise.resolve(mockIssues);
    }
    public search = (text: string) : Promise<Issue[]> => {
        return Promise.resolve(mockIssues);
    }
}

test('IssueInteractor getAll', async () => {
    const issueInteractor = new IssueInteractor(new MockIssueRepository());
    const all = await issueInteractor.getAll();
    expect(all).toHaveLength(6);
});

test('IssueInteractor search', async () => {
    const issueInteractor = new IssueInteractor(new MockIssueRepository());
    const search = await issueInteractor.search('dummy');
    expect(search).toHaveLength(6);
});

test('IssueInteractor getMatchingWords', () => {
    const issueInteractor = new IssueInteractor(new MockIssueRepository());
    const words = issueInteractor.getMatchingWords('real', mockIssues);
    expect(words).toHaveLength(10);
    ['reallyBigIssue', 'ReallyBigIssue', 'reallySmallIssue', 'ReallySmallIssue', 'reallyAnIssue', 
     'ReallyAnIssue', 'reallyYIssue', 'ReallyYIssue', 'reallyZIssue', 'ReallyZIssue'].forEach(word=>{
        expect(words).toContainEqual(word);
    });
});