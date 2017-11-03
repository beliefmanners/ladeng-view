import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import './index.styl';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import actions from 'Redux_config/actions/index';
import { Layout,Button,Icon,Menu, Dropdown,message, Avatar } from 'antd';
import {hashHistory} from 'react-router'
const { Header, Sider, Content, Footer } = Layout;
class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      collapsed: false
    }
  }
  componentWillMount() {
    let token = this.props.userInfo.token;
    if(!token) {
      let result = this.props.loginCheck();
      result.then((res) => {
        if (res.status === 'F') {
          message.warning('请重新登录');
          hashHistory.push('login');
        } else {
          // 获取权限
          this.props.getMeMenuElement();
        }
      }).catch(() => {
        message.warning('请重新登录');
        hashHistory.push('/login');
      });
    };
    let { menu } = this.props.right.meRightMenuElement;
    if(!menu.length) {
      this.props.getMeMenuElement();
    }
  }
  toggleSider = () =>{
    this.setState({
      collapsed: !this.state.collapsed,
      APPCONNECT: false
    })
  };

  onMenuSelect = (val) => {
    hashHistory.push(`/${val.key}`);
  };

  // 退出登录
  outLogin(val) {
    if (val.key !== 'outLogin') {return};
    this.props.loginOut();
    hashHistory.push('/login');
  }
  render() {
    let { menu } = this.props.right.meRightMenuElement;

    menu.sort(function(a, b){
      return a.sort - b.sort;
    });
    let userInfo = this.props.userInfo;
    let {avatarUrl} = userInfo;
    const DropMenu = (<Menu onClick={this.outLogin.bind(this)}>
      <Menu.Item >
        {userInfo.name}
      </Menu.Item>
      <Menu.Item key='outLogin'>
        退出登录
      </Menu.Item>
    </Menu>);
    return (
      <Layout className='layout-wrapper'>
        <Sider trigger={null}
               collapsible
               width={200}
               className='layout-sider-wrapper'
               collapsed={this.state.collapsed}>
          <div className='logo'></div>
          <Menu theme='dark'
                onSelect={this.onMenuSelect}
                mode='inline'>
            {
              menu.map((val) => {
                return (<Menu.Item key={val.path}>
                    {
                      val.icon? <Icon type={val.icon} /> : ''
                    }
                  <span>{val.name}</span>
                </Menu.Item>)
              })
            }
          </Menu>
        </Sider>
        <Layout>
          <Header className='layout-header-wrapper'>
            <div className='header-toolbar-wrapper'>
              <Icon
                className="layout-header-trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggleSider}
              />
              <Button>
                <Icon type="info-circle" />
                <a href="http://git.gag.cn/laden/doc/issues/2" target='_blank'>查看帮助文档</a>
              </Button>
            </div>
            <div className='header-avatar-wrapper'>
              <Dropdown overlay={DropMenu} placement='bottomLeft'>
                {
                  avatarUrl? <Avatar size='large' src={avatarUrl}/> : <Avatar size='large' icon='user'/>
                }
              </Dropdown>
            </div>
          </Header>
          <Content className='layout-content-wrapper'>
            <Layout className='layout-wrapper'>
              <Content className='content-layout-content-wrapper'>
                {
                  this.props.children
                }
              </Content>
              {
                this.props.layout.siderCollapsed?
                  <Sider trigger={null} collapsible className='layout-content-sider-wrapper' width={this.props.layout.width || 250}>
                    {this.props.layout.children}
                </Sider>: ''
              }

            </Layout>
          </Content>
          <Footer className='layout-footer-wrapper'>
            拉登前端发布系统 ©{new Date().getFullYear()} Created by Gooagoo
          </Footer>
        </Layout>
      </Layout>
    );
  }
  componentDidMount() {
    this.setState({
      APPCONNECT: true
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
export default connect(mapStateToProps, mapDispatchToProps)(LayoutComponent);
