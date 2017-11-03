import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class systemManageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentWillMount() {

    }

    render() {

        return (
            <div>
                系统管理
            </div>
        );
    }
}

export default systemManageComponent;
