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
} // config



function codeAssembly ( cfg ) {
            this.templates = {}
            this.processes = {}
            this.data = {}
            this.data.blocks = {}
            this.config = {}

            Object.keys(codeAssemblyConfig).forEach ( k => this.config[k] = codeAssemblyConfig[k] )
            if ( cfg )  Object.keys(cfg).forEach ( k => this.config[k] = cfg[k] )
  } // codeAssembly func.



const lib = {
  insertTemplate : function ( extTemplate ) { // (extTemplate: ExternalTemplate) -> void
        let 
            me = this
          , templateNames = Object.keys( extTemplate )
          ;

        templateNames.forEach ( name => {
              if ( lib._isTemplateWritingForbidden(me,name) ) {
                    console.error ( showError('overwriteTemplate') )
                    return
                  }
              me.templates [ name ] = interpretTemplate ( extTemplate[name] )
            })        
  } // insertTemplate func.





, insertTemplateLib : function ( extLib, libName ) {  //   ( extLib: ExternalTemplate,  name: string ) -> void
      let 
              me = this
          ,  simpleTemplates = Object.keys ( extLib )
          ;

      simpleTemplates.forEach ( extName => {
                                const 
                                        newTpl = {}
                                      , name = `${libName}/${extName}`
                                      ;
                                if ( lib._isTemplateWritingForbidden(me,name) ) {
                                        console.error ( showError('overwriteTemplate')   )
                                        return
                                   }
                                newTpl[name] = extLib[extName]
                                lib.insertTemplate.call ( me, newTpl )
                        })
  } // insertTemplateLib func.





, _isTemplateWritingForbidden : function ( me , name ) {
    const
           entryExists = me.templates.hasOwnProperty ( name ) // 'true' if template with this name already exists
         , entryForbidden = entryExists && !me.config.overwriteTemplates
         ;
   return entryForbidden
} // _isTemplateWritingForbidden func.





, renameTemplate : function ( ops ) { //   ({oldName:newName}) -> void
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
} // renameTemplate func.





, removeTemplate : function ( tplName ) {   //   ( tplName:string|string[]) -> void
    const me = this;
    let listDelete;

    if ( tplName instanceof Array ) listDelete = tplName
    else {
            const t = Object.keys ( arguments );
            listDelete = t.map ( k => arguments[k] )
         }
    
    listDelete.forEach ( item => delete me.templates[item])
} // removeTemplate func.





, getTemplate: function ( tplName ) { // (tplName: string|string[]) -> ExternalTemplate
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

} // getTemplate func.





, getTemplateLib: function ( libName ) { //   (libName:string|string[]) -> ExternalTemplate
  const me = this;
  let libRequst;

  if ( libName instanceof Array )   libRequst = libName
  else {
          const t = Object.keys ( arguments );
          libRequst = t.map ( k => arguments[k] )
       }
  
  return lib._extractLib ( me.templates, libRequst )
} // getTemplateLib func.





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





, _isProcessWritingForbidden : function ( me , name ) {
  const
         entryExists = me.processes.hasOwnProperty ( name ) // 'true' if process with this name already exists
       , entryForbidden = entryExists && !me.config.overwriteProcesses
       ;
 return entryForbidden
} // _isProcessWritingForbidden func.





, insertProcess: function ( ext, name ) { // (ext: extProcess, name: string) -> void
    const me = this;

    if ( lib._isProcessWritingForbidden(me,name) ) {
          console.error ( showError('overwriteProcess',name) )
          return
        }

    me.processes[name] = processTools.interpret ( ext )
} // insertProcess func.





, mixProcess : function ( mixList, newProcessName ) {   //   ( mixList:string[], processName:string ) -> void
  // * Set new process as combination of existing processes
    const
            me            = this
          , processes     = me.processes
          ;
          
    let mix = {};   // new process container
    
    if ( lib._isProcessWritingForbidden(me,newProcessName) ) {
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
} // mixProcess func.





, getHooks   : function ( processName ) { //   (processName) -> { hookName : undefined }
    const recordExists = this.processes.hasOwnProperty ( processName );
    if ( recordExists )  { 
              const hooks = this.processes[ processName ].hooks;  
              return hooks.reduce ( (res, name) => {
                              res[name] = undefined
                              return res
                        },{})
        }
    else      return {}
} // getHooks func.





, getPlaceholders : function ( templateName ) { //   (templateName:string) -> placeholderNames:string[].
    const tpl = this.templates [ templateName ];

    if ( tpl )  return Object.keys ( tpl.placeholders )
    else        return []
} // getPlaceholders func.





, _validateProcess : function ( engine, processName ) {
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





, runProcess : function ( processList, data, hooks ) {    
    if ( !(data        instanceof Array ))   data        = [data]
    if ( !(processList instanceof Array ))   processList = [processList]
    const error = processList.reduce ( (res, processName ) => {
                                    const errorUpdate = lib._validateProcess(this, processName);
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
} // run func.

} // lib










// codeAssembly API
codeAssembly.prototype = {
      tools : tools              // Usefull template and process related functions (external)
   
    // Template I/O Operations
    , insertTemplate    : lib.insertTemplate     // Insert template;
    , insertTemplateLib : lib.insertTemplateLib  // Insert template library;    
    , getTemplate       : lib.getTemplate        // Exports template
    , getTemplateLib    : lib.getTemplateLib     // Export list of templates as library
    , getPlaceholders   : lib.getPlaceholders    // Return placeholders per template
      
    // Template Manipulation
    , renameTemplate : lib.renameTemplate // change name of template/templates
    , removeTemplate : lib.removeTemplate // remove template/templates

    // Processes
    , insertProcess : lib.insertProcess // Insert new process
    , mixProcess    : lib.mixProcess    // Set new process as combination of existing processes
    , getHooks      : lib.getHooks      // Provide information about hooks available
    , run           : lib.runProcess    // Execute process

    // Data
    , insertData : 'NA'   // Save data. Word 'blocks'
} // codeAssembly prototype



module.exports = codeAssembly;


