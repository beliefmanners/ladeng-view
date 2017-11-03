import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index'
import { Icon, Button, message } from 'antd'
import Appconfig from 'config';
const { caleUpdateTime } = Appconfig;
import { api_configMenu } from 'sources/menu';
import Table from 'components/table/table'
import Toolbar from 'components/toolbar/toolbar'
import ModalForm from 'components/modalForm/modalForm'
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      columns: [
        {
          title:'菜单名称',
          key:'name',
          dataIndex:'name'
        },
        {
          title:'图标',
          key:'icon',
          dataIndex:'icon',
          render(text) {
            if (text)
              return <Icon type={text}/>
            return text;
          }
        },
        {
          title:'Path',
          key:'path',
          dataIndex:'path'
        },
        {
          title:'描述',
          key:'description',
          dataIndex:'description'
        },
        {
          title:'排序号',
          key:'sort',
          dataIndex:'sort'
        },
        {
          title:'更新时间',
          key:'updateTime',
          dataIndex:'updateTime',
          render(text) {
            if(text)
              return caleUpdateTime(text);
            return text;
          }
        },
        {
          title: '操作',
          render: (row) => {
            return (<Button type='primary'
              onClick={() => {
              this._handConfigMenu(row);
            }}>更新</Button>);
          }
        }
      ],
      visible: false,
      loading: false,
      formColumns: [
        {
          key: 'id',
          type: 'hidden'
        },{
          key: 'pId',
          type: 'hidden'
        },{
          title:'菜单名称',
          key: 'name',
          type:'input',
          isRequired: true,
          msg:'请输入菜单名称'
        },{
          title:'PATH',
          key: 'path',
          type:'input',
          isRequired: true,
          msg:'请输入菜单路径'
        },{
          title:'Icon',
          key: 'icon',
          type:'radio',
          isRequired: true,
          itemArr:[
            {
              value:'lock',
              text:<Icon type="lock" />
            },{
              value:'unlock',
              text:<Icon type="unlock" />
            },{
              value:'area-chart',
              text:<Icon type="area-chart" />
            },{
              value:'pie-chart',
              text:<Icon type="pie-chart" />
            },{
              value:'bar-chart',
              text:<Icon type="bar-chart" />
            },{
              value:'dot-chart',
              text:<Icon type="dot-chart" />
            },{
              value:'book',
              text:<Icon type="book" />
            },{
              value:'calendar',
              text:<Icon type="calendar" />
            },{
              value:'cloud',
              text:<Icon type="cloud" />
            },{
              value:'cloud-download',
              text:<Icon type="cloud-download" />
            },{
              value:'code-o',
              text:<Icon type="code-o" />
            },{
              value:'file',
              text:<Icon type="file" />
            },{
              value:'file-text',
              text:<Icon type="file-text" />
            },{
              value:'file-unknown',
              text:<Icon type="file-unknown" />
            },{
              value:'file-pdf',
              text:<Icon type="file-pdf" />
            },{
              value:'hdd',
              text:<Icon type="hdd" />
            },{
              value:'file-excel',
              text:<Icon type="file-excel" />
            },{
              value:'file-jpg',
              text:<Icon type="file-jpg" />
            },{
              value:'file-ppt',
              text:<Icon type="file-ppt" />
            },{
              value:'file-text',
              text:<Icon type="file-text" />
            },{
              value:'file-unknown',
              text:<Icon type="file-unknown" />
            },{
              value:'file-add',
              text:<Icon type="file-add" />
            },{
              value:'folder',
              text:<Icon type="folder" />
            },{
              value:'folder-open',
              text:<Icon type="folder-open" />
            },{
              value:'line-chart',
              text:<Icon type="line-chart" />
            },{
              value:'notification',
              text:<Icon type="notification" />
            },{
              value:'fork',
              text:<Icon type="fork" />
            },{
              value:'api',
              text:<Icon type="api" />
            },{
              value:'shake',
              text:<Icon type="shake" />
            },{
              value:'global',
              text:<Icon type="global" />
            },{
              value:'contacts',
              text:<Icon type="contacts" />
            },{
              value:'trophy',
              text:<Icon type="trophy" />
            },{
              value:'bank',
              text:<Icon type="bank" />
            },{
              value:'wallet',
              text:<Icon type="wallet" />
            },{
              value:'safety',
              text:<Icon type="safety" />
            },{
              value:'trademark',
              text:<Icon type="trademark" />
            },{
              value:'copyright',
              text:<Icon type="copyright" />
            },{
              value:'coffee',
              text:<Icon type="coffee" />
            },{
              value:'red-envelope',
              text:<Icon type="red-envelope" />
            },{
              value:'medicine-box',
              text:<Icon type="medicine-box" />
            },{
              value:'idcard',
              text:<Icon type="idcard" />
            },{
              value:'gift',
              text:<Icon type="gift" />
            },{
              value:'shop',
              text:<Icon type="shop" />
            },{
              value:'woman',
              text:<Icon type="woman" />
            },{
              value:'usergroup-delete',
              text:<Icon type="usergroup-delete" />
            },{
              value:'schedule',
              text:<Icon type="schedule" />
            },{
              value:'car',
              text:<Icon type="car" />
            },{
              value:'user-add',
              text:<Icon type="user-add" />
            },{
              value:'user',
              text:<Icon type="user" />
            },{
              value:'wifi',
              text:<Icon type="wifi" />
            },{
              value:'sync',
              text:<Icon type="sync" />
            },{
              value:'tool',
              text:<Icon type="tool" />
            },{
              value:'skin',
              text:<Icon type="skin" />
            },{
              value:'usb',
              text:<Icon type="usb" />
            },{
              value:'printer',
              text:<Icon type="printer" />
            }
          ]
        },{
          title:'描述',
          key: 'description',
          type:'input'
        },{
          title:'排序',
          key:'sort',
          type:'input'
        }
      ]
    }
  }

  componentWillMount() {
    let {menuList} = this.props.system;
    if (!menuList.length) {
      this.props.getMenuList();
    }
  }
  _handConfigMenu = (row) => {
    this.setState({
      fieldValue:row.name ? row : {},
      visible:true,
      title: row.name ? `更新${row.name}配置`: '添加菜单'
    })
  };
  _modalOnCancel = () => {
    this.setState({
      visible: false,
      loading: false
    })
  };
  _modalOnOk = () => {
    let { fieldValue={} } = this.state;
    let field = ['name', 'path', 'icon'];
    for (let i = 0; i<field.length; i++) {
      if(!fieldValue[field[i]]) {
        message.warning('配置不是完整');
        return;
      }
    }
    let result = api_configMenu(fieldValue);
    result.then((res) => {
      if (res.status === 'S') {
        message.success(res.msg);
        this.props.getMenuList();
        this._modalOnCancel();
      } else {
        message.warning(res.msg);
      }
    }).catch(() => {
      message.error('系统有误！');
    });
  };
  _modalOnChange = (values) => {
    let { fieldValue } = this.state;
    this.setState({
      fieldValue: Object.assign({}, fieldValue, values)
    })
  };
  render() {
    let {menuList} = this.props.system;
    let { columns, visible, loading, formColumns, title, fieldValue={} } = this.state;
    let toolbar = [
      {
        text: '添加菜单',
        icon: 'check-circle',
        type: 'button',
        onClick: this._handConfigMenu
      }
    ];
    return (
        <div>
          <Toolbar toolbar={toolbar}/>
          <ModalForm loading={loading}
                     fieldValue={fieldValue}
                     onCancel={this._modalOnCancel}
                     onChange={this._modalOnChange}
                     onOk={this._modalOnOk}
                     title={title}
                     formColumns={formColumns}
            visible={visible}/>
          <Table columns={columns} dataSource={menuList}/>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state};
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
