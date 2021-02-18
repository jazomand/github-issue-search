import Issue from "../../../../domain/entities/Issue";

export const StatusFilters = {
    Started: 'started',
    Loading: 'loading',
    Done: 'done',
    Error: 'error',
};
  
const initialState = {
    status: StatusFilters.Started,
    text: '',
    words: [] as string[],
    issues: [] as Issue[],
    filteredIssues: [] as Issue[],
    error: null
};

export default function issuesReducer(state = initialState, action: any) {
    switch (action.type) {
        case 'clean': {
            return {...initialState}
        }
        case 'loadingIssues': {
            return {
                ...state,
                status: StatusFilters.Loading
            }
        }
        case 'loadIssuesComplete': {
            return {
                ...state,
                status: StatusFilters.Done,
                issues: action.payload,
                filteredIssues: action.payload,
            }
        }
        case 'loadIssuesError': {
            return {
                ...state,
                status: StatusFilters.Error,
                error: action.payload,
            }
        }
        case 'textChanged': {
            return {
                ...state,
                text: action.payload.text,
                filteredIssues: action.payload.filteredIssues,
                words: action.payload.words
            }
        }
        default:
            return state
    }
}