# List Repos (list-repos)

This utility lists the current active branch on repos present in specified directory. By default it takes the current directory

Read more at [http://time2hack.com/2016/10/introducing-list-repos.html](http://time2hack.com/2016/10/introducing-list-repos.html)

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

And will comeup with this output:

![list-repos](https://dl.dropboxusercontent.com/u/45270860/list-repos.png)

There are several other options for output like:

- `--git-only` || `-g` 

  Show only git repos

  ![list-repos -g](https://dl.dropboxusercontent.com/u/45270860/list-repos-g.png)

- `--attention` || `-a`

  Show all directories which requires attention, includes non-git

  ![list-repos -a](https://dl.dropboxusercontent.com/u/45270860/list-repos-a.png)

- `--attention --git-only` || `-ag`

  Show all git repos which requires attention

  ![list-repos -ag](https://dl.dropboxusercontent.com/u/45270860/list-repos-ag.png)

- `--compact` || `-c`

  Show compact table output

  ![list-repos -c](https://dl.dropboxusercontent.com/u/45270860/list-repos-c.png)

- `--compact=s` || `-c=s`

  Show compact table output and short table headers and header description at the bottom

  ![list-repos -c=s](https://dl.dropboxusercontent.com/u/45270860/list-repos-c%3Ds.png)

- `--compact=so` || `-c=so`

  Show compact table output and short table headers and no header description at the bottom

  ![list-repos -c=so](https://dl.dropboxusercontent.com/u/45270860/list-repos-c%3Dso.png)

- `--simple` || `-s`

  Show simple comma and new line separated output; 

  order of values is `dir`, `branch`, `ahead`, `dirty`, `untracked`, `stashes`

  ![list-repos -s](https://dl.dropboxusercontent.com/u/45270860/list-repos-s.png)

- `--help` || `-h`

  Show help

- `--version` || `-v`

  Show version of the utility
