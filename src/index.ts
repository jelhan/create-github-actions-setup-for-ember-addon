import ejs from 'ejs';
import path from 'path';

const gitHubActionsConfigurationTemplate = path.join(
  __dirname,
  '..',
  'templates',
  '.github',
  'workflows',
  'ci.yml'
);
const data = {};
const options = {};
ejs.renderFile(
  gitHubActionsConfigurationTemplate,
  data,
  options,
  function (err, str) {
    console.log(str);
  }
);
