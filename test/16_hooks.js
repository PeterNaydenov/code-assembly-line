'use strict'

const 
        chai             = require ('chai')
      , expect           = chai.expect
      , CodeAssemblyLine = require ( '../src/index'  )
      ;



describe ( 'Hooks', () => {
    
    it ( 'Hook with "draw" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0] ).to.be.equal ( 'Hi, Peter' )
        }) // it Hook with "draw" modifier
  
  
  
    it ( 'Hook with "set" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = 'Peter'
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'set', as: 'name' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].name ).to.be.equal ( 'Peter' )
        }) // it Hook with "set" modifier



    it ( 'Hook with "set" modifier. Data as array of strings', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [{ list: ['Peter','John']},{ list: ['Kris']}]
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                function testFn ( data, modify ) {
                                const res = modify ( data[0].list, { do: 'set', as: 'name' })
                                return [res]
                    }

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].name ).to.be.equal ( 'Peter' )
                expect ( result[1].name ).to.be.equal ( 'John'  )
                expect ( result[2].name ).to.be.equal ( 'Kris'  )
        }) // it Hook with "set" modifier



    it ( 'Hook with "set" modifier. Data as array of strings', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [{ list:'Peter'},{ list: 'Kris'}]
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                function testFn ( data, modify ) {
                                const res = modify ( [data[0].list], { do: 'set', as: 'name' })
                                return [res]
                    }

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].name ).to.be.equal ( 'Peter' )
                expect ( result[1].name ).to.be.equal ( 'Kris'  )
        }) // it Hook with "set" modifier



    it ( 'Hook with "set" and "draw" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = 'Peter'
                    , hi = 'Hi, {{name}}'
                    , process = [{ do: 'hook', name: 'testFn' }]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                function testFn ( data, modify ) {
                        let tmp;
                        tmp = modify ( data, { do: 'set', as: 'name' })
                        tmp = modify ( tmp, { do:'draw', tpl: 'hi' })
                        return tmp
                   }

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0] ).to.be.equal ( 'Hi, Peter' )
        }) // it Hook with "set" and "draw" modifier



    it ( 'Hook with selected data', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [ 
                                  { title: 'Welcome', guestList: ['Ivan', 'Kris', 'Ivo']}
                                , { title: 'Welcome', guestList: ['Nikolay', 'Hristo'] }
                            ]
                    , hi = `Hi, {{name}}!`
                    , process = [
                              { do: 'hook', name: 'testFn'  }
                            , { do: 'block', name: 'result', space: ' ' }
                        ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                function testFn ( data, modify ) {
                        /**
                         *  Execution of hook is for every single data-segment but the segment always 
                         *  come as an array with a single member because modifiers require data as array. 
                         *  Keep in mind this details when you try to do manual selections and modification 
                         *  inside hook functions.
                         *  Remember that hook-function should return always an array with signle element!
                         */
                        let 
                              guestList = data[0].guestList
                            , tmp
                            ;
                        tmp = modify ( guestList, { do: 'set', as: 'name' })
                        tmp = modify ( tmp, { do:'draw', tpl: 'hi' })
                        return [tmp]
                    } // testFn func.

                tplEngine.run ( 'doit', data, {testFn} )
                const result = tplEngine.getBlock ( 'result')
                expect ( result ).to.be.equal ( 'Hi, Ivan! Hi, Kris! Hi, Ivo! Hi, Nikolay! Hi, Hristo!' )
        }) // it Hook with selected data



    it ( 'Hook with "block" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [  
                                  'string 1'
                                , 'string 2'
                            ]
                    , process = [{ do: 'hook', name: 'testFn'  }]
                    ;
                tplEngine.insertProcess ( process, 'doit' )
                
                const testFn = ( data, modify ) =>  modify ( data, { do:'block' });
                const result = tplEngine.run ( 'doit', data, {testFn} );
                /**
                 *  Using 'block' modifier inside hook function has no effect
                 *  because hook is executed on each data-fragment. 
                 */
                expect ( result        ).to.be.an ( 'array' )
                expect ( result.length ).to.be.equal ( 2 )
                expect ( result[1]     ).to.be.equal ( 'string 2' )
        }) // it Hook with "block" modifier



    it ( 'Hook with "alter" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [  
                                  { user : 'Peter' }
                                , { user : 'Kris' }
                            ]
                    , process = [{ do: 'hook', name: 'testFn'  }]
                    ;
                tplEngine.insertProcess ( process, 'doit' )
                
                const testFn = ( data, modify ) =>  modify ( data, { do:'alter', data: { 'user' : 'name'} });
                const result = tplEngine.run ( 'doit', data, {testFn} );

                expect ( result             ).to.be.an ( 'array' )
                expect ( result[1]          ).to.have.property ( 'name' )
                expect ( result[1]['name']  ).to.be.equal ( 'Kris' )
        }) // it Hook with "alter" modifier



    it ( 'Hook with "add" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [  
                                  { user : 'Peter' }
                                , { user : 'Kris' }
                            ]
                    , hi = 'Hi, {{user}}!'
                    , process = [
                                    { do: 'hook', name: 'testFn'   }
                                   , { do: 'draw', tpl: 'hi'       } 
                                   , { do: 'block', name: 'result', space: ' '}
                                ]
                    ;
                tplEngine.insertTemplate ({ hi })
                tplEngine.insertProcess ( process, 'doit' )
                
                const testFn = ( data, modify ) =>  modify ( data, { do:'add', select:'first', data: { 'user' : 'text...'} });
                tplEngine.run ( 'doit', data, {testFn} )
                const result = tplEngine.getBlock ( 'result');

                expect ( result ).to.be.equal ( 'Hi, Peter text...! Hi, Kris text...!' )
                /**
                 *   Hooks are executed on each data-segment and data-scope of function is a
                 *   current data-segment. Hook function doesn't have informatation about 
                 *   full current-data! 
                 *   Every data-segment is 'first' and modifier 'add' will add text into 
                 *   each data-segment.
                 * 
                 *  Process-steps as modifiers may generate different results in some 
                 *  cases because data-scope is different.
                 *  
                 */
        }) // it Hook with "add" modifier



    it ( 'Hook with "copy" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [  
                                  { user : 'Peter' }
                                , { user : 'Kris' }
                            ]
                    , hi = 'Hi, {{name}}!'
                    , process = [
                                     { do: 'hook', name: 'testFn'   }
                                   , { do: 'draw', tpl: 'hi'       } 
                                   , { do: 'block', name: 'result', space: ' '}
                                ]
                    ;
                tplEngine.insertTemplate ({ hi })
                tplEngine.insertProcess ( process, 'doit' )
                
                const testFn = ( data, modify ) =>  modify ( data, { do:'copy', data: { 'user' : 'name'} });
                tplEngine.run ( 'doit', data, {testFn} )
                const result = tplEngine.getBlock ( 'result');

                expect ( result ).to.be.equal ( 'Hi, Peter! Hi, Kris!' )                
        }) // it Hook with "copy" modifier



    it ( 'Hook with "remove" modifier', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = [  
                                  { user : 'Peter' }
                                , { user : 'Kris' }
                            ]
                    , hi = 'Hi, {{user}}!'
                    , process = [
                                     { do: 'hook', name: 'testFn'   }
                                   , { do: 'draw', tpl: 'hi'       } 
                                   , { do: 'block', name: 'result', space: ' '}
                                ]
                    ;
                tplEngine.insertTemplate ({ hi })
                tplEngine.insertProcess ( process, 'doit' )
                
                const testFn = ( data, modify ) =>  modify ( data, { do:'remove', keys: ['user'] });
                tplEngine.run ( 'doit', data, {testFn} )
                const result = tplEngine.getBlock ( 'result');

                expect ( result ).to.be.equal ( 'Hi, {{user}}! Hi, {{user}}!' )                
        }) // it Hook with "remove" modifier




    it ( 'Hook "draw" modifies existing field. Method "add"', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn', as: 'name', method: 'add' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].name ).to.be.equal ( 'Peter' )
        }) // it 'Hook "draw" modifies existing field. Method "add"



    it ( 'Hook "draw" modifies non-existing field. Method "add"', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn', as: 'more', method: 'add' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].more ).to.be.equal ( 'Hi, Peter' )
        }) // it 'Hook "draw" modifies non-existing field. Method "add"



    it ( 'Hook "draw" modifies existing field. Method "update"', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn', as: 'name', method: 'update', space: ' ' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].name ).to.be.equal ( 'Hi, Peter' )
        }) // it 'Hook "draw" modifies existing field. Method "update"



    it ( 'Hook "draw" modifies non-existing field. Method "update"', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn', as: 'more', method: 'update', space: ' ' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0] ).to.not.have.property ( 'more' )
        }) // it 'Hook "draw" modifies non-existing field. Method "update"



    it ( 'Hook "draw" modifies existing field. Method "overwrite"', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn', as: 'name', method: 'overwrite', space: ' ' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].name ).to.be.equal ( 'Hi, Peter' )
        }) // it 'Hook "draw" modifies existing field. Method "overwrite"



    it ( 'Hook "draw" modifies existing field. Method "heap"', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data = { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn', as: 'name', method: 'heap' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )

                let testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })

                const result = tplEngine.run ( 'doit', data, {testFn} )
                expect ( result[0].name ).to.be.equal ( 'Peter Hi, Peter' )
        }) // it 'Hook "draw" modifies existing field. Method "heap"



    it ( 'Hook "draw" modifier with string data', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data =  'Old string' 
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )
                const 
                      testFn = ( data, modify ) => modify ( data, { do: 'draw', tpl: 'hi' })
                    , result = tplEngine.run ( 'doit', data, {testFn} )
                    ;

                expect ( result[0] ).to.be.equal ( 'Old string' )
                /**
                 *  When input parapeters are wrong, process-step will be skiped.
                 */
        }) // it 'Hook "draw" modifier with string data



    it ( 'Hook "set" modifier with "object" input', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data =  { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )
                const
                      testFn = ( data, modify ) => modify ( data, { do: 'set', as: 'name' })
                    , result = tplEngine.run ( 'doit', data, {testFn} )
                    ;

                expect ( result[0].name ).to.be.equal ( 'Peter' )
                /**
                 *  When input parapeters are wrong, process-step will be skiped.
                 */
        }) // it 'Hook "set" modifier with "object" input 



    it ( 'Hook "block" modifier with "object" input', () => {
                const 
                      tplEngine = new CodeAssemblyLine ()
                    , data =  { name : 'Peter' }
                    , hi = 'Hi, {{name}}'
                    , process = [
                                    { do: 'hook', name: 'testFn' }
                                ]
                    ;
                tplEngine.insertTemplate ( { hi })
                tplEngine.insertProcess ( process, 'doit' )
                const
                      testFn = ( data, modify ) => modify ( data, { do: 'block' })
                    , result = tplEngine.run ( 'doit', data, {testFn} )
                    ;

                expect ( result[0].name ).to.be.equal ( 'Peter' )
                /**
                 *  When input parapeters are wrong, process-step will be skiped.
                 */
        }) // it 'Hook "block" modifier with "object" input


}) // describe Hooks


