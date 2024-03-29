'use strict';





function getHelpLib ({ showError }) {

const help = {
   


    _validateProcess ( engine, processName ) {
      // * Validate process before run. Find if process exists and all templates needed are available.
              let errors = [];
              const 
                      processExists   = engine.processes.hasOwnProperty ( processName )
                    , intProcess = engine.processes[processName]
                    ;
              
              if ( processExists && intProcess['errors'] ) errors = errors.concat( intProcess['errors'])
              
              if ( !processExists )   errors.push ( showError('processNotExists',processName)   )
              else {
                      intProcess['arguments']
                          .reduce ( (listTemplates, step) => { 
                                              if ( step.do == 'draw' && step.tpl )  listTemplates.push ( step.tpl )
                                              return listTemplates
                                      },[])
                          .forEach ( name => {
                                              const tpl = engine.templates[name];
                                              if ( tpl && tpl['errors'] )   errors = errors.concat ( tpl['errors'] )
                                              if ( !tpl )                   errors.push ( showError('templateNotExists',name)   )
                                      })
                  }
              return errors
        } // _validateProcess func.
   
   
   
   , _extractLib ( tpl, libRequst ) { //   (tpl:inTemplates[], libRequest:string[]) -> ExternalTemplate
     // * Creates new ExternalTemplate by removing libName from template name 
              const tplNames = Object.keys ( tpl ).filter ( name => name.includes('/')   );
              let result = {};
            
              if ( libRequst )   result = libRequst.reduce ( (res, libItem ) => {
                                                      tplNames
                                                          .filter  ( name => name.indexOf(libItem) == 0   )
                                                          .forEach ( name => {
                                                                    const 
                                                                          sliceIndex = name.indexOf('/')
                                                                        , prop = name.slice ( sliceIndex+1 )
                                                                        ;
                                                                    
                                                                    res [prop] = tpl[name].tpl.join('')
                                                              })
                                                      return res
                                                },{})
              else {                    
                                const allNames = Object.keys ( tpl );
                                allNames.forEach ( name => result[name] = tpl[name].tpl.join('')   )
                  }
              return result
        } // _extractLib func.
   
   
   
   , _flatten ( data, objects=[], buffer={} ) {
              let
                    result = Object.assign ( {}, buffer )
                  , keyIn = false
                  ;
              if ( !data ) {
                      const [ k, val ] = objects.pop ();
                      keyIn = k
                      data = val
                  }
            
              for ( let key in data ) {
                      const value  = data[key];
                      let   newKey = key;
                      if ( keyIn )   newKey = `${keyIn}/${key}`
                      if ( typeof value == 'function' )   continue   //   Data can't contain functions. Ignore them
                      if ( help._isPrimitive(value)   )   result[newKey] = value
                      else objects.push ([newKey,value])
                  }
          
              if ( objects.length != 0 )   return help._flatten ( false, objects, result )    
              return result
        } // _flatten func.
   
   
   
   , _isPrimitive ( value ) {
              return ( typeof value === 'object' ) ? false : true;
        } // isPrimitive func.
   
    } // help lib
    return help
  } // getHelpLib func.


  
export default getHelpLib


