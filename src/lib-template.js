


function getLibTemplate ({ help, templateTools, showError }) {
   
   const 
          str2intTemplate   = templateTools.str2intTemplate
        , interpretTemplate = templateTools.load_interpretTemplate ( str2intTemplate )
        ;

   const lib_Template = {

    insert ( extTemplate, method='add' ) {   // (ExternalTemplate,saveMethod) -> engine
      /**
       *  saveMethod: enum. Values: add | update | heap | overwrite
       */
        let 
            me = this
          , templateNames = Object.keys( extTemplate )
          ;
    
        templateNames.forEach ( name => {
                const hasField = (me.templates [name] != null) ? true : false;
                      
                if (  hasField && method == 'add'    )   return
                if ( !hasField && method == 'update' )   return
                if (  hasField && method == 'heap'   ) { 
                                                        let 
                                                              existingTpl = me.templates[name].tpl.join('')
                                                            , newTemplate = existingTpl + ' ' + extTemplate[name]
                                                            ;
                                                        me.templates [ name ] = interpretTemplate ( newTemplate )
                                                        return
                    }
                me.templates [ name ] = interpretTemplate ( extTemplate[name] )
            })
        return me       
    } //   insert func.   -- Template
    
    
    
    , insertLib ( extLib, libName, method='add' ) {  //   ( ExternalTemplate,  string ) -> engine
      let 
             me = this
          ,  simpleTemplates = Object.keys ( extLib )
          ;
    
      simpleTemplates.forEach ( extName => {
                                const 
                                        newTpl = {}
                                      , name = `${libName}/${extName}`
                                      ;
                                newTpl[name] = extLib[extName]
                                lib_Template.insert.call ( me, newTpl, method )
                        })
      return me
    } //   insertLib func.  -- Template
    
    
    
    , rename ( ops ) { //   ({oldName:newName}) -> engine
      // * Change template names
      const 
              me = this
            , list = Object.keys (ops)
            , doOverwrite = me.config.overwriteTemplates
            ;
      list.forEach ( key => {
            if ( !me.templates[key] ) return
            const 
                    newKey = ops[key]
                  , keyExists = (me.templates[newKey]) ? true : false
                  ;
            
            if ( keyExists && !doOverwrite ){
                    console.error ( showError('overwriteTemplate') )
                    return
                 }
            else {
                    me.templates[newKey] = me.templates[key]
                    delete me.templates[key]
              }
        })
      return me
    } //   rename func.   -- Template
    
    
    
    , remove ( tplName ) {   //   ( tplName:string|string[]) -> engine
      const me = this;
      let listDelete;
    
      if ( tplName instanceof Array ) listDelete = tplName
      else {
              const t = Object.keys ( arguments );
              listDelete = t.map ( k => arguments[k] )
           }
      
      listDelete.forEach ( item => delete me.templates[item])
      return me
    } //   remove func.   -- Template
    
    
    
    , get ( tplName ) { // (tplName: string|string[]) -> ExternalTemplate
     const 
           me = this
         , tpl = me.templates
         ;
     let tplRequst;
    
     if ( tplName instanceof Array )   tplRequst = tplName
     else {
             const t = Object.keys ( arguments );
             tplRequst = t.map ( k => arguments[k] )
          }
     
     return tplRequst.reduce ( (res, item ) => {
                         if ( tpl[item] ) res[item] = tpl[item].tpl.join('')
                         else             res[item] = ''
                         return res
                   },{})
    
    } //   get func.   -- Template
    
    
    
    , getLib ( libName ) { //   (libName:string|string[]|undefind) -> ExternalTemplate
     const 
              me = this
            , takeEverything = libName ? false : true
            ;
     let libRequst;
    
     if      ( libName == null )            libRequst = null
     else if ( libName instanceof Array )   libRequst = libName
     else {
             const t = Object.keys ( arguments );
             libRequst = t.map ( k => arguments[k] )
          }
     
     return help._extractLib ( me.templates, libRequst )
    } // getLib func.   -- Template
    
    
    
    , getPlaceholders ( templateName ) { //   (templateName:string) -> placeholderNames:string[].
      const tpl = this.templates [ templateName ];
    
      if ( tpl )  return Object.keys ( tpl.placeholders )
      else        return []
    } // getPlaceholders func.   -- Template
    
    } //   lib_Template lib
    return lib_Template
} // getLibTemplate func.


    module.exports = getLibTemplate