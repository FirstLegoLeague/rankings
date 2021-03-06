[![npm](https://img.shields.io/npm/v/@first-lego-league/rankings.svg)](https://www.npmjs.com/package/@first-lego-league/rankings)
[![codecov](https://codecov.io/gh/FirstLegoLeague/rankings/branch/master/graph/badge.svg)](https://codecov.io/gh/FirstLegoLeague/rankings)
[![Build status](https://ci.appveyor.com/api/projects/status/k4krkeis8vkl7w2u/branch/master?svg=true)](https://ci.appveyor.com/project/2roy999/rankings/branch/master)
[![GitHub](https://img.shields.io/github/license/FirstLegoLeague/rankings.svg)](https://github.com/FirstLegoLeague/rankings/blob/master/LICENSE)

[![David Dependency Status](https://david-dm.org/FirstLegoLeague/rankings.svg)](https://david-dm.org/FirstLegoLeague/rankings)
[![David Dev Dependency Status](https://david-dm.org/FirstLegoLeague/rankings/dev-status.svg)](https://david-dm.org/FirstLegoLeague/rankings#info=devDependencies)
[![David Peer Dependencies Status](https://david-dm.org/FirstLegoLeague/rankings/peer-status.svg)](https://david-dm.org/FirstLegoLeague/rankings?type=peer)

# rankings
A server-only micro-service that upon request, calculates the rankings by requesting them from the scoring service

## Background
The calculations of the rankings should be performed between the scoring and the display. This module is meant to be a REST API for anyone to consume the rankings at realtime.

## Techincal details
This module is a `node` module (see the [Module Standard](https://github.com/FirstLegoLeague/architecture/blob/master/module-standard/v1.0-SNAPSHOT.md)).

## Development
1. Fork this repository or create your own branch here
2. Make some changes
3. Create a Pull Request
4. Wait for a CR from the code owner
5. Make sure everything is well
6. Merge

A few things to notice while developing:
* Use `yarn` not `npm`
* Follow javascript standard as described [here](https://standardjs.com/)
* Keep the service lightweight
* Follow the API of the other modules, and try not to break API here. If you do break API, make sure the other modules are changed accrodingly.
* Be creative and have fun
