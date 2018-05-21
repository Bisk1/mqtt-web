import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormControlLabel } from 'material-ui/Form';

const style = {
    select: {
        margin: 12,
        minWidth: '12em'
    },
    textField: {
        margin: 12,
        minWidth: '12em'
    },
    button: {
        margin: 6
    }
};

class ConfigurationForm extends React.Component {

    render = () => {
        const { classes } = this.props;

        return (
                <Grid container direction='column' >
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="protocol">Protocol</InputLabel>
                            <Select
                                value={this.props.config.protocol}
                                onChange={this.props.onChange}
                                inputProps={{
                                    name: 'protocol',
                                    id: 'protocol',
                                }}
                            >
                                <MenuItem value='ssl'>MQTT over TLS</MenuItem>
                                <MenuItem value='wss'>MQTT over Websocket</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <TextField
                            id='clientId'
                            className={classes.textField}
                            value={this.props.config.clientId}
                            label='Client ID'
                            onChange={this.props.onChange}/>
                    </Grid>
                    <Grid item>
                        <TextField
                            id='broker'
                            className={classes.textField}
                            value={this.props.config.broker}
                            label='Broker hostname/IP'
                            onChange={this.props.onChange}/>
                        <TextField
                            id='port'
                            className={classes.textField}
                            value={this.props.config.port}
                            label='Port'
                            disabled
                            type="number"
                            onChange={this.props.onChange}/>
                    </Grid>
                    <Grid item>
                        <TextField
                            id='jwt'
                            className={classes.textField}
                            value={this.props.config.jwt}
                            label='JSON Web Token (JWT)'
                            multiline
                            style ={{minWidth: '50em'}}
                            onChange={this.props.onChange}/>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.props.config.spoof}
                                    onChange={this.props.onChange}
                                    value='spoof'
                                    color="primary"
                                />
                            }
                            label="Spoof 'Host' header?"
                        />
                        <TextField
                            id='hostHeader'
                            className={classes.textField}
                            value={this.props.config.spoof ? this.props.config.hostHeader : this.props.config.broker}
                            label='"Host" header'
                            disabled={!this.props.config.spoof}
                            onChange={this.props.onChange}/>
                    </Grid>
                </Grid>
        );
    }
}

export default withStyles(style)(ConfigurationForm);