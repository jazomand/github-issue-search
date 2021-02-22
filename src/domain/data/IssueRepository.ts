import Issue from '../entities/Issue';

export default interface IssueRepository { 
    getAll: ()=>Promise<Issue[]>
    search: (text: string)=>Promise<Issue[]>
}