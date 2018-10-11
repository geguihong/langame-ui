import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PathNodeTable from '@/components/PathNodeTable';

class Query extends Component {

    render() {
        const loading = false;
        const nodes = {
            list: [{
                id: 1
            }]
        };

        return (
            <PageHeaderWrapper>
                <PathNodeTable loading={loading}
                    data={nodes}
                    onDirClick={this.openDir}
                    onSelectRows={this.handleSelectRows}
                    onChange={this.handleStandardTableChange} />
            </PageHeaderWrapper>
        );
    }
}

export default Query;
