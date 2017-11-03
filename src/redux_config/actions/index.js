import * as login from './login';
import * as right from './right'
import * as webhook from './webhook'
import * as service from './service'
import * as layout from './layout'
import * as system from './system';

export default {
  ...login,
  ...right,
  ...webhook,
  ...service,
  ...layout,
  ...system
};
