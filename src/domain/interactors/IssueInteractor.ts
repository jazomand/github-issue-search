import Issue from '../entities/Issue';
import IssueRepository from '../data/IssueRepository';

export default class IssueInteractor {

    constructor(private issueRepository : IssueRepository) {}

    public getAll = (): Promise<Array<Issue>> => {
        return this.issueRepository.getAll();
    }

    // Not currently used because it search for full strings only
    public search = (text: string): Promise<Array<Issue>> => {
        return this.issueRepository.search(text);
    }

    public getMatchingWords = (text: string, issues: Array<Issue>) : Array<string> => {
        let words = [] as Array<string>;
        if (text.length < 3){
            return words;
        }
        const wordMap = new Map<string, number>();
        const addToWordMap = (word: string) => {
            let count: number | undefined = wordMap.get(word);
            if (!count){
                count = 1;
            }else{
                count++;
            }
            wordMap.set(word, count);
        };
        issues.forEach(issue =>{
            (this.transformToSpaces(issue.body).split(' ') ?? [])
                .filter(w => w.toLowerCase().indexOf(text.toLowerCase()) != -1)
                .forEach(word => addToWordMap(word));
            
            (this.transformToSpaces(issue.title).split(' ') ?? [])
                .filter(w => w.toLowerCase().indexOf(text.toLowerCase()) != -1)
                .forEach(word => addToWordMap(word));
        });
        wordMap.forEach((value, key)=>{
            words.push(key);
        });
        words.sort((a, b) => (wordMap.get(b) ?? 0)-(wordMap.get(a) ?? 0));
        if (words.length > 10){
            words = words.slice(0,10);
        }
        return words;
    }

    public filterIssues = (text: string, issues: Issue[]) => {
        return issues.filter(issue => 
            (issue.body?.indexOf(text) != -1) || issue.title?.indexOf(text) != -1
        );
    };

    private transformToSpaces = (text: string) => {
        var ch1 = String.fromCharCode(10);
        var ch2 = String.fromCharCode(13);
        if (text.replaceAll){
            return text.replaceAll(ch1, ' ').replaceAll(ch2, '');
        }else{
            return text.split(ch1).join(' ').split(ch2).join('');
        }
    }
}