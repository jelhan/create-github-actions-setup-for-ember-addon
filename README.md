# Create GitHub Actions setup for Ember Addon

Creates GitHub Actions for Ember Addon with NPM init / yarn create command.

> This is early alpha software. Use with care and double check the generated GitHub Actions workflow.

## Features

- Update an existing GitHub Actions workflow to latest blueprints using configuration from last run.
- Analyse an existing TravisCI configuration and migrate it over to GitHub Actions.

## Usage

```sh
# in a yarn repo
yarn create github-actions-setup-for-ember-addon

# in an npm repo
npm init github-actions-setup-for-ember-addon
```

The configuration to be used depends on the repository. It is determined using this algorithm:

1. Use configuration persisted in `.github/workflows/ci.yml` by a previous run if exists.
2. Analyse `.travis.yml` if one exist.
3. Fallback to defaults.

## Limitations of Travis CI parser

- Only supports TravisCI configuration following the schema used by Ember CLI >= 3.4.
- Environment variables used in TravisCI pipelines are not migrated (yet).
- Customizations of `before_install` or `script` steps are not migrated (yet).

## Contributing

Merge requests are very much appreciated. Parts that could be improved are:

- The generated GitHub Actions workflow may not reflect latest best practices.
- The script is only tested against TravisCI configurations created by recent Ember CLI versions so far. Extending that test coverage (and fixing bugs) would be great.
- Only a very limited subset of common customizations of the default TravisCI configuration is supported. Would love to support more common patterns.
- The script could be extended to allow the user to set configuration variables with command line flags rather than extracting them from an existing TravisCI configuration.

Contributing documentation is provided in [CONTRIBUTING.md](CONTRIBUTING.md)
to lower entry barrier. In case you face additional questions do not hesitate
to either open an issue or contact me (@jelhan) on
[Ember Community Discord](https://discord.gg/emberjs).

## License

This project is licensed under the [MIT License](LICENSE.md).
