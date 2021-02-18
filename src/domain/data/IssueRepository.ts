import Issue from '../entities/Issue';

export default interface IssueRepository { 
    getAll: ()=>Promise<Array<Issue>>
    search: (text: string)=>Promise<Array<Issue>>
}