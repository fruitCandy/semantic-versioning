#! /usr/bin/env node
import fs from 'fs-extra';
import pkg from '../../corgix/package.json';
import path from 'path';
import promise from 'promise';
import latestVersion from 'latest-version';

const keys = Object.keys(pkg.dependencies);
const promises = [];
keys.forEach((dependency) => {
    promises.push(latestVersion(dependency));
});

let major = false;
let minor = false;
let patch = false;
promise.all(promises).then(versions => {
    versions.forEach((version, index) => {
        const oldVersion = pkg.dependencies[keys[index]];
        const oldVersionChunks = oldVersion.slice(1, oldVersion.length).split('.');
        const newVersionChunks = version.split('.');

        if (!major && oldVersionChunks[0] < newVersionChunks[0]) {
            major = true;
        } else if (!major && !minor && oldVersionChunks[1] < newVersionChunks[1]) {
            minor = true;
        } else if (!major && !minor && !patch && oldVersionChunks[2] < newVersionChunks[2]) {
            patch = true;
        }

        pkg.dependencies[keys[index]] = `~${version}`;
    });

    const corgixVersionChunks = pkg.version.split('.');
    if (major) {
        pkg.version = `${parseInt(corgixVersionChunks[0], 10) + 1}.0.0`;
    } else if (minor) {
        pkg.version = `${corgixVersionChunks[0]}.${parseInt(corgixVersionChunks[1], 10) + 1}.0`;
    } else if (patch) {
        pkg.version = `${corgixVersionChunks[0]}.${corgixVersionChunks[1]}.${parseInt(corgixVersionChunks[2], 10) + 1}`;
    }

    fs.writeJsonSync(path.resolve(__dirname, '../../corgix/package.json'), pkg);
});