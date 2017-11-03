import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Router, Route, IndexRoute, hashHistory  } from 'react-router';
import menuList from './layout/menu/menu'
// containers
import Login from 'containers/login/login';
import Layout from './layout/layout'
import Home from 'containers/webhookConfigManage/webhookConfigManage';
import NotFound from './404'
import '../styles/App.less'

class RouterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <Router history={hashHistory}>
        <Route path='login' component={Login} />
        <Route path='/' component={Layout}>
          <IndexRoute component={Home}/>
          {
            menuList.map((val, index) => {
              return (
                <Route key={index} path={val.path} component={val.component}/>
              );
            })
          }
          <Route path='*' component={NotFound}/>
        </Route>
      </Router>
    );
  }
}

export default RouterComponent;
