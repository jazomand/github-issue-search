import IssueInteractor from "../../../../domain/interactors/IssueInteractor";

export enum ActionTypes {
    ISSUES_LOAD_PROCESSING = 'ISSUES_LOAD_PROCESSING',
    ISSUES_LOAD_COMPLETE = 'ISSUES_LOAD_COMPLETE',
    ISSUES_LOAD_ERROR = 'ISSUES_LOAD_ERROR',
    ISSUES_FILTERED = 'ISSUES_FILTERED',
    ISSUES_CLEARED = 'ISSUES_CLEARED'
};

export const loadIssues = ()=>{
    return async (dispatch: any, getState: any, deps: {issueInteractor: IssueInteractor}) => {
        dispatch({ type: ActionTypes.ISSUES_LOAD_PROCESSING});
        try {
            dispatch({ type: ActionTypes.ISSUES_LOAD_COMPLETE, payload: await deps.issueInteractor.getAll() });
        } catch(error) {
            dispatch({ type: ActionTypes.ISSUES_LOAD_ERROR, payload: error.message });
        }
    }
}

export const filterIssues = (text: string) => {
    return (dispatch: any, getState: any, deps: {issueInteractor: IssueInteractor}) => {
        const issues = getState().issues.issues;
        const filteredIssues = deps.issueInteractor.filterIssues(text, issues);
        const words = deps.issueInteractor.getSuggestions(text, filteredIssues);
        dispatch({ type: ActionTypes.ISSUES_FILTERED, payload: {filteredIssues, words} });
    };
};

export const searchIssues = (text: string)=>{
    return async (dispatch: any, getState: any, deps: {issueInteractor: IssueInteractor}) => {
        dispatch({ type: ActionTypes.ISSUES_LOAD_PROCESSING});
        try {
            const issues = await deps.issueInteractor.search(text);
            dispatch({ type: ActionTypes.ISSUES_LOAD_COMPLETE, payload: issues });
            const words = deps.issueInteractor.getSuggestions(text, issues);
            dispatch({ type: ActionTypes.ISSUES_FILTERED, payload: {filteredIssues: issues, words} });
        } catch(error) {
            dispatch({ type: ActionTypes.ISSUES_LOAD_ERROR, payload: error.message });
        }
    }
}

export const clear = () => ({ type: ActionTypes.ISSUES_CLEARED });