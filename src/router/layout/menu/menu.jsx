import systemManage from 'containers/systemManage/systemManage';
import roleManage from 'containers/roleManage/roleManage';
import userManage from 'containers/userManage/userManage';
import menuManage from 'containers/menuManage/menuManage';
import serviceList from 'containers/serviceList/serviceList';
import webhookList from 'containers/webhookList/webhookList';
import webhookLog from 'containers/webhookLog/webhookLog';
import webhookConfigManage from 'containers/webhookConfigManage/webhookConfigManage'
import elementMenage from 'containers/elementManage/elementMange'
export default  [
  {path: '/systemManage', component: systemManage},
  {path: '/roleManage', component: roleManage},
  {path: '/userManage', component: userManage},
  {path: '/menuManage', component: menuManage},
  {path: '/serviceList', component: serviceList},
  {path: '/webhookList', component: webhookList},
  {path: '/webhookConfigManage', component: webhookConfigManage},
  {path: '/webhookLog', component: webhookLog},
  {path: '/elementMenage', component: elementMenage}
]
