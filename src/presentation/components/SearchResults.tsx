import React, { useEffect, useState } from 'react';
import useKeyPress, {keys} from '../hooks/useKeyPress';
import Issue from '../../domain/entities/Issue';
import { Card, CardContent, CardHeader, Chip, Typography } from '@material-ui/core';

function SearchResults({issues, selectResult, setSelectResult} : {issues: Issue[], selectResult: boolean, setSelectResult: {(selectResult: boolean): void}}) {

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const downKeyPress = useKeyPress(keys.arrowDown.keyCode);
    const upKeyPress = useKeyPress(keys.arrowUp.keyCode);
    const escKeyPress = useKeyPress(keys.escape.keyCode);

    useEffect(()=>{
        if (selectResult && downKeyPress){
            if (selectedIndex < issues.length - 1){
                document.getElementById(`card-${issues[selectedIndex + 1].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setSelectedIndex(selectedIndex + 1);
            }
        }
    },[downKeyPress]);

    useEffect(()=>{
        if (selectResult && upKeyPress){
            setSelectedIndex(selectedIndex - 1);
            if (selectedIndex > 0){
                document.getElementById(`card-${issues[selectedIndex - 1].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }else{
                setSelectResult(false);
            }
        }
    },[upKeyPress]);

    useEffect(()=>{
        if (selectResult && escKeyPress){
            setSelectResult(false);
            setSelectedIndex(-1);
        }
    },[escKeyPress]);

    useEffect(()=>{
        if (selectResult){
            setSelectedIndex(0);
        }else{
            setSelectedIndex(-1);
        }
    },[selectResult, issues]);

    if (issues.length > 100){
        issues = issues.slice(0,100);
    }
    return (<>
        {issues.map((issue, index) => 
            <Card 
                id={`card-${issue.id}`} 
                style={{marginTop: '2vh', padding: '1vh'}}
                key={issue.id} 
                raised={index === selectedIndex}
                onClick={()=>{
                    setSelectResult(true);
                    setSelectedIndex(index);
                }}>
                <CardHeader 
                    data-testid={`card-title-${issue.id}`}
                    title={issue.title}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {issue.body}
                    </Typography>
                </CardContent>
                <CardContent>
                    {issue.labels.map(label => 
                        <Chip key={label.id} label={label.name} style={{backgroundColor: `#${label.color}`, marginRight: '1vh'}} />
                    )}
                </CardContent>
            </Card>
        )}
    </>);
}

export default SearchResults;