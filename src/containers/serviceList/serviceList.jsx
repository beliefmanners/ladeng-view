import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index';
import { message, notification } from 'antd';
import { api_configService } from 'sources/service'

import Until from 'config';
const { caleUpdateTime } = Until;
import Table from 'components/table/table';
import Toolbar from 'components/toolbar/toolbar'
import ModalForm from 'components/modalForm/modalForm'
import './index.styl'

class ServiceAppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      columns: [
        {
          title: 'name',
          dataIndex:'name',
          key:'name'
        },{
          title: 'IP',
          dataIndex:'ip',
          key:'ip'
        },{
          title:'账号',
          dataIndex:'account',
          key:'account'
        },{
          title: 'PKEY',
          dataIndex:'pkey',
          key:'pkey'
        },{
          title:'秘钥地址',
          dataIndex:'sshKey',
          key:'sshKey'
        },{
          title: '端口',
          dataIndex:'port',
          key:'port'
        },{
          title:'标签',
          dataIndex:'serviceTagText',
          key:'serviceTagText'
        },{
          title: '更新时间',
          dataIndex:'updateTime',
          key:'updateTime',
          render(text) {
            return caleUpdateTime(text) || text;
          }
        },{
          title:'备注',
          dataIndex:'remark',
          key:'remark'
        }
      ],
      title: '',
      visible: false,
      loading: false,
      fieldValue:{},
      selectRow:[],
      formColumns:[
        {
          key:'id',
          type:'hidden'
        },{
          title:'名称',
          key:'name',
          type:'input',
          isRequired: true,
          msg:'请输入服务器名称'
        },{
          title:'IP',
          key:'ip',
          type:'input',
          isRequired: true,
          msg:'请输入服务器IP地址'
        },{
          title:'账号',
          key:'account',
          type:'input',
          isRequired: true,
          msg:'请输入服务器账号'
        },{
          title:'PKEY',
          key:'pkey',
          type:'input',
          isRequired: true,
          msg:'请输入服务器登录密码'
        },{
          title:'文件部署路径',
          key:'saveProjectPath',
          type:'input',
          isRequired: true,
          msg:'请输入服务器文件部署'
        },{
          title:'端口',
          key:'port',
          type:'input',
          isRequired: true,
          msg:'请输入服务器部署端口号'
        },{
          title:'服务器属性标签',
          key:'serviceTag',
          type:'radio',
          isRequired: true,
          itemArr:[{
            value:'3Dtest',
            text:'3段测试服务器'
          },{
            value:'5Dtest',
            text:'5段测试服务器'
          },{
            value:'8Dtest',
            text:'8段测试服务器'
          },{
            value:'other',
            text:'其他'
          },{
            value:'official',
            text:'正式服务器'
          }],
          msg:'请选择服务器属性标签'
        },{
          title:'秘钥地址',
          key:'sshKey',
          type:'input',
          isRequired: true,
          msg:'请输入服务器秘钥地址'
        },{
          title:'是否显示',
          key:'status',
          type:'switch'
        },{
          title:'备注',
          key:'remark',
          type:'input'
        },{
          title:'更新时间',
          key:'updateTime',
          type:'text'
        }
      ]
    }
  }

  componentWillMount() {
    let {list} = this.props.service;
    if (!list.length) {
      this.props.getServiceList();
    }
  }

  _handleAddService = () => {
    this.setState({
      fieldValue: {},
      visible: true,
      title:'添加服务'
    })
  };

  _handleEdit = () => {
    let {selectRow} = this.state;
    if(selectRow.length !== 1){
      message.warning('请选择一条服务，进行编辑！');
      return;
    }
    let row = selectRow[0];
    row.updateTime = caleUpdateTime(row.updateTime);
    this.setState({
      fieldValue: row,
      visible: true,
      title:`编辑 ${row.name || row.ip} 应用服务`
    })
  };

  _onChange = (values) => {
    let { fieldValue } = this.state;
    this.setState({
      fieldValue: Object.assign({}, fieldValue, values)
    })
  };

  _onCancel = () => {
    this.setState({
      visible:false
    })
  };

  _openLoading =()=> {
    this.setState({
      loading: true
    })
  };

  _closeLoading =() =>{
    this.setState({
      loading: false
    })
  };

  _closeModal = () => {
    this.setState({
      visible: false
    })
  };

  _onOk = () => {
    let { fieldValue , formColumns} = this.state;
    this._openLoading();
    for (let i = 0; i < formColumns.length; i++) {
      let obj = formColumns[i];
      if(obj.isRequired && (!fieldValue[obj.key] || !String(fieldValue[obj.key]).length)) {
        notification.warning({
          message:'输入有误',
          description:obj.msg
        });
        this._closeLoading();
        return;
      }
    };
    let { id, account, name, status, port, sshKey, ip, pkey, remark = '', serviceTag,saveProjectPath  } = fieldValue;
    status = status ? 1 : 0;
    let params = {status , account, name, port, ip ,sshKey,pkey,remark,serviceTag, saveProjectPath}

    if(id)
      params.id = id;
    let result = api_configService(params);
    result.then((res) => {
      if(res.status === 'S') {
        message.success('配置成功');
        this.props.getServiceList();
        this._closeModal();
      } else {
        message.warning(res.msg);
      }
      this._closeLoading();
    }).catch((err) => {
      notification.warning({
        message:'请求有误',
        description:err.toString()
      });
      this._closeLoading();
    })
  };

  _onSelectRow = (row,r,rows) => {
    this.setState({
      selectRow: rows
    })
  };

  _onSelectRowAll = (r,rows) => {
    this.setState({
      selectRow: rows
    })
  };


  render() {
    let {list} = this.props.service;
    let { title, visible, loading, formColumns, fieldValue } = this.state;
    let {meRightMenuElement} = this.props.right;
    let toolbar = [], rowSelection=null;
    if (meRightMenuElement.element && meRightMenuElement.element.length) {
      toolbar = [];
      meRightMenuElement.element.map((val) => {
        if (val.key === 'addService') {
          val.onClick = this._handleAddService;
          val.type = 'button';
          toolbar.push(val)
        };
        if (val.key === 'editService') {
          val.onClick = this._handleEdit;
          val.type = 'button';
          toolbar.push(val);
          rowSelection = {
            type: 'checkbox',
            onSelect: this._onSelectRow,
            onSelectAll: this._onSelectRowAll
          };

        }
      })
    }

    return (
        <div className='service-wrapper'>
          {
            toolbar.length?<Toolbar toolbar={toolbar}/>:''
          }
          <div className='service-table-wrapper'>
            <Table columns={this.state.columns}
                   rowSelection={rowSelection}
                   dataSource={list} />
          </div>
          <ModalForm title={title}
                     onChange={this._onChange}
                     fieldValue={fieldValue}
                     onCancel={this._onCancel}
                     loading={loading}
                     onOk={this._onOk}
                     formColumns={formColumns}
                     visible={visible}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(ServiceAppComponent);
