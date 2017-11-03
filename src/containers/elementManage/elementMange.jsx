import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index'
import { Icon } from 'antd'

import Appconfig from 'config';
const { caleUpdateTime } = Appconfig;
import Table from 'components/table/table'
class AppComponent extends React.Component {
    constructor(props) {
      super(props);
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this.state = {
        columns: [
          {
            title:'Name',
            key:'name',
            dataIndex:'name'
          },
          {
            title:'icon',
            key:'icon',
            dataIndex:'icon',
            render(text) {
              if(text)
                return <Icon type={text}/>
            }
          },
          {
            title:'key',
            key:'key',
            dataIndex:'key'
          },
          {
            title:'描述',
            key:'description',
            dataIndex:'description'
          },
          {
            title:'更新时间',
            key:'updateTime',
            dataIndex:'updateTime',
            render(text) {
              return caleUpdateTime(text)
            }
          }
        ]
      }
    }

    componentWillMount() {
      let { elementList } = this.props.system;
      if(!elementList.length) {
        this.props.getElementList();
      }
    }

    render() {
      let {elementList} = this.props.system;
      let { columns } = this.state;
      return (
        <div>
          <Table columns={columns} dataSource={elementList}/>
        </div>
      );
    }
}
function mapStateToProps(state) {
  return {
    ...state
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
