'use strict';

const chop = require ('./template-chop');
const showError = require ('./errors' );

/*
    Converts ExtTempalteString to InternalTpl.

    • Import string template
      ( stringTemplate: string ) -> internalTemplate
       internalTemplate: { tpl: tplData, placeholders?:indexOfPlaceholders, error?: errorMsg }
       indexOfPlaceholders: { placeholderName: indexInTplData }
       errorMsg: string  
      
      tplData: string[]; Contains text and placeholders.
      Example:
          [
              'Some words from '         //text
            , '{{person}}'               // placeholder
            , ' - See how simple is it'  //text
          ]
      
      placeholderName is extracted value of placeholder.
      Example:
          placeholder: {{person}}
          placeholderName: person    
*/


const lib = {
 
 str2intTemplate : function (str) {
    const r = chop ( str );
    const error = r.includes ( showError('brokenTemplate') );
    let 
          placeholders = {}
        , spaces = {}  // { placeholderName: spaceType } 
        ;
    /*
        placeholderName: string. Name of the placeholder.
        spaceType:enum. 
                1-space before, 
                2-space after, 
                3-both spaces
    */

    if ( !error ) {  
            const t = lib._findPlaceholdersAndSpaces ( r )
            spaces = t.spaces
            placeholders = t.placeholders
        }

    const template = {
                        tpl:r
                      , placeholders
                      , spaces
                     };
    if ( error )   template.errors = [showError('brokenTemplate')]
    return template
} // str2inTemplate func.



, load_interpretTemplate : function ( convert2intTemplate ) {
  return ( tplItem ) => {
      let intTemplate = {}; // internal template
      const type = (typeof tplItem == 'string')  ? 'string' : 'error';

      if ( type == 'string' ) intTemplate = convert2intTemplate ( tplItem )
      else                    intTemplate = { errors: [showError('wrongDataTemplate')] }

      return intTemplate
}} // load_interpretTemplate func.



, _findPlaceholdersAndSpaces : function ( tplArray ) {
    const 
              placeholders = {}
            , spaces = {}
            ;
    tplArray.forEach ( (item,i) => {
                if ( item.slice(0,2) == '{{' ) {
                        let start = 2, end = -2;
                        const before = item.slice(2,4) == '~~';
                        const after  = item.slice (-4,-2) == '~~';
                        if (before) start = 4
                        if ( after ) end = -4
                        const phName = item.slice ( start, end );
                        if ( before && after ) spaces [ phName ] = 3  // before and after
                        else if ( after  )     spaces [ phName ] = 2  // only after
                        else if ( before )     spaces [ phName ] = 1  // only before
                        if ( placeholders.hasOwnProperty(phName) ) placeholders [ phName ].push (i)
                        else                                       placeholders [ phName ] = [i]
                   }
            })
    return { spaces, placeholders }
} // findPlaceholders func.

} // lib



module.exports = lib


