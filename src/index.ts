import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import process from 'process';

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
const data = {
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
