import React from 'react';
import {ListItemText} from 'material-ui/List';
import Paper from 'material-ui/Paper';


function Summary(props) {
    const { classes } = props;
    return (
        <div>
            <Paper>
                <ListItemText primary={props.session.connectionStatus} secondary="Connection status" />
            </Paper>
        </div>
    );
}


export default Summary;