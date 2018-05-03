MESSAGE=$(git log --format=%B -n 1 $TRAVIS_COMMIT)
# git remote add origin git@github.com:fruitCandy/semantic-versioning.git
# git fetch origin
# git clone git@github.com:fruitCandy/semantic-versioning.git lerna-semantic-release
git checkout $TRAVIS_BRANCH
git config credential.helper store
echo "https://${RELEASE_GH_USERNAME}:${RELEASE_GH_TOKEN}@github.com/fruitCandy/lerna-semantic-release.git" > ~/.git-credentials
npm config set //registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN -q
npm prune

# email address to be recorded in any newly created commits
git config --global user.email "pinkbear715@gmail.com"
# full name to be recorded in any newly created commits
git config --global user.name "Travis CI"
# in centralized workflow, work like upstream with an added safety to refuse to push if the upstream branch’s name is different from the local one.
git config --global push.default simple

git fetch --tags
git branch -u origin/$TRAVIS_BRANCH
git fsck --full
echo "npm whoami"
npm whoami #debug
echo "git config --list"
git config --list #debug