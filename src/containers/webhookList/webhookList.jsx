
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index';
import {Tag,Button,Modal, notification, Popover, Radio, message, Steps,Icon} from 'antd';
const Step = Steps.Step;
const RadioGroup = Radio.Group;
import Table from 'components/table/table';
import CONFIG from 'config';
const { caleUpdateTime , formatDate , baseUrl} = CONFIG;
const Socket = require('socket.io-client')(`${baseUrl}`);
Socket.on('connect', function() {
  console.log('连接成功');
  // Socket.emit('link', 11 ,69, 'XfuKh_TqjqRt-KaZgyXc');
});
Socket.on('disconnect', function() {
  console.log("与服务其断开");
  Socket.on('reconnect', function() {
    console.log("重新连接到服务器");
  });
});

import './index.styl'
import { api_deployWebhook, api_webhookGetBranch, api_webhookRollBackProject} from 'sources/webhook'
// import Toolbar form 'components/toolbar/toolbar';

function warning(val, row, branch, _selectBranch) {
  if(!val || !row) {
    return;
  }
  let { name, serviceTagText,ip, account  } = val;
  let serviceGitTags = val.gitTags;
  let {projectName, sshUrl, gitTags} = row;
  let saveProjectPath = row.saveProjectPath || val.saveProjectPath;
  let arr = [
    {
      label:'服务器名称',
      value:name
    },{
      label:'ssh 服务器登录账户',
      value:account
    },{
      label:'服务器IP',
      value:ip
    },{
      label:'服务器属性标签',
      value:serviceTagText
    },{
      label:'项目名称',
      value:projectName
    },{
      label:'Git 仓库地址',
      value:sshUrl
    },{
      label:'服务器文件部署路径',
      value:saveProjectPath
    },{
      label:'当前版本号',
      value:gitTags
    }
  ];
  return (
    <div className='deploy-congirm-wrapper'>
      <ul>
        {
          arr.map((obj, index) => {
            return (
              <li key={index} className='deploy-congirm-list'>
                <span className='deploy-congirm-ladel'>{obj.label}</span> :
                <span className='deploy-congirm-value'>{obj.value}</span>
              </li>
            );
          })
        }
        {
          branch?<li className='deploy-congirm-list'>
            <span className='deploy-congirm-ladel'>回滚版本</span> ：
            <span>
            <RadioGroup onChange={_selectBranch}>
              {
                branch? branch.map((obj, key) => {
                  if(obj.name === 'master'){
                    return;
                  }
                  return (<Radio disabled={serviceGitTags === obj.name} value={obj.name} key={key}>{obj.name}</Radio>);
                }):''
              }
            </RadioGroup>
          </span>
          </li>:''
        }
      </ul>
    </div>
  );
}


let logArr = [
  {key:'deployStatusText',text:'部署状态'},
  {key:'error',text:'错误提示'},
  {key:'serviceIp',text:'服务器IP'},
  {key:'serviceAccount',text:'服务器登录账户'},
  {key:'createdTime',text:'部署时间'}
];
class webhookConfigManage extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      loading: false,
      columns: [
        {
          title: '应用服务器',
          dataIndex:'name',
          key:'name'
        }, {
          title: '服务账户',
          dataIndex:'account',
          key:'account'
        },{
          title:'服务器标签',
          dataIndex:'serviceTagText',
          key:'serviceTagText'
        },{
          title:'默认应用部署文件路径',
          dataIndex:'saveProjectPath',
          key:'saveProjectPath'
        },{
          title:'当前应用部署版本',
          dataIndex:'gitTags',
          key:'gitTags',
          render(text) {
            if(text){
              return <Tag color='#87d068'>{text}</Tag>
            } else {
              return <Tag color='red'>暂无部署版本</Tag>
            }
          }
        },{
          title:'备注',
          dataIndex:'remark',
          key:'remark'
        },{
          title:'上次更新时间',
          dataIndex:'updateTime',
          key:'updateTime',
          render(text) {
            if(text) {
              return caleUpdateTime(text);
            }
          }
        }
      ],
      branch: null,
      rollBackTag: null,
      steps:[{
        title: '检查应用配置',
        icon: 'check-circle'
      }, {
        title: '拉取应用文件',
        icon: 'cloud-download'
      }, {
        title: '部署应用文件',
        icon:'cloud-upload'
      },{
        title: '备份应用文件',
        icon: 'export'
      }],
      link1:[],
      link2:[],
      link3:[],
      link4:[],
      currentStep: 0,
      displayStatus: 'none'
    }
  }
  componentWillMount() {
    this.props.getWebhookConfigList();

  }

  _handleDeploy(val) {
    let { configList } = this.props.webhook;
    this.setState({
      visible: true,
      val,
      row: configList[val.key],
      link1:[],
      link2:[],
      link3:[],
      link4:[]
    })
  }

  _handleRollback(val) { // 回滚
    let { configList } = this.props.webhook;
    let row = configList[val.key];
    let branch = api_webhookGetBranch({projectId: row.projectId});
    branch.then((res) => {
      if(res.status === 'S') {
        this.setState({
          val,
          row,
          branch: res.data.data,
          gitBackSshUrl: res.data.gitBackSshUrl,
          visible: true
        })
      } else {
        message.warning('该项目暂没有备份');
      }
    })
  }

  _rollBack = () => {
    let { rollBackTag, val, row ,gitBackSshUrl} = this.state;
    let {id, userName} = this.props.userInfo;
    if(!rollBackTag) {
      message.warning('请选择回滚的版本');
      return;
    }
    let rollBack = {
      gitBackSshUrl: gitBackSshUrl,
      gitTags: rollBackTag,
      serviceAccount: val.account,
      serviceIp: val.ip,
      sshKey: val.sshKey,
      projectName: row.projectName,
      saveProjectPath: row.saveProjectPath,
      projectId: row.projectId,
      sshUrl: row.sshUrl,
      webUrl: row.webUrl,
      userName,
      userId: id,
      serviceId: val.id,
      webhookId: row.id
    };
    this._openLoading();
    let rollBackResult = api_webhookRollBackProject(rollBack);
    rollBackResult.then((res) => {
      notification[res.status === 'S'? 'success': 'warning']({
        massage: `部署 ${res.status === 'S'?'完成': '失败'}`,
        description: res.msg
      });
      this._onCancel();
      this.props.getWebhookConfigList();
    }).catch((res) => {
      res? notification.warning({
        massage: `回滚失败`,
        description: String(res)
      }): message.warning('回滚失败');
      this._closeLoading();
      this.props.getWebhookConfigList();
    });
  };

  _openLoading = () => {
    this.setState({
      loading: true
    })
  };

  _closeLoading = () => {
    this.setState({
      loading: false
    })
  };

  _onCancel = () => {
    this.setState({
      loading: false,
      visible: false,
      branch: null
    })
  };

  _deployProject1 = () => {
    let {val, row} = this.state;
    let serviceId = val.id, webhookId = row.id;
    this._openLoading();
    let result = api_deployWebhook({
      serviceId,
      webhookId
    });
    result.then((res) => {
      if(res){
        notification[res.status === 'S'?'success': 'error']({
          message:'部署结果',
          description: `部署${res.status ==='S'?'成功':'失败'} 提示信息：${res.msg}`
        });
      } else {
        notification.warning({
          message: '耐心等待',
          description:'文件过大、部署时间过长；请稍后刷新部署列表并查询项目部署日志'
        });
      }
      this._onCancel();
      this.props.getWebhookConfigList();
    }).catch((err) => {
      if(!err){
        notification.warning({
          message: '耐心等待',
          description:'文件过大、部署时间过长；请稍后刷新部署列表并查询项目部署日志'
        });
      }else {
        notification.error({
          message: '部署失败',
          description: err?String(err):'原因未知'
        });
      }

      this.props.getWebhookConfigList();
      this._closeLoading()
    })
  };

  _selectBranch =(e) => {
    this.setState({
      rollBackTag: e.target.value
    });
  };

  _deployProject = () =>{
    if(!Socket.connected){
      message.warning('数据传输失败');
      return;
    }
    this.setState({
      displayStatus: 'block',
      visible: false
    });
    let { token } = this.props.userInfo;
    let {val, row} = this.state;
    let serviceId = val.id, webhookId = row.id;
    Socket.emit('link', webhookId ,serviceId, token);
  };

  _closeBackage = (e)=> {
    e.stopPropagation();
    this.setState({
      link1:[],
      link2:[],
      link3:[],
      link4:[],
      currentStep: 0,
      displayStatus: 'none'
    });
    this.props.getWebhookConfigList();
  };
  render() {
    let { configList } = this.props.webhook;
    let {columns, loading,val, row, visible, branch, steps, link1, link2, link3, link4, currentStep, displayStatus} = this.state;
    let opt = {
      title:'操作',
      render:(val)=> {
        let deployLog = val.deployLog, content;
        if(deployLog){
          content = (<div>
            {
              logArr.map((obj, key) => {
                if(deployLog[obj.key]){
                  if(obj.key === 'createdTime') {
                    return  <p key={key}> {obj.text} :  <span className='bold'>{caleUpdateTime(deployLog[obj.key])} </span></p>
                  } else {
                    return <p key={key}> {obj.text} :  <span className='bold'>{deployLog[obj.key]} </span></p>;
                  }
                }
              })
            }
          </div>);
        } else {
          content = (<div>
            <p>部署状态 : <span className='bold'>尚未部署</span></p>
          </div>)
        }
        return (<div>
          <Popover content={content} title='部署状态提示'>
            <Button type={val.gitTags === configList[val.key].gitTags? 'default' : 'primary'}
                    size='small'
                    onClick={this._handleDeploy.bind(this, val)}
                    disabled={val.isSuccess === 1 && val.gitTags === configList[val.key].gitTags}
                    style={{margin:'5px'}}>发布</Button>
          </Popover>
          <Button type='primary' size='small' onClick={this._handleRollback.bind(this, val)}>回滚</Button>
        </div>)
      }
    };
    columns = columns.concat(opt);
    /*======== 连接socket =========*/
    return (
      <div className='webhook-config-wrapper'>
        <div className='webhook-config-modal'>
          <Modal title='请确认部署信息'
                 confirmLoading={loading}
                 onOk={branch?this._rollBack :this._deployProject}
                 onCancel={this._onCancel}
                 visible={visible}>
            {
              branch ?warning(val, row, branch, this._selectBranch): warning(val, row)
            }
          </Modal>
        </div>
        <div className='webhook-config-table-wrapper'>
          {
            configList.length ? configList.map((val, index) => {
              let title = () => {
                return (<ul className='webhook-project-info clear'>
                  <li>
                    <span className='webhook-project-lable'>项目名称</span>：
                    <span className='webhook-project-value'>{val.projectName}</span>
                  </li>
                  <li>
                    <span className='webhook-project-lable'>WebUrl</span>：
                    <a className='webhook-project-value' href={val.webUrl} target='_blank'>{val.webUrl}</a>
                  </li>
                  <li>
                    <span className='webhook-project-lable'>sshUrl</span>：
                    <span className='webhook-project-value'>{val.sshUrl}</span>
                  </li>
                  <li>
                    <span className='webhook-project-lable'>当前最新版本</span>：
                    <Tag color='#87d068'>{val.gitTags}</Tag>
                  </li>
                  <li>
                    <span className='webhook-project-lable'>应用部署路径</span>：
                    <span className='webhook-project-value'>{val.saveProjectPath}</span>
                  </li>
                  <li>
                    <span className='webhook-project-lable'>上次更新时间</span>：
                    <span className='webhook-project-value'>{caleUpdateTime(val.updateTime)}</span>
                  </li>
                </ul>)
              };
              let serviceArr = val.serviceArr.map((obj) => {
                obj.key = index;
                return obj;
              });
              return (<Table title={title}  key={index} columns={columns} dataSource={serviceArr}/>)
            }) : "暂没有配置任何应用发布，请前去配置发布应用"
          }
        </div>
        <div className='webhook-deploy-step-wrapper' style={{display: displayStatus}}>
          <div className='webhook-deploy-close-wrapper'>
            <Icon type="close"  className='webhook-deploy-close' onClick={this._closeBackage}/>
          </div>
          <div className='webhook-deploy-step-content-wrapper'>
            <Steps current={currentStep}>
              {
                steps.map((item) => {
                  return <Step key={item.title} title={item.title}  icon={<Icon type={item.icon} />} />;
                })
              }
            </Steps>
            <div className="steps-content">
              <ul className='clear'>
                <li>
                  {
                    link1.length?link1.map((item, index) => {
                      return <p className={item.className? item.className : ''} key={index}>{item.msg}</p>
                    }):''
                  }
                </li>
                <li>
                  {
                    link2.length?link2.map((item, index) => {
                      return <p className={item.className? item.className : ''} key={index}>{item.msg}</p>
                    }):' '
                  }
                </li>
                <li>
                  {
                    link3.length?link3.map((item, index) => {
                      return <p className={item.className? item.className : ''} key={index}>{item.msg}</p>
                    }):''
                  }
                </li>
                <li>
                  {
                    link4.length?link4.map((item, index) => {
                      return <p className={item.className? item.className : ''}  key={index}>{item.msg}</p>
                    }):' '
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    let str = 'YYMMDDhhmmss';
    Socket.on('deployError', (obj) => {
      obj.msg = `${formatDate(new Date(), str)} : ${obj.msg}`;
      obj.className = 'waring';
      let arr = this.state['link'+obj.link];
      arr.push(obj);
      let set ={};
      set['link'+obj.link] = arr;
      set['currentStep'] = obj.link - 1;
      let timeOut = (obj.link - 1) * 100 + arr.length * 200;
      setTimeout(() => {
        this.setState(set,() => {
          message.warning(obj.msg);
        });
      }, timeOut);
    });
    Socket.on('deploySuccess', (obj) => {
      obj.msg = `${formatDate(new Date(), str)} : ${obj.msg}`;
      obj.className = 'success';
      let arr = this.state['link'+obj.link];
      arr.push(obj);
      let set ={};
      set['link'+obj.link] = arr;
      set['currentStep'] = obj.link - 1;
      let timeOut = (obj.link - 1) * 100 + arr.length * 200;
      setTimeout(() => {
        this.setState(set, () => {
          message.success(obj.msg);
        });
      }, timeOut);
    });
    Socket.on('link1', (obj) => {
      obj.msg = `${formatDate(new Date(), str)} : ${obj.msg}`;
      let { link1 } = this.state;
      link1.push(obj);
      setTimeout(() => {
        this.setState({
          link1: link1
        });
      }, link1.length * 150)
    });
    Socket.on('link2', (obj) => {
      obj.msg = `${formatDate(new Date(), str)} : ${obj.msg}`;
      let { link2 } = this.state;
      link2.push(obj);
      setTimeout(() => {
        this.setState({
          link2: link2
        })
      }, link2.length * 150);
    });
    Socket.on('link3', (obj) => {
      obj.msg = `${formatDate(new Date(), str)} : ${obj.msg}`;
      let { link3 } = this.state;
      link3.push(obj);
      setTimeout(() => {
        this.setState({
          link3: link3
        })
      }, link3.length * 150);
    });
    Socket.on('link4', (obj) => {
      obj.msg = `${formatDate(new Date(), str)} : ${obj.msg}`;
      let { link4 } = this.state;
      link4.push(obj);
      setTimeout(() => {
        this.setState({
          link4: link4
        })
      }, link4.length * 150);
    });
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
export default connect(mapStateToProps, mapDispatchToProps)(webhookConfigManage);
