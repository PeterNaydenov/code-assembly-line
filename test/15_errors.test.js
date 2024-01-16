'use strict'

import { expect } from 'chai'
import showError from '../src/errors.js'



describe ( 'Errors', () => {
    
  it ( 'Call a non-existing error', () => {
    const result  = showError ( 'Fake')
    expect ( result ).to.be.equal ( 'Not defined error.' )
  }) // it call a non-existing error

}) // describe Tools


