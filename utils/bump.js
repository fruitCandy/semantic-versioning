#! /usr/bin/env node
import fs from 'fs-extra';
import pkg from '../../corgix/package.json';
import path from 'path';
import latestVersion from 'latest-version';

const keys = Object.keys(pkg.dependencies);

keys.forEach((dependency) => {
    latestVersion(dependency).then(version => {
        pkg.dependencies[dependency] = `~${version}`;
        fs.writeJsonSync(path.resolve(__dirname, '../../corgix/package.json'), pkg);
    });
});