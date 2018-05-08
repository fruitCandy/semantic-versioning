module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'fix',
                'perf',
                'feat',
                'break',
                'test',
                'docs',
                'style',
                'refactor',
                'chore',
                'revert',
                'WIP'
            ]
        ]
    },
};
