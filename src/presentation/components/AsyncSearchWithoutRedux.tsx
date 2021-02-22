import React, {useState, useEffect, Fragment } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Issue from '../../domain/entities/Issue';
import SearchResults from './SearchResults';
import useDebounce from '../hooks/useDebounce';
import {keys} from '../hooks/useKeyPress';

import { Alert } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import IssueInteractor from '../../domain/interactors/IssueInteractor';

export default function AsyncSearchWithoutRedux(props: {issueInteractor: IssueInteractor}) {

    const [text, setText] = useState('');
    const [words, setWords] = useState([] as string[]);
    const [searchedIssues, setSearchedIssues] = useState([] as Issue[]);
    const [error, setError] = useState('');
    const [selectResult, setSelectResult] = useState(false);
    const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debouncedText = useDebounce(text, 500);
    let inputRef: any;

    const handleTextChange = async (event: any) => {
        setText(event.target.value);
    };

    useEffect(() => {
        let active = true;
        setLoading(true);
        (async () => {
            try {
                const issues = await props.issueInteractor.search(debouncedText);
                const suggestions = props.issueInteractor.getSuggestions(debouncedText, issues);
                if (active) {
                    setSearchedIssues(issues);
                    setWords(suggestions);
                    setLoading(false);
                    setError('');
                }
            } catch(error){
                setLoading(false);
                setError(error.message);
            }
        })();
        return () => {
            active = false;
        };
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
                loading={loading}
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
                                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
            {!error && searchedIssues.length > 0 && (
                <SearchResults issues={searchedIssues} selectResult={selectResult && !isAutocompleteOpen} setSelectResult={setSelectResult} />
            )}
        </div>
    );
}