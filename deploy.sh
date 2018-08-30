#! /usr/bin/env sh

npm run build

cd docs/.vuepress/dist

git init
git config user.name 'chenyueban'
git config user.email '269380014@163.com'
git add -A
git commit -m 'deploy'

git push -f git@github.com:chenyueban/notes.git master:gh-pages