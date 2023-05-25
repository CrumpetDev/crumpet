# Contributing to Crumpet

Thank you for your interest in contributing to Crumpet! Whether you're fixing a bug, baking a new feature or improving documentation, we greatly value your work and your time.

## Getting Started

1. Fork the repository on GitHub.
2. Clone the project to your own machine.
3. Commit changes to your own branch.
4. Push your work back up to your fork.
5. Submit a Pull Request so that we can review your changes and merge them into the main project.

## Coding Conventions

Please follow the coding conventions already established in the project. These may include things like indentation styles, placement of brackets, etc. If in doubt, follow the style of existing code.

## Linting and Spelling Check

We aim to maintain high code quality and readability in our project. To help with this, we use a few tools that will run as pre-commit hooks using [pre-commit](https://pre-commit.com/).

### Flake8

Flake8 is a powerful Python tool that we use for linting. It checks our codebase against coding style (PEP8), programming errors (like 'variable not defined' and 'unused import') among others. By running Flake8 before each commit, we can ensure that our codebase remains clean and well-structured. More about Flake8 can be found at its [GitHub page](https://github.com/PyCQA/flake8).

### CSpell

In addition to linting, we also want to ensure that our spelling is correct across the project. For this, we use CSpell. It is an open-source tool designed to catch spelling errors in your code. Find more details about CSpell on its [GitHub page](https://github.com/streetsidesoftware/cspell).

By adhering to these standards, we can all contribute to the quality, readability, and overall health of the project. 

## Commit Messages

Writing good commit messages is important for maintaining the long-term health of our project. Here's a summary of best practices:

1. Separate subject from body with a blank line.
2. Limit the subject line to 50 characters.
3. Capitalize the subject line.
4. Do not end the subject line with a period.
5. Use the imperative mood in the subject line (e.g. "Fix bug" not "Fixes bug").
6. Wrap the body at 72 characters.
7. Use the body to explain what and why vs. how.

While we recommend using the git message template provided in the `.gitcommitmessage` file in this repository, it is particularly important for larger commits that include complex changes or non-obvious reasoning. For smaller commits, a simple, clear description in the subject line should suffice.

For additional information, you can also refer to [this article](https://cbea.ms/git-commit).

## Branching and Rebasing

For every task or feature, create a new branch off the main branch. This isolates changes for specific features or tasks and makes it easier for you to work independently on your task without affecting the rest of the project.

When naming your branches, follow this structure: `<type>/<description>[/<subtask>]`. The `<type>` should describe the nature of your work, and while it can be one of the following, it is not strictly limited to these options:

1. `fix` - for a bug fix.
2. `feature` - for new features.
3. `issue` - if the work relates to a specific issue in the project.
4. `hotfix` - for critical fixes that need to be deployed quickly.
5. `setup` - for setting up new areas of the project.
6. `wip` - for branches that include experiments or work in progress.
7. `chore` - for routine tasks or small changes that don't significantly alter the functionality.

The `<description>` part of the branch name should provide a short, clear understanding of the task you're working on and ideally relate to the issue or task that has been assigned. If a feature branch has been split into subtasks, you may include the subtask after another `/`. For example: `feature/user-authentication/add-email-verification`.

Before creating a Pull Request, perform a `git rebase` with the main branch. This helps to maintain a clean and clear commit history, and reduces the chance of merge conflicts.

1. Fetch the latest changes from the main repository's main branch: `git fetch origin main`
2. Rebase your feature branch onto the tip of these latest changes: `git rebase origin/main`

If you encounter any conflicts, resolve them and then continue the rebase. Once you've pushed your rebased branch to your fork, you can open a Pull Request for review.

## Submitting a Pull Request

Before submitting your pull request, please make sure:

1. Your code builds correctly.
2. All tests pass.
3. You have written tests for any new features or changes to existing code.
4. You have run `git rebase` and resolved any conflicts.

Finally, submit your Pull Request, providing a clear and comprehensive description of the changes you've made.

Remember, your contributions are the heart of this open source project, and we appreciate your work. Thank you!

## Feedback

Any questions, comments, suggestions or concerns, message the Slack channel or open an issue with the appropriate label. Happy coding!
