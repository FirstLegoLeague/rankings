# rankings
A server-only micro-service that upon request, calculates the rankings by requesting them from the scoring service

## Background
The calculations of the rankings should be performed between the scoring and the display. This module is meant to be a REST API for anyone to consume the rankings at realtime.

## Techincal details
This module is a `node` module (see the [Module Standard](https://github.com/FirstLegoLeague/architecture/blob/master/module-standard/v1.0-SNAPSHOT.md)).

## Development
1. Fork this repository or create your own branch here
2. make some changes
3. create a Pull Request
4. Wait for a CR from the code owner
5. make sure everything is well
6. merge

A few things to notice while developing:
* Use `yarn` not `npm`
* Follow javascript standard as described [here](https://standardjs.com/)
* Keep the service lightweight
* Follow the API of the other modules, and try not to break API here. If you do break API, make sure the other modules are changed accrodingly.
* Be creative and have fun
