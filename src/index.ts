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
const data = {};
const options = {};

ejs.renderFile(templateFile, data, options, function (err, str) {
  if (err) {
    throw err;
  }

  fs.mkdirSync(path.dirname(gitHubActionsWorkflowFile), { recursive: true });
  fs.writeFileSync(gitHubActionsWorkflowFile, str);
});
