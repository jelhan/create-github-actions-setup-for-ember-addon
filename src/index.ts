import ejs from 'ejs';
import fs from 'fs';
import parseTravisCiConfig from './utils/parse-travis-ci-config';
import path from 'path';
import process from 'process';

interface ConfigurationInterface {
  browsers: string[];
  emberTryScenarios: {
    allowedToFail: string[];
    required: string[];
  };
  nodeVersion: string;
}

const gitHubActionsWorkflowFile = path.join(
  process.cwd(),
  '.github',
  'workflows',
  'ci.yml'
);

const templateFile = path.join(
  __dirname,
  '..',
  'templates',
  '.github',
  'workflows',
  'ci.yml'
);
const data: ConfigurationInterface = parseTravisCiConfig() ?? {
  browsers: ['chrome', 'firefox'],
  emberTryScenarios: {
    required: [
      'ember-lts-3.16',
      'ember-lts-3.20',
      'ember-release',
      'ember-beta',
      'ember-default-with-jquery',
      'ember-classic',
    ],
    allowedToFail: ['ember-canary', 'embroider-tests'],
  },
  nodeVersion: '10.x',
};
const options = {
  // debug: true,
};

ejs.renderFile(templateFile, data, options, function (err, str) {
  if (err) {
    throw err;
  }

  fs.mkdirSync(path.dirname(gitHubActionsWorkflowFile), { recursive: true });
  fs.writeFileSync(gitHubActionsWorkflowFile, str);
});

export { ConfigurationInterface };
