'use strict'

const 
        chai             = require ('chai')
      , expect           = chai.expect
      , CodeAssemblyLine = require ( '../src/index'  )
      , showError           = require ( '../src/errors' )
      ;



describe ( 'Errors', () => {
    
  it ( 'Call a non-existing error', () => {
    const result  = showError ( 'Fake')
    expect ( result ).to.be.equal ( 'Not defined error.' )
  }) // it call a non-existing error

}) // describe Tools


