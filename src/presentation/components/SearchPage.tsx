import React, {useState} from 'react';
import { AppBar, Button, Tab, Tabs, Typography, Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SearchWithoutRedux from './SearchWithoutRedux';
import SearchWithRedux from './SearchWithRedux';

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
                <Typography variant="subtitle2">Press: "ESC" key to unselect</Typography>
                <Typography variant="subtitle2">Press: "UP & DOWN" keys to select an issue.</Typography>
                <Typography variant="subtitle2">Press: "ENTER" key to select a word from autocomplete.</Typography>
                <AppBar position="static" style={{marginTop: '2vh'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="tabs">
                        <Tab label="Search without Redux" />
                        <Tab label="Search with Redux" />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <SearchWithoutRedux {...props} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <SearchWithRedux {...props} />
                </TabPanel>
            </Paper>
        </div>
    );
}