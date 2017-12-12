'use strict'

const 
        chai             = require ('chai')
      , expect           = chai.expect
      , CodeAssemblyLine = require ( '../src/index'  )
      , errors           = require ( '../src/errors' )
      ;



describe ( 'Data', () => {
    
  it ( 'Insert single data record', () => {
    const
              tplEngine  = new CodeAssemblyLine()
            , defaultAlt = 'image description is missing'
            ;
        
    tplEngine.insertData ( { 'alt' : defaultAlt } )

    expect ( tplEngine.data ).to.have.property ( 'alt' )
    expect ( tplEngine.data.alt ).to.be.equal ( defaultAlt )
  }) // it insert single data record

  
  
  it ( 'Insert many records', () => {
    const
            tplEngine  = new CodeAssemblyLine()
          , records = {
                           'alt'  : 'image description is missing'
                         , 'home' : 'Sweet home'

                      }
          ;

  tplEngine.insertData ( records )

  expect ( tplEngine.data ).to.have.property ( 'alt' )
  expect ( tplEngine.data ).to.have.property ( 'home' )
  expect ( tplEngine.data.alt ).to.be.equal ( records.alt )
  expect ( tplEngine.data.home ).to.be.equal ( records.home )
}) // it Insert many records



  it ( 'Insert deep nestled objects', () => {
    const
            tplEngine  = new CodeAssemblyLine()
          , records = {
                            'alt'    : 'image description is missing'
                          , 'settings' : {
                                              'access' : 'admin'
                                            , 'users'  : [ 'Peter', 'Ivan', 'Stefan' ]
                                        }
                      }
          ;

    tplEngine.insertData ( records )

    expect ( tplEngine.data ).to.have.property ( 'alt' )
    expect ( tplEngine.data ).to.have.property ( 'settings/access' )
    expect ( tplEngine.data ).to.have.property ( 'settings/users/0' )
    expect ( tplEngine.data ).to.not.have.property ( 'settings/users' )
  }) // it Insert deep nestled objects



  it ( 'Try to overwrite existing data-record', () => {
    const
            tplEngine  = new CodeAssemblyLine()
          , record = { 'alt'    : 'image description is missing'}
          , nextrecord =  { 'alt' : 'new alt '}
          ;

    tplEngine.insertData ( record )
    tplEngine.insertData ( nextrecord )

    expect ( tplEngine.data ).to.have.property ( 'alt' )
    expect ( tplEngine.data.alt ).to.be.equal ( record.alt )
  }) // it Try to overwrite existing data-record



  it ( 'Insert data as a library', () => {
    const
            tplEngine  = new CodeAssemblyLine()
            , records = {
                              'alt'    : 'image description is missing'
                            , 'settings' : {
                                                'access' : 'admin'
                                              , 'users'  : [ 'Peter', 'Ivan', 'Stefan' ]
                                          }
                        }
            ;

    tplEngine.insertDataLib ( records, 'special' )
    const r = tplEngine.data;

    expect ( r ).to.not.have.property ( 'alt' )
    expect ( r ).to.have.property ( 'special/alt' )
    expect ( r ).to.have.property ( 'special/settings/users/0')
    expect ( r ).to.have.property ( 'special/settings/access')
    expect ( r['special/settings/users/0'] ).to.be.equal ( records.settings.users[0] )
  }) // it Insert data as a library



  it ( 'Insert data as a library. Overwriting is forbidden', () => {
      const
               tplEngine  = new CodeAssemblyLine ()
             , oldRecord  = { 'lib/alt' : 'old record' }
             , record     = { 
                                  'alt'     : 'new record' 
                                , 'other'   : 'other record'
                            }
             ;
      
      tplEngine.insertData ( oldRecord )
      tplEngine.insertDataLib ( record, 'lib' )
      
      const d = tplEngine.data;
      expect (d).to.have.property ('lib/alt'  )
      expect (d).to.have.property ('lib/other')

      expect(d['lib/alt']).to.be.equal ( oldRecord['lib/alt'])
      expect(d['lib/other']).to.be.equal ( record['other'] )
  }) // it Insert data as a library. Overwriting is forbidden
  


  it ( 'Rename data-record', () => {
    const
            tplEngine  = new CodeAssemblyLine()
          , record = { 'alt'    : 'image description is missing'}
          ;

    tplEngine.insertData ( record )
    tplEngine.renameData ( {'alt':'test'} )

    expect ( tplEngine.data ).to.not.have.property ( 'alt' )
    expect ( tplEngine.data ).to.have.property     ( 'test' )
  }) // it Rename data-record



  it ( 'Rename a non-existing data-record', () => {
    const 
            tplEngine  = new CodeAssemblyLine()
          , record     = { 'alt' : 'record text' }
          ;

    tplEngine.insertData ( record )
    tplEngine.renameData ( {'alt':'test', 'missing' : 'fake' }  )
    
    const d = tplEngine.data;
    expect (d).to.not.have.property ( 'missing' )
    expect (d).to.not.have.property ( 'fake'    )
    expect (d).to.not.have.property ( 'alt'     )

    expect (d).to.have.property ( 'test')
  }) // it rename a non-existing data-record


  it ( 'Rename is not allowed', () => {
    const 
            tplEngine  = new CodeAssemblyLine()
          , record     = { 
                               'one' : 'first record'
                             , 'two' : 'second record'
                         }
          ;

    tplEngine.insertData ( record )
    tplEngine.renameData ( {'two':'one'}  )

    const d = tplEngine.data;
    expect (d).to.have.property ( 'one' )
    expect (d).to.have.property ( 'two' )

    expect ( d.one ).to.be.equal ( record.one )
    expect ( d.two ).to.be.equal ( record.two )
  }) // it rename is not allowed
  
  
  
  it ( 'Remove data-record', () => {
    const
            tplEngine  = new CodeAssemblyLine()
          , record = { 'alt'    : 'image description is missing'}
          ;

    tplEngine.insertData ( record )
    tplEngine.removeData ( 'alt'  )

    expect ( tplEngine.data ).to.not.have.property ( 'alt' )
  }) // it Remove data-record
  
  
  
  it ( 'Remove data-records presented as array', () => {
    const
            tplEngine  = new CodeAssemblyLine()
          , record = { 
                          'one'   : 'record one'
                        , 'two'   : 'record two'
                        , 'three' : 'record three'
                     }
          ;

    tplEngine.insertData ( record )
    tplEngine.removeData ( ['one']  )

    const d = tplEngine.data;
    expect (d).to.not.have.property ( 'one' )
    expect (d).to.have.property ( 'two'   )
    expect (d).to.have.property ( 'three' )
  }) // it Remove data-record presented as array



  it ( 'Get missing block', () => {
    const
            tplEngine = new CodeAssemblyLine()
          , template  = { 'dummy' : 'image description is missing'}
          , pr        =  [
                              { do:'draw', tpl: 'dummy' }
                            , { do: 'save', as: 'block', name: 'dummy' }
                         ]
          ;

    tplEngine.insertTemplate ( template )
    tplEngine.insertProcess ( pr, 'test' )
    tplEngine.run ( 'test' )

    const result = tplEngine.getBlock ( 'missing' )
    expect ( result ).to.be.equal ( '' )
  }) // it Get missing block



  it ( 'Get block with no arguments', () => {
    const
            tplEngine   = new CodeAssemblyLine()
          , template    = { 'dummy' : 'image description is missing'}
          , testProcess =  [
                              { do:'draw', tpl: 'dummy' }
                            , { do: 'save', as: 'block', name: 'dummy' }
                          ]
          ;

    tplEngine
        .insertTemplate ( template )
        .insertProcess  ( testProcess, 'test' )
        .run ( 'test' )

    const result = tplEngine.getBlock ( )
    expect ( result ).to.be.equal ( '' )
  }) // it Get block with no arguments



  it ( 'Get single block', () => {
    const
            tplEngine = new CodeAssemblyLine()
          , template  = { 'dummy' : 'image description is missing'}
          , pr        =  [
                              { do:'draw', tpl: 'dummy' }
                            , { do: 'save', as: 'block', name: 'dummy' }
                        ]
          ;

    tplEngine.insertTemplate ( template )
    tplEngine.insertProcess ( pr, 'test' )
    tplEngine.run ( 'test' )

    const result = tplEngine.getBlock ( 'dummy'  )
    expect ( result ).to.be.equal ( template.dummy )
  }) // it Get single block



  it ( 'Get blocks in order', () => {
    const
            tplEngine = new CodeAssemblyLine ()
          , templates = {
                            'one' : 'First sentence.'
                          , 'two' : 'Second sentence.'
                        }
          , pr1       = [
                            { do:'draw', tpl: 'one' }
                          , { do: 'save', as: 'block', name: 'first' }
                        ]
          , pr2       = [
                            { do:'draw', tpl: 'two' }
                          , { do: 'save', as: 'block', name: 'second' }
                        ]

    tplEngine
            .insertTemplate ( templates )
            .insertProcess ( pr1, 'doOne')
            .insertProcess ( pr2, 'doTwo')
            .run ( [ 'doTwo' , 'doOne'] )

    const result = tplEngine.getBlock ( 'first', 'second' )

    expect ( result ).to.be.a ( 'string' )
    expect ( result ).to.be.equal ( templates.one + templates.two )
  }) // it Get blocks in order
  
  
  
  it ( 'Get blocks in order as array', () => {
    const
            tplEngine = new CodeAssemblyLine ()
          , templates = {
                            'one' : 'First sentence.'
                          , 'two' : 'Second sentence.'
                        }
          , pr1       = [
                            { do:'draw', tpl: 'one' }
                          , { do: 'save', as: 'block', name: 'first' }
                        ]
          , pr2       = [
                            { do:'draw', tpl: 'two' }
                          , { do: 'save', as: 'block', name: 'second' }
                        ]

    tplEngine
          .insertTemplate ( templates )
          .insertProcess ( pr1, 'doOne')
          .insertProcess ( pr2, 'doTwo')
          .run ( [ 'doTwo' , 'doOne'] )

    const result = tplEngine.getBlock ( ['first', 'second'] )

    expect ( result ).to.be.a ( 'string' )
    expect ( result ).to.be.equal ( templates.one + templates.two )
  }) // it Get blocks in order as array



  it ( 'Try to insert function in data' , () => {
    const 
           tplEngine = new CodeAssemblyLine()
         , data      = {
                            'a'  : 'Some string information'
                          , 'fx' : function () { console.log('Hey, I am in!') }
                          , 'b'  : 12
                        }
         ;

     tplEngine.insertData ( data )

     const d = tplEngine.data;
     expect (d).to.have.property('a')
     expect (d).to.have.property('b')
     expect (d).to.not.have.property('fx')
  }) // it Try to insert function in data


    
}) // describe Tools


