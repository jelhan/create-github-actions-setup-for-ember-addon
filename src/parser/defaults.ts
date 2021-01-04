import { ConfigurationInterface } from '../index';
import { existsSync } from 'fs';

function determinePackageManager() {
  const isNPM = existsSync('package-lock.json');
  const isYarn = existsSync('yarn.lock');

  if (isNPM && isYarn) {
    throw new Error(
      'Unable to determine package manager. Project seems to have both package-lock.json and yarn.lock.'
    );
  }

  if (!isNPM && !isYarn) {
    throw new Error(
      'Unable to determine package manager. Project seems to have neither package-lock.json nor yarn.lock'
    );
  }

  return isNPM ? 'npm' : 'yarn';
}

export default function (): ConfigurationInterface {
  return {
    browsers: ['chrome', 'firefox'],
    emberTryScenarios: [
      {
        scenario: 'ember-lts-3.16',
        allowedToFail: false,
      },
      {
        scenario: 'ember-lts-3.20',
        allowedToFail: false,
      },
      {
        scenario: 'ember-release',
        allowedToFail: false,
      },
      {
        scenario: 'ember-beta',
        allowedToFail: false,
      },
      {
        scenario: 'ember-default-with-jquery',
        allowedToFail: false,
      },
      {
        scenario: 'ember-classic',
        allowedToFail: false,
      },
      {
        scenario: 'ember-canary',
        allowedToFail: true,
      },
      {
        scenario: 'embroider-tests',
        allowedToFail: true,
      },
    ],
    nodeVersion: '10.x',
    packageManager: determinePackageManager(),
  };
}
