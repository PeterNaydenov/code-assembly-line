'use strict'

const 
        chai             = require ('chai')
      , expect           = chai.expect
      , CodeAssemblyLine = require ( '../index'  )
      , errors           = require ( '../errors' )
      ;



describe ( 'Run', () => {
    
    it ( 'Draw. Valid operation', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.' }
              , processData =  [ 
                                      { do: 'draw', tpl: 'random' } 
                                    , { do: 'block' }
                               ]                                                       
              , renderData  = [{ place: 'test string'}]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'Some text with test string.' )
    }) // it Draw. Valid operation
    
    
    
    it ( 'Draw with a non existing template.', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , tplName     = 'random'
              , processData =  [ { do: 'draw', tpl: tplName } ]                                                       
              , renderData  = [{ place: 'test string'}]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( `Error: Template "${tplName}" is not available` )        
    }) // it Draw with a non existing template.



    it ( 'Alter template', () => {
        const
                 tplEngine = new CodeAssemblyLine ()
               , tpl = { test: 'Find {{who}}!' }
               , data = { name: 'Peter' }
               , processData = [
                                   { do: 'alterTemplate', tpl:'test', data: { 'who':'name'}  }
                                 , { do: 'draw', tpl: 'test' }
                                ]
               ;
        
        tplEngine.insertTemplate ( tpl )
        tplEngine.insertProcess ( processData, 'change' )

        const result = tplEngine.run ( 'change', data )
        expect ( result[0] ).to.be.equal ( 'Find Peter!' )
    }) // it alter template
    
    
    
    it ( 'Write Block', () => {
        const
                  tplEngine = new CodeAssemblyLine ()
                , tpl = { test: 'Find {{who}}!' }
                , blockName = 'finding'
                , data = [
                             { name: 'Peter' }
                           , { name: 'Ivan' }
                         ]
                , processData = [
                                      { do: 'alterTemplate', tpl:'test', data: { 'who':'name'}  }
                                    , { do: 'draw', tpl: 'test' }
                                    , { do: 'block', name: blockName }
                                ]
                ;
                    
        tplEngine.insertTemplate ( tpl )
        tplEngine.insertProcess ( processData, 'change' )
                    
        const result = tplEngine.run ( 'change', data );
        expect ( tplEngine.data.blocks ).to.have.property ( blockName )
    }) // it write block
                
                
                
    it ( 'Set', () => {
        const
                  tplEngine = new CodeAssemblyLine()
                , tpl = { test: 'Find {{who}}!' }
                , data = [ 'Peter', 'Ivan' ]
                , processData = [
                                    { do: 'set', as: 'who'}
                                  , { do: 'draw', tpl: 'test' }
                                ]
                ;
        tplEngine.insertTemplate ( tpl )
        tplEngine.insertProcess ( processData, 'findList' )

        const result = tplEngine.run ( 'findList', data )

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.be.equal ( 'Find Peter!' )
        expect ( result[1] ).to.be.equal ( 'Find Ivan!' )
    }) // it set

}) // describe Run