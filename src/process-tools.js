'use strict';

const validSteps = [ 'draw', 'alterTemplate', 'alter', 'set', 'add', 'copy', 'remove', 'hook', 'block', 'save' ];





function getProcessTools ({ showError, operation }) {

const lib = {

interpret ( ext ) { //   (ext: extProcess) -> int: intProcess
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



, _validate (ext) {
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



, _copyList ( source ) { // (string[]) -> string[]
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




, _setupDrawDependencies ( me, todo, template, data, hookFn ) {
  // *** Setup 'draw' dependenices
    const 
            sharedData     = me.data
          , htmlAttributes = me.config.htmlAttributes
          , missField      = todo.missField  || false
          , missData       = todo.missData   || false
          ;
    return  { 
                  template
                , data
                , sharedData
                , htmlAttributes
                , missField
                , missData
                , hookFn
            }
} // _setupDrawDependencies func.



, _getTemplate ( tplName, library, contextPlaceholders ) {
  // *** Returns a copy of template
      let 
            template = {}
          , tpl      = library [ tplName ]
          , localPlaceholders = contextPlaceholders[tplName] || library [tplName].placeholders
          , holderKeys = Object.keys ( localPlaceholders )
          ;
      template.tpl = tpl.tpl.map ( x => x )
      template.spaces = Object.assign ( {}, tpl.spaces )
      template.placeholders = {}
      holderKeys.forEach ( key => {
                  template.placeholders [ key ] = localPlaceholders[key].map ( x => x )
            })
      return template
} // _getTemplate func.



, run ( proccessItems, data, hooks ) {
  // * Executes process/processes
    let 
          me = this
        , libTemplates = me.templates
        , current      = data
        , currentIsStr = lib._findIfString(current) // current is array of strings or array of objects
        , getTemplate  = lib._getTemplate          // Creates a copy of requested template
        , setupDrawDependencies = lib._setupDrawDependencies // Sets draw dependency object
        , contextPlaceholders = {}
        ;
    proccessItems.steps.forEach ( (step,id) => {
          const todo = proccessItems.arguments[id];    //   Get full step instruction
          let 
                tplName
              , watchHook = todo.watchHook ? hooks[todo.watchHook] || false : false
              , update    = []  // draw result buffer
              , space     = (todo.space != null ) ? todo.space : ' '
              , method    = todo.method || 'add'   // Add method is default
              // Method possible values: < add | update | heap | overwrite >
              ;

          switch ( step ) {
            case 'draw' :
                          tplName = todo.tpl
                          if ( currentIsStr )  console.warn ( showError ('dataExpectObject', `Step "draw" with template "${tplName}"`) )
                           const
                                  hookFn    = hooks ? hooks[todo.hook] || false : false
                                , holdData  = !(todo.as == null)
                                ;
                          if ( watchHook ) {
                                  current.forEach ( dataSegment => { 
                                            let 
                                                  [ watchData, watchTplName ] = watchHook ( dataSegment, tplName )
                                                , watchTemplate    = getTemplate ( watchTplName, libTemplates, contextPlaceholders )
                                                , drawDependencies = {}
                                                ;
                                            if ( !(watchData instanceof Array) )   watchData = [ watchData ]
                                            drawDependencies = setupDrawDependencies ( me, todo, watchTemplate, watchData, hookFn )
                                            update = update.concat ( operation[step] ( drawDependencies )  )
                                        })
                                  if ( holdData )   update = [ update.join ( space ) ]
                              }
                          else {
                                            const 
                                                  localTemplate = getTemplate ( tplName, libTemplates, contextPlaceholders )
                                                , dependenices  = setupDrawDependencies ( me, todo, localTemplate, current, hookFn )
                                                ;
                                            update = operation[step] ( dependenices );

                              } // else watchHook
                          
                          if ( holdData ) {
                                    current = current.reduce ( (res,el,i) => {
                                                                switch ( method ) { 
                                                                      case 'add': // write only if key doesn't exist
                                                                            if ( !el[todo.as] )   el[todo.as] = update[i]
                                                                            break
                                                                      case 'update': // overwrite only if key exists
                                                                            if ( el[todo.as] )   el[todo.as] = update[i]
                                                                            break
                                                                      case 'overwrite': // always write
                                                                            el[todo.as] = update[i]
                                                                            break
                                                                      case 'heap': // Add update to the heap. Accumulate value.
                                                                            el [todo.as] += space + update[i]
                                                                            break
                                                                   } // switch method
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
                          const 
                                blockSpace = todo.space || '';
                          current = operation[step] ( current, blockSpace )
                          if ( todo.name ) {
                                        let newData = {};
                                        newData[`block/${todo.name}`] = current.join('')
                                        me.insertData ( newData, method )
                              }
                          break
            case 'add':
                          current = operation[step] ( todo, current )
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
                          let 
                               extend = todo.as || false
                             , hooked = []  // storage for hook results
                             ;
                          current.forEach ( (dataSegment,i) => {
                                    const dt = [dataSegment,i];
                                    hooked.push ( operation[step].call( lib, dt, hooks[todo.name], me )[0])
                              })
                          if ( extend ) {
                                current = current.map ( (dataSegment,i) => {
                                                        const 
                                                              hk = hooked[i]
                                                            , res = ( hk instanceof Array ) ? hk.join ( space ) : hk
                                                            ;
                                                        switch ( method ) { 
                                                                      case 'add': // write only if key doesn't exist
                                                                            if ( !dataSegment [ extend ] )   dataSegment [ extend ] = res
                                                                            break
                                                                      case 'update': // overwrite only if key exists
                                                                            if ( dataSegment [ extend ] )   dataSegment [ extend ] = res
                                                                            break
                                                                      case 'overwrite': // always write
                                                                            dataSegment [ extend ] = res
                                                                            break
                                                                      case 'heap': // Add update to the heap. Accumulate value.
                                                                            dataSegment [ extend ] += space + res
                                                                            break
                                                                   } // switch method
                                                        return dataSegment
                                                })
                                break
                              }
                          current = hooked.reduce ( (acc,item) => {
                                          const 
                                                isArray = item instanceof Array
                                              , isStr = lib._findIfString (item)
                                              ;
                                          
                                          if ( isArray && isStr ) { // Array of strings
                                                      item = item.join ( space )
                                                      acc.push ( item )
                                                      return acc
                                                  }

                                          if ( isArray ) {  // Array of objects
                                                       acc = acc.concat(item)
                                                       return acc
                                                    }
                                          acc.push ( item )
                                          return acc
                                        },[])
                          currentIsStr = lib._findIfString ( current )
                          break
            case 'save' :
                          const saveName = (todo.as != 'block') ? todo.name : `block/${todo.name}`;
                          let currentData = {};
                          

                          switch ( todo.as ) {
                                  case 'block':
                                  case 'data':
                                                  if ( !currentIsStr ) {  
                                                            console.log ( showError ( 'blockExpectString', JSON.stringify(current)   ))
                                                            break
                                                      }
                                                  currentData[saveName] = current.join('')
                                                  me.insertData ( currentData, method )
                                                  break
                                  case 'template':
                                                  currentData[saveName] = current[0]
                                                  me.insertTemplate ( currentData, method )
                                                  break
                                  case 'process':
                                                  let newProcess = lib._parse ( current[0] )
                                                  if ( newProcess )   me.insertProcess ( newProcess, saveName )
                                                  else                console.error (  showError ( 'invalidJSON', current[0] )   )
                                                  break
                                  default:
                                                 console.error ( showError ('invalidStorageName', todo.as) )
                                                 return
                             }
                          break
            } // switch step
       }) // forEach step
       return current
} // run func.
} // lib
  return lib
} // getProcessTools func.



export default getProcessTools


