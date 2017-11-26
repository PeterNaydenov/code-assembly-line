'use strict'

const 
        chai             = require ('chai')
      , expect           = chai.expect
      , CodeAssemblyLine = require ( '../index'  )
      , errors           = require ( '../errors' )
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
  
  
  
  it ( 'Remove data-record', () => {
    const
            tplEngine  = new CodeAssemblyLine()
          , record = { 'alt'    : 'image description is missing'}
          ;

    tplEngine.insertData ( record )
    tplEngine.removeData ( 'alt'  )

    expect ( tplEngine.data ).to.not.have.property ( 'alt' )
  }) // it Remove data-record
    
}) // describe Tools