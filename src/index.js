'use strict';

/* 
   Code Assembly Line
     - started at 23 september 2017
*/

const 
       templateTools = require ( './template-tools' )
     , processTools  = require ( './process-tools'  )
     , tools         = require ( './general-tools'  )
     , showError     = require ( './errors'         )
     ;

const str2intTemplate   = templateTools.str2intTemplate;
const interpretTemplate = templateTools.load_interpretTemplate ( str2intTemplate );


// Default config object applied to every codeAssembly object.
const codeAssemblyConfig = { 
    overwriteTemplates : false
  , overwriteProcesses : false
  , overwriteData      : false
  , htmlAttributes     : [ 'id', 'name', 'href', 'src', 'value', 'data', 'alt', 'role', 'class' ]
} // config



function codeAssembly ( cfg ) {
            this.templates = {}
            this.processes = {}
            this.data = {}
            this.config = {}

            Object.keys(codeAssemblyConfig).forEach ( k => this.config[k] = codeAssemblyConfig[k] )
            if ( cfg )  Object.keys(cfg).forEach ( k => this.config[k] = cfg[k] )
  } // codeAssembly func.



















const help = {

 _isWritingForbidden ( engine , type, name ) {
  let configProperty;
  if      ( type == 'templates' ) configProperty = 'overwriteTemplates'
  else if ( type == 'processes' ) configProperty = 'overwriteProcesses'
  else                            configProperty = 'overwriteData'
  const  entryExists = engine[type].hasOwnProperty ( name ); // 'true' if template/process/data with this name already exists
  const  entryForbidden = entryExists && !engine.config[configProperty]
  return entryForbidden
} // _isWritingForbidden func.



, _normalizeExternalData ( data ) {
   if ( !(data instanceof Array ))   data = [data] // temp...
   // TODO: flatten data but save top level array
   const result = data;
   return result
} // _normalizeExternalData func.



, _validateProcess ( engine, processName ) {
  // * Find if process exists and no errors in it. Find if all templates needed are available.
  let errors = [];
  const 
          processExists   = engine.processes.hasOwnProperty ( processName )
        , intProcess = engine.processes[processName]
        ;
  
  if ( processExists && intProcess['errors'] ) errors = errors.concat( intProcess['errors'])
  
  if ( !processExists )   errors.push ( showError('processNotExists',processName)   )
  else {
          intProcess['arguments']
              .reduce ( (listTemplates, step) => { 
                                  if ( step.do == 'draw' && step.tpl )  listTemplates.push ( step.tpl )
                                  return listTemplates
                          },[])
              .forEach ( name => {
                                  const tpl = engine.templates[name];
                                  if ( tpl && tpl['errors'] )   errors = errors.concat ( tpl['errors'] )
                                  if ( !tpl )                   errors.push ( showError('templateNotExists',name)   )
                          })
      }
  return errors
} // _validateProcess func.



, _validateProcessLib ( ext ) {   //   (JSON) -> { processName : intProcess } | false
  // * Find if JSON is valid, find if every process is an array.
  try {
        const 
                  list = JSON.parse ( ext )
                , processNames = Object.keys(list)
                ;
        return processNames.reduce ( (res,name) => {
                            if ( list[name] instanceof Array )   res[name] = [].concat(list[name])
                            return res
                        },{})
      } // try
  catch ( e ) {
                                      return false
      }
} // _validateProcessLib func.



, _extractLib ( tpl, libRequst ) { //   (tpl:inTemplates[], libRequest:string[]) -> ExternalTemplate
  // * Creates new ExternalTemplate by removing libName from template name 
  const tplNames = Object.keys ( tpl ).filter ( name => name.includes('/')   );

  return libRequst.reduce ( (res, libItem ) => {
                tplNames
                    .filter  ( name => name.indexOf(libItem) == 0   )
                    .forEach ( name => {
                              const 
                                    sliceIndex = name.indexOf('/')
                                  , prop = name.slice ( sliceIndex+1 )
                                  ;
                              
                              res [prop] = tpl[name].tpl.join('')
                        })
                return res
            },{})
} // _extractLib func.



, _flatten ( data, res , keyIn ) {
  let result = res || {};
  
  keyIn = keyIn || ''

  for ( let key in data ) {
          const value = data[key]
          let newKey = key
          if (keyIn) newKey = `${keyIn}/${key}`
          if ( typeof value == 'function' )   continue   //   Data can't contain functions
          if ( help._isPrimitive(value)   )   result[newKey] = value
          else                                return help._flatten ( value, result, newKey )
       }
  return result
} // _flatten func.   -- Help



, _isPrimitive ( value ) {
    return ( typeof value === 'object' ) ? false : true;
} // isPrimitive func. -- Help

} // help lib




















const lib_Template = {

insert ( extTemplate ) {   // (extTemplate: ExternalTemplate) -> engine
    let 
        me = this
      , templateNames = Object.keys( extTemplate )
      ;

    templateNames.forEach ( name => {
            if ( help._isWritingForbidden(me,'templates',name) ) {
                  console.error ( showError('overwriteTemplate') )
                  return
                }
            me.templates [ name ] = interpretTemplate ( extTemplate[name] )
        })
    return me       
} //   insert func.   -- Template



, insertLib ( extLib, libName ) {  //   ( extLib: ExternalTemplate,  name: string ) -> engine
  let 
         me = this
      ,  simpleTemplates = Object.keys ( extLib )
      ;

  simpleTemplates.forEach ( extName => {
                            const 
                                    newTpl = {}
                                  , name = `${libName}/${extName}`
                                  ;
                            if ( help._isWritingForbidden(me,'templates',name) ) {
                                    console.error ( showError('overwriteTemplate')   )
                                    return
                               }
                            newTpl[name] = extLib[extName]
                            lib_Template.insert.call ( me, newTpl )
                    })
  return me
} //   insertLib func.  -- Template



, rename ( ops ) { //   ({oldName:newName}) -> engine
// * Change template names
const 
          me = this
        , list = Object.keys (ops)
        , doOverwrite = me.config.overwriteTemplates
        ;

list.forEach ( key => {
        const 
                newKey = ops[key]
              , keyExists = (me.templates[newKey]) ? true : false
              ;

        if ( keyExists && !doOverwrite ){
                console.error ( showError('overwriteTemplate') )
                return
             }
        else {
                me.templates[newKey] = me.templates[key]
                delete me.templates[key]
          }
  })
  return me
} //   rename func.   -- Template



, remove ( tplName ) {   //   ( tplName:string|string[]) -> engine
  const me = this;
  let listDelete;

  if ( tplName instanceof Array ) listDelete = tplName
  else {
          const t = Object.keys ( arguments );
          listDelete = t.map ( k => arguments[k] )
       }
  
  listDelete.forEach ( item => delete me.templates[item])
  return me
} //   remove func.   -- Template



, get ( tplName ) { // (tplName: string|string[]) -> ExternalTemplate
 const 
       me = this
     , tpl = me.templates
     ;
 let tplRequst;

 if ( tplName instanceof Array )   tplRequst = tplName
 else {
         const t = Object.keys ( arguments );
         tplRequst = t.map ( k => arguments[k] )
      }
 
 return tplRequst.reduce ( (res, item ) => {
                     if ( tpl[item] ) res[item] = tpl[item].tpl.join('')
                     else             res[item] = ''
                     return res
               },{})

} //   get func.   -- Template



, getLib ( libName ) { //   (libName:string|string[]) -> ExternalTemplate
 const me = this;
 let libRequst;

 if ( libName instanceof Array )   libRequst = libName
 else {
         const t = Object.keys ( arguments );
         libRequst = t.map ( k => arguments[k] )
      }
 
 return help._extractLib ( me.templates, libRequst )
} // getLib func.   -- Template



, getPlaceholders ( templateName ) { //   (templateName:string) -> placeholderNames:string[].
  const tpl = this.templates [ templateName ];

  if ( tpl )  return Object.keys ( tpl.placeholders )
  else        return []
} // getPlaceholders func.   -- Template

} //   lib_Template lib




















const lib_Process = {

  insert ( ext, name ) { // (ext: extProcess, name: string) -> engine
    const me = this;

    if ( help._isWritingForbidden(me,'processes',name) ) {
          console.error ( showError('overwriteProcess',name) )
          return
        }

    me.processes[name] = processTools.interpret ( ext )
    return me
} //   insert func.   -- Process



, insertLib ( extLib, libName ) {  //   ( processLib: JSON,  name: string ) -> engine
  let 
        me = this
      , listOfProcesses = help._validateProcessLib ( extLib )
      , processNames = Object.keys ( listOfProcesses )
      ;
  if ( listOfProcesses ) {
            processNames.forEach ( extName => {
                              const name = ( libName ) ? `${libName}/${extName}` : extName;
                              lib_Process.insert.call ( me, listOfProcesses[extName], name )
                        })
     }
  return me
} //   insertLib func.  -- Process



, mix ( mixList, newProcessName ) {   //   ( mixList:string[], processName:string ) -> engine
  // * Set new process as combination of existing processes
    const
            me            = this
          , processes     = me.processes
          ;
          
    let mix = {};   // new process container
    
    if ( help._isWritingForbidden(me,'processes',newProcessName) ) {
          console.error ( showError('overwriteProcess', newProcessName)  )
          return
       }

    mix.steps = []
    mix.arguments =[]
    mix.hooks = []
    
    mixList.forEach ( requestedName => {
              if ( !processes[requestedName] ) return
              const 
                       source = processes[requestedName]
                     , hookNames = source.hooks.map ( name => `${requestedName}/${name}` )
                     , newArguments = source.arguments.map ( arg => { 
                                                if ( arg.do != 'hook' ) return arg
                                                return { do: 'hook', name: `${requestedName}/${arg.name}` }
                                            })
                     ;
                     
              mix['steps'] = mix['steps'].concat ( source['steps'] )
              mix['arguments'] = mix['arguments'].concat ( newArguments )
              mix['hooks'] = mix['hooks'].concat ( hookNames )
           })
    me.processes[newProcessName] = mix
    return me
} //   mix func.   -- Process



, getLib ( name ) {
  // * Extract process library as JSON
  const 
          me = this
        , allKeys = Object.keys ( me.processes )
        , takeEverything = (name) ? false : true
        ;
  const result = allKeys.reduce ( (res,key) => {
                              if ( !takeEverything ) {
                                      if ( key.includes(name) ) {
                                                const t = key.split('/');
                                                t.shift()
                                                const newKey = t.join('/');
                                                res[newKey] = me.processes[key]
                                         }
                                  }
                              else res[key] = me.processes[key]
                              return res
                      }, {})
  return JSON.stringify ( result )
} // getLib func.   -- Process



, rename ( ops ) {   //   ({oldName:newName}) -> engine
    // * Change process names
    const 
            me = this
          , list = Object.keys (ops)
          , doOverwrite = me.config.overwriteProcesses
          ;

    list.forEach ( key => {
                  if ( !me.processes[key] )   return
                  const 
                        newKey = ops[key]
                      , keyAlreadyDefined = (me.processes[newKey]) ? true : false
                      ;

                  if ( keyAlreadyDefined && !doOverwrite ) {
                        console.error ( showError('overwriteProcess', newKey) )
                        return
                      }
                  else {
                        me.processes[newKey] = me.processes[key]
                        delete me.processes[key]
                    }
          })
    return me
} // rename func.   -- Process



, remove (  processName ) {   //   ( processName:string|string[]) -> engine
    const me = this;
    let listDelete;
  
    if ( processName instanceof Array ) listDelete = processName
    else {
            const t = Object.keys ( arguments );
            listDelete = t.map ( k => arguments[k] )
        }
    
    listDelete.forEach ( item => delete me.processes[item])
    return me
} // remove func.   -- Process



, getHooks ( processName ) { //   (processName) -> { hookName : undefined }
const recordExists = this.processes.hasOwnProperty ( processName );
if ( recordExists )  { 
          const hooks = this.processes[ processName ].hooks;  
          return hooks.reduce ( (res, name) => {
                          res[name] = undefined
                          return res
                    },{})
    }
else      return {}
} //   getHooks func.   -- Process



, run ( processList, data, hooks ) {   
  if ( !(processList instanceof Array ))   processList = [processList]
  const 
        internalData = help._normalizeExternalData(data)
      , error = processList.reduce ( (res, processName ) => {
                                  const errorUpdate = help._validateProcess(this, processName);
                                  return res.concat ( errorUpdate )
                      },[])
      ;

  if ( error.length == 0 )  {
        let current = internalData;
        processList.forEach ( processName => {
            current = processTools.run.call ( this, this.processes[processName], current, hooks )
        })
        return current
    }
  else  return error
} //   run func.   -- Process

}   // lib_Process lib




















const lib_Data = {  
 insert ( data ) {   //   ({}) -> engine
        const 
              me        = this
            , flatData  = help._flatten ( data )
            , dataNames = Object.keys( flatData )
            ;

        dataNames.forEach ( name => {
                  if ( help._isWritingForbidden(me,'data',name)   ) {
                              console.error ( showError('overwriteData', name)   )
                              return
                      }
                  me.data [ name ] = flatData[name]
            })
        return me        
  } //   insert func.   -- Data



  , insertLib ( data, libName ) {   //   ({}, string) -> engine
        const 
                me        = this
              , flatData  = help._flatten ( data )
              , dataNames = Object.keys ( flatData )
              ;

        dataNames
            .forEach ( name => {
                      const newKey = `${libName}/${name}`
                      if ( help._isWritingForbidden ( me, 'data', newKey )   ) {
                              console.error ( showError('overwriteData',newKey)   )
                              return
                          }
                      me.data [ newKey ] = flatData[name]
                })
        return me
  } // insertLib func.   -- Data



  , rename ( ops ) {   //   ({oldName:newName}) -> engine
    // * Change data-record names
    const 
            me = this
          , list = Object.keys (ops)
          , doOverwrite = me.config.overwriteData
          ;

    list.forEach ( key => {
                  if ( !me.data[key] )   return
                  const 
                        newKey = ops[key]
                      , keyAlreadyDefined = (me.data[newKey]) ? true : false
                      ;

                  if ( keyAlreadyDefined && !doOverwrite ) {
                        console.error ( showError('overwriteData', newKey) )
                        return
                      }
                  else {
                        me.data[newKey] = me.data[key]
                        delete me.data[key]
                    }
          })
    return me
  } // rename func   --- Data



  , remove ( dataName ) {   //   ( dataName:string|string[]) -> engine
          const me = this;
          let listDelete;
        
          if ( dataName instanceof Array ) listDelete = dataName
          else {
                  const t = Object.keys ( arguments );
                  listDelete = t.map ( k => arguments[k] )
              }
          
          listDelete.forEach ( item => delete me.data[item])
          return me
  } //   remove func.   -- Data



  , getBlock ( blockName ) {   //   ( string ) -> string
    const me = this;
    let blockRequst = [];
    if ( blockName instanceof Array )   blockRequst = blockName
    else {
            const t = Object.keys ( arguments );
            blockRequst = t.map ( k => arguments[k] )
         }
    return blockRequst.reduce ( (res, name) => {
                      const snippet =  ( me.data[`block/${name}`] ) ? me.data[`block/${name}`] : '';
                      res += snippet
                      return res
          }, '')
  } // getBlock func.   -- Data
}   // lib_Data




















// * Code-Assembly-Line API
codeAssembly.prototype = {
      tools : tools              // Usefull template and process related functions (external)
   
    // Template I/O Operations
    , insertTemplate    : lib_Template.insert     // Insert templates;
    , insertTemplateLib : lib_Template.insertLib  // Insert templates as a template-library;    
    , getTemplate       : lib_Template.get        // Export templates;
    , getTemplateLib    : lib_Template.getLib     // Export templates from template-library;
    , getPlaceholders   : lib_Template.getPlaceholders    // Return placeholders per template;
      
    // Template Manipulation
    , renameTemplate : lib_Template.rename    // Change name of template/templates;
    , removeTemplate : lib_Template.remove    // Remove template/templates;

    // Processes
    , insertProcess    : lib_Process.insert     // Insert new process;
    , insertProcessLib : lib_Process.insertLib  // Insert list of processes with a single operation. JSON required;
    , mixProcess       : lib_Process.mix        // Set new process as combination of existing processes;
    , getProcessLib    : lib_Process.getLib     // Export processes from process-library as JSON;
    , getHooks         : lib_Process.getHooks   // Provide information about hooks available
    , run              : lib_Process.run        // Execute process/processes

    // Process Manipulation
    , renameProcess : lib_Process.rename  // Renames a process
    , removeProcess : lib_Process.remove  // Remove process/processes

    // Data I/O
    , insertData    : lib_Data.insert      // Insert data. Save data. Word 'blocks'
    , insertDataLib : lib_Data.insertLib   // Insert set of data
    , getBlock      : lib_Data.getBlock    // Obtain rendered code snippets 
    , getBlocks     : lib_Data.getBlock    

    // Data Manipulation
    , renameData       : lib_Data.rename   // Change name of data record
    , removeData       : lib_Data.remove   // Remove data record from template engine
} // codeAssembly prototype



module.exports = codeAssembly;


