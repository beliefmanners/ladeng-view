import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Button } from 'antd';
import './index.styl'
class ToolTarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
      return (
        <div className='toolbar-warpper'>
          {
            this.props.toolbar.map((val, index) => {
              if(val.type === 'button') {
                return (<Button className='toolbar-btn' key={index} type='primary' icon={val.icon} onClick={val.onClick}>{val.name || val.text}</Button>);
              }
            })
          }
        </div>
      );
    }
}
ToolTarComponent.defaultProps = {
  toolbar: []
};

export default ToolTarComponent;
