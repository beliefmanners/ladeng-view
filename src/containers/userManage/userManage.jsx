import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index'
import { Row,Col, Avatar, Tree, message } from 'antd'
const TreeNode = Tree.TreeNode;
import Appconfig from 'config';
const { caleUpdateTime } = Appconfig;
import Toolbar from 'components/toolbar/toolbar'
import { getUserRight, configUserRight } from 'sources/user'
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
        },{
          title:'userName',
          key:'userName',
          dataIndex:'userName'
        },{
          title:'头像',
          key:'avatarUrl',
          dataIndex:'avatarUrl',
          render(text) {
            if(text) {
              return <Avatar src={text}/>
            }
            return text;
          }
        },{
          title:'登录次数',
          key:'loginCount',
          dataIndex:'loginCount'
        },{
          title:'上次登录时间',
          key:'loginLastTime',
          dataIndex:'loginLastTime',
          render(text) {
            return caleUpdateTime(text);
          }
        }
      ],
      role:[],
      element: [],
      menu:[],
      rowSelection: {
        type: 'radio',
        onSelect: this._handleClickRow
      }
    }
  }

  componentWillMount() {
    let { userList, menuList, elementList, roleList } = this.props.system;
    if(!userList.length) {
      this.props.getUserList();
    }
    if(!menuList.length) {
      this.props.getMenuList()
    }
    if(!elementList.length) {
      this.props.getElementList()
    }
    if(!roleList.length) {
      this.props.getRoleList();
    }
  }
  _menuTreeRight =(menu) => {
    this.setState({
      menu:menu
    })
  };
  _roleTreeRight =(role) => {
    this.setState({
      role:role
    })
  };
  _elementTreeRight =(element) => {
    this.setState({
      element:element
    })
  };
  renderTreeNodes = (treeNode) => {
    return treeNode.map((item) => {
      return <TreeNode {...item} />;
    })
  };
  _handleClickRow = (row)=> {
    let result = getUserRight({id: row.id});
    result.then((res) => {
      if(res.status === 'S') {
        let {role, element, menu} = res.data;
        this.setState({
          fieldValue: row,
          role: role.map((val) => {
            return val.id + '';
          }),
          element: element.map((val) => {
            return val.id + '';
          }),
          menu: menu.map((val) => {
            return val.id + '';
          })
        })
      } else {

      }
    }).catch(() => {
      message.error('系统有误');
    });

  };
  _configUserRight = () => {
    let { fieldValue = {},menu, element, role} = this.state;
    if(!fieldValue.id || !(menu.length || element.length || role.length)) {
      message.warning('请选择用户，并配置其权限');
      return;
    }
    let result = configUserRight({id: fieldValue.id,menuIds: menu.join(','), elementIds:element.join(','),roleIds:role.join(',')})
    result.then((res) => {
      if(res.status === 'S') {
        message.success(res.msg);
      } else {
        message.warning(res.msg);
      }
    }).catch(() => {
      message.error('系统有误')
    })
  };
  render() {
    let {columns, role, menu, element, rowSelection} = this.state;
    let { userList, menuList, elementList, roleList   } = this.props.system;
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
    let roleNode = roleList.map((val) => {
      return {
        title:val.name,
        key:val.id
      }
    });
    let toolbar = [
      {
        text: '确认配置',
        icon: 'check-circle',
        type: 'button',
        onClick: this._configUserRight
      }
    ];
    return (
      <Row>
        <Col span={24}>
          <Toolbar toolbar={toolbar}/>
        </Col>
        <Col span={24}>
          <Table columns={columns} rowSelection={rowSelection} dataSource={userList} />
        </Col>
        <Col span={8} className='menu-right-wrapper'>
          <div className='menu-right-content'>
            <h3>角色权限</h3>
            <Tree checkable={true}
                  onCheck={this._roleTreeRight}
                  checkedKeys={role}>
              {
                this.renderTreeNodes(roleNode)
              }
            </Tree>
          </div>
        </Col>
        <Col span={8} className='menu-right-wrapper'>
          <div className='menu-right-content'>
            <h3>菜单权限</h3>
            <Tree checkable={true}
                  onCheck={this._menuTreeRight}
                  checkedKeys={menu}>
              {
                this.renderTreeNodes(menuNode)
              }
            </Tree>
          </div>
        </Col>
        <Col span={8} className='element-right-wrapper'>
          <div className='element-right-content'>
            <h3>页面元素权限</h3>
            <Tree checkable={true}
                  onCheck={this._elementTreeRight}
                  checkedKeys={element}>
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
function mapStateToProps(state) {
  return {
    ...state
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
