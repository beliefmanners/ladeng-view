import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table }  from 'antd'
class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {

    return (
      <Table {...this.props}
             bordered = {true}
             rowKey={record => record.id}
             >
      </Table>
    );
  }
}

export default TableComponent;

