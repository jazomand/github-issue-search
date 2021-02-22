import Label from './Label';

class Issue{
    constructor (
        public id: number,
        public title: string,
        public labels: Label[],
        public url: string,
        public repositoryUrl: string,
        public state: string,
        public createdAt: Date,
        public updatedAt: Date|null,
        public closedAt: Date|null,
        public body: string
    ) {}
};

export default Issue;