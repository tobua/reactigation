# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0](https://github.com/tobua/reactigation/compare/v2.0.2...v2.1.0) (2021-09-23)


### Features

* **transition:** add custom "peek" modal with backdrop around ([ff03d32](https://github.com/tobua/reactigation/commit/ff03d32988dd8335e7ac87e0f06823d4252127f5))

### [2.0.2](https://github.com/tobua/reactigation/compare/v2.0.1...v2.0.2) (2021-09-23)


### Bug Fixes

* **register:** make sure all default screen properties are always set ([0ac4e09](https://github.com/tobua/reactigation/commit/0ac4e09c52068cc1d2f0b2d334904690009b7a3f))

### [2.0.1](https://github.com/tobua/reactigation/compare/v2.0.0...v2.0.1) (2021-09-19)


### Bug Fixes

* **hook:** clean up currentScreen listeners on unmount ([54c420d](https://github.com/tobua/reactigation/commit/54c420d57f44f4746fe5c5e73df4ad6eaf8de238))

## [2.0.0](https://github.com/tobua/reactigation/compare/v1.2.0...v2.0.0) (2021-09-19)


### ⚠ BREAKING CHANGES

* **register:** third argument to register is now an object with an option for `transition`

### Features

* **go:** passing props to next screen ([b05849a](https://github.com/tobua/reactigation/commit/b05849ae36495e1c523e5f4ed49b8e4370c2438e))
* **register:** allow customizing backgroundColor for each screen ([ea6c2d1](https://github.com/tobua/reactigation/commit/ea6c2d108d845f76ddca4dd8a267756a8335f022))


### Bug Fixes

* **flow:** make sure flow types available ([5823e6b](https://github.com/tobua/reactigation/commit/5823e6bb3b8bdc3fde812a3d8b468c7b8b288385))
* **transition:** only allow one transition at one time ([1a73228](https://github.com/tobua/reactigation/commit/1a7322868e532d03d248ab2d1555d512cba720ea))

## 1.2.0 (2021-09-03)


### Features

* **react:** add useCurrentScreen hook to ensure values are updated ([215a9eb](https://github.com/tobua/reactigation/commit/215a9ebb260c4a236c9a19891b0f94becc35c11a))
