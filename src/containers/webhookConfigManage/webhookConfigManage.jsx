import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index';
import Table from 'components/table/table';
import Toolbar from 'components/toolbar/toolbar';

import Until from 'config';
const { caleUpdateTime } = Until;
import { api_findWebhookById, api_webhookConfig } from 'sources/webhook'
import {Tag, Button, notification, message} from 'antd';
import ModalForm from 'components/modalForm/modalForm'



class WebhookComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      columns: [
        {
          title: '项目名称',
          dataIndex:'projectName',
          key:'projectName'
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
            return (<Tag color='#87d068'>{text}</Tag>)
          }
        },{
          title: '更新时间',
          dataIndex:'updateTime',
          key:'updateTime',
          render(text) {
            return caleUpdateTime(text);
          }
        }
      ],
      fieldValue:{},
      formColumns:[
        {
          title:'项目名称',
          type:'text',
          key:'title'
        },
        {
          title:'应用部署路径',
          type:'input',
          key:'saveProjectPath',
          isRequired:true,
          msg:'请输入应用部署路径'
        },{
          title:'是否显示',
          type:'switch',
          key:'status'
        },{
          type:'hidden',
          key:'webhookId'
        }
      ],
      visible: false,
      loading: false
    }
  }
  componentWillMount() {
    let {webhookList} = this.props.webhook;
    if (!webhookList.length) {
      this.props.getWebhhookList();
    }
    let {list} = this.props.service;
    if(!list.length) {
      this.props.getServiceList();
    };
  }

  _handleAddAppConfig(row){
    let { id,projectId, projectName } = row;
    let result = api_findWebhookById({webhookId:id});
    result.then((res) => {
      let data = res.data || {};
      let fieldValue = {
        webhookConfigId: data.id || '',
        saveProjectPath:data.saveProjectPath || '',
        serviceIds:data.serviceIds?data.serviceIds.split(','): [],
        updateTime:data.updateTime?caleUpdateTime(data.updateTime): '',
        webhookId:id,
        status:data.status || 1,
        projectId
      };
      this.setState({
        fieldValue,
        visible: true,
        title:`配置 ${projectName}应用`
      })
    })
  }

  _onCancel = () => {
    this.setState({
      visible: false,
      loading: false
    })
  };

  _onChange = (value) => {
    let { fieldValue } = this.state;
    this.setState({
      fieldValue: Object.assign({}, fieldValue, value)
    });
  };

  _closeLoading = () => {
    this.setState({
      loading: false,
      visible: false
    });
  };

  _openLoading = () => {
    this.setState({
      loading: true
    });
  };

  _onOk = () => {
   let {fieldValue} = this.state;
   this._openLoading();
   let validate = {
     saveProjectPath: '请输入应用文件部署 路径',
     serviceIds:'请选择应用部署服务器'
   };
   for(let k in validate){
     if(!fieldValue[k] || !fieldValue[k].length) {
       notification.warning({
         message:'输入有误',
         description: validate[k]
       });
       this.setState({
         loading: false
       });
       return;
     }
   }
   let { webhookId, webhookConfigId, status=1 , saveProjectPath, serviceIds, projectId} = fieldValue;
   let params = {
     serviceIds: Object.prototype.toString.call(serviceIds) === '[object Array]' ? serviceIds.join(','): serviceIds,
     webhookId,
     status,
     saveProjectPath,
     projectId
   };
   if (webhookConfigId)
     params.id = webhookConfigId;
   let result = api_webhookConfig(params);
   result.then((res) => {
     if(res.status === 'S') {
       message.success('配置成功')
     } else {
       message.warning(res.msg);
     }
     this._closeLoading();
   }).catch((err) => {
     notification.error({
       message:'配置失败',
       description: err.toString()
     });
     this.setState({
       loading: true
     });
   });
  };

  render() {
    let {webhookList} = this.props.webhook;
    let {list} = this.props.service;
    let toolbar = [];
    let {columns, fieldValue, formColumns, loading} =  this.state;
    columns = columns.concat({
      title:'操作',
      render:(row)=>{
        return (<Button type='primary' onClick={this._handleAddAppConfig.bind(this, row)}>应用配置</Button>)
      }
    });
    formColumns = formColumns.concat({
      title:'应用部署服务器',
      type:'select',
      key:'serviceIds',
      mode:'multiple',
      isRequired:true,
      msg:'请选择应用部署的服务',
      itemArr:list.map((val) => {
        return {
          value: val.id,
          text:val.name || val.ip
        }
      })
    },{
      title:'更新时间',
      type:'text',
      key:'updateTime'
    });
    return (
      <div className='webhook-wrapper'>
        {
          toolbar.length?<Toolbar toolbar={toolbar}/>:''
        }
        <div className='webhook-table-wrapper'>
          <Table columns={columns}
                 dataSource={webhookList} />
        </div>
        <ModalForm title={this.state.title}
                   formColumns={formColumns}
                   onChange={this._onChange}
                   fieldValue={fieldValue}
                   onCancel={this._onCancel}
                   loading={loading}
                   onOk={this._onOk}
                   visible={this.state.visible}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(WebhookComponent);

