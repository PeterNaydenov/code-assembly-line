'use strict'

import { expect } from 'chai'
import help from '../src/help.js'
import showError from '../src/errors.js'
import processToolsModule from '../src/process-tools.js'

const 
        processTools = processToolsModule ({ help, showError })
      , callErrors     = showError
      ;

describe ( 'Process Tools', () => {
    
    it ( 'Interpet: Valid process name', () => {
        const linkProcess = [
                                  { do: 'draw', tpl: 'a' }
                                , { do: 'hook', name: 'sanitize'}
                                , { do: 'block' }
                                , { do: 'set', as: 'text' }
                            ]
        const result = processTools.interpret ( linkProcess )

        expect ( result ).to.have.property     ( 'steps'     )
        expect ( result ).to.have.property     ( 'arguments' )
        expect ( result ).to.have.property     ( 'hooks'     )
        expect ( result ).to.not.have.property ( 'error'     )

        expect ( result.hooks ).to.contain ( 'sanitize' )
        
        expect ( result.steps ).to.contain ( 'draw'  )
        expect ( result.steps ).to.contain ( 'hook'  )
        expect ( result.steps ).to.contain ( 'block' )
        expect ( result.steps ).to.contain ( 'set' )
    }) // it interpret: valid process name



    it ( 'Interpret: Not a valid process name', () => {
        const 
              fake = 'alternate'
            , processChain = [
                                  { do: fake, name: 'something' }
                            ]
            ;

        const result = processTools.interpret ( processChain )

        expect ( result ).to.have.property ( 'steps'     )
        expect ( result ).to.have.property ( 'arguments' )
        expect ( result ).to.have.property ( 'hooks'     )
        expect ( result ).to.have.property ( 'errors'     )
        expect ( result.errors[0] ).to.be.equal ( `Error: "${fake}" is not a valid operation` )
    }) // it interpret: not a valid process name


    it ( 'Interpret: Missing operation', () => {
        const processChain = [ { name: 'something' } ]
        const result = processTools.interpret ( processChain )

        expect ( result ).to.have.property ( 'errors' )
        expect ( result.errors[0] ).to.be.equal ( callErrors('missingOperation') )
    }) // it interpret: missing operation



    it ( 'Interpret: Not a valid arguments', () => {
       const processFake = { name: 'fakeProcess' };
       const result = processTools.interpret ( processFake );

       expect ( result ).to.have.property ( 'errors' )
       expect ( result.errors[0] ).to.be.equal ( callErrors('wrongExtProcess') )
    }) // it interpret: not a valid arguments



    it ( 'Interpret: Empty process', () => {
      const emptyProcess = [];
      const result = processTools.interpret ( emptyProcess );

      expect ( result ).to.have.property ( 'errors' )
      expect ( result.errors[0] ).to.be.equal ( callErrors('emptyExtProcess') )
    }) // it interpret: Empty process



    it ( 'string helper: string', () => {
        const a = 'ala-bala';
        const result = processTools._findIfString ( a )

        expect ( result ).to.be.equal ( true )
    }) // it string helper: string



    it ( 'string helper: not a string', () => {
        const a = 4;
        const result = processTools._findIfString ( a )

        expect ( result ).to.be.equal ( false )
    }) // it string helper: not a string



    it ( 'List copier', () => {
        const a = [ 'one', 'two' ];
        const result = processTools._copyList ( a )        
        a[0] = 'update'

        expect ( result[0] ).to.not.be.equal ( a[0] )
    }) // it list copier
    
    // Note: method "run" has separate testing page

}) // describe Process Tools


