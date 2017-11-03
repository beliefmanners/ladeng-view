import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import actions from 'Redux_config/actions';
import Appconfig from 'config';
const { caleUpdateTime } = Appconfig;
import Table from 'components/table/table';
import { Row, Col, Tree, Button, message } from 'antd'
const TreeNode = Tree.TreeNode;
import Toolbar from 'components/toolbar/toolbar'
import ModalForm from 'components/modalForm/modalForm'
import { getRoleRight, configRoleRight } from 'sources/role'
import './index.styl'
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      columns:[
        {
          title:'角色名',
          key:'name',
          dataIndex:'name'
        },{
          title:'角色描述',
          key:'description',
          dataIndex:'description'
        },{
          title:'更新时间',
          key:'updateTime',
          dataIndex:'updateTime',
          render:(text) => {
            return caleUpdateTime(text);
          }
        },{
          title: '操作',
          render:(col) => {
            return (
              <Button type='primary'
                onClick={() => {
                this._handleAddRole(col)
              }}>更新</Button>
            )
          }
        }
      ],
      formColumns: [
        {
          key: 'id',
          type: 'hidden'
        },{
          title: '角色名称',
          key: 'name',
          type:'input',
          isRequired: true,
          msg:'请输入角色名称'
        },{
          title: '角色KEY',
          key: 'key',
          type:'input',
          isRequired: true,
          msg:'请输入角色KEY'
        },{
          title: '描述',
          key: 'description',
          type:'input'
        }
      ],
      visible: false,
      menu: [],
      element:[],
      rowSelection: {
        type: 'radio',
        onSelect: this._handleClickRow
      }
    }
  }

  componentWillMount() {
    let { roleList, menuList, elementList } = this.props.system;
    if(!roleList.length) {
      this.props.getRoleList();
    }
    if(!menuList.length) {
      this.props.getMenuList()
    }
    if(!elementList.length) {
      this.props.getElementList()
    }
  }
  renderTreeNodes = (treeNode) => {
    return treeNode.map((item) => {
      return <TreeNode {...item} />;
    })
  };

  _menuTreeRight = (keyArr) => {
    this.setState({
      menu: keyArr
    })
  };
  _elementTreeRight = (keyArr) => {
    this.setState({
      element: keyArr
    })
  };
  _hanldOkConfig = () => {
    let {fieldValue = {},  menu, element} = this.state;
    if(!menu.length && !element.length && !fieldValue.id) {
      message.warning('请选择角色，并添加权限');
      return;
    }
    let result = configRoleRight({id: fieldValue.id, menuIds: menu.join(','), elementIds: element.join(',')});
    result.then((res) => {
      if(res.status === 'S') {
        message.success(res.msg);
      } else {
        message.warning(res.msg)
      }
    }).catch(() => {
      message.error('系统有误');
    })
  };
  _closeModal = () => {
    this.setState({
      visible: false,
      loading: false
    })
  };
  _handleClickRow = (row) => {
    let result = getRoleRight({id: row.id});
    result.then((res) => {
      if(res.status === 'S') {
        this.setState({
          menu: res.data.menu.map((val) => {
            return val.id + '';
          }),
          element: res.data.element.map((val) => {
            return val.id + '';
          }),
          fieldValue: row
        })
      }
    }).catch(() => {
      message.error('系统有误')
    });
  };
  _handleAddRole =(row) => {
    this.setState({
      visible: true,
      title: row.name?`更新角色${row.name}`:'增加角色',
      fieldValue: row.name ? row : {}
    })
  };
  _modalOk = () => {
    let { fieldValue = {} } = this.state;
    let result = configRoleRight(fieldValue);
    result.then((res) => {
      if(res.status === 'S') {
        this.setState({
          visible: false
        });
        message.success(res.msg);
      } else {
        message.warning(res.msg);
      }
      this.props.getRoleList();
    }).catch(() => {
      message.error('系统有误！')
    })
  };
  _modalOnChange = (values) => {
    console.log(values);
    let { fieldValue } = this.state;
    this.setState({
      fieldValue: Object.assign({}, fieldValue, values)
    })
  };
  render() {
    let {columns, formColumns, loading, fieldValue={}, title , visible, rowSelection, menu, element} = this.state;
    let { roleList, menuList, elementList } = this.props.system;
    let menuNode = menuList.map((val) => {
      return {
        title:val.name,
        key:val.id
      }
    });
    let eleNode = elementList.map((val) => {
      return {
        title:val.name,
        key:val.id
      }
    });
    let toolbar = [
      {
        text: '增加角色',
        type: 'button',
        onClick: this._handleAddRole
      },{
        text: '确认配置',
        icon: 'check-circle',
        type: 'button',
        onClick: this._hanldOkConfig
      }
    ];
    return (
      <Row>
        <ModalForm loading={loading}
                   fieldValue={fieldValue}
                   formColumns={formColumns}
                   visible={visible}
                   onChange={this._modalOnChange}
                   onCancel={this._closeModal}
                   onOk={this._modalOk}
                   title={title}/>
        <Col span={24}>
          <Toolbar toolbar={toolbar}/>
        </Col>
        <Col span={24}>
          <Table rowSelection={rowSelection}
                 columns={columns} dataSource={roleList} />
        </Col>
        <Col span={12} className='menu-right-wrapper'>
          <div className='menu-right-content'>
            <h3>菜单权限</h3>
            <Tree checkable={true}
                  checkedKeys={menu}
                  onCheck={this._menuTreeRight}>
              {
                this.renderTreeNodes(menuNode)
              }
            </Tree>
          </div>
        </Col>
        <Col span={12} className='element-right-wrapper'>
          <div className='element-right-content'>
            <h3>页面元素权限</h3>
            <Tree checkable={true}
                  checkedKeys={element}
                  onCheck={this._elementTreeRight}>
              {
                this.renderTreeNodes(eleNode)
              }
            </Tree>
          </div>
        </Col>
      </Row>
    );
  }
}
/****************** 绑定redux  ******************/

function mapStateToProps(state) {
  return {
    ...state
  }
}
//将dispatch的所有方法绑定到props上
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
