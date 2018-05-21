import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

class PacketsTable extends React.Component {
    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.packets.map((entry, idx) =>
                            <TableRow key={idx}>
                                <TableCell>{entry.type}</TableCell>
                                <TableCell>{JSON.stringify(entry.wireMessage)}</TableCell>
                            </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }
}

export default PacketsTable;