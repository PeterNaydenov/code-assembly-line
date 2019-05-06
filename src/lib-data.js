
function getLibData ({ help, showError }) {


const lib_Data = {  
    insert ( data, method='add' ) {   //   ({},enum) -> engine
           const 
                 me        = this
               , flatData  = help._flatten ( data )
               , dataKeys = Object.keys( flatData )
               ;
           dataKeys.forEach ( name => {
                     const hasField = me.data[name] ? true : false;
   
                     if (  hasField && method == 'add'    )   return
                     if ( !hasField && method == 'update' )   return
                     if (  hasField && method == 'heap'   ) { 
                                                             me.data[name] += ' ' + flatData[name]
                                                             return
                         }
                     me.data [ name ] = flatData[name]
               })
           return me        
     } //   insert func.   -- Data
   
   
   
     , insertLib ( data, libName, method='add' ) {   //   ({}, string) -> engine
           const 
                   me        = this
                 , flatData  = help._flatten ( data )
                 , dataKeys = Object.keys ( flatData )
                 ;
   
           dataKeys.forEach ( name => {
                         const 
                               newKey = `${libName}/${name}`
                             , hasField = me.data [ newKey ]
                             ;
                             if (  hasField && method == 'add'    )   return
                             if ( !hasField && method == 'update' )   return
                             if (  hasField && method == 'heap'   ) { 
                                                                     me.data[newKey] += ' ' + flatData[name]
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
   return lib_Data
}  // getLibData func.


   module.exports = getLibData


