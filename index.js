'use strict';

/* 
   Code Assembly Line
     - started at 23 september 2017
*/

const 
       templateTools      = require ( './template-tools'     )
     , processTools       = require ( './process-tools'      )
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
  insertTemplate : function ( extTemplate, altName ) {
    /*
         ( extTemplate, altName ) -> void
         extTemplate: ExtSimpleTemplate | ExtTempalteString | ExtTemplateData; External format of template;
         altName?: string; Change template name for internal use;
    */
        let 
            me = this
          , duplicate     = false // Boolean flag. Template with this name already exist
          , internalTpl   = {}
          , { name, tpl } = extTemplate
          ;

        if ( !tpl ) { 
              // It's not ExtTempalteString but could be ExtSimpleTemplate
              const simpleTemplates = Object.keys( extTemplate )
              simpleTemplates
                    .forEach ( name => lib.insertTemplate.call ( me, { name, tpl: extTemplate[name] }, altName )   )
              return
           }

        if ( !name && !altName ) {
             console.error ( 'Error: Missing template name' );
             return
           }

        if ( altName ) name = altName
        
        duplicate = me.templates.hasOwnProperty ( name )
        const entryForbidden = duplicate && !me.config.overwriteTemplates;
        if ( entryForbidden ) return
        
        const tplArray = extTemplate.tpl instanceof Array
        if  ( tplArray ) internalTpl = lib._replicateTpl ( extTemplate )
        else             internalTpl = interpretTemplate ( extTemplate.tpl )
                    
        me.templates [ name ] = internalTpl
  } // addTemplate func.



, _replicateTpl : function ( ext ) {   //   (ExtTemplateData) -> InternalTpl
      let internal = {};
      internal.tpl = ext.tpl.map ( v => v )
      if ( !ext.placeholders ) ext = interpretTemplate ( ext.tpl.join('') )
      internal.placeholders = Object.assign ( {}, ext.placeholders )
      return internal
} // _replicateTpl func.



, insertTemplateLib : function ( extLib, libName ) {  //   ( extLib: ExtTemplateSLib,  name: string ) -> void
      let 
              me = this
          ,  simpleTemplates = Object.keys ( extLib )
          ;

      simpleTemplates.forEach ( extName => {
                                    const name = `${libName}/${extName}`;
                                    lib.insertTemplate.call ( me, { name, tpl: extLib[extName]})
                        })
  } // insertTemplateLib func.




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
                  console.error ( 'Error: Overwrite of existing template is not permited by configuration.' )
                  return
               }
          else {
                  me.templates[newKey] = me.templates[key]
                  delete me.templates[key]
            }
    })
} // renameTemplate func.



, removeTemplate : function ( tplName ) {   //   (string || string[]) -> void
    const me = this;
    let listDelete;

    if ( tplName instanceof Array ) listDelete = tplName
    else {
            const t = Object.keys ( arguments );
            listDelete = t.map ( k => arguments[k] )
         }
    
    listDelete.forEach ( item => delete me.templates[item])
} // removeTemplate func.



, getTemplate: function ( tplName ) {
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



, getTemplateLib: function ( libName ) {
  const 
        me = this
      , tpl = me.templates
      , tplNames = Object
                       .keys ( tpl )
                       .filter ( name => name.includes('/')   )
      ;
  let libRequst;

  if ( libName instanceof Array )   libRequst = libName
  else {
          const t = Object.keys ( arguments );
          libRequst = t.map ( k => arguments[k] )
       }
  
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
} // getTemplateLib func.



, insertProcess: function ( ext, name ) {
    /*
        -> void
        ext: extProcess. Process steps.
        name: string. Process name
    */
    const
           me = this
         , duplicate = me.processes.hasOwnProperty ( name )
         , entryForbidden = duplicate && !me.config.overwriteProcesses
         ;

    if ( entryForbidden ) return

    const internalProcess = processTools.interpret ( ext );
    me.processes[name] = internalProcess
} // addProcess func.



, mixProcess : function ( mixList, newProcessName ) {   //   ( mixList:string[], processName:string ) -> void
  // * Set new process as combination of existing processes
    const
            me            = this
          , processes     = me.processes
          , doOverwrite   = me.config.overwriteTemplates
          , processExists = processes[newProcessName] ? true : false
          ;
          
    let mix = {};   // new process container
    
    if ( processExists && !doOverwrite ) {
          console.error ( `Error: Process with name "${newProcessName}" is already defined.` )
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
} // setProcess func.



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
  // * Find if process exists. Find if all templates needed are available.
  let error = [];
  const processExists   = engine.processes.hasOwnProperty ( processName );
  
  if   ( !processExists ) error.push ( `Process "${processName}" doesn't exist.` )
  else {
    engine.processes[ processName ]['arguments']
    .reduce ( (listTemplates, step) => { 
                            if ( step.do == 'draw' && step.tpl )  listTemplates.push ( step.tpl )
                            return listTemplates
                       },[])
              .forEach ( name => {
                      if ( !engine.templates[name] ) error.push (`Error: Template "${name}" is not available` )
              })
      }
  return error
} // _validateProcess func.



, runProcess : function ( processName, data, hooks ) {    
    const error = lib._validateProcess ( this, processName );
    if ( !(data instanceof Array)) data = [data]
    if ( error.length == 0 )  return processTools.run.call ( this, this.processes[processName], data, hooks )
    else                      return error
} // run func.

} // lib











// codeAssembly API
codeAssembly.prototype = {
    // Template I/O Operations
      insertTemplate    : lib.insertTemplate     // Insert template;
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


