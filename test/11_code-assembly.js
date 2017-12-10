'use strict'

const 
        chai         = require ('chai')
      , expect       = chai.expect
      , CodeAssemblyLine = require ( '../src/index'  )
      , errors       = require ( '../src/errors' )
      ;


describe ( 'Code Assembly', () => {
    
    it ( 'Start Code Assembly', () => {
        const tplEngine = new CodeAssemblyLine ();

        expect ( tplEngine ).have.property ( 'templates' )
        expect ( tplEngine ).have.property ( 'processes' )
        expect ( tplEngine ).have.property ( 'data'      )
    }) // it start code Assembly
    


    it ( 'Insert Template Library', () => {
      const
              tplEngine = new CodeAssemblyLine ()
            , tplLib = {
                              'hello' : 'Hello {{user}}'
                            , 'bye'   : 'Good bye {{user}}'
                        }
            , tplLib2 = {
                             'hello'   : 'Hi {{user}}'
                           , 'welcome' : 'Welcome {{user}}'
                        }
            ;

      tplEngine.insertTemplateLib ( tplLib, 'custom'  )
      tplEngine.insertTemplateLib ( tplLib2, 'custom' )

      expect ( tplEngine.templates ).to.have.property ('custom/hello'   )
      expect ( tplEngine.templates ).to.have.property ('custom/bye'     )
      expect ( tplEngine.templates ).to.have.property ('custom/welcome' )
      const tpl = tplEngine.getTemplate ( 'custom/hello' );
      expect ( tpl['custom/hello'] ).to.be.equal ( tplLib.hello )
    }) // it insert template library

    

    it ( 'Get Template', () => {
      const
              tplEngine = new CodeAssemblyLine ()
            , tpl       = {
                              'hello' : 'Hello {{user}}'
                            , 'bye'   : 'Good bye {{user}}'
                          }
            ;

      tplEngine.insertTemplate ( tpl )
      const 
            single   = tplEngine.getTemplate ( 'hello' )
          , multiple = tplEngine.getTemplate ( 'hello', 'bye', 'dummy' )
          , altMultiple = tplEngine.getTemplate (['hello', 'bye'])
          ;

      expect ( single ).to.have.property ( 'hello' )
      expect ( single.hello ).to.be.a ( 'string' )
      expect ( single.hello ).to.be.equal ( tpl.hello )

      expect ( multiple ).to.have.property ( 'hello' )
      expect ( multiple ).to.have.property ( 'bye' )
      expect ( multiple ).to.have.property ( 'dummy' )
      expect ( multiple.hello ).to.be.a ( 'string' )
      expect ( multiple.bye   ).to.be.a ( 'string' )
      expect ( multiple.dummy ).to.be.empty

      expect ( multiple.hello ).to.be.equal ( tpl.hello )
      expect ( multiple.bye   ).to.be.equal ( tpl.bye )
      
      expect ( altMultiple.hello ).to.be.equal ( multiple.hello )
      expect ( altMultiple.bye   ).to.be.equal ( multiple.bye )
    }) // it getTemplate
    


    it ( 'Get Template Library' , () => {
      const
              tplEngine = new CodeAssemblyLine ()
            , tpl       = { 'hi': 'Hi {{user}}' }
            , tplLib    = {
                              'hello' : 'Hello {{user}}'
                            , 'bye'   : 'Good bye {{user}}'
                          }
            ;

      tplEngine.insertTemplate ( tpl )
      tplEngine.insertTemplateLib ( tplLib, 'test' )
      
      const 
          result = tplEngine.getTemplateLib ('test')
        , alt    = tplEngine.getTemplateLib (['test'])
        ;

      expect ( result ).to.have.property ( 'hello' )
      expect ( result ).to.have.property ( 'bye' )
      expect ( result ).to.not.have.property ( 'hi' )
      expect ( result.hello ).to.be.equal ( tplLib.hello )
      expect ( result.bye ).to.be.equal ( tplLib.bye )

      expect ( alt ).to.have.property ( 'hello' )
      expect ( alt ).to.have.property ( 'bye' )
    }) // it getTemplateLib
    


    it ( 'Get Placeholders', () => {
       const
             tplEngine = new CodeAssemblyLine ()
             , tpl = {
                        'hello': 'Hello {{user}}. Welcome to {{place}}'
                     }
             ;

        tplEngine.insertTemplate ( tpl )
        const result   = tplEngine.getPlaceholders ( 'hello' )
        const emptyRes = tplEngine.getPlaceholders ( 'fail'  )

        expect ( result ).to.be.an ( 'array' )
        expect ( result ).to.includes ( 'user' )
        expect ( result ).to.includes ( 'place' )

        expect ( emptyRes ).to.be.an ( 'array' )
        expect ( emptyRes ).to.be.empty
    }) // it getPlaceholders



    it ( 'Template rename normal', () => {
      const
                 tplEngine = new CodeAssemblyLine ()
               , tpl = {
                            'hello' : 'Hello {{user}}'
                          , 'bye'   : 'Good bye {{user}}'
                       }
               , instructions = { 'hello':'sayHello', 'bye': 'sayGoodbye' }
               ;
      
      tplEngine.insertTemplate ( tpl )
      tplEngine.renameTemplate ( instructions )

      expect ( tplEngine.templates).to.have.property ( 'sayHello'   )
      expect ( tplEngine.templates).to.have.property ( 'sayGoodbye' )
      expect ( tplEngine.templates).to.not.have.property ( 'hello'  )
      expect ( tplEngine.templates).to.not.have.property ( 'bye'    )
    }) // it template rename normal
    
    
    
    it ( 'Template rename with overwrite', () => {
        const
                  tplEngine = new CodeAssemblyLine ()
                , tpl = {
                              'hello'    : 'Hello {{user}}'
                            , 'bye'      : 'Good bye {{user}}'
                            , 'sayHello' : 'Should stay'
                        }
                , instructions = { 'hello':'sayHello', 'bye': 'sayGoodbye'}
                ;
        const tt = new CodeAssemblyLine()
        tplEngine.insertTemplate ( tpl )
        tplEngine.renameTemplate ( instructions )

        expect ( tplEngine.templates).to.have.property ( 'hello'  )
        expect ( tplEngine.templates).to.have.property ( 'sayHello'   )
        expect ( tplEngine.templates).to.have.property ( 'sayGoodbye' )
        expect ( tplEngine.templates).to.not.have.property ( 'bye'    )      
    }) // it template rename with overwrite
    


    it ( 'Rename a non existing template')



    it ( 'Remove Template', () => {
      const
               tplEngine = new CodeAssemblyLine ()
               , tpl = {
                            'hello' : 'Hello {{user}}'
                          , 'bye'   : 'Good bye {{user}}'
                       }
        
      tplEngine.insertTemplate ( tpl )
      tplEngine.removeTemplate ( 'hello' )
        
      expect ( tplEngine.templates ).have.property('bye')
      expect ( tplEngine.templates ).not.have.property('hello')
    }) // it remove template

    

    it ( 'Remove list of templates with array ', () => {
      const
               tplEngine = new CodeAssemblyLine ()
               , tpl = {
                            'hello' : 'Hello {{user}}'
                          , 'bye'   : 'Good bye {{user}}'
                       }
        
      tplEngine.insertTemplate ( tpl )
      tplEngine.removeTemplate ( ['hello'] )
        
      expect ( tplEngine.templates ).have.property('bye')
      expect ( tplEngine.templates ).not.have.property('hello')
    }) // it remove list of templates with array
    


    it ( 'Insert Process', () => {
        const
                tplEngine = new CodeAssemblyLine ()
              , process = [ { do: 'draw' , tpl: 'some'} ]
              , altProcess = [ {do:'draw', tpl: 'alt' } ]
              ;
        
        tplEngine.insertProcess ( process, 'test' )
        tplEngine.insertProcess ( altProcess, 'test' )

        expect ( tplEngine.processes ).to.have.property ('test')
        expect ( tplEngine.processes['test'] ).to.have.property ('steps'    )
        expect ( tplEngine.processes['test'] ).to.have.property ('arguments')
        expect ( tplEngine.processes['test'] ).to.have.property ('hooks'    )
        expect ( tplEngine.processes['test']['arguments'][0]['tpl']).to.be.equal('some')
        expect ( tplEngine.processes['test']['arguments'][0]['tpl']).to.not.be.equal('alt')
    }) // it insert process 
    


    it ( 'Mix Process', () => {
      const
              tplEngine = new CodeAssemblyLine ()
            , liProcess = [ 
                                { do: 'draw', tpl: 'link'}
                              , { do: 'set', as: 'text'}
                              , { do: 'draw' , tpl: 'li'  } 
                              , { do: 'hook' , name: 'navButtons'}                       
                          ]
            , ulProcess = [ {do:'draw', tpl: 'ul'} ]
            , ulTransition = [ 
                                  { do: 'set', as: 'text'}
                                , { do: 'block' } 
                             ]
            ;

      tplEngine.insertProcess ( liProcess, 'li')
      tplEngine.insertProcess ( ulProcess, 'ul')
      tplEngine.insertProcess ( ulTransition, 'ulTransition')
      tplEngine.mixProcess ( ['li', 'ulTransition', 'ul'], 'navigation' )
      tplEngine.mixProcess ( ['li','fail'],'navigation' )
      const res = tplEngine.processes['navigation'];

      expect ( res['steps'] ).to.have.length (7)
      expect ( res['arguments'] ).to.have.length (7)
      expect ( res['hooks'] ).to.have.length (1)
      expect ( res['hooks'][0]).to.be.equal ( 'li/navButtons' )
      expect ( res['arguments'][3]['name']).to.be.equal ( 'li/navButtons' )

      expect ( tplEngine.processes['li']['hooks'][0] ).to.be.equal('navButtons')
    }) // it mix process
    
    
    
    it ( 'Get existing hooks', () => {
        const
        tplEngine   = new CodeAssemblyLine()
      , templateLib = { random: 'Some text with {{place}}.' }
      , processData =  [ 
                              { do: 'draw', tpl: 'random' } 
                            , { do: 'hook', name: 'testingHook' }
                       ]                                                       
      , renderData  = [{ place: 'test string'}]
      ;

      tplEngine.insertProcess ( processData, 'test')
      tplEngine.insertTemplate ( templateLib )

      const result = tplEngine.getHooks ( 'test' )

      expect ( result ).to.have.property ( 'testingHook' )
      expect ( result['testingHook'] ).to.be.undefined
    }) // it get existing hooks
   
   
   
    it ( 'Get non existing hooks', () => {
        const
        tplEngine   = new CodeAssemblyLine()
      , templateLib = { random: 'Some text with {{place}}.' }
      , processData =  [ 
                              { do: 'draw', tpl: 'random' } 
                       ]                                                       
      , renderData  = [{ place: 'test string'}]
      ;

      tplEngine.insertProcess ( processData, 'test')
      tplEngine.insertTemplate ( templateLib )

      const result = tplEngine.getHooks ( 'test' )

      expect ( result ).to.be.empty
    }) // it get existing hooks
    
    
    
    it ( 'Get hooks of non existing process', () => {
        const
        tplEngine   = new CodeAssemblyLine()
      , templateLib = { random: 'Some text with {{place}}.' }
      , processData =  [ 
                              { do: 'draw', tpl: 'random' } 
                       ]                                                       
      , renderData  = [{ place: 'test string'}]
      ;

      tplEngine.insertProcess ( processData, 'test')
      tplEngine.insertTemplate ( templateLib )

      const result = tplEngine.getHooks ( 'fail' )

      expect ( result ).to.be.empty
    }) // it get hooks of non existing process

}) // describe Run