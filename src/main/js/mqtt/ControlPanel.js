import React from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import {withStyles} from 'material-ui/styles';

const style = {
    textField: {
        margin: 12,
        minWidth: '12em'
    },
    button: {
        margin: 6
    }
};

class ControlPanel extends React.Component {

    handleConnect = event => {
        this.props.onConnect(this.props.config);
    };

    canConnect = () => {
        return this.props.session.connectionStatus === 'DISCONNECTED';
    };

    canDisconnect = () => {
        return this.props.session.connectionStatus === 'CONNECTED';
    };

    render = () => {
        const { classes } = this.props;

        return (
                <Grid container>
                    <Grid item>
                        <Button
                            className={classes.button}
                            variant="raised"
                            color='primary'
                            disabled={!this.canConnect()}
                            onClick={this.handleConnect}
                        >CONNECT</Button>
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.button}
                            variant="raised"
                            color='primary'
                            disabled={!this.canDisconnect()}
                            onClick={this.props.handleDisconnect}
                        >DISCONNECT</Button>
                    </Grid>
                </Grid>
        );
    }
}

export default withStyles(style)(ControlPanel);