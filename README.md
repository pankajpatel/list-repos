# List Repos (list-repos)

This utility lists the current active branch on repos present in specified directory. By default it takes the current directory

Read more at [http://time2hack.com/2016/10/introducing-list-repos.html](http://time2hack.com/2016/10/introducing-list-repos.html)

To install the utility, simply do
```
sudo npm install -g list-repos
```
And in few seconds(or minutes), it should be installed after you enter the password for `sudo`.

To use the utility, type following on CLI,
```
# Check for the current active branch on repos present in parent directory
list-repos ../
```

And will comeup with this output:
```
../
┌──────────────┬───────────────────┬───────┬───────┬───────────┬─────────┐
│ Directory    │ Current Branch/NA │ Ahead │ Dirty │ Untracked │ Stashes │
├──────────────┼───────────────────┼───────┼───────┼───────────┼─────────┤
│ ci           │ -                 │ -     │ -     │ -         │ -       │
├──────────────┼───────────────────┼───────┼───────┼───────────┼─────────┤
│ code-status  │ master            │ 0     │ 0     │ 0         │ -       │
├──────────────┼───────────────────┼───────┼───────┼───────────┼─────────┤
│ get-it-ready │ master            │ 0     │ 0     │ 0         │ -       │
├──────────────┼───────────────────┼───────┼───────┼───────────┼─────────┤
│ list-repos   │ master            │ 0     │ 1     │ 0         │ -       │
└──────────────┴───────────────────┴───────┴───────┴───────────┴─────────┘
```

There are several other options for output

```
# Show only git repos, omit not git directories; --gitonly
list-repos ../ -g
```

And will comeup with this output:
```
../
┌──────────────┬───────────────────┬───────┬───────┬───────────┬─────────┐
│ Directory    │ Current Branch/NA │ Ahead │ Dirty │ Untracked │ Stashes │
├──────────────┼───────────────────┼───────┼───────┼───────────┼─────────┤
│ code-status  │ master            │ 0     │ 0     │ 0         │ -       │
├──────────────┼───────────────────┼───────┼───────┼───────────┼─────────┤
│ get-it-ready │ master            │ 0     │ 0     │ 0         │ -       │
├──────────────┼───────────────────┼───────┼───────┼───────────┼─────────┤
│ list-repos   │ master            │ 0     │ 1     │ 0         │ -       │
└──────────────┴───────────────────┴───────┴───────┴───────────┴─────────┘
```

```
# Show compact output; you can mix it with -g as well by typing -cg; --compact
list-repos ../ -c
```

And will comeup with this output:
```
../
┌──────────────┬───────────────────┬───────┬───────┬───────────┬─────────┐
│ Directory    │ Current Branch/NA │ Ahead │ Dirty │ Untracked │ Stashes │
│ ci           │ -                 │ -     │ -     │ -         │ -       │
│ code-status  │ master            │ 0     │ 0     │ 0         │ -       │
│ get-it-ready │ master            │ 0     │ 0     │ 0         │ -       │
│ list-repos   │ master            │ 0     │ 1     │ 0         │ -       │
└──────────────┴───────────────────┴───────┴───────┴───────────┴─────────┘
```