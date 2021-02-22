import React, {useState} from 'react';
import { AppBar, Button, Tab, Tabs, Typography, Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import AsyncSearchWithoutRedux from './AsyncSearchWithoutRedux';
import AsyncSearchWithRedux from './AsyncSearchWithRedux';
import LocalSearchWithoutRedux from './LocalSearchWithoutRedux';
import LocalSearchWithRedux from './LocalSearchWithRedux';

export default function SearchPage(props: any) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const TabPanel = ({ children, value, index} : {children: any, value: number, index: number}) => {
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
          >
            {value === index && (
              <Box p={3}>
                {children}
              </Box>
            )}
          </div>
        );
    };

    return (
        <div >
            <Paper style={{margin: '5vh', padding: '3vh'}} elevation={3} >
                <Typography variant="h4" style={{marginBottom: '1vh'}}>Github facebook/react repository issues</Typography>
                <Typography variant="subtitle1">"Local" download all data first and filter when input change on client js. </Typography>
                <Typography variant="subtitle1" style={{marginBottom: '1vh'}}>"Async" search issues when input changes. </Typography>
                <Typography variant="subtitle2">"ESC" key to unselect</Typography>
                <Typography variant="subtitle2">"UP & DOWN" keys to select an issue.</Typography>
                <Typography variant="subtitle2">"ENTER" key to select a word from autocomplete & to select first result.</Typography>
                <AppBar position="static" style={{marginTop: '2vh'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="tabs">
                        <Tab label="Local Search without Redux" />
                        <Tab label="Local Search with Redux" />
                        <Tab label="Async Search without Redux" />
                        <Tab label="Async Search with Redux" />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <LocalSearchWithoutRedux {...props} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <LocalSearchWithRedux {...props} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <AsyncSearchWithoutRedux {...props} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <AsyncSearchWithRedux {...props} />
                </TabPanel>
            </Paper>
        </div>
    );
}