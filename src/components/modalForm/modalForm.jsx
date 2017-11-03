import React from 'react'
import { Form, Input, Switch, Checkbox,Modal ,Radio, Select } from 'antd';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

class AppComponent extends React.Component {
  constructor(props) {
    super(props)
  }
  _onChange = (values) => {
    if(this.props.onChange){
      this.props.onChange(values);
    }
  };
  render() {
    let formLayout = this.props.formLayout ? this.props.formLayout : 'horizontal';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    } : null;
    let fieldValue = this.props.fieldValue || {};
    let formColumns = this.props.formColumns || [];
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
                  <Input defaultValue={''}
                         value={fieldValue[value.key]}
                         onChange={(e) => {
                           e.stopPropagation();
                           e.preventDefault();
                           let fieldValue = e.target.value;
                           this._onChange({[value.key]:fieldValue});
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
                        let fieldValue = val? 1 : 0;
                        this._onChange({[value.key]:fieldValue});
                      }}
                        checked={!!fieldValue[value.key]}
                        defaultChecked={true}/>
              </FormItem>)
            }
            if(value.type === 'radio') {
              return (
                <FormItem {...formItemLayout}
                          label={value.title}
                          key={index}
                          colon={true}>
                  <RadioGroup defaultValue={[]}
                              value={fieldValue[value.key]}
                              onChange={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                let fieldValue = e.target.value;
                                this._onChange({[value.key]:fieldValue});
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
                <CheckboxGroup defaultValue={[]}
                               value={fieldValue[value.key]}
                               onChange={(e) => {
                                 e.stopPropagation();
                                 e.preventDefault();
                                 let fieldValue = e.target.value;
                                 this._onChange({[value.key]:fieldValue});
                               }} options={options}/>
              </FormItem>)
            }
            if(value.type === 'select') {
              return (<FormItem {...formItemLayout}
                                label={value.title}
                                key={index}
                                colon={true}>
                <Select placeholder = {value.msg || `请选择${value.title}`}
                        onChange={(fieldValue) => {
                          this._onChange({[value.key]:fieldValue});
                        }}
                        value={fieldValue[value.key]}
                        defaultValue={[]}
                        mode={value.mode}>
                  {
                    value.itemArr.map((val, key) => {
                      return (<Select.Option key={key} value={String(val.value)}>{val.text}</Select.Option>);
                    })
                  }
                </Select>
              </FormItem>)
            }
            if(value.type === 'text' && fieldValue[value.key]) {
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
class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }
  _onCancel() {
    if(this.props.onCancel){
      this.props.onCancel();
    }
  }
  __onOk() {
    if(this.props.onOk) {
      this.props.onOk();
    }
  }
  render() {
    let { title, visible, formColumns, fieldValue,onChange } = this.props;

    return (
      <Modal title={title}
             confirmLoading={this.props.loading || false}
             onOk={this.__onOk.bind(this)}
             onCancel={this._onCancel.bind(this)}
             visible={visible}>
        <FormComponent formColumns={formColumns} onChange={onChange} fieldValue={fieldValue}/>
      </Modal>
    );
  }
}
export default ModalComponent;
