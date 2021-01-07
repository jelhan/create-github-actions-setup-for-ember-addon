import path from 'path';
import { copy, existsSync } from 'fs-extra';
import execa from 'execa';

const fixturesPath = path.join(__dirname, '..', 'fixtures');

export async function prepareFixtures(
  fixture: string,
  tmpDirForTesting: string
): Promise<void> {
  // copy fixture files to testing directory
  await copy(path.join(fixturesPath, fixture), tmpDirForTesting);

  // install dependencies
  const isYarn = existsSync(path.join(tmpDirForTesting, 'yarn.lock'));
  const isNpm =
    !isYarn && existsSync(path.join(tmpDirForTesting, 'package-lock.json'));
  if (isYarn) {
    await execa('yarn', ['install', '--frozen-lockfile'], {
      cwd: tmpDirForTesting,
    });
  } else if (isNpm) {
    await execa('npm', ['ci'], { cwd: tmpDirForTesting });
  }
}
