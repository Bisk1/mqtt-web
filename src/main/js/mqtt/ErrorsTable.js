import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

class ErrorsTable extends React.Component {
    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Detail</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.errors.map(entry =>
                        <TableRow key={entry.time}>
                            <TableCell>{entry.time}</TableCell>
                            <TableCell>{entry.message}</TableCell>
                            <TableCell>{entry.detail}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }
}

export default ErrorsTable;