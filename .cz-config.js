'use strict';

module.exports = {
    types: [
        {value: 'fix',      name: 'fix:      🛠  A bug fix (Patch release)'},
        {value: 'perf',     name: 'perf:     🛠  A code change that improves performance (Patch release)'},
        {value: 'feat',     name: 'feat:     ✨  A new feature (Minor release)'},
        {value: 'break',    name: 'break:    💥  Incompatible API changes (Major release)'},
        {value: 'test',     name: 'test:     Adding missing tests'},
        {value: 'docs',     name: 'docs:     Documentation only changes'},
        {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
        {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
        {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
        {value: 'revert',   name: 'revert:   Revert to a commit'},
        {value: 'WIP',      name: 'WIP:      Work in progress'}
    ],

    scopes: [],

    // override the messages, defaults are as follows
    messages: {
        type: 'Type:',
        customScope: 'Scope:',
        subject: 'Subject:\n',
        body: 'Commit body (optional). Use "|" to break new line:\n',
        breaking: 'List any BREAKING CHANGES:\n',
        confirmCommit: 'Are you sure you want to proceed with the commit above?'
    },

    allowCustomScopes: true,
    allowBreakingChanges: ['break']
};