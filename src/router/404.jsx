import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import { Button } form 'antd';
// import { hashHistory } form 'react-router'
class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {

        return (
            <h1>
                404
            </h1>
        );
    }
}

export default AppComponent;
