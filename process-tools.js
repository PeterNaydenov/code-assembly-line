'use strict';

const errors = require ('./errors');
const operation = require ( './process-operations')



const lib = {
interpret : function ( ext ) {
    /*
        (ext) -> in
        ext: extProcess. Process steps.
        in: intProcess. Internal process structure.
    */
  
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
     })

  return internal
} // interpret func.



, _validate : function (ext) {
      const 
               validSteps = [ 'draw', 'alterTemplate', 'alter', 'set', 'add', 'copy', 'remove', 'hook', 'block', 'load' ]
             , log = []
             , validType = ext instanceof Array
             ;
        
        if ( !validType )      return [ errors.wrongExtProcess ]
        if ( ext.length == 0 ) return [ errors.emptyExtProcess ]

        ext.forEach ( step => {
                let validOperation = false;
                if ( !step.do ) {
                        log.push ( errors.missingOperation )
                        return
                   }
                validOperation = validSteps.includes ( step.do )
                if ( !validOperation ) log.push ( `Error: "${step.do}" is not a valid operation` )
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



, run : function ( proccessItems, data, hooks ) {
  // * Executes render process
    if ( proccessItems.hasOwnProperty('errors') ) return
    const dataIsArray = data instanceof Array;
    let 
      me = this
    , libTemplates = me.templates
    , current  = data
    , currentIsStr = lib._findIfString(current) // current is array of strings or array of objects
    , contextPlaceholders = {}
    , answer
    ;

    if ( !dataIsArray )   data = [ data ]
    proccessItems.steps.forEach ( (step,id) => {
           const todo = proccessItems.arguments[id]

           let tplName;
           
           switch ( step ) {
            case 'draw' :
                          if ( currentIsStr ) {
                                  console.error (`Error: Draw expects object data. ${console}`)   
                                  return
                            }
                            
                            tplName   = todo.tpl
                            
                            if ( !libTemplates[tplName] ) {
                                    console.error ( `Error. Template "${tplName}" doesn't exist.` )
                                    return
                               }
                          
                          const
                                  missField = todo.missField | false
                                , missData  = todo.missData  | false
                                , tpl       = libTemplates[tplName]['tpl']
                                , originalPlaceholders = libTemplates[tplName]['placeholders']
                                , holdData  = !(todo.as == null)
                                ;
                          
                          let localTemplate = {};
                          localTemplate.tpl = tpl
                          localTemplate.placeholders = contextPlaceholders[tplName] || originalPlaceholders
                          
                          const update = operation[step] ( localTemplate, current, missField, missData );
                          if ( holdData ) {
                                  current = current.map ( (el,i) => el[todo.as] = update[i] )
                               }
                          else {
                                  current      = update
                                  currentIsStr = true
                             }
                          break
            case 'block':
                          if ( !currentIsStr ) {
                                 console.error ( `Block expects string data. ${current}` )
                                 return
                             }
                          
                          current = operation[step] ( current )
                          if ( todo.name ) me.data.blocks[ todo.name ] = current 
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
                          current = operation[step] ( current, hooks[step] )
                          currentIsStr = lib._findIfString ( current )
                          break
            case 'load' :
                          const name = todo.name
                          current    = this.data[name]
                          currentIsStr = lib._findIfString(current)
                          break
            case 'save' :
                          const 
                                  saveName = todo.name
                                , storage  = todo.in
                                ;                          
                          this[storage][saveName] = current
                          break
                default :
                          if ( currentIsStr ) {
                                console.error (`Data operations require objects. ${current}`)
                                return
                             }
                          // data operations
                          current = operation[step] ( todo, current )
            } // switch step
       }) // forEach step
       return current
} // run func.
} // lib



module.exports = lib


