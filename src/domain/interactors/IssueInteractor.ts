import Issue from '../entities/Issue';
import IssueRepository from '../data/IssueRepository';

export default class IssueInteractor {

    constructor(private issueRepository : IssueRepository) {}

    private transformToSpaces = (text: string) => {
        var ch1 = String.fromCharCode(10);
        var ch2 = String.fromCharCode(13);
        if (text.replaceAll){
            return text.replaceAll(ch1, ' ').replaceAll(ch2, '');
        }else{
            return text.split(ch1).join(' ').split(ch2).join('');
        }
    }

    public getAll = async (): Promise<Issue[]> => {
        const issues = await this.issueRepository.getAll();
        issues.forEach(issue =>{
            issue.body = this.transformToSpaces(issue.body);
            issue.title = this.transformToSpaces(issue.title);
        });
        return issues;
    };

    // Not currently used because it search for full strings only
    public search = async (text: string): Promise<Issue[]> => {
        const issues = await this.issueRepository.search(text);
        issues.forEach(issue =>{
            issue.body = this.transformToSpaces(issue.body);
            issue.title = this.transformToSpaces(issue.title);
        });
        return issues;
    };

    public filterIssues = (text: string, issues: Issue[]) => {
        return issues.filter(issue => 
            (issue.body?.indexOf(text) != -1) || issue.title?.indexOf(text) != -1
        );
    };

    private getMatchingWords = (text: string, issues: Issue[]) : string[] => {
        let words = [] as string[];
        if (text.length < 3){
            return words;
        }
        const wordMap = new Map<string, number>();
        const addToWordMap = (word: string) => {
            let count: number | undefined = wordMap.get(word);
            if (!count){
                count = word === text ? 1000000 : 1;
            }else{
                count++;
            }
            wordMap.set(word, count);
        };
        issues.forEach(issue =>{
            issue.body.toLowerCase().split(' ')
                .filter(w => w.indexOf(text) != -1)
                .forEach(word => addToWordMap(word));
            issue.title.toLowerCase().split(' ')
                .filter(w => w.indexOf(text) != -1)
                .forEach(word => addToWordMap(word));
        });
        wordMap.forEach((value, key)=>{
            words.push(key);
        });
        words.sort((a, b) => (wordMap.get(b) ?? 0) - (wordMap.get(a) ?? 0));
        if (words.length > 10) {
            words = words.slice(0, 10);
        }
        return words;
    };

    private getNextWords = (text: string, issues: Issue[]) => {
        let nextWords = [] as string[];
        if (text.length < 3){
            return nextWords;
        }
        const wordMap = new Map<string, number>();
        const addToWordMap = (word: string) => {
            if (word.length > 0){
                let count: number | undefined = wordMap.get(word);
                if (!count) {
                    count = 1;
                } else {
                    count++;
                }
                wordMap.set(word, count);
            }
        };
        issues.forEach(issue => {
            const arrBody = issue.body.toLowerCase().split(' ');
            arrBody.forEach((word, index) => {
                if (word === text && (index + 1) < arrBody.length){
                    addToWordMap(arrBody[index + 1]);
                }
            });
            const arrTitle = issue.title.toLowerCase().split(' ');
            arrTitle.forEach((word, index) => {
                if (word === text && (index + 1) < arrTitle.length){
                    addToWordMap(arrTitle[index + 1]);
                }
            });
        });
        wordMap.forEach((value, key)=>{
            nextWords.push(key);
        });
        nextWords.sort((a, b) => (wordMap.get(b) ?? 0) - (wordMap.get(a) ?? 0));
        if (nextWords.length > 9){
            nextWords = nextWords.slice(0, 9);
        }
        return nextWords;
    };

    public getSuggestions = (text: string, issues: Issue[]) => {
        const lowerCaseText = text.toLowerCase().trim();
        const matchingWords = this.getMatchingWords(lowerCaseText, issues);
        const nextWords = this.getNextWords(lowerCaseText, issues);
        if (nextWords && nextWords.length > 0){
            const options = [];
            for (let i=0; i<matchingWords.length && i<Math.min(nextWords.length, 3); i++){
                options.push(matchingWords[i]);
            }
            const currentOptionCount = options.length;
            for (let i=0; i<nextWords.length && i<10-currentOptionCount; i++){
                options.push(`${lowerCaseText} ${nextWords[i]}`);
            }
            return options;
        }
        return matchingWords;
    };
}