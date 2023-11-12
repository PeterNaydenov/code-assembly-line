## Migration Guides



### 2.x.x - 3.x.x
Hook functions receive different arguments and also require different result response. Hook functions will definitely need a refactoring.
Configuration setting were removed. Take a look on your code and if you need to overwrite existing value, add step field 'method' with appropriate value - update/overwrite/heap. 

If you don't use hooks or never have change configuration settings - your software will work without any changes.


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