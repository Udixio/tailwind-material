# Contributing to Tailwind-material

We would love for you to contribute to Tailwind-material and help make it even better than it is
today! As a contributor, here are the guidelines we would like you to follow:

<!--* [Code of Conduct](#coc)-->

- [Question or Problem?](#question)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Development Setup](#development)
- [Coding Rules](#rules)
- [Commit Message Guidelines](#commit)
  <!-- - [Signing the CLA](#cla) -->

## <a name="question"></a> Do you have a question or problem?

**Please refrain from using GitHub issues for general support questions. We want to keep GitHub issues for bug reports and feature requests exclusively.**

For general assistance or if you would like to discuss your question in real-time, we encourage you to reach out to us on [our Discord channel][discord].

This approach helps make communication more efficient and save time, both for you and us. Therefore, any GitHub issues related to general support requests will be systematically closed and redirected to our Discord channel.

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submit-issue) to our GitHub
Repository. If you would like to _implement_ a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

- For a **Major Feature**, first open an issue and outline your proposal so that it can be
  discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
  and help you to craft the change so that it is successfully accepted into the project. For your issue name, please prefix your proposal with `[discussion]`, for example "[discussion]: your feature idea".
- **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs we will systematically ask you to provide a minimal reproduction scenario using a repository or [Gist](https://gist.github.com/). Having a live, reproducible scenario gives us wealth of important information without going back & forth to you with additional questions like:

- version of packages used
- 3rd-party libraries and their versions
- and most importantly - a use-case that fails


Unfortunately, we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you we are going to close an issue that doesn't have enough info to be reproduced.

You can file new issues by filling out our [new issue form][new_issue].

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:


1. Search [GitHub Pull Requests][gh_prs] for an open or closed PR
   that relates to your submission. You don't want to duplicate effort.
2. Fork this repository.
3. Make your changes in a new git branch:

   ```shell
   git checkout -b my-fix-branch master
   ```

4. Create your patch, **including appropriate test cases**.
5. Follow our [Coding Rules](#rules).
6. Run the full test suite (see [common scripts](#common-scripts)),
   and ensure that all tests pass.
7. Commit your changes using a descriptive commit message that follows our
   [commit message conventions](#commit). Adherence to these conventions
   is necessary because release notes are automatically generated from these messages.

   ```shell
   git commit -a
   ```

   Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

8. Push your branch to GitHub:

   ```shell
   git push origin my-fix-branch
   ```

9. In GitHub, send a pull request to `tailwind-material:master`.

- If we suggest changes then:

    - Make the required updates.
    - Re-run the Nest test suites to ensure tests are still passing.
    - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

      ```shell
      git rebase master -i
      git push -f
      ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-fix-branch
  ```

- Check out the master branch:

  ```shell
  git checkout master -f
  ```

- Delete the local branch:

  ```shell
  git branch -D my-fix-branch
  ```

- Update your master with the latest upstream version:

  ```shell
  git pull --ff upstream master
  ```

## <a name="development"></a> Development Setup

You will need [Node.js](https://nodejs.org) version >= 16.0.0

1. After cloning the repo, run:

```bash
$ npm i # (or yarn install)
```

### <a name="common-scripts"></a>Commonly used NPM scripts

```bash
# build all packages and move to "sample" directories
$ npm run build

# run the full unit tests suite
$ npm run test
```

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

<!--
// We're working on auto-documentation.
* All public API methods **must be documented**. (Details TBC). -->

- All features or bug fixes **must be tested** by one or more specs (unit-tests).

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the Nest change log**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>: <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

Footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples:

```
docs: update change log to beta.5
fix: need to depend on latest rxjs and zone.js
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **chore**: Updating tasks etc. no production code change
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
- **sample**: A change to the samples

If your change affect more than one package, separate the scopes with a comma (e.g. `common,core`).

There are currently a few exceptions to the "use package name" rule:

- **packaging**: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, d.ts file/format changes, changes to bundles, etc.
- **changelog**: used for updating the release notes in CHANGELOG.md
- **sample/#**: for the example apps directory, replacing # with the example app number
- none/empty string: useful for `style`, `test` and `refactor` changes that are done across all packages (e.g. `style: add missing semicolons`)

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
<!-- [dev-doc]: -->
[github]: https://github.com/Udixio/tailwind-material/
[discord]: https://discord.com/invite/bt2h5RCp77
[new_issue]: https://github.com/Udixio/tailwind-material/issues/new
[gh_prs]: https://github.com/Udixio/tailwind-material/pulls
[commits_samples]: https://github.com/Udixio/tailwind-material/commits/master
