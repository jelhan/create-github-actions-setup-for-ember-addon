# How To Contribute

## Installation

- `git clone https://github.com/jelhan/create-github-actions-setup-for-ember-addon.git`
- `cd create-github-actions-setup-for-ember-addon`
- `yarn install`

## Architecture

GitHub Actions CI workflow is created based on a template writen in [EJS](https://ejs.co/).
It's located in `templates/.github/workflows/ci.yml`.

A configuration object is used to generate a concrete workflow based on the
template. It is defined by `ConfigurationInterface`.

The data used is extracted from existing configuration files in the project.
The utility functions responsible for parsing existing configurations are
called parser. They are located in `src/parser/`. So far only TravisCI
configuration (`.travis.yml`) is supported.

If no configuration file supported by any available parser is found, default
values are used.

## Running latest development

The project is written in TypeScript. To use latest development you must first
compile the code to JavaScript. Run `yarn compile` to do so.

Afterwards you can run latest development on any project. To do so change
current working directory to the project and afterwards execute the script
using a local path:
`/path/to/create-github-actions-setup-for-ember-addon/bin/create-github-actions-setup-for-ember-addon`

## Linting

The project uses ESLint for linting and Prettier for code formatting. Prettier
is integrated as an ESLint plugin.

Execute `yarn lint` to run linting and `yarn lint --fix` to automatically fix
linting issues. The latter is especially helpful to prettify the code.

## Running tests

The tests are executed with `yarn test`. The command also takes care of
compiling the TypeScript to JavaScript before executing the script.

The Tests are written with [jest](https://jestjs.io/).

The tests use [snapshot testing](https://jestjs.io/docs/en/snapshot-testing).
A snapshot of the created GitHub Actions CI workflow is created for each test
scenario. It's compared against snapshots created before. The snapshots are
checked into the repository and located at `tests/acceptance/__snapshots__`.

The snaphot-based tests are expected to fail whenever the created GitHub
Actions CI workflow changes. In many cases that changes may be expected. If so
the snapshots must be updated. Run `yarn test -u` to do so.

Please double check that all changes to snapshots are as expected by your
change before committing the changes.
