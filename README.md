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





## Upgrade Notes

### 2.0.0 - 2.1.x
If you want to overwrite existing data/template/process, use process-step 'block' and 'save' with field `method`. 
```js
 { do: 'block', name: 'profile', method: 'overwrite' }
```
No more code changes required.



### 1.x.x - 2.x.x
Breaking change in `.insertProcessLib` method. In version 1.x method expects JSON argument. Version 2.x require object from type `extProcessLib` where key is processName and value is `extProcess` type. 

Breaking change in `.getProcessLib` method. In version 1.x method returns JSON. Version 2.x returns object from type `extProcessLib`.

Code change required:

```js
// v.1.x.x
tplEngine.insertProcessLib ( libData, libName );
// libData:string. JSON representation of extProcessLib
const libJSON = tplEngine.getProcessLib ()

// convert to version 2.x.x
tplEngine.insertProcessLib ( JSON.parse(libData), libName )
const libJSON = JSON.stringify ( tplEngine.getProcessLib ())
```
No more code changes required.





## Release History

### 2.1.1 ( 2019-05-03 )
- [x] Fix: WatchHook data after 'set' process-step 

### 2.1.0 (2019-04-30)
Read **upgrade notes** for version 2.1.x.
- [x] Watch-hooks introduction
- [x] Process-step 'save' with `methods`: add/update/heap/overwrite
- [x] Process-step 'block' with methods;
- [x] Upgrade webpack to version 4.30;
- [x] Fix: Correct flatten of deep objects;
- [ ] Bug: WatchHook data after 'set' process-step 

### 2.0.0 (2018-01-09)
- [x] Fix: method getProcessLib returns JSON representation of intProcess type object. Should be object of extProcessLib type;
- [x] Method 'getTemplateLib' without arguments will return all templates without modification;
- [x] Breaking change: Method 'getProcessLib' returns 'extProcessLib'. Was JSON representation of 'extProcessLib';
- [x] Breaking change: Argument extLib for method 'insertProcessLib' was changed. Was JSON, now is extProcessLib object;
- [ ] Bug: Flatten of deep objects is not working as should.



### 1.0.3 (2017-12-31)
- [x] Run throws console error if any errors
- [ ] Bug: method getProcessLib returns JSON representation of intProcess type object. Should be JSON representation of extProcessLib type;

### 1.0.2 (2017-12-23)
- [x] Process-step 'add' was switched on;
- [x] Readme has link to documentation wiki;
- [ ] Bug: method getProcessLib returns JSON representation of intProcess type object. Should be JSON representation of extProcessLib type;


### 1.0.0 (2017-12-17)
- [ ] Process-step 'add' is not active.
- [x] Node.js module;
- [x] Browser module;
- [x] Test package;
- [ ] Bug: method getProcessLib returns JSON representation of intProcess type object. Should be JSON representation of extProcessLib type;






## Credits
'code-assembly-line' was created by Peter Naydenov.





## License
'code-assembly-line' is released under the [MIT License](http://opensource.org/licenses/MIT).


