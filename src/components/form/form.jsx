import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Form, Input, Switch, Checkbox,Button ,Radio, Select } from 'antd';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
import { hashHistory } from 'react-router'
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  handleFormLayoutChange(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.props.onOk(values)
      }
    });
  }
  _onGoBack() {
    hashHistory.goBack();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let formLayout = this.props.formLayout ? this.props.formLayout : 'horizontal';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    } : null;
    let fieldValue = this.props.fieldValue || {};
    return (
        <Form onSubmit={this.handleFormLayoutChange.bind(this)}
          layout={formLayout}>
          {
            this.props.formColumns.map((value, index) => {
              if(value.type === 'hidden'){
                return (
                  <FormItem key={index}>
                    {
                      getFieldDecorator(value.key,{
                        initialValue: fieldValue[value.key]
                      })(<Input type='hidden'/>)
                    }
                  </FormItem>

                )
              }
              if(value.type === 'input') {
                return (
                  <FormItem {...formItemLayout}
                            key={index}
                            hasFeedback
                            colon={true}
                            label={value.title}>
                    {
                      getFieldDecorator(value.key,{
                        rules:[{required: value.isRequired, message: value.msg}],
                        initialValue:fieldValue[value.key] ? fieldValue[value.key]: ''
                      })(<Input/>)
                    }
                  </FormItem>
                )
              }
              if(value.type === 'switch') {
                return (<FormItem {...formItemLayout}
                                  label={value.title}
                                  key={index}
                                  colon={true}>
                  {
                    getFieldDecorator(value.key, {
                      rules:[{required: value.isRequired, message: value.msg}],
                      valuePropName: 'checked',
                      initialValue:fieldValue[value.key] ? true: false
                    })(<Switch/>)
                  }
                </FormItem>)
              }
              if(value.type === 'radio') {
                return (
                  <FormItem {...formItemLayout}
                            label={value.title}
                            key={index}
                            colon={true}>
                    {
                      getFieldDecorator(value.key, {
                        rules:[{required: value.isRequired, message: value.msg}],
                        initialValue: fieldValue[value.key]
                      })(<RadioGroup>
                        {
                          value.itemArr.map((val, index) => {
                            return (
                              <Radio value={val.value}
                                     disabled={val.disabled}
                                     key={index}>{val.text}</Radio>
                            );
                          })
                        }
                      </RadioGroup>)
                    }
                  </FormItem>
                )
              }
              if(value.type === 'checkbox') {
                let options = [];
                value.itemArr.map((val) => {
                  options.push({
                    label:val.text,
                    value:val.value,
                    disabled: value.disabled
                  })
                });
                return (<FormItem {...formItemLayout}
                                  label={value.title}
                                  colon={true}
                                  key={index}>
                  {
                    getFieldDecorator(value.key, {
                      rules:[{required: value.isRequired, message: value.msg}],
                      valuePropName: 'checked',
                      initialValue: fieldValue(value.key)
                    })(<CheckboxGroup defaultValue={fieldValue[value.key]}
                                      options={options}/>)
                  }
                </FormItem>)
              }
              if(value.type === 'select') {
                return (<FormItem {...formItemLayout}
                                  label={value.title}
                                  key={index}
                                  colon={true}>
                  {
                    getFieldDecorator(value.key,{
                      rules:[{required: value.isRequired, message: value.msg}],
                      initialValue: fieldValue[value.key]
                    })(<Select
                      placeholder = '请选择该项目服务器'
                      mode={value.mode}>
                      {
                        value.itemArr.map((val, key) => {
                          return (<Select.Option key={key} value={String(val.value)}>{val.text}</Select.Option>);
                        })
                      }
                    </Select>)
                  }
                </FormItem>)
              }
              if(value.type === 'text') {
                return (
                  <FormItem {...formItemLayout}
                            label={value.title}
                            colon={true}
                            key={index}>
                    <span style={{height:'180px',lineHeight:1.5}}>{fieldValue[value.key]}</span>
                  </FormItem>
                );
              }
            })
          }
          <FormItem  wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 6 }
          }}>
            <Button style={{ marginRight: 10 }}
                    onClick={this._onGoBack.bind(this)}>返回</Button>
            {
              this.props.onOk?
                <Button style={{ marginRight: 10 }}
                        htmlType='submit'
                        type='primary'>
                  确定
                </Button>:''
            }
          </FormItem>
        </Form>
    );
  }
}
function mapPropsToFields (props) {
  return {
    ...props
  }
}
let FormComponent = Form.create({mapPropsToFields})(AppComponent);

export default FormComponent;
