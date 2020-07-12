# files2text

[![Dependency Status](https://david-dm.org/plantain-00/files2text.svg)](https://david-dm.org/plantain-00/files2text)
[![devDependency Status](https://david-dm.org/plantain-00/files2text/dev-status.svg)](https://david-dm.org/plantain-00/files2text#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/files2text.svg?branch=master)](https://travis-ci.org/plantain-00/files2text)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/files2text?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/files2text/branch/master)
![Github CI](https://github.com/plantain-00/files2text/workflows/Github%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/files2text.svg)](https://badge.fury.io/js/files2text)
[![Downloads](https://img.shields.io/npm/dm/files2text.svg)](https://www.npmjs.com/package/files2text)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fplantain-00%2Ffiles2text%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/files2text)

A CLI tool and library to get text structure of files in a folder.

## install

`yarn global add files2text`

## usage

run `files2text . -e node_modules -e .git`

key | description
--- | ---
-e,--exclude | directories, eg: "node_modules,.git", repeatable
-h,--help | Print this message.
-v,--version | Print the version

```txt
.
├─ .github
│  ├─ ISSUE_TEMPLATE.md
│  └─ PULL_REQUEST_TEMPLATE.md
├─ .gitignore
├─ .travis.yml
├─ .vscode
│  └─ settings.json
├─ LICENSE
├─ README.md
├─ appveyor.yml
├─ bin
│  └─ files2text
├─ clean-release.config.js
├─ clean-scripts.config.js
├─ dist
│  └─ index.js
├─ package.json
├─ spec
│  ├─ indexSpec.ts
│  ├─ result.txt
│  ├─ support
│  │  └─ jasmine.json
│  └─ tsconfig.json
├─ src
│  ├─ index.ts
│  ├─ lib.d.ts
│  └─ tsconfig.json
├─ tslint.json
└─ yarn.lock
```
