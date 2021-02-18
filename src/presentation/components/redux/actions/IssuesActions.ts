import IssueInteractor from "../../../../domain/interactors/IssueInteractor";

export const loadIssues = ()=>{
    return async function getAllIssuesThunk(dispatch: any, getState: any, deps: {issueInteractor: IssueInteractor}) {
        dispatch({ type: 'loadingIssues'});
        try {
            const issuesData = await deps.issueInteractor.getAll();
            dispatch({ type: 'loadIssuesComplete', payload: issuesData });
        } catch(error) {
            dispatch({ type: 'loadIssuesError', payload: error });
        }
    }
}

export const changeText = (text: string) => {
    return async (dispatch: any, getState: any, deps: {issueInteractor: IssueInteractor}) => {
        const issues = getState().issues.issues;
        const filteredIssues = deps.issueInteractor.filterIssues(text, issues);
        const words = deps.issueInteractor.getMatchingWords(text, issues);
        dispatch({ type: 'textChanged', payload: {text, filteredIssues, words} });
    };
};

export const clean = () => ({ type: 'inject' });