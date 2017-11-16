'use strict';

const chop = require ('./template-chop');
const findPlaceholders = require ( './template-find-placeholders' );
const errors = require ('./errors' );

/*
    Converts external template formats to internal template format.

    • Import string template
      ( stringTemplate: string ) -> internalTemplate
       internalTemplate: { tpl:string[], placeholders?:indexOfPlaceholders, error?: errorMsg }
       indexOfPlaceholders: { varName: indexInTpl }, errorMsg: string
    
    • Import template as data 
     ({tpl: tplData, placeholders : indexOfPlaceholders }) -> internalTemplate
      tplData: string[], indexOfPlaceholders: { varName: indexInTpl }
      
      tplData can contain text and placeholders.
       Example:
          [
              'Some words from '         //text
            , '{{person}}'               // placeholder
            , ' - See how simple is it'  //text
          ]
      
      varName is extracted value of variable.
        Example:
          variable: {{person}}
           varName: person
    
     • Import template as light data ( template array only )        
      ( tpl: tplData ) -> internalTemplate
        tplData: string[]
*/





function interpret ( tplItem ) {
    const hasPlaceholders = tplItem.hasOwnProperty ('placeholders');
    const hasTpl          = tplItem.hasOwnProperty ('tpl');
    let template = [];

    if ( typeof tplItem == 'string' ) {   // string template
               const strList = chop (tplItem);
               const error = strList.includes ( errors.brokenTemplate );
               let placeholders = {};

               if ( !error ) placeholders = findPlaceholders ( strList )

               template = {
                               tpl: strList
                             , placeholders
                          }
                if ( error ) template.error = errors.brokenTemplate
         }
    else if ( hasPlaceholders && hasTpl ) {   // full data template
              template = Object.assign ( {}, tplItem ) 
         }
    else if ( hasTpl ) {   // light data template
              template.tpl = tplItem.tpl.map(item => item )
              template.placeholders = findPlaceholders ( template.tpl )
         }
    else {
              // error
              template = { error: errors.wrongDataTemplate }
         }
    return template
} // interpret func.



module.exports = interpret;


