'use strict'

const 
        chai             = require ('chai')
      , expect           = chai.expect
      , CodeAssemblyLine = require ( '../src/index'  )
      , showError        = require ( '../src/errors' )
      ;



describe ( 'Run', () => {
    


    it ( 'Process has error', () => {
      const 
             tplEngine = new CodeAssemblyLine()
           , fakeProcess = [{tpl:'fake'}]
           ;
      
      tplEngine.insertProcess ( fakeProcess, 'fake')
      const result = tplEngine.run ( 'fake' )

      expect ( result ).to.be.an('array')
      expect ( result[0] ).to.be.equal( showError('missingOperation') )
    }) // it Process has error



    it ( 'Template has error', () => {
      const
            tplEngine = new CodeAssemblyLine()
          , brokenTpl = { 'break' : 'Something}} {{broken'}
          , drawBreak  = [ { do:'draw', tpl:'break'}   ]
          ;
      
      tplEngine.insertTemplate ( brokenTpl )
      tplEngine.insertProcess ( drawBreak, 'drawBreak' )
      
      const result = tplEngine.run ( 'drawBreak' );
      expect ( result ).to.be.an('array')
      expect ( result[0] ).to.be.equal ( showError('brokenTemplate') )
    }) // it Template has error



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



    it ( 'Draw. Enrich data', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , simple = 'Some text with {{place}}.'
              , complex  = '{{place}}: {{text}}'
              , processTest =  [ 
                                      { do: 'draw', tpl: 'simple', as: 'text' }
                                    , { do: 'draw', tpl: 'complex'  }
                                    , { do: 'block', name: 'result' }
                               ]                                                       
              , renderData  = [{ place: 'test string'}]
              ;
        
        tplEngine.insertProcess ( processTest, 'test')
        tplEngine.insertTemplate ( {simple, complex} )
        
        const result = tplEngine.run ( 'test', renderData )

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( 'test string: Some text with test string.' )
    }) // it Draw. Enrich data




    it ( 'Draw templates with _attr', () => {
        const
                tplEngine   = new CodeAssemblyLine()
              , templateLib = { 
                                link: '<a {{_attr}}>{{text}}<a/>' 
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



    it ( 'Try to save as a process invalid JSON', () => {
        const
                  tplEngine    = new CodeAssemblyLine ()
                , testTPL      = 'Find {{who}}!'
                , renderBlock  = `{
                                       'name': "{{name}}" 
                                  }`
                , setBlock = [
                                     { do: 'draw', tpl: 'renderBlock' }
                                   , { do: 'save', as: 'process', name: 'result' }
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
        expect ( processes ).to.not.have.property ( 'result' )
    }) // it Try to save as a process invalid JSON 



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



    it ( 'Save as non existing item', () => {
        const
                  tplEngine   = new CodeAssemblyLine ()
                , testTPL     = 'Find {{who}}!'
                , renderMyBlock = [
                                     { do: 'draw', tpl: 'test' }
                                   , { do: 'save', as: 'memo', name: 'myBlock' }
                                ]
                ;

        tplEngine.insertTemplate ({  test : testTPL })
        tplEngine.insertProcess ( renderMyBlock, 'renderMyBlock' )
        
        const result = tplEngine.run ( 'renderMyBlock', { who: 'Peter' } )

        expect ( result[0] ).to.be.equal ( 'Find Peter!')
        expect ( tplEngine           ).to.not.have.property ( 'memo' )
        expect ( tplEngine.data      ).to.not.have.property ( 'memo' )
        expect ( tplEngine.templates ).to.not.have.property ( 'memo' )
        expect ( tplEngine.processes ).to.not.have.property ( 'memo' )
    }) // it save as non existing item


    
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


    it ( 'Hook', () => {
      const
              tplEngine = new CodeAssemblyLine ({ overwriteData: true})
            , simple = 'Just simple text, {{name}}!'
            , processWithHook = [
                                      { do: 'draw', tpl: 'simple' }
                                    , { do: 'hook', name: 'afterSimple' }
                                    , { do: 'block', name: 'result' }
                                 ]
            ;
      
      const hookFn  = function ( ) { return 'ala-bala' };
      const hookAlt = function ( ) { return ['brum-brum']};
      
      tplEngine.insertProcess  ( processWithHook, 'withHook' )
      tplEngine.insertTemplate ( {simple} )

      const hookObject = tplEngine.getHooks ( 'withHook' );
      hookObject['afterSimple'] = hookFn
      tplEngine.run ( 'withHook', {name:'Johny'}, hookObject )
      
      const  D = tplEngine.data;
      expect ( D ).to.have.property ( 'block/result' )
      expect ( D['block/result'] ).to.be.equal ('ala-bala')

      hookObject['afterSimple'] = hookAlt
      tplEngine.run ( 'withHook', {name:'Johny'}, hookObject )
      expect ( D['block/result'] ).to.be.equal ('brum-brum')
    }) // it hook



    it ( 'Draw templates with _count placeholder', () => {
        const
                tplEngine = new CodeAssemblyLine()
              , userName = '{{_count}}. User: {{name}},{{_count}}'
              , data = ['Peter', 'Ivan', 'Ivo', 'Stefan' ]
              , processUserList = [
                                      { do: 'set', as: 'name' }
                                    , { do: 'draw', tpl:'userName'}
                                  ]
              ;

        tplEngine.insertTemplate ( {userName})
        tplEngine.insertProcess ( processUserList, 'userList' )

        const result = tplEngine.run ( 'userList', data );

        expect ( result ).to.be.an ('array')
        expect ( result[0] ).to.be.equal ( '1. User: Peter,1'  )
        expect ( result[1] ).to.be.equal ( '2. User: Ivan,2'   )
        expect ( result[2] ).to.be.equal ( '3. User: Ivo,3'    )
        expect ( result[3] ).to.be.equal ( '4. User: Stefan,4' )
    }) //   it Draw templates with _count placeholder



    it ( 'Whitespaces with external data', () => {
        const
                tplEngine = new CodeAssemblyLine()
              , simple = '{{_count~~}}{{~~combine~~}}{{~~name}}'
              , data = ['Peter', 'Ivan', 'Ivo', 'Stefan' ]
              , renderSimple = [
                                      { do: 'set', as: 'name' }
                                    , { do: 'draw', tpl:'simple', as: 'combine', missField:'_hide' }
                                    , { do: 'draw', tpl:'simple'}
                                  ]
              ;
        
        tplEngine.insertTemplate ({simple})
        tplEngine.insertProcess ( renderSimple, 'renderSimple' )

        const result = tplEngine.run ( 'renderSimple', data );

        expect ( result[0] ).to.be.equal ( '1  1  Peter  Peter'   )
        expect ( result[1] ).to.be.equal ( '2  2  Ivan  Ivan'     )
        expect ( result[2] ).to.be.equal ( '3  3  Ivo  Ivo'       )
        expect ( result[3] ).to.be.equal ( '4  4  Stefan  Stefan' )
    }) // it whitespaces with external data



    it ( 'Whitespaces with system placeholders', () => {
        const
                tplEngine = new CodeAssemblyLine()
              , simple = '<div{{~~_attr~~}}>{{text}}{{~~_count}}</div>'
              , data = [
                            { text:'Peter', id:'first'}
                          , { text:'Ivan', id: 'second'}
                          , { text:'Stefan'} 
                       ]
              , renderSimple = [
                                  { do: 'draw', tpl:'simple'}
                               ]
              ;
        
        tplEngine.insertTemplate ({simple})
        tplEngine.insertProcess ( renderSimple, 'renderSimple' )

        const result = tplEngine.run ( 'renderSimple', data );

        expect ( result[0] ).to.be.equal ( '<div id="first" name="first" >Peter 1</div>'  )
        expect ( result[1] ).to.be.equal ( '<div id="second" name="second" >Ivan 2</div>' )
        expect ( result[2] ).to.be.equal ( '<div>Stefan 3</div>'                          )
    }) // it Whitespaces with system placeholders



    it ( 'Whitespaces with data', () => {
        const
                tplEngine = new CodeAssemblyLine()
              , simple = '{{name}}:{{~~info~~}}.'
              , data = [
                            { name:'Peter', info: 'General info'}
                          , { name:'Ivan'}
                          , { name:'Stefan'} 
                       ]
              , info = 'Missing information'
              , renderSimple = [
                                  { do: 'draw', tpl:'simple'}
                               ]
              ;
        
        tplEngine.insertTemplate ({simple})
        tplEngine.insertData ({info})
        tplEngine.insertProcess ( renderSimple, 'renderSimple' )

        const result = tplEngine.run ( 'renderSimple', data );

        expect ( result[0] ).to.be.equal ( 'Peter: General info .'          )
        expect ( result[1] ).to.be.equal ( 'Ivan: Missing information .'    )
        expect ( result[2] ).to.be.equal ( 'Stefan: Missing information .'  )
    }) // it Whitespaces with data
    
    
    
}) // describe Run