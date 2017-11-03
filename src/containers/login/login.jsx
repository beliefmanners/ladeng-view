import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import actions from 'Redux_config/actions/index'
import { hashHistory } from 'react-router'

import './index.styl';
import { Form, Icon, Input, Button, Checkbox, notification } from 'antd';
const FormItem = Form.Item;
class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let output = {
        status: !err,
        data: values
      };
      this.props.handleSubmit(output);
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Please input your Username!" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox>记住我</Checkbox>
          )}
          <Button type="primary"
                  loading={this.props.loading}
                  htmlType="submit"
                  className="login-form-button">
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({
  mapPropsToFields(props) {
    return props;
  }
})(NormalLoginForm);

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      loading: false
    }
  }
  handleSubmit(data) {
    this.setState({
      loading: true
    });
    if (!data.status){
      return
    }

    let result = this.props.logingIn(data.data);
    result.then((res) => {
      if (res && res.status === 'S') {
        hashHistory.push('/')
      } else {
        notification.warning({
          message: '登录失败',
          description: '账号密码有误'
        });
        this.setState({
          loading: false
        });
      }
    });
  }
  render() {
    let { loading } = this.state;
    return (
      <div className='login-wrapper'>
        <div className='login-from'>
          <div className='login-title'>
            <h1>拉登 应用发布管理系统</h1>
          </div>
          <WrappedNormalLoginForm loading={loading} handleSubmit={this.handleSubmit.bind(this)} />
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
