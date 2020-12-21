import { debug, determineConfiguration } from './utils';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import process from 'process';
import yaml from 'js-yaml';

interface EmberTryScenario {
  scenario: string;
  allowedToFail: boolean;
}

interface ConfigurationInterface {
  browsers: string[];
  emberTryScenarios: EmberTryScenario[];
  nodeVersion: string;
  packageManager: 'npm' | 'yarn';
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
const configuration: ConfigurationInterface = determineConfiguration();
const data = Object.assign(
  { configurationDump: yaml.safeDump(configuration) },
  configuration
);
const options = {
  // debug: true,
};

ejs.renderFile(templateFile, data, options, function (err, str) {
  if (err) {
    throw err;
  }

  debug(`Writing GitHub Actions workflow to ${gitHubActionsWorkflowFile}`);
  fs.mkdirSync(path.dirname(gitHubActionsWorkflowFile), { recursive: true });
  fs.writeFileSync(gitHubActionsWorkflowFile, str);
});

export { ConfigurationInterface, EmberTryScenario };
