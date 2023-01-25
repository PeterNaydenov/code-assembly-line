'use strict'

/*
   Operations: 
         - draw
         - alterTemplate
         - block
         - set
         - alter
         - add 
         - copy
         - remove
         - hook
         - load // load is not part of the library but is valid op. Find it in process-tools
*/



function getProcessOperations ({help }) {

const lib = {

  draw ( params ) {   // ( {params} ) -> string[]
    // * Render template.
    /*
        Params:
           template:{intTemplate}. Selected template for this draw operation;
           data:{any}[]. Current data;
           sharedData:{any}. Engine data object;
           htmlAttributes: string[]. Render '_attr' will consider this list of items and their order;
           missField?:string. Strategy for fulfill missing data-fields;
           missData?:string.  Strategy for substitute data-record on missing data-fields;
           hookFn: (placeholderName:string) -> renderResult:string. Result will be added to render result array;

        MissField argument could be a string but also has two predefined options:
          '_position': will render placeholder name;
          '_hide'    : will not render anything;
          '_fn'      : hook function will take care about missing fields;
        
        MissData argument could be a string or some of predefined options:
         '_hide': will not render anything from this data-record
         '_fn'  : hook function will take care about the record;
        
    */
    let 
          { template, data, sharedData, htmlAttributes, missField, missData, hookFn } = params
        , result = []
        ;
    data.forEach ( (obj, _count) => {
                const 
                      current = help._flatten ( obj )
                    , keys = Object.keys ( current )
                    ;
                let 
                      tpl = lib._copyList ( template.tpl )
                    , places = Object.assign ( {}, template.placeholders )
                    , spaces = template.spaces // enumerable: 1-space before, 2-space after, 3-space before and after
                    , spaceBefore = '' 
                    , spaceAfter = ''
                    ;
                if ( places['_attr'] ) {   // calculate html attributes only if '_attr' placeholder exists in template
                            const attrTarget = places['_attr'][0]
                            spaceBefore = ( spaces['_attr'] && spaces['_attr']%2 ) ? ' ' : '' 
                            spaceAfter  = ( spaces['_attr'] && spaces['_attr']>1 ) ? ' ' : ''
                            const attr = lib._createAttributes(current, htmlAttributes ).trim()
                            if ( attr )   tpl[attrTarget] = `${spaceBefore}${attr}${spaceAfter}`   // generate attributes string
                            else          tpl[attrTarget] = ''
                            delete places['_attr']
                   }
                   
                if ( places['_count'] ) {   // replace _count if  '_count' placeholder exists in template
                        const countTarget = places['_count'];
                        spaceBefore = ( spaces['_count'] && spaces['_count']%2 ) ? ' ' : '' 
                        spaceAfter  = ( spaces['_count'] && spaces['_count']>1 ) ? ' ' : ''
                        countTarget.forEach ( position => tpl[position] = `${spaceBefore}${_count + 1}${spaceAfter}` )
                        delete places['_count']
                  }

                keys.forEach ( k => {
                            const positions = places[k];
                            spaceBefore = ( spaces[k] && spaces[k]%2 ) ? ' ' : '' 
                            spaceAfter  = ( spaces[k] && spaces[k]>1 ) ? ' ' : ''    
                            if ( positions ) {
                                    for (let position of positions ) tpl[position] = `${spaceBefore}${current[k]}${spaceAfter}`
                                    delete places[k]
                               }
                     })
                
                let   neglected     =   Object.keys ( places )
                    , someNeglected = ( neglected.length > 0 )
                    ;                    

                if ( someNeglected && sharedData ) {  // find values in sharedData
                      for ( let placeholder of neglected ) {
                            if ( sharedData[placeholder] ) {
                                            const list = places [placeholder]
                                            spaceBefore = ( spaces[placeholder] && spaces[placeholder]%2 ) ? ' ' : '' 
                                            spaceAfter  = ( spaces[placeholder] && spaces[placeholder]>1 ) ? ' ' : ''                    
                                            list.forEach ( id =>   tpl[id] = `${spaceBefore}${sharedData[placeholder]}${spaceAfter}`    )
                                            delete places[placeholder]
                                }
                         }
                } // if someNeglected

                neglected = Object.keys ( places )
                someNeglected = ( neglected.length > 0 )
                if ( someNeglected && missField ) {   // miss field strategy
                            let missFieldUpdate;
                            if ( missField == '_fn' && typeof(hookFn) != 'function' ) missField = '_hide'
                            switch ( missField ) {
                                case '_fn'       :
                                                    missFieldUpdate = hookFn
                                                    break
                                case '_hide'     :
                                                    missFieldUpdate = () => ''
                                                    break
                                case '_position' :
                                                    missFieldUpdate = (pos) => pos
                                                    break
                                default          :
                                                    missFieldUpdate = () => missField
                                } // switch missField
                            for ( let position of neglected ) {
                                                const list = places[position]
                                                list.forEach ( el => tpl[el] = missFieldUpdate(position)     )
                                }
                   } // if missField
                      
                if ( someNeglected && missData ) {   // miss data strategy
                            let missDataUpdate;
                            if ( missData =='_fn'   &&   typeof(hookFn) != 'function' )    missData = '_hide'
                            switch ( missData ) {
                                case '_fn':
                                              missDataUpdate = (x) => [hookFn(x)]
                                              break
                                case '_hide':
                                              missDataUpdate  = () => []
                                              break
                                default:
                                              missDataUpdate = () => [ missData ]
                                } // switch missData                            
                            tpl = missDataUpdate(neglected)
                    } // if missData
                
                if ( tpl.length > 0 )   result.push ( tpl.join('') )
        })
    return result
  } // draw func.





, _createAttributes ( data, attributes ) {   //   ({}, string[]) -> string
// *** 'attr' placeholder calculation
  const 
        attr      = {}
      , dataAttr  = new RegExp('^data-')
      ;
  let dataItems = '';

  for ( let item in data ) {
          if ( item === 'name'             )  continue  //   Ignore 'name'
          if ( item === 'id'               ) {
                                              attr['id'] = `id="${data[item]}"`
                                              attr['name'] = `name="${data[item]}"`
                                              continue
              }
          if ( item === 'className'        ) {
                                              attr['class'] = `class="${data[item]}"`
                                              continue
             } 
          if ( attributes.includes (item)  ) {
                                              attr[item]    = `${item}="${data[item]}"`
                                              continue
             }
          if ( dataAttr.test       (item)   ) {
                                              attr[item]    = `${item}="${data[item]}"`
                                              dataItems    += ` ${attr[item]}`
             }
        }

  return attributes.reduce ( (res,item) => {
                                        if ( attr[item]     ) res += ` ${attr[item]}`
                                        if ( item == 'data' ) res += ` ${dataItems}`
                                        return res
               },'')
} // _createAttributes func.





, _copyList ( source ) { // (string[]) -> string[]
    return source.map ( x => x )
} // _copyList func.



, alterTemplate ( step, sourcePlaceholders  ) {   // (step{}, internalTpl.placeholers) -> internalTpl.placeholders
  // * Rename of placeholders
  const 
          changes = step.data   // { oldPlaceholderName : newPlaceholderName }
        , keysPh  = Object.keys ( sourcePlaceholders )
        , placeholders = {};
        ;

  keysPh.forEach ( key => {
        const k = changes[key] || key;
        placeholders[k] = sourcePlaceholders[key]
    }) 

  return placeholders
} // alterTemplate func.



, block ( data, space ) {   //  ( string[] ) -> string[]
  // * Concatinate strings from array. Returns new array with a single entry
    return [ data.join( space )   ]
} // block func.



, set ( step, data ) {   //  ( step{}, string[] ) -> {}[]
  // * Converts renders and blocks in object
    const 
          name = step.as
        , result = data.reduce ( (res,item) => {
                                if ( !item ) return res
                                let obj = {};
                                obj[name] = item
                                res.push ( obj )
                                return res
                        },[])
    return result
} // set func.



, alter ( step, data ) {   // ( step{}, {}[] ) -> {}[]
  // * Change property names. 
  const 
         changes = step.data
       , keys    = Object.keys ( changes )
       , forUpdate = lib._normalizeSelection ( step.select, data.length )
       ;
  let result = data.map ( dataRecord => Object.assign ({}, dataRecord)   );
  forUpdate.forEach ( el => {
        const selected = result[el]
        const dataKeys = Object.keys(selected)
        let update = {}
        dataKeys.forEach ( k => {
                    let value = selected[k]
                    if ( keys.includes(k) ) k = changes[k]
                    update[k] = value
            })
        result[el] = update
    })
  return result
} // alter func.




, _normalizeSelection ( list, length ) { 
    let result = [];
    if ( !list ) {
         result = lib._generateList ( length )
         return result
       }
    // if ( typeof(list) == 'string' ) list = [ list ]
    if ( typeof(list) != 'object' ) list = [ list ]

    list.forEach ( el => {
            if ( el == 'all') {
                 result = lib._generateList(length)
                 return result
              }
            switch ( el ) {
                case 'first': 
                              result.push(0)
                              break;
                case 'last' : 
                              result.push(length-1)
                              break
                    default :
                              if (el<0) result.push(length-1+el)
                              else      result.push(el-1)
               }
        })
    return result
} // _normalizeSelection func.



, _generateList ( size ) {
    let result = [];
    for ( let i=0; i < size; i++ ) result.push(i)
    return result
} // _generateList func.



, add ( step, data ) {   // ( step{}, {}[] ) -> {}[]
  // * Add property names
  const 
         changes = step.data
       , keys    = Object.keys ( changes )
       , listForUpdate = lib._normalizeSelection ( step.select, data.length )
       ;
  let result = data.map ( dataRecord => Object.assign ({}, dataRecord)   );
  listForUpdate.forEach ( el => {
        const selected = result[el]
        const dataKeys = Object.keys(selected)
        let update = keys.reduce ( (res,k) => {
                                if ( !selected[k] ) res[k] = changes[k]
                                else                res[k] = lib._combineValues (selected[k], changes[k])
                                return res
                        }, {})
        result[el] = Object.assign( selected, update )
    })
  return result  
} // add func.



, _combineValues ( existing, update ) {
    let 
          primitive = false
        , result
        ;
    
    if ( typeof existing != 'object' )   primitive = true
    if ( primitive )   result = [ existing ]
    else               result = existing

    return result.concat ( update ).join ( ' ' )
} // _combineValues func.



, copy ( step, data ) {   //   ( step{}, {}[] ) -> {}[]
  // * Create new property copy the value.
    const 
         changes = step.data
       , keys    = Object.keys ( changes )
       , forUpdate = lib._normalizeSelection ( step.select, data.length )
       , result = data.map ( record => Object.assign ({},record) )
       ;

    forUpdate.forEach ( dataRecord => {
    keys.forEach ( k => {
            const value     = result[dataRecord][k]
            const copyKey   = changes[k]
            result[dataRecord][copyKey] = value 
       })
       })

    return result
} // copy func.



, remove ( step, data ) {   // ( step{}, {}[] ) -> {}[]
  // * Remove existing property
    const 
         keys = step.keys
       , forUpdate = lib._normalizeSelection ( step.select, data.length )
       , result = data.map ( record => Object.assign ({}, record) )
       ;

    forUpdate.forEach ( dataRecord => {
    keys.forEach ( k => {
                delete result[dataRecord][k]
       })        
       })
    return result
} // remove func.



, hook ( data, cb, engine ) {   // ( {}[], Function ) -> {}[]
  // * Function placeholder within render process
    const operation = this; // access to process-tools
    if ( !cb ) return data
    return cb ( data , lib.modify(operation,engine) )   // 'operation' and 'engine' are dependencies for function 'modify'
} // hook func.



, _findIfString : ( list ) => (typeof(list[0]) == 'string')



, modify ( operations, engine ) {   // ...required dependencies for 'draw'
  // * Access step-operations inside hook callbacks.
  return function ( data, step ) {   // ( {}[], step{} ) -> {}[]
    let 
          act = step.do
        , dataIsStr = lib._findIfString ( data )
        , space = step.space || ' '
        ;
    switch ( act ) {
            case 'draw' :
                          const 
                               template   = operations._getTemplate ( step.tpl, engine.templates, {})
                             , sharedData = engine.data
                             , missField  = step.missField
                             , missData   = step.missData
                             , hookFn     = false
                             ;
                           if ( dataIsStr ) {
                                      console.error ( `Hook-modifier require an 'object' data-segment but has a 'string'. {do:'draw', tpl: '${step.tpl}'}` )
                                      return data
                              }
                          return lib [act] ({ template, data, sharedData, missField, missData, hookFn })
            case 'set'  :
                            if ( !dataIsStr ) {
                                      console.error (`Hook-modifier require a 'string' data-segment but has an 'object'. { do:'${step.do}', as:'${step.as}' }`)
                                      return data
                              }
                            return lib[act] ( step, data )
            case 'block' :
                            if ( !dataIsStr ) {
                                      console.error (`Hook-modifier require a 'string' data-segment but have an 'object'. { do:'block' }`)
                                      return data
                              }
                            return lib[act] ( data, space )
            default:
                            if ( dataIsStr ) {
                                      console.error (`Data operations require objects but have strings. Data: ${data}`)
                                      return data
                              }
                            return lib[act] ( step, data )
          } // switch act
 }} // modify func.

} // lib

return lib
}  // getProcessOperations func.



module.exports = getProcessOperations


