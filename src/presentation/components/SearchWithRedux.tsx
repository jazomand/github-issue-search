import React, {useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchResults from './SearchResults';
import Issue from '../../domain/entities/Issue';

import useKeyPress, { keys } from '../hooks/useKeyPress';

import { Alert } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import { loadIssues, changeText, clean } from './redux/actions/IssuesActions';

export default function SearchWithRedux() {
    const { text, issues, filteredIssues, error, words } = useSelector(
        (state: {issues: any}) => state.issues) as 
        {text: string, issues: Issue[], filteredIssues: Issue[], error: string, words: string[]};
    const dispatch = useDispatch();
    const [selectResult, setSelectResult] = useState(false);
    const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
    const downKeyPress = useKeyPress(keys.arrowDown.keyCode);
    let inputRef: any;

    const handleTextChange = async (event: any) => {
        dispatch(changeText(event.target.value));
    };

    useEffect(()=>{
        if (downKeyPress && (words.length === 0 || !isAutocompleteOpen)){
            setSelectResult(true);
        }
    },[downKeyPress]);

    useEffect(()=>{
        if (!selectResult){
            inputRef.focus();
            inputRef.scrollIntoView && inputRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }else{
            inputRef.blur();
        }
    }, [selectResult]);
    
    useEffect(()=>{
        dispatch(loadIssues());
        return ()=>{
            dispatch(clean());    
        }
    }, []);

    return (
        <div>
            {error && (
                <Alert severity="error">{error}</Alert>
            )}
            <Autocomplete
                id="search-without-redux"
                autoSelect
                //blurOnSelect
                disableClearable
                freeSolo
                options={words}
                value={text}
                selectOnFocus
                onSelect={handleTextChange}
                onOpen={()=>setAutocompleteOpen(true)}
                onClose={()=>setAutocompleteOpen(false)}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Search title & body"
                        margin="normal"
                        variant="outlined"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                        inputRef={input => {
                            inputRef = input;
                        }}
                        onChange={handleTextChange}
                        onBlur={()=>setAutocompleteOpen(false)}
                        onKeyUp={({keyCode}) => {
                            if (keyCode === keys.escape.keyCode){
                                setSelectResult(true);
                                inputRef.blur();
                            }
                        }}
                        onKeyDown={({keyCode}) => keyCode === 13 && !isAutocompleteOpen && setSelectResult(true)}
                    />
                )}
            />
            {!error && issues.length > 0 && (
                <SearchResults issues={filteredIssues} selectResult={selectResult} setSelectResult={setSelectResult} />
            )}
            {!error && issues.length === 0 && (
                <CircularProgress />
            )}
        </div>
    );
}