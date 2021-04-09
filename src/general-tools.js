'use strict';

const tools = {

renameTemplate : function ( extLib, mod ) {  //   (externalTemplate, mod{}) -> externalTemplate
// * Change-name tool for externalTemplate object
// mod - { existingTemplateName: newTemplateName }
    const 
            updateKeys = Object.keys ( mod )
        , existingKeys = Object.keys ( extLib )
        ;
    
    return existingKeys.reduce ( (res,key) => {
                    if ( updateKeys.includes(key) ) res [ mod[key]] = extLib[key]
                    else                            res [ key     ] = extLib[key]
                    return res
            },{})
} // modifyTemplate func.

} // tools



module.exports = tools


