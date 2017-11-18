# ghost-to-gatsby

:construction: A CLI to convert a ghost 0.11 export to gatsby pages
:construction:

## The problem

I started looking at migrating my blog from
[ghost](https://github.com/TryGhost/Ghost) to
[gatsby](https://github.com/gatsbyjs/gatsby), but didn't want to have to
manually migrate my content. I had a quick look around, but couldn't find a tool
that would do this for me.

## The solution

This is a simple cli that takes a
[ghost backup](https://help.ghost.org/hc/en-us/articles/224112927-Import-Export-Data)
and creates a page for each post.

Example output.

```
pages
│
└───2017-01-01-getting-started
│   │   index.md
│
└───2017-03-01-another-post
    │   index.md
```

## Installation

```
npm install -g ghost-to-gatsby
```

## Usage

```
ghost-to-gatsby [options] <file>

  Options:

    -V, --version    output the version number
    --out-dir <dir>  The output directory where the pages will be written to
    -h, --help       output usage information
```

## Progress

* [x] Create basic pages
* [x] Convert to CLI
* [ ] Publish to npm to use with npx
* [x] Add tags
* [ ] Download all images
