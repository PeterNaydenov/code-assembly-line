# Code Assembly Line

Yet another template engine...
Documentation will late a bit.





## Installation
Code-Assembly-Line works for node.js and browsers.



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





## Motivation Factors for creating the 'Code Assembly Line'
 - Decouple render-processes from templates;
 - Decouple templates from data;
 - All components (templates, processes, and data) provisioning in a JSON compatible format;
 - Built-in hooks for modifying render process if needed;
 - Posible default value for missing data;
 - Strategies on missing data: Hide a field, hide the record or provide alternative content;
 - Chaining render-processes;
 - Alternate template's placeholder names;
 - Enrich data by render new data-fields;
 - Partial rendering. Create new templates by render part of the available placeholders;
 - Optional spaces;





## Examples

### Example name

## Known bugs
_(Nothing yet)_





## Release History

### 1.0.0 (2017-12-17)

- [x] Node.js module;
- [x] Browser module;
- [x] Test package;





## Credits
'code-assembly-line' was created by Peter Naydenov.





## License
'code-assembly-line' is released under the [MIT License](http://opensource.org/licenses/MIT).


