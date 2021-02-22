import React, {useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchResults from './SearchResults';
import Issue from '../../domain/entities/Issue';
import useDebounce from '../hooks/useDebounce';

import useKeyPress, { keys } from '../hooks/useKeyPress';

import { Alert } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import { loadIssues, filterIssues, clear } from './redux/actions/IssuesActions';


export default function LocalSearchWithRedux() {
    const [text, setText] = useState('');
    const { issues, filteredIssues, error, words } = useSelector(
        (state: {issues: any}) => state.issues) as 
        {issues: Issue[], filteredIssues: Issue[], error: string, words: string[]};
    const dispatch = useDispatch();
    const [selectResult, setSelectResult] = useState(false);
    const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
    const downKeyPress = useKeyPress(keys.arrowDown.keyCode);
    let inputRef: any;
    const debouncedText = useDebounce(text, 500);

    const handleTextChange = async (event: any) => {
        setText(event.target.value);
    };

    useEffect(()=>{
        dispatch(filterIssues(debouncedText));
    }, [debouncedText]);

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
            dispatch(clear());    
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
                <SearchResults issues={filteredIssues} selectResult={selectResult && !isAutocompleteOpen} setSelectResult={setSelectResult} />
            )}
            {!error && issues.length === 0 && (
                <CircularProgress />
            )}
        </div>
    );
}