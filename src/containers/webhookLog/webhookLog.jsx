import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Tag,Input , Button, message, notification } from 'antd'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index';
import './index.styl';

import Until from 'config';
const {caleUpdateTime} = Until;
import Table from 'components/table/table';

class WebhookLogApp extends React.Component {
  constructor(props) {
      super(props);
      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
      this.state = {
        columns:[{
          title: '项目名称',
          dataIndex:'projectName',
          key:'projectName',
          width:100
        },{
          title: 'Web Url',
          dataIndex:'webUrl',
          key:'webUrl',
          render(text) {
            return <a href={text} target='_blank'>{text}</a>
          }
        },{
          title: '仓库地址',
          dataIndex:'sshUrl',
          key:'sshUrl'
        },{
          title: '版本号',
          dataIndex:'gitTags',
          key:'gitTags',
          render(text) {
            return <Tag color='#87d068'>{text}</Tag>
          }
        },{
          title:'IP',
          dataIndex:'serviceIp',
          key:'serviceIp'
        },{
          title:'部署状态',
          dataIndex:'deployStatusText',
          key:'deployStatusText'
        },{
          title:'error',
          dataIndex:'error',
          width:200,
          key:'error'
        },{
          title: '备份git URL地址',
          dataIndex:'gitBackSshUrl',
          width:120,
          key:'gitBackSshUrl',
          render(text) {
            if (!text)
              return '';
            return <a href={text} target='_blank'>{text}</a>
          }
        },{
          title: '时间',
          dataIndex:'createdTime',
          key:'createdTime',
          render(text) {
            return caleUpdateTime(text);
          }
        }]
      }
  }

  componentWillMount() {
    let {webhookLog} = this.props.webhook;
    if (!webhookLog.length) {
      this.props.getWebhookLogList();
    }
  }
  _projectNameInput = (e) => {
    this.setState({
      projectName: e.target.value
    })
  };

  _searchProjectName = () => {
    let { projectName } = this.state;
    if(!projectName) {
      message.warning('请输入查找的项目名称!');
      return;
    }
    let result = this.props.webhookLogSearch({
      projectName
    });
    result.then((res) => {
      if(res.status === 'F') {
        message.warning(res.msg)
      }
    }).catch((res) => {
      notification.warning({
        message: '请求有误',
        description: String(res)
      })
    })
  };

  _webhookLogReset = () => {
    this.props.getWebhookLogList();
  };
  render() {
    let { webhookLog } = this.props.webhook;
    return (
      <div className='webhookLog-wrapper'>
        <div className='webhookLog-toolbar clear'>
          <div className='toolbar-input'>
            <Input onChange={this._projectNameInput}
                   placeholder='项目名' />
          </div>
          <div>
            <Button className='toolbar-button' type='primary' onClick={this._searchProjectName}>查询</Button>
            <Button className='toolbar-button' onClick={this._webhookLogReset}>重置</Button>
          </div>
        </div>
        <div className='webhookLog-table-wrapper'>
          <Table columns={this.state.columns} dataSource={webhookLog} />
        </div>
      </div>
    );
  }
}
/*==================  绑定redux  ==========================*/
//将state.site绑定到props的site
function mapStateToProps(state) {
  return {
    ...state
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(WebhookLogApp);
