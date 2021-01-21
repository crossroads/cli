# Goodcity CLI

## Usage

```
Usage: goodcity-cli [options] [command]

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  release <repo> <version>  Creates a release PR for the specified project
  help [command]            display help for command
```

## Creating a release PR

```bash
npx @goodcity/cli release api.goodcity 0.17
```
