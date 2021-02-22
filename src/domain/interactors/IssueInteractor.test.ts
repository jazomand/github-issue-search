import Issue from '../../domain/entities/Issue';
import IssueRepository from '../../domain/data/IssueRepository';
import IssueInteractor from './IssueInteractor';

const mockIssues : Issue[] = [
    new Issue(
        1, 'ReallyBigIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'open', new Date(), null, null, 'This is a reallyBigIssue big:'),
    new Issue(
        2, 'ReallySmallIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallySmallIssue small'),
    new Issue(
        3, 'ReallyAnIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallyAnIssue'),
    new Issue(
        4, 'ReallyYIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallyYIssue yyyy'),
    new Issue(
        5, 'ReallyZIssue', [], 
        'https://issueurl.com', 'https://repositoryurl.com', 
        'closed', new Date(), null, null, 'This is a reallyZIssue zzz'),
    new Issue(
        6, 'ReallyXIssue', [], 
            'https://issueurl.com', 'https://repositoryurl.com', 
            'closed', new Date(), null, null, 'This is a reallyXIssue xxx'),
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
    const search = await issueInteractor.search('issue');
    expect(search).toHaveLength(6);
});

test('IssueInteractor getSuggestions', () => {
    const issueInteractor = new IssueInteractor(new MockIssueRepository());
    let words = issueInteractor.getSuggestions('real', mockIssues);
    expect(words).toHaveLength(6);
    ['reallybigissue', 'reallysmallissue', 'reallyanissue', 'reallyyIssue', 'reallyzissue', 'reallyxissue'].forEach(word=>{
        expect(words).toContainEqual(word.toLowerCase());
    });
    words = issueInteractor.getSuggestions('reallyZIssue', mockIssues);
    expect(words).toHaveLength(2);
    ['reallyzissue', 'reallyzissue zzz'].forEach(word=>{
        expect(words).toContainEqual(word.toLowerCase());
    });
});