'use strict';





function getLibProcess ({ help, showError, processTools }) {

const lib_Process = {

    insert ( ext, name ) { // (ext: extProcess, name: string) -> engine
            const me = this;
        
            if ( help._isWritingForbidden(me,'processes',name) ) {
                    console.error ( showError('overwriteProcess',name) )
                    return
                }
            me.processes[name] = processTools.interpret ( ext )
            return me
        } //   insert func.   -- Process
  
  

  

  , insertLib ( extLib, libName ) {   // ( extProcessLib, string ) -> engine
            const processNames = Object.keys ( extLib );
                
            processNames.forEach ( extName => {
                    const name = ( libName ) ? `${libName}/${extName}` : extName;
                    let actionSteps;          
                    if ( extLib[extName] instanceof Array ) {
                                actionSteps = [].concat(extLib[extName])
                                lib_Process.insert.call ( this, actionSteps, name )
                        }  
            })
            return this
        } //   insertLib func.  -- Process
  
  


  
  , mix ( mixList, newProcessName ) {   //   ( mixList:string[], processName:string ) -> engine
            // * Set new process as combination of existing processes
            const
                    me            = this
                    , processes     = me.processes
                    ;
                    
            let mix = {};   // new process container
            
            if ( help._isWritingForbidden(me,'processes',newProcessName) ) {
                    console.error ( showError('overwriteProcess', newProcessName)  )
                    return
                }
        
            mix.steps = []
            mix.arguments =[]
            mix.hooks = []
            
            mixList.forEach ( requestedName => {
                        if ( !processes[requestedName] ) return
                        const 
                                source = processes[requestedName]
                            , hookNames = source.hooks.map ( name => `${requestedName}/${name}` )
                            , newArguments = source.arguments.map ( arg => { 
                                                        if ( arg.do != 'hook' ) return arg
                                                        return { do: 'hook', name: `${requestedName}/${arg.name}` }
                                                    })
                            ;
                            
                        mix['steps'] = mix['steps'].concat ( source['steps'] )
                        mix['arguments'] = mix['arguments'].concat ( newArguments )
                        mix['hooks'] = mix['hooks'].concat ( hookNames )
                    })
            me.processes[newProcessName] = mix
            return me
        } //   mix func.   -- Process
  
  


  
  , getLib ( name ) {
            // * Extract process library
            const 
                    me = this
                , allKeys = Object.keys ( me.processes )
                , takeEverything = (name) ? false : true
                ;
            const result = allKeys.reduce ( (res,key) => {
                                        if ( !takeEverything ) {
                                                if ( key.includes(name) ) {
                                                        const t = key.split('/');
                                                        t.shift()
                                                        const newKey = t.join('/');
                                                        res[newKey] = me.processes[key]['arguments']
                                                }
                                            }
                                        else res[key] = me.processes[key]['arguments']
                                        return res
                                }, {})
            return result
        } // getLib func.   -- Process
  


  
  
  , rename ( ops ) {   //   ({oldName:newName}) -> engine
            // * Change process names
            const 
                    me = this
                    , list = Object.keys (ops)
                    , doOverwrite = me.config.overwriteProcesses
                    ;
        
            list.forEach ( key => {
                            if ( !me.processes[key] )   return
                            const 
                                newKey = ops[key]
                                , keyAlreadyDefined = (me.processes[newKey]) ? true : false
                                ;
        
                            if ( keyAlreadyDefined && !doOverwrite ) {
                                console.error ( showError('overwriteProcess', newKey) )
                                return
                                }
                            else {
                                me.processes[newKey] = me.processes[key]
                                delete me.processes[key]
                            }
                    })
            return me
        } // rename func.   -- Process
  


  
  
  , remove (  processName ) {   //   ( processName:string|string[]) -> engine
            const me = this;
            let listDelete;
            
            if ( processName instanceof Array ) listDelete = processName
            else {
                    const t = Object.keys ( arguments );
                    listDelete = t.map ( k => arguments[k] )
                }
            
            listDelete.forEach ( item => delete me.processes[item])
            return me
        } // remove func.   -- Process
  
  
  


  , getHooks ( processName ) { //   (processName) -> { hookName : undefined }
  // *** Returns an object with all hook names defined in the process.
            const recordExists = this.processes.hasOwnProperty ( processName );
            if ( recordExists )  { 
                        const hooks = this.processes[ processName ].hooks;  
                        return hooks.reduce ( (res, name) => {
                                        res[name] = undefined
                                        return res
                                },{})
                }
            else      return {}
        } //   getHooks func.   -- Process
  
  
  
  , run ( processList, data, hooks ) {   
            if ( !(processList instanceof Array ))   processList = [processList]
            let 
                internalData
                , error = processList.reduce ( (res, processName ) => {
                                            const errorUpdate = help._validateProcess(this, processName);
                                            return res.concat ( errorUpdate )
                                },[])
                ;
            if ( data == null )                    internalData = [{}]
            else if ( !(data instanceof Array) )   internalData = [data]
            else                                   internalData = data
        
            if ( error.length == 0 )  {
                    let current = internalData;
                    processList.forEach ( processName => {
                        current = processTools.run.call ( this, this.processes[processName], current, hooks )
                    })
                    return current
                }
            else {
                    console.error ( error )
                    return error
                }
        } //   run func.   -- Process
  
  }   // lib_Process lib
  return lib_Process
} // getLibProcess func.



module.exports = getLibProcess


