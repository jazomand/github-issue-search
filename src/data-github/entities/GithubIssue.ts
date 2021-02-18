import GithubLabel from './GithubLabel';

export default class GithubIssue{
    constructor (
        public id: number,
        public title: string,
        public labels: Array<GithubLabel>,
        public url: string,
        public repository_url: string,
        public labels_url: string,
        public comments_url: string,
        public events_url: string,
        public html_url: string,
        public node_id: string,
        public number: number,
        public state: string,
        public created_at: string,
        public updated_at: string|null,
        public closed_at: string|null,
        public body: string,
        public score: number
    ) {}
}