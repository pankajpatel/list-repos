# List Repos (list-repos)

[![Code Climate](https://codeclimate.com/github/pankajpatel/list-repos/badges/gpa.svg)](https://codeclimate.com/github/pankajpatel/list-repos) [![Issue Count](https://codeclimate.com/github/pankajpatel/list-repos/badges/issue_count.svg)](https://codeclimate.com/github/pankajpatel/list-repos) [![Test Coverage](https://codeclimate.com/github/pankajpatel/list-repos/badges/coverage.svg)](https://codeclimate.com/github/pankajpatel/list-repos/coverage)

This utility lists the current active branch on repos present in specified directory. By default it takes the current directory

Read more at [time2hack.com/introducing-list-repos](https://time2hack.com/introducing-list-repos)

To install the utility, simply do

```
npm install -g list-repos
```

And in few seconds(or minutes), it should be installed. If it gives error of Access rights, try with `sudo` and after you enter the password for `sudo`, it should install normally.

To use the utility, type following on CLI,

```
# Check for the current active branch on repos present in parent directory
list-repos ../
```

You can pass the following arguments:

| **Parameter** | **Shorthand** | **Description**                                      |
| ------------- | ------------- | ---------------------------------------------------- |
| `--version`   | `-v`          | Version                                              |
| `--help`      | `-h`          | Help                                                 |
| `--ignore`    | `-i`          | Ignore matching substring                            |
| `--match`     | `-m`          | Only matching substring                              |
| `--gitonly`   | `-g`          | Show only git repos                                  |
| `--attention` | `-a`          | Show repos which only needs attention                |
| `--simple`    | `-s`          | Simple Output                                        |
| `--compact`   | `-c`          | Compactness; no value = Low; `=s` Medium; `=so` High |

And will comeup with this output:

![list-repos](https://cloud.githubusercontent.com/assets/251937/24815833/e7e32bd8-1bd6-11e7-8d80-dad4f3ce7eef.png)

There are several other options for output like:

- `--git-only` or `-g`

Show only git repos

![list-repos -g](https://cloud.githubusercontent.com/assets/251937/24815831/e7c6e9be-1bd6-11e7-885b-b71ae70aa692.png)

- `--attention` or `-a`

Show all directories which requires attention, includes non-git

![list-repos -a](https://cloud.githubusercontent.com/assets/251937/24815828/e7c13e9c-1bd6-11e7-8906-2a8dbaacf3bf.png)

- `--attention --git-only` or `-ag`

Show all git repos which requires attention

![list-repos -ag](https://cloud.githubusercontent.com/assets/251937/24815827/e7c0dba0-1bd6-11e7-95ef-f0b708bfe94d.png)

- `--compact` or `-c`

Show compact table output

![list-repos -c](https://cloud.githubusercontent.com/assets/251937/24815826/e7c0dcc2-1bd6-11e7-8e8d-def1dbaf1012.png)

- `--compact=s` or `-c=s`

Show compact table output and short table headers and header description at the bottom

![list-repos -c=s](https://cloud.githubusercontent.com/assets/251937/24815829/e7c337ec-1bd6-11e7-8b7f-99b9317639fd.png)

- `--compact=so` or `-c=so`

Show compact table output and short table headers and no header description at the bottom

![list-repos -c=so](https://cloud.githubusercontent.com/assets/251937/24815830/e7c46a7c-1bd6-11e7-8b08-456f31485287.png)

- `--simple` or `-s`

Show simple comma and new line separated output;

order of values is `dir`, `branch`, `ahead`, `dirty`, `untracked`, `stashes`

![list-repos -s](https://cloud.githubusercontent.com/assets/251937/24815832/e7e3154e-1bd6-11e7-97e4-fa5f553f54b2.png)

- `--help` or `-h`

Show help

- `--version` or `-v`

Show version of the utility
