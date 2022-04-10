# new-component

Automatically generate boilerplate for new React component

~~Shamelessly stolen~~ heavily influenced by [Josh Comeau](https://www.https://www.joshwcomeau.com/)'s [new-component](https://github.com/joshwcomeau/new-component). Create's a new component in your components folder.

Features

- Simple CLI interface for adding React components.
- Uses Prettier to stylistically match the existing project.
- Offers global config, which can be overridden on a project-by-project basis.
- Colourful terminal output!

<br>

## Installation

---

Install via NPM:

```
# Using NPM:
npm i -g @mimodev/new-component

# Using Yarn:
yarn global add @mimodev/new-component
```

## Usage

---

```
  nc Button
```

This will create the below files:

src/components/Button/index.js

```
  export const Button = () => {
  return <div />
}
```

src/components/Button/Button.jsx

```
export * from './Button'
```

## Configuration

---

Configuration can be done accompolished in 3 different ways:

- Creating a global .nc-config.json in your home directory (~/.nc-config.json).
- Creating a local .nc-config.json in your project's root directory.
- Command-line arguments.

The resulting values are merged, with command-line values overwriting local values, and local values overwriting global ones.

## Options

---

### Type

Control the type of component created:

- `functional` for a functional component (default)
- `class` for traditional class-based component
- `pure` for a PureComponent class

#### Usage

Command line: `--type <value>` or `-t <value>`  
JSON Config: `{ "type": <value> }`

### Directory

Controls the directory for the created component. Defaults to `src/components`

#### Usage

Command line: `--dir <value>` or `-d <value>`  
JSON Config: `{ "dir": <value> }`

### Add Default export

Adds a Default export to the component. Defaults to `false`

#### Usage

Command line: `--default`  
JSON Config: `{ "default": true }`

### File Type

Determine file extension type to use.

- `javascript` Standard javascript extensions (default)
- `typescript` Use typescript extensions

#### Usage

Command line: `--extension <value>` or `-x <value>`  
JSON Config: `{ "extension": <value> }`

### Prettier Config

Set Prettier configuration so component is formatted as you like. Defaults to Prettier defaults.

JSON Config: `{ "prettierConfig": { "key": "value" } }`

## Platform Support

---

This has only been tested on Windows. I think it should be fine for macOS and linux, but it has yet to be tested.
