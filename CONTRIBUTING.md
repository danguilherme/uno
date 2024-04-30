# Contributing Guide

## Branching

Use `develop` as the base branch when starting development. Follow our usual standard for branch names:

-   `feature/*` for new features.
-   `bugfix/*` for bug fixes.
-   `chore/*` for non-functional changes.

## Committing

This repo uses [semantic-release](https://github.com/semantic-release/semantic-release) and [conventional commit messages](https://conventionalcommits.org) so prefix your commits with the appropriate change type if you want your changes to appear in [release notes](CHANGELOG.md):

-   `feat:` when implementing a new feature.
-   `fix:` when implementing a bug fix.
-   `chore:` when making changes that do not affect the library functionality.
    "Chore" commits do not generate a new release.

When introducing a breaking change, add what has changed in the footer of the comment in the format `BREAKING CHANGE: what has changed`.
[Check out examples in the documentation.](https://www.conventionalcommits.org/en/v1.0.0/#examples)

## Pull Requests

After done with your development, open a pull request to `main`.

Pull requests are merged with the ["Squash and merge" option](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-commits), so that the commit history is clean and the commit messages are meaningful. This means that the PR title will be used as the commit summary, thus it must follow the [conventional commit message format described above](#committing). In case of a breaking change, add a `!` after the type (e.g. `feat!: ...` or `fix(Player)!: ...`), and add the breaking change description in the end of the PR description.

## Releasing Changes

Releases are done automatically as soon as changes are merged to main. Keep an eye in the [Release action](https://github.com/spread-ai/machina/actions/workflows/release.yml) to follow the status.

### Build & Bundle

A new version of the library is released when changes are merged to `main`. The release process will build and bundle the library, and publish it to npm.
