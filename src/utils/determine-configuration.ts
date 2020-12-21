import { ConfigurationInterface } from '../index';
import debug from './debug';
import parseTravisCiConfig from '../parser/travis-ci';
import parsePreviosRunConfig from '../parser/previous-run';

interface Parser {
  name: string;
  parse: { (): ConfigurationInterface | null };
}

const parsers: Parser[] = [
  {
    name: 'TravisCI',
    parse: parseTravisCiConfig,
  },
  {
    name: 'Previous Run',
    parse: parsePreviosRunConfig,
  },
];

export default function determineConfiguration(): ConfigurationInterface {
  for (const parser of parsers) {
    const { name, parse } = parser;

    debug(`Trying parser ${name}`);
    const config = parse();

    if (config === null) {
      continue;
    }

    console.log(`Using configuration from ${name}`);
    return config;
  }

  console.log('Using default configuration');

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
