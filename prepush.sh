#! /usr/bin/env node

current_branch=$(git rev-parse --abbrev-ref HEAD)
echo $current_branch
if [[ "$current_branch" =~ "master" ]]; then
    echo 456
    read -a array
    pushed_ref=${array[1]}
    emote_ref=${array[3]}

    echo
    echo "# Files changed:"
    git diff --name-only $remote_ref $pushed_ref

    files=$(git diff --name-only $remote_ref $pushed_ref)

    echo $files
    read -p "You're about to push to production, are you sure? [y|n] " -r < /dev/tty
    echo
    if [[ $REPLY = 'y' ]]; then
        echo yes
        exit 1
    else
        echo no
        exit 1
    fi
else
    echo 789
    exit 1
fi