import React from 'react'
// import PureRenderMixin form 'react-addons-pure-render-mixin'
import { Form, Input, Switch, Checkbox,Button ,Radio, Select } from 'antd';
import {hashHistory} from 'react-router'
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  _onGoBack() {
    hashHistory.goBack()
  }
  render() {
    let formLayout = this.props.formLayout ? this.props.formLayout : 'horizontal';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    } : null;
    let formColumns = this.props.formColumns;
    let fieldValue = this.props.fieldValue || {};
    return (
      <Form layout={formLayout}>
        {
          formColumns.map((value, index) => {
            if(value.type === 'input') {
              return (
                <FormItem {...formItemLayout}
                          key={index}
                          hasFeedback
                          colon={true}
                          label={value.title}>
                  <Input defaultValue={fieldValue[value.key]} onChange={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    let val = e.target.value;
                    fieldValue[value.key] = val;
                  }}/>
                </FormItem>
              )
            }
            if(value.type === 'switch') {
              return (<FormItem {...formItemLayout}
                                label={value.title}
                                key={index}
                                colon={true}>
                <Switch onChange={(val) => {
                  fieldValue[value.key] = val? 1 : 0;
                  return val;
                }} defaultChecked={fieldValue[value.key]? true : false}/>
              </FormItem>)
            }
            if(value.type === 'radio') {
              return (
                <FormItem {...formItemLayout}
                          label={value.title}
                          key={index}
                          colon={true}>
                  <RadioGroup defaultValue={fieldValue[value.key]}
                              onChange={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                fieldValue[value.key] = e.target.value;
                  }}>
                    {
                      value.itemArr.map((val, index) => {
                        return (
                          <Radio value={val.value}
                                 disabled={val.disabled}
                                 key={index}>{val.text}</Radio>
                        );
                      })
                    }
                  </RadioGroup>
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
                <CheckboxGroup defaultValue={fieldValue[value.key]}
                               onChange={(e) => {
                                 e.stopPropagation();
                                 e.preventDefault();
                                 fieldValue[value.key] = e.target.value;
                }} options={options}/>
              </FormItem>)
            }
            if(value.type === 'select') {
              return (<FormItem {...formItemLayout}
                                label={value.title}
                                key={index}
                                colon={true}>
                <Select placeholder = {value.msg}
                        onChange={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          fieldValue[value.key] = e.target.value;
                        }}
                        defaultValue={fieldValue[value.key]}
                  mode={value.mode}>
                  {
                    value.itemArr.map((val, key) => {
                      return (<Select.Option key={key} value={String(val.value)}>{val.text}</Select.Option>);
                    })
                  }
                </Select>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        this.props.onOk(fieldValue);
                      }}
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
