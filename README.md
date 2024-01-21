# Code Assembly Line

![version](https://img.shields.io/github/package-json/v/peterNaydenov/code-assembly-line)
![license](https://img.shields.io/github/license/peterNaydenov/code-assembly-line)
![GitHub issues](https://img.shields.io/github/issues-raw/peterNaydenov/code-assembly-line)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/code-assembly-line)



Code-Assembly-Line works for node.js and browsers.





## It's not a standard template engine
Engine works with templates, data and processes. All items are described in JSON compatible format, in a way to exchange resources via standard AJAX calls. Templates are logicless and are fully decoupled from the data. Partial rendering nature of this engine will give you an opportunity to balance rendering between server and client and you will be able to separate localization, design and data rendering processes. Choose a strategy on missing property values and have fine control on data during rendering process by using hook functions. In brief - **Code-Assembly-Line**.





## Installation

### Installation for Node.js based projects:
From the console:
```
 npm i code-assembly-line

```

It will install module in to the project. 
You can start using it by:
```js
// If you are using CommonJS modules:
 const CodeAssemblyLine = require ( 'code-assembly-line' );
// If you are using ES6 modules:
import CodeAssemblyLine from 'code-assembly-line';
// Create instance of template engine
 const tplEngine = new CodeAssemblyLine();
```



### Installation for browsers
Just go to '/dist' folder and get copy of '**code-assembly-line.min.js**'. Put the file inside your project folder and add a reference to it from HTML code by using this script tag:
```html
 <script src="code-assembly-line.min.js"></script>
```
Library is avalable as '**CodeAssemblyLine**' and start using it.
```js
const tplEngine = new CodeAssemblyLine();
```
Find working example in file '**/dist/index.html**'.





## Links
* [Getting started](https://github.com/PeterNaydenov/code-assembly-line/wiki/Getting-started)
* [Documentation](https://github.com/PeterNaydenov/code-assembly-line/wiki)
* [History of changes](https://github.com/PeterNaydenov/code-assembly-line/blob/master/Changelog.md)
* [Migration guide](https://github.com/PeterNaydenov/code-assembly-line/Migration.guide.md)





## Credits
'code-assembly-line' was created by Peter Naydenov.





## License
'code-assembly-line' is released under the [MIT License](http://opensource.org/licenses/MIT).


