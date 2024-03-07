## Release History


### 5.1.1 ( 2024-03-07)
- [x] Fix: Build has an incorect filenames;


### 5.1.0 ( 2024-02-08)
- [x] Package.json: "exports" section was added. Allows you to use package as commonjs or es6 module without additional configuration;
- [x] Dev dependencies update. Chai@5.0.3;
- [ ] Bug: Build has an incorect filenames;


### 5.0.0 ( 2024-01-16)
- [x] Converted to ES6 module;
- [x] CommonJS and UMD modules are available in dist folder;



### 4.0.2 ( 2023-11-12 )
- [x] Documentation update, badges, links;



### 4.0.1 ( 2023-01-25)
- [x] Fix: Process-step 'set' did not ignore empty strings;

### 4.0.0 ( 2021-05-13)
- [x] Breaking change: Hook argument comes as typles. Was: (data,modifier), become: ([data, id], modifier )
- [ ] Bug: Process-step 'set' did not ignore empty strings;


### 3.0.2 ( 2021-05-07 )
- [x] Fix: WatchHook combines results even they are not for extending data record
- [ ] Bug: Process-step 'set' did not ignore empty strings;



### 3.0.1 ( 2019-05-06 )
Version 2.1.x was step in right direction but changes were not enough and software starts to looks incomplete and buggy. Hook functions work on inconsistency way. Hook modifiers were very limited.  Manipulation of data is also problematic. Using a configuration for overwrite data/templates/processes is heavy and not flexible enough.
So... the new version have:
- [x] Overwrite configuration is completly removed. Now writing methods have attribute **method**
      Process-steps have equivalent field **method**. Method has 4 possible values:
       - **add**(default): Add only a non-existing values. Do not change fields that already exist;
       - **update**: Overwrite only existing fields. Do not add new records;
       - **overwrite** : Overwrite existing record or create new ones;
       - **heap** : Combine the old and the new value;
- [x] Hook function execution is per every data-segment. In version 2.0 we have single hook-function execution with all current-data. 
- [x] Hook function should always return an array with single element. Data-segment argument is also an array with single element. On this way, you can apply 'modify' function directly on incoming data-segment.
- [x] Hook functions modifiers can execute process-steps [ 'draw', 'block','set', 'alter', 'add', 'copy', 'remove' ]. Don't forget that scope of hook is now only a single data-segment. Hook functions have no access to templates and step **alterTemplate** is not available. Don't try to use '**hook**' inside the hook. We want to keep logic flat as possible. Should be human readable.
- [x] Version 3.0.0 is coming with more than 190 unit tests.
- [ ] Bug: WatchHook combines results even they are not for extending data record
- [ ] Bug: Process-step 'set' did not ignore empty strings;


### 2.1.1 ( 2019-05-03 )
- [x] Fix: WatchHook data after 'set' process-step
- [ ] Bug: Process-step 'set' did not ignore empty strings; 

### 2.1.0 (2019-04-30)
Read **upgrade notes** for version 2.1.x.
- [x] Watch-hooks introduction
- [x] Process-step 'save' with `methods`: add/update/heap/overwrite
- [x] Process-step 'block' with methods;
- [x] Upgrade webpack to version 4.30;
- [x] Fix: Correct flatten of deep objects;
- [ ] Bug: WatchHook data after 'set' process-step 
- [ ] Bug: Process-step 'set' did not ignore empty strings;

### 2.0.0 (2018-01-09)
- [x] Fix: method getProcessLib returns JSON representation of intProcess type object. Should be object of extProcessLib type;
- [x] Method 'getTemplateLib' without arguments will return all templates without modification;
- [x] Breaking change: Method 'getProcessLib' returns 'extProcessLib'. Was JSON representation of 'extProcessLib';
- [x] Breaking change: Argument extLib for method 'insertProcessLib' was changed. Was JSON, now is extProcessLib object;
- [ ] Bug: Flatten of deep objects is not working as should.
- [ ] Bug: Process-step 'set' did not ignore empty strings;



### 1.0.3 (2017-12-31)
- [x] Run throws console error if any errors
- [ ] Bug: method getProcessLib returns JSON representation of intProcess type object. Should be JSON representation of extProcessLib type;
- [ ] Bug: Process-step 'set' did not ignore empty strings;

### 1.0.2 (2017-12-23)
- [x] Process-step 'add' was switched on;
- [x] Readme has link to documentation wiki;
- [ ] Bug: method getProcessLib returns JSON representation of intProcess type object. Should be JSON representation of extProcessLib type;
- [ ] Bug: Process-step 'set' did not ignore empty strings;


### 1.0.0 (2017-12-17)
- [ ] Process-step 'add' is not active.
- [x] Node.js module;
- [x] Browser module;
- [x] Test package;
- [ ] Bug: method getProcessLib returns JSON representation of intProcess type object. Should be JSON representation of extProcessLib type;
- [ ] Bug: Process-step 'set' did not ignore empty strings;