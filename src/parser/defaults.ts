import { ConfigurationInterface } from '../index';

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
    packageManager: 'yarn',
  };
}
