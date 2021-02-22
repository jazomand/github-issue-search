import Issue from "../../../../domain/entities/Issue";
import { ActionTypes } from "../actions/IssuesActions";

export const StatusFilters = {
    STARTED: 'started',
    LOADING: 'loading',
    DONE: 'done',
    ERROR: 'error',
};
  
const initialState = {
    status: StatusFilters.STARTED,
    text: '',
    words: [] as string[],
    issues: [] as Issue[],
    filteredIssues: [] as Issue[],
    error: null
};

export default function issuesReducer(state = initialState, action: any) {
    switch (action.type) {
        case ActionTypes.ISSUES_CLEARED: {
            return {...initialState}
        }
        case ActionTypes.ISSUES_LOAD_PROCESSING: {
            return {
                ...state,
                status: StatusFilters.LOADING
            }
        }
        case ActionTypes.ISSUES_LOAD_COMPLETE: {
            return {
                ...state,
                status: StatusFilters.DONE,
                issues: action.payload,
                filteredIssues: action.payload,
                error: null,
            }
        }
        case ActionTypes.ISSUES_LOAD_ERROR: {
            return {
                ...state,
                status: StatusFilters.ERROR,
                error: action.payload,
            }
        }
        case ActionTypes.ISSUES_FILTERED: {
            return {
                ...state,
                filteredIssues: action.payload.filteredIssues,
                words: action.payload.words
            }
        }
        default:
            return state
    }
}