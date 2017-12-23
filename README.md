# Code Assembly Line

Code-Assembly-Line works for node.js and browsers.





## It's not a standard template engine
Engine works with templates, data and processes. All items are described in JSON compatible format, in a way to exchange resources via standard AJAX calls. Templates are logicless and are fully decoupled from the data. Partial rendering nature of this engine will give you an opportunity to balance rendering between server and client and you will be able to separate localization, design and data rendering processes. Choose a strategy on missing property values and have fine control on data during rendering process by using hook functions. In brief - **Code-Assembly-Line**.





## Installation

### Installation for Node.js based projects:
From the console:
```
 npm i -S code-assembly-line

```
It will install module in to the project. You can start using it by
```js
 const CodeAssemblyLine = require ( 'code-assembly-line' );
 const tplEngine = new CodeAssemblyLine();   // Create instance of template engine
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
* [Documentation](https://github.com/PeterNaydenov/code-assembly-line/wiki)
* [Getting started](https://github.com/PeterNaydenov/code-assembly-line/wiki/Getting-started)





## Known bugs
_(Nothing yet)_





## Release History

### 1.0.2 (2017-12-23)
- [x] Process-step 'add' was switched on;
- [x] Readme has link to documentation wiki;

### 1.0.0 (2017-12-17)
- [ ] Process-step 'add' is not active.
- [x] Node.js module;
- [x] Browser module;
- [x] Test package;





## Credits
'code-assembly-line' was created by Peter Naydenov.





## License
'code-assembly-line' is released under the [MIT License](http://opensource.org/licenses/MIT).


