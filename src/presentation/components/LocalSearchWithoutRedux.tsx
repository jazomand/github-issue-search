import React, {useState, useEffect } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Issue from '../../domain/entities/Issue';
import SearchResults from './SearchResults';
import useDebounce from '../hooks/useDebounce';
import useKeyPress, {keys} from '../hooks/useKeyPress';

import { Alert } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import IssueInteractor from '../../domain/interactors/IssueInteractor';

export default function LocalSearchWithoutRedux(props: {issueInteractor: IssueInteractor}) {

    const [issues, setIssues] = useState([] as Issue[]);
    const [text, setText] = useState('');
    const [words, setWords] = useState([] as string[]);
    const [filteredIssues, setFilteredIssues] = useState([] as Issue[]);
    const [error, setError] = useState('');
    const [selectResult, setSelectResult] = useState(false);
    const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
    const downKeyPress = useKeyPress(keys.arrowDown.keyCode);
    const debouncedText = useDebounce(text, 500);
    let inputRef: any;

    const handleTextChange = async (event: any) => {
        setText(event.target.value);
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
        const filteredIssues = props.issueInteractor.filterIssues(debouncedText, issues);
        setWords(props.issueInteractor.getSuggestions(debouncedText, filteredIssues));
        setFilteredIssues(filteredIssues);
    }, [debouncedText, issues]);
    
    useEffect(()=>{
        let active = true;
        (async ()=>{
            try {
                const issues = await props.issueInteractor.getAll();
                if (active){
                    setIssues(issues);
                    setError('');
                }
            } catch(error){
                setError(error.message);
            }
        })();
        return ()=>{
            active = false;
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
                disableClearable
                freeSolo
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
                        InputProps={{ ...params.InputProps, type: 'search' }}
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
                <SearchResults issues={filteredIssues} selectResult={selectResult && !isAutocompleteOpen} setSelectResult={setSelectResult} />
            )}
            {!error && issues.length === 0 && (
                <CircularProgress />
            )}
        </div>
    );
}