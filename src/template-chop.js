"use strict";

const showError = require ('./errors');

/*
     Converts string template to internal template format
     ( text: string ) -> string[]

*/



function chopTemplate ( text ) {  

    let 
        start      // placeholder start
      , end        // placeholder end
      , checkPoint // check 
      , res = []   // template result array
      ;

    if ( typeof(text) != 'string' ) return [ showError('brokenTemplate') ]
    if ( text.length == 0 ) return []

    start = text.indexOf ( '{{' )
    if ( 0 < start )  res.push ( text.slice(0, start) )
    if ( -1 == start ) {
                res.push( text  )
                return res;
         }
    else {
                checkPoint = text.indexOf ( '{{', start+2 )
                end = text.indexOf("}}")

                if ( end < start ) return [ showError('brokenTemplate') ] // Placeholder closing tags without starting ones
                if ( end == -1   ) return [ showError('brokenTemplate') ] // Placeholder with missing closing tags
                else               end += 2 

                if ( checkPoint != -1 && checkPoint < end ) {
                     // New placeholder before first ends
                     return [ showError('brokenTemplate') ]
                   }

                res.push( text.slice(start,end) )
                let nextText = text.slice (end)
                let additional = chopTemplate ( nextText )
                return res.concat ( additional )
         }
} // chopTemplate func.



module.exports = chopTemplate;


