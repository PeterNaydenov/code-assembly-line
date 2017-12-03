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



    it ( 'Draw templates with _attr', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { 
                                link: '<a{{_attr}}>{{text}}<a/>' 
                              }
              , processData =  [ 
                                      { do: 'draw', tpl: 'link' } 
                                    , { do: 'block' }
                               ]                                                       
              , renderData  = [
                                { text: 'Test link', href: '#link', className:'hello'}
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( '<a href="#link"  class="hello">Test link<a/>' )
    }) // it Draw templates with _attr



    it ( 'Draw with missField: string', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missField: 'ERROR!' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'Some text with test string.ERROR!' )
        expect ( result[2] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missField string.
    
    
    
    it ( 'Draw with missField: _hide', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missField:'_hide' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'Some text with test string.' )
        expect ( result[2] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missField _hide.



    it ( 'Draw with missField: _fn', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missField:'_fn', hook: 'ole' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData , { ole: (x) => `Error: Missing data - ${x}` } )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'Some text with test string.Error: Missing data - more' )
        expect ( result[1] ).to.be.equal ( 'Some text with ala-bala.Error: Missing data - more' )
        expect ( result[2] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missField: _fn.



    it ( 'Draw with missField: _fn but missing hook', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missField:'_fn', hook: 'ole' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData , { oled: (x) => `Error: Missing data - ${x}` } )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'Some text with test string.' )
        expect ( result[2] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missField: _fn but missing hook.



    it ( 'Draw with missField: _fn but no hook object', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missField:'_fn', hook: 'ole' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'Some text with test string.' )
        expect ( result[2] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missField: _fn but no hook object.



    it ( 'Draw with missData: _fn.', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missData:'_fn', hook: 'ole' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData , { ole: (x) => `Error: Missing data - ${x.join(',')}` } )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'Error: Missing data - more' )
        expect ( result[1] ).to.be.equal ( 'Error: Missing data - more' )
        expect ( result[2] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missData: _fn.



    it ( 'Draw with missData: _fn. but no hook function', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missData:'_fn', hook: 'ole' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData , { oled: (x) => `Error: Missing data - ${x.join(',')}` } )

        expect ( result ).to.be.an ('array')
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missData: _fn but no hook function.



    it ( 'Draw with missData: _fn. but no hooks', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missData:'_fn', hook: 'ole' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missData: _fn but no hooks.



    it ( 'Draw with missData: _hide', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missData:'_hide' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missData: _hide.



    it ( 'Draw with missData: string', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { random: 'Some text with {{place}}.{{more}}' }
              , processData = [ 
                                      { do: 'draw', tpl: 'random', missData:'ERROR' } 
                              ]                                                       
              , renderData  = [
                                   { place: 'test string'}
                                 , { place: 'ala-bala' }
                                 , { place: 'pasion', more: 'Great to be here' }
                              ]
              ;
        
        tplEngine.insertProcess ( processData, 'test')
        tplEngine.insertTemplate ( templateLib )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result ).to.have.length (3)
        expect ( result[0] ).to.be.equal ( 'ERROR' )
        expect ( result[1] ).to.be.equal ( 'ERROR' )
        expect ( result[2] ).to.be.equal ( 'Some text with pasion.Great to be here' )
    }) // it Draw with missData: string.
    
    
    
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

        expect ( tplEngine.data ).to.have.property ( `block/${blockName}` )
    }) // it write block
   
   
   
    it ( 'Can not overwrite Block', () => {
        const
                  tplEngine = new CodeAssemblyLine ()
                , tpl = { test: 'Find {{who}}!' }
                , blockName = 'finding'
                , data = [
                             { name: 'Peter' }
                           , { name: 'Ivan' }
                         ]
                , altData     = [ { name: 'Joseph'} ]
                , processData = [
                                      { do: 'alterTemplate', tpl:'test', data: { 'who':'name'}  }
                                    , { do: 'draw', tpl: 'test' }
                                    , { do: 'block', name: blockName }
                                ]
                , badProcess = [ { do: 'block', name: 'bad' } ]
                ;
                    
        tplEngine.insertTemplate ( tpl )
        tplEngine.insertProcess ( processData, 'processData' )
        tplEngine.insertProcess ( badProcess, 'badProcess' )
                    
        tplEngine.run ( 'badProcess', data )
        tplEngine.run ( 'processData', data )
        tplEngine.run ( 'processData', altData )

        const D = tplEngine.data;
        expect ( D ).to.have.property ( `block/${blockName}` )
        expect ( D[`block/${blockName}`] ).to.be.equal ( 'Find Peter!Find Ivan!' )
        expect ( D ).to.not.have.property ( 'bad' )
    }) // it can not overwrite block



    it ( 'Save Template', () => {
        const
                  tplEngine = new CodeAssemblyLine ()
                , tpl = { test: 'Find {{who}}!' }
                , blockName = 'finding'
                , processData = [
                                      { do: 'draw', tpl: 'test' }
                                    , { do: 'save', as:'template', name: blockName }
                                ]
                ;

        tplEngine.insertTemplate ( tpl )
        tplEngine.insertProcess ( processData, 'change' )
        
        tplEngine.run ( 'change', [{name:'Peter'},{name:'Ivan'}] );
        
        const templates = tplEngine.templates;
        expect ( templates ).to.have.property ( blockName )
        const test =  templates[blockName]['tpl'].join('');
        expect ( test ).to.be.equal ( tpl.test )
    }) // it save template



    it ( 'Save Process, save Block', () => {
        const
                  tplEngine    = new CodeAssemblyLine ()
                , testTPL      = 'Find {{who}}!'
                , renderBlock  = `[
                                      { "do": "draw", "tpl": "{{tpl}}" }
                                    , { "do": "save", "as": "block", "name": "{{name}}" }
                                  ]`
                , setBlock = [
                                     { do: 'draw', tpl: 'renderBlock' }
                                   , { do: 'save', as: 'process', name: 'build/block' }
                                ]
                ;

        tplEngine.insertTemplate ({ 
                                        renderBlock
                                      , test : testTPL
                                  })
        tplEngine.insertProcess ( setBlock, 'setBlock' )
        
        tplEngine.run ( 'setBlock', { name: 'first', tpl:'test' } )
        tplEngine.run ( 'build/block', { who: 'Peter' })
 
        const processes = tplEngine.processes;
        expect ( processes ).to.have.property ( 'setBlock'    )
        expect ( processes ).to.have.property ( 'build/block' )
        expect ( tplEngine.data ).to.have.property ( 'block/first' )
    }) // it save process, save Block



    it ( 'Save as Data', () => {
        const
                  tplEngine   = new CodeAssemblyLine ()
                , testTPL     = 'Find {{who}}!'
                , findWho     = '{{findWho}}' 
                , setData = [
                                     { do: 'draw', tpl: 'test' }
                                   , { do: 'save', as: 'data', name: 'findWho' }
                                ]
                , renderMyBlock = [
                                     { do: 'draw', tpl: 'findWho' }
                                   , { do: 'save', as: 'block', name: 'myBlock' }
                                ]
                ;

        tplEngine.insertTemplate ({  test : testTPL, findWho })
        tplEngine.insertProcess ( setData, 'setData' )
        tplEngine.insertProcess ( renderMyBlock, 'renderMyBlock' )
        
        tplEngine.run ( 'setData', { who: 'Peter' } )
        tplEngine.run ( 'renderMyBlock' )

        const result = tplEngine.data;
        expect ( result ).to.have.property ( 'findWho'       )
        expect ( result ).to.have.property ( 'block/myBlock' )
        expect ( result['findWho']).to.be.equal ( result['block/myBlock'])
    }) // it save as Data


    
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



    it ( 'List of processes', () => {
        const
                  tplEngine = new CodeAssemblyLine()
                , tpl = { test: 'Find {{who}}!' }
                , data = [ 'Peter', 'Ivan' ]
                , processSetData = [ { do: 'set', as: 'who'    }]
                , processDraw    = [ { do: 'draw', tpl: 'test' }]
                ;
        
        tplEngine.insertTemplate ( tpl )
        tplEngine.insertProcess( processSetData, 'setData')
        tplEngine.insertProcess( processDraw, 'draw' )
        const result = tplEngine.run ( ['setData','draw'], data )

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.be.equal ( 'Find Peter!' )
        expect ( result[1] ).to.be.equal ( 'Find Ivan!' )
    }) // it list of processes



    it ( 'Consume "data" for missing fields', () => {
       const
               tplEngine = new CodeAssemblyLine()
             , tpl = { test : 'Find {{who}}! Address: {{location}}' }
             , data = [ 
                            { who: 'Peter', 'location' : 'Bulgaria,Sofia' }
                          , { who: 'Ivan' }
                      ]
             , processDraw = [{ do: 'draw', tpl: 'test' }]
             , defaultLocation = 'Location unknown'
             ;

      tplEngine.insertTemplate ( tpl )
      tplEngine.insertProcess ( processDraw, 'draw' )
      tplEngine.insertData ({'location': defaultLocation })

      const result = tplEngine.run ( 'draw', data )
      expect ( result[1] ).to.be.equal ( `Find Ivan! Address: ${defaultLocation}` )
    }) // it consume "data" for missing fields

}) // describe Run