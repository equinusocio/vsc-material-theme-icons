import * as execa from 'execa';

import {PATHS} from './helpers/paths';

export default () =>
  execa.shell(`json-minify ${PATHS.tmpPathIcons} > ${PATHS.pathIcons} && rimraf ${PATHS.tmpPathIcons}`);
