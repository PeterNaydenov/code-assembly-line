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
  const  entryExists = engine[type].hasOwnProperty ( name ); // 'true' if process with this name already exists
  const  entryForbidden = entryExists && !engine.config[configProperty]
  return entryForbidden
} // _isWritingForbidden func.



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

insert ( extTemplate ) {   // (extTemplate: ExternalTemplate) -> void
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
} //   insert func.   -- Template



, insertLib ( extLib, libName ) {  //   ( extLib: ExternalTemplate,  name: string ) -> void
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
} //   insertLib func.  -- Template



, rename ( ops ) { //   ({oldName:newName}) -> void
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
} //   rename func.   -- Template



, remove ( tplName ) {   //   ( tplName:string|string[]) -> void
  const me = this;
  let listDelete;

  if ( tplName instanceof Array ) listDelete = tplName
  else {
          const t = Object.keys ( arguments );
          listDelete = t.map ( k => arguments[k] )
       }
  
  listDelete.forEach ( item => delete me.templates[item])
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

  insert ( ext, name ) { // (ext: extProcess, name: string) -> void
    const me = this;

    if ( help._isWritingForbidden(me,'processes',name) ) {
          console.error ( showError('overwriteProcess',name) )
          return
        }

    me.processes[name] = processTools.interpret ( ext )
} //   insert func.   -- Process



, mix ( mixList, newProcessName ) {   //   ( mixList:string[], processName:string ) -> void
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
} //   mix func.   -- Process



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
  if ( !(data        instanceof Array ))   data        = [data]
  if ( !(processList instanceof Array ))   processList = [processList]
  const error = processList.reduce ( (res, processName ) => {
                                  const errorUpdate = help._validateProcess(this, processName);
                                  return res.concat ( errorUpdate )
                      },[])

  if ( error.length == 0 )  {
        let current = data;
        processList.forEach ( processName => {
            current = processTools.run.call ( this, this.processes[processName], current, hooks )
        })
        return current
    }
  else  return error
} //   run func.   -- Process

}   // lib_Process lib




















const lib_Data = {  
 insert ( data ) {   //   ({}) -> void
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
  } //   insert func.   -- Data



  , insertLib ( data, libName ) {   //   ({}, string) -> void
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
  } // insertLib func.   -- Data



  , rename ( ops ) {   //   ({oldName:newName}) -> void
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
  } // rename func   --- Data



  , remove ( dataName ) {   //   ( dataName:string|string[]) -> void
          const me = this;
          let listDelete;
        
          if ( dataName instanceof Array ) listDelete = dataName
          else {
                  const t = Object.keys ( arguments );
                  listDelete = t.map ( k => arguments[k] )
              }
          
          listDelete.forEach ( item => delete me.data[item])
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
    , mixProcess       : lib_Process.mix        // Set new process as combination of existing processes;
    , insertProcessLib : 'NA'                   // Insert list of processes with a single operation. JSON required;
    , getProcess       : 'NA'
    , getProcessLib    : 'NA'                   // Export processes from process-library as JSON;
    , getHooks         : lib_Process.getHooks   // Provide information about hooks available
    , run              : lib_Process.run        // Execute process/processes

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


