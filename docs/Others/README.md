# Others

## Vuepress + Travis 实现自动部署踩坑

`vuepress` 官方推荐的创建一个 `deploy.sh` 来实现部署，此操作在集成 `travis` 时完全可以省略(别问我为什么知道)

### 生成 Personal access tokens
- 登录 github,点击右上角头像
- Settings / Developer settings / Personal access tokens
- Generate new token (全选)

### Environment Variables 设置 token
- 进入要设置的项目
- More options / Settings
- Environment Variables 内新添 `GITHUB_TOKEN` (value 为上一步 github 生成的 token)

### .travis.yml
- 项目根目录新建 `.travis.yml`
```
language: node_js
sudo: required
node_js:
  - "lts/*"
install:
  - npm install -g vuepress
script:
  - vuepress build docs && cd docs/.vuepress/dist
deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN
  on:
    branch: master
  local-dir: docs/.vuepress/dist
```

最后 push 代码到 github, travis 就会检测到 push 请求，实现自动部署到 `gh-pages` 分支

##  jest codecov 集成踩坑

codecov 是一个开源的统计单元测试覆盖率的工具, 可通过 `travis` 自动部署时上传覆盖率.

本例结合 jest 集成 codecov

首先安装 codecov
```bash
yarn add --dev codecov
```
然后 `package.json` `scripts` 加入:
```json
"codecov": "codecov"
```
最后在 `package.json` `jest` 或者 `jest.config.js` 内加入配置项:
```
coverageDirectory: './coverage/',
collectCoverage: true,
```
注: codecov 将在根目录下生成目录 coverage, 可通过 `.gitignore` 配置忽略.

本地文件的操作就这些, 之后去到 [codecov.io](https://codecov.io/), 登录后进入目标项目, 复制 `Token`

然后去到 travis 对应项目 `Environment Variables` 内新添 `CODECOV_TOKEN`

ok, 以后 `git push` 就会自动跑 codecov 啦~

## Commitizen
能够根据提示自动生成符合规范的 `commit message`

安装
```bash
yarn global add commitizen
```

在项目中使用
```bash
commitizen init cz-conventional-changelog --save --save-exact
```

在提交的时候就可以使用 `git cz` 就可以根据提示，生成自动化的 `commit message`

![commit](https://user-gold-cdn.xitu.io/2018/10/27/166b47239dd94158?imageslim)

## 生成 Change log
> 如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， Change log 就可以用脚本自动生成

```bash
yarn global add conventional-changelog-cli

conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

> 为了方便使用，可以将其写入package.json的scripts字段。

```json
{
  "scripts": {
    "version": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"
  }
}
```

[参考](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
[参考2](https://juejin.im/post/5bd2debfe51d457abc710b57)