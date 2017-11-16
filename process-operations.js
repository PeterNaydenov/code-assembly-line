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


const lib = {

  draw : function ( template, data, missField, missData ) {   // ( intTemplate, {}[], string, string ) -> string[]
    // * Render template.
    let result = [];
    data.forEach ( obj => {
                const keys = Object.keys(obj);
                let 
                      tpl = lib._copyList ( template.tpl )
                    , places = Object.assign ( {}, template.placeholders )
                
                keys.forEach ( k => {
                            const positions = places[k]
                            if ( positions ) {
                                    for (let position of positions ) tpl[position] = obj[k]
                                    delete places[k]
                               }
                     })
                
                const neglected     =   Object.keys ( places )
                    , someNeglected = ( neglected.length > 0 )
                    ;                    

                if ( someNeglected && missField ) { // miss field strategy
                       for ( let position of neglected ) {
                                 const id = places[position]
                                 tpl[id]  = lib._neglectedUpdate ( position, missField )
                           }  
                   }
               
                if ( someNeglected && missData ) { // miss data strategy
                       tpl = ( missData == '_hide' ) ? [] : [ missData ]
                  }
                
                if ( tpl.length > 0 )   result.push ( tpl.join('') )
        })
    return result
  } // draw func.



, _neglectedUpdate : function ( position, missField ) {
     switch ( missField ) {
        case '_position' : return position
        case '_hide'     : return ''
        default          : return missField
     }
} // _neglectedUpdate



, _copyList : function ( source ) { // (string[]) -> string[]
    let 
          size = source.length
        , result = []
        ;
    while (size--) result[size] = source[size]
    return result
} // _copyList func.



, alterTemplate : function ( step, sourcePlaceholders  ) {   // (step{}, internalTpl.placeholers) -> internalTpl.placeholders
  // * Rename of placeholders
  const 
          changes = step.data 
        , keysPh  = Object.keys ( sourcePlaceholders )
        , placeholders = {};
        ;

  keysPh.forEach ( key => {
        const k = changes[key] || key;
        placeholders[k] = sourcePlaceholders[key]
    }) 

  return placeholders
} // alterTemplate func.



, block : function ( data ) {   //  ( string[] ) -> string[]
  // * Concatinate strings from array. Returns new array with a single entry
    const result = data.reduce ( (res, item) => res += item, '')
    return [ result ]
} // block func.



, set : function ( step, data) {   //  ( step{}, string[] ) -> {}[]
  // * Converts renders and blocks in object
    const 
          name = step.as
        , result = data.reduce ( (res,item) => {
                                let obj = {};
                                obj[name] = item;
                                res.push ( obj )
                                return res
                        },[])
    return result;
} // set func.



, alter : function ( step, data ) {   // ( step{}, {}[] ) -> {}[]
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




, _normalizeSelection: function ( list, length ) { 
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



, _generateList: function ( size ) {
    let result = [];
    for ( let i=0; i < size; i++ ) result.push(i)
    return result
} // _generateList func.



, add : function ( step, data ) {   // ( step{}, {}[] ) -> {}[]
  // * Add property names
  const 
         changes = step.data
       , keys    = Object.keys ( changes )
       , forUpdate = lib._normalizeSelection ( step.select, data.length )
       ;
  let result = data.map ( dataRecord => Object.assign ({}, dataRecord)   );
  forUpdate.forEach ( el => {
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



, _combineValues: function ( existing, update ) {
    let 
          primitive = false
        , result
        ;
    
    if ( typeof existing != 'object' )   primitive = true
    if ( primitive )   result = [ existing ]
    else               result = existing

    return result.concat ( update )
} // _combineValues func.



, copy : function ( step, data ) {   // ( step{}, {}[] ) -> {}[]
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



, remove : function ( step, data ) {   // ( step{}, {}[] ) -> {}[]
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



, hook : function ( data, cb ) {   // ( {}[], Function ) -> {}[]
  // * Function placeholder within render process
    if ( !cb ) return data
    return cb ( data , lib.modify )
} // hook func.



, _findIfString : ( list ) => (typeof(list[0]) == 'string')



, modify : function ( data, step ) {   // ( {}[], step{} ) -> {}[]
  // * Access step-operations inside hook callbacks.
    let 
        act = step.do
      , dataIsStr = lib._findIfString ( data )
      ;

    if ( dataIsStr ) {
            console.error (`Data operations require objects but have strings. Data: ${data}`)
            return data
      }
    return lib[act] ( step, data )
} // modify func.

} // lib



module.exports = lib


