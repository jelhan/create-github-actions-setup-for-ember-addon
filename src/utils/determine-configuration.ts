import { ConfigurationInterface } from '../index';
import debug from './debug';
import parseTravisCiConfig from '../parser/travis-ci';
import parsePreviosRunConfig from '../parser/previous-run';
import calculateDefaults from '../parser/defaults';

interface Parser {
  name: string;
  parse: { (): Promise<ConfigurationInterface | null> };
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
  {
    name: 'Defaults',
    parse: calculateDefaults,
  },
];

export default async function determineConfiguration(): Promise<ConfigurationInterface> {
  for (const parser of parsers) {
    const { name, parse } = parser;

    debug(`Trying parser ${name}`);
    const config = await parse();

    if (config === null) {
      continue;
    }

    console.log(`Using configuration from ${name}`);
    return config;
  }

  throw new Error(
    'Unable to determine any configuration. Defaults should have been used as a last fallback. Please report this bug.'
  );
}
