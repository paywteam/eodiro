# Changelog

## v2.1.0 Beta 9

### Performance

- Use only two components to transition between previous and next routes instead of utilizing redundant `v-if`s for every hamlet

### Bug Fixes

- Mitigate some flickering problems inside the Banner - #205

### Chore

- Show the currently deployed version number in home

## v2.1.0 Beta 8

### Bug Fixes

- Fix broken post item layout - #228
- Fix infinite comments fetching - #237
- Conceal the post data when access without authentication - #243

### Features

- Display the number of comments

### Chore

- Faster page transition
- No more auto-redirection to the Sign In page when a page requires the authentication

---

Check out [release notes](https://github.com/paywteam/eodiro/releases) for the previous updates.