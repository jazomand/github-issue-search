import Issue from '../domain/entities/Issue';
import IssueRepository from '../domain/data/IssueRepository';
import Label from '../domain/entities/Label';
import GithubIssue from './entities/GithubIssue';
import { resolve } from 'path';

export default class GithubIssueRepository implements IssueRepository {

    private static baseURL = 'https://api.github.com';

    // retrieves all issues
    public getAll = () : Promise<Array<Issue>> => {
        return new Promise(async (resolve, reject) => {
            const url : URL = new URL(`${GithubIssueRepository.baseURL}/repos/facebook/react/issues`);
            let page: number = 1;
            let issues : Array<Issue> = [];
            let totalIssues: Array<Issue> = [];
            let issueCount = 0;
            url.searchParams.append('per_page', `100`);
            try {
                do {
                    url.searchParams.delete('page');
                    url.searchParams.append('page', `${page}`);
                    const response = await fetch(<unknown>url as RequestInfo, {
                        method: 'get', headers: { 'Accept': 'application/vnd.github.v3+json' }
                    });
                    const json = await response.json();
                    if (!Array.isArray(json)){
                        reject(json.message);
                    }
                    issueCount = json.length;
                    issues = json.filter((item:any) => !item.pull_request).map((item: GithubIssue) => 
                        new Issue (
                            item.id, 
                            item.title, 
                            item.labels.map(label => new Label(label.id, label.name, label.color)),
                            item.url,
                            item.repository_url,
                            item.state,
                            new Date(item.created_at),
                            item.updated_at ? new Date(item.updated_at) : null,
                            item.closed_at ? new Date(item.closed_at) : null,
                            item.body
                    ));
                    page++;
                    totalIssues = totalIssues.concat(issues);
                }while(issueCount === 100);
            } catch(error){
                reject(error);
            }
            resolve(totalIssues);
        });
    };

    // search api works but only for complete words.
    public search = (text: string) : Promise<Array<Issue>> => {
        return new Promise(async (resolve, reject) => {
            const url : URL = new URL(`${GithubIssueRepository.baseURL}/search/issues`);
            url.searchParams.append('q', `${text}+repo:facebook/react`);
            try{
                const response = await fetch(<unknown>url as RequestInfo, {
                    method: 'get', headers: { 'Content-Type': 'application/json' }
                });
                const json = await response.json();
                if (!json.items){
                    reject(json.message);
                }
                const issues : Array<Issue> = json.items.map((item: GithubIssue) => 
                    new Issue(
                        item.id, 
                        item.title, 
                        item.labels.map(label => new Label(label.id, label.name, label.color)),
                        item.url,
                        item.repository_url,
                        item.state,
                        new Date(item.created_at),
                        item.updated_at ? new Date(item.updated_at) : null,
                        item.closed_at ? new Date(item.closed_at) : null,
                        item.body)
                );
                resolve(issues);
            }catch(error){
                reject(error);
            }
        })
    };

}