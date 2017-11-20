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
    let placeholders = {}

    if ( !error )   placeholders = lib._findPlaceholders ( r )

    const template = {
                        tpl:r
                      , placeholders
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



, _findPlaceholders : function ( tplArray ) {
    const placeholders = {};
    tplArray.forEach ( (item,i) => {
                if ( item.slice(0,2) == '{{' ) {
                        const phName = item.slice ( 2, -2)
                        if ( placeholders.hasOwnProperty(phName) ) placeholders [ phName ].push (i)
                        else                                       placeholders [ phName ] = [i]
                   }
            })
    return placeholders
} // findPlaceholders func.

} // lib



module.exports = lib


