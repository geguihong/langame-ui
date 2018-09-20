import React, { Component } from 'react';

class Refresh extends Component {

    componentWillMount(){
        window.history.go(-1);
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Refresh;
