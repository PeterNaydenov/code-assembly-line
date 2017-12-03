'use strict';

const 
        showError = require ('./errors')
      , operation = require ( './process-operations')
      , validSteps = [ 'draw', 'alterTemplate', 'alter', 'set', 'add', 'copy', 'remove', 'hook', 'block', 'save' ]
      ;



const lib = {
interpret : function ( ext ) { //   (ext: extProcess) -> int: intProcess
  const internal = {};
  
  internal.steps = []
  internal.arguments = []
  internal.hooks = []

  const errorLog = lib._validate ( ext )
  if ( errorLog.length > 0 ) {
                internal.errors = errorLog;
                return internal;
     }

  ext.forEach ( step => {
        internal.steps.push ( step.do )
        internal.arguments.push ( step )
        if ( step.do == 'hook' ) internal.hooks.push ( step.name )
        if ( step.hook         ) internal.hooks.push ( step.hook )
     })

  return internal
} // interpret func.



, _validate : function (ext) {
      const 
               log = []
             , validType = ext instanceof Array
             ;
        
        if ( !validType )      return [ showError('wrongExtProcess') ]
        if ( ext.length == 0 ) return [ showError('emptyExtProcess') ]

        ext.forEach ( step => {
                let validOperation = false;
                if ( !step.do ) {
                        log.push ( showError('missingOperation'))
                        return
                   }
                validOperation = validSteps.includes ( step.do )
                if ( !validOperation ) log.push ( showError('notaValidOperation', [step.do] ) )
        })
        return log
} // _validate func.



, _findIfString : (list) => (typeof(list[0]) == 'string')



, _copyList : function ( source ) { // (string[]) -> string[]
    let 
          size = source.length
        , result = []
        ;
    while (size--) result[size] = source[size]
    return result
} // _copyList func.



, _parse ( data ) {   //   (string) -> {} | false
    try        {  return JSON.parse(data)   }
    catch (er) {  return false              }
} // _parse func.



, run : function ( proccessItems, data, hooks ) {
  // * Executes process/processes
    if ( proccessItems.hasOwnProperty('errors') ) return
    const dataIsArray = data instanceof Array;
    let 
          me = this
        , libTemplates = me.templates
        , current      = data
        , currentIsStr = lib._findIfString(current) // current is array of strings or array of objects
        , contextPlaceholders = {}
        , answer
        ;

        if ( !dataIsArray )   data = [ data ]

        proccessItems.steps.forEach ( (step,id) => {
          const todo = proccessItems.arguments[id];    //   Get full step instruction
          let tplName;

          switch ( step ) {
            case 'draw' :
                          tplName   = todo.tpl
                          if ( currentIsStr )  console.warn ( showError ('dataExpectObject', `Step "draw" with template "${tplName}"`) )

                          const
                                  missField = todo.missField       || false
                                , missData  = todo.missData        || false
                                , hookFn    = hooks ? hooks[todo.hook] || false : false
                                , tpl       = libTemplates[tplName]['tpl']
                                , originalPlaceholders = libTemplates[tplName]['placeholders']
                                , holdData  = !(todo.as == null)
                                ;
                          
                          let localTemplate = {};
                          localTemplate.tpl = tpl
                          localTemplate.placeholders = contextPlaceholders[tplName] || originalPlaceholders

                          const update = operation[step] ( { template:localTemplate, data:current, sharedData:me.data, htmlAttributes:me.config.htmlAttributes, missField, missData, hookFn} );
                          if ( holdData ) {
                                    current = current.reduce ( (res,el,i) => {
                                                                el[todo.as] = update[i]
                                                                res.push(el)
                                                                return res
                                                        }, [])
                               }
                          else {
                                  current      = update
                                  currentIsStr = true
                             }
                          break
            case 'block':
                          if ( !currentIsStr ) {
                                 console.error ( showError ('blockExpectString', JSON.stringify(current))   )
                                 return
                             }
                          
                          current = operation[step] ( current )
                          if ( todo.name ) {
                                        let newData = {};
                                        newData[`block/${todo.name}`] = current.join('')
                                        me.insertData ( newData )
                              }
                          break
            case 'alterTemplate' :
                          tplName = todo.tpl
                          const intTemplate = libTemplates[tplName];
                          contextPlaceholders[tplName] = operation[step] ( todo, intTemplate.placeholders )
                          break
            case 'set'  :
                          current = operation[step] (todo, current )
                          currentIsStr = false
                          break
            case 'hook' :  
                          let hooked = operation[step] ( current, hooks[todo.name] )
                          if ( hooked instanceof Array ) current = hooked
                          else                           current = [hooked]
                          currentIsStr = lib._findIfString ( current )
                          break
            case 'save' :
                          const saveName = (todo.as != 'block') ? todo.name : `block/${todo.name}`;
                          let currentData = {};

                          switch ( todo.as ) {
                                  case 'block':
                                  case 'data':
                                                  currentData[saveName] = current.join('')
                                                  me.insertData ( currentData )
                                                  // TODO: check twice!!!
                                                  break
                                  case 'template':
                                                  currentData[saveName] = current[0]
                                                  me.insertTemplate ( currentData )
                                                  break
                                  case 'process':
                                                  let newProcess = lib._parse ( current[0] )
                                                  if ( newProcess )   me.insertProcess ( newProcess, saveName )
                                                  else                console.log (  showError ( 'invalidJSON', current[0] )   )
                                                  break
                                  default:
                                                 console.log ( showError ('invalidStorageName', todo.as) )
                                                 return
                             }
                          break
            } // switch step
       }) // forEach step
       return current
} // run func.
} // lib



module.exports = lib


