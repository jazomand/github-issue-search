import React, {useState, useEffect, Fragment } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Issue from '../../domain/entities/Issue';
import SearchResults from './SearchResults';
import useDebounce from '../hooks/useDebounce';
import {keys} from '../hooks/useKeyPress';

import { Alert } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { searchIssues } from './redux/actions/IssuesActions';

export default function AsyncSearchWithRedux() {

    const [text, setText] = useState('');
    const { issues, error, words, status } = useSelector(
        (state: {issues: any}) => state.issues) as 
        {issues: Issue[], filteredIssues: Issue[], error: string, words: string[], status: string};
    const dispatch = useDispatch();
    const [selectResult, setSelectResult] = useState(false);
    const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
    let inputRef: any;
    const debouncedText = useDebounce(text, 500);

    const handleTextChange = async (event: any) => {
        setText(event.target.value);
    };

    useEffect(() => {
        dispatch(searchIssues(debouncedText));
    }, [debouncedText]);

    useEffect(()=>{
        if (!selectResult){
            inputRef.focus();
            inputRef.scrollIntoView && inputRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }else{
            inputRef.blur();
        }
    }, [selectResult]);

    return (
        <div>
            {error && (
                <Alert severity="error">{error}</Alert>
            )}
            <Autocomplete
                id="search-without-redux"
                autoSelect
                disableClearable
                freeSolo
                loading={status === 'loading'}
                options={words}
                selectOnFocus
                value={text}
                onSelect={handleTextChange}
                onOpen={()=>setAutocompleteOpen(true)}
                onClose={()=>setAutocompleteOpen(false)}
                renderInput={params => (
                    <TextField
                        {...params}      
                        label="Search title & body"
                        margin="normal"
                        variant="outlined"
                        InputProps={{ 
                            ...params.InputProps, 
                            type: 'search',
                            endAdornment: (
                                <Fragment>
                                  {status === 'loading' ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </Fragment>
                            ) }}
                        inputRef={input => {
                            inputRef = input;
                        }}
                        onBlur={()=>setAutocompleteOpen(false)}
                        onChange={handleTextChange}
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
                <SearchResults issues={issues} selectResult={selectResult && !isAutocompleteOpen} setSelectResult={setSelectResult} />
            )}
        </div>
    );
}