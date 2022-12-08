# @michvh-dev: Virtial scroll
> This Is a virtual scroll that gives you the possibility to customize everything of the web scrolling mechanism, you can use it in scrolling animations, webgl, canvas, ... 
> Live demo [_here_](https://virtual-scroll.michvh.dev/example/).

## Table of Contents
* [General Info](#general-information)
* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)



## General Information
This Is a virtual scroll that gives you the possibility to customize everything of the web scrolling mechanism
- It supports the mobile velocity autoscroll
- It supports the keyboard events
- You can create multiple instances on window or seperate elements



## Features
The key features are
- Keyboard scrolling
- mobile velocity autoscrolling
- Set custom boundaries (or make it infinite)


## Installation
### npm
```
npm i @michvh-dev/virtual-scroll -S
```

### yarn
```
yarn add @michvh-dev/virtual-scroll
```

## Usage

```js
const scroll = new VirtualScroll({
    element: window // Can also be an other html element (required)
    horizontal: false, // Default false (not required)
    vertical: true, // Default true (not required)
    keyBoardOffset: 25, // Default 50 (not required)
    boundaries: { // When no boundaries the scroll is infinite in four directions
        minX: 0, // minimum x (not required)
        minY: 0, // minimum y (not required)
        maxX: 10000, // maximum x (not required)
        maxY: 10000, // maximum y (not required)
    }
});
```