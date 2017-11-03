import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import ReadMe from './READNE.md'
import MarkdownRenderer from 'react-markdown-renderer';
// console.log(ReadMe);
const MarkDown = '# 拉登应用发布系统\n' +
  '\n' +
  '# first\n' +
  '  # `npm install`\n' +
  '* second\n' +
  '  * `npm start`\n' +
  '* third\n' +
  '  * open chrome with url `localhost:4000`';
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentWillMount() {

  }

  render() {

    return (
      <div>
        <MarkdownRenderer markdown={MarkDown}/>
      </div>
    );
  }
}

export default AppComponent;
