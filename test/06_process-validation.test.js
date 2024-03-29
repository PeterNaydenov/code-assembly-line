'use strict'

import { expect } from 'chai'
import codeAssemblyLine from '../src/index.js'
import help from '../src/help.js'
import callErrors from '../src/errors.js'
import processToolsModule from '../src/process-tools.js'

const
    showError = callErrors
  , processTools = processToolsModule ({ help, showError })
  ;
    


 describe ( 'Process Validation', () => {
    
    it ( 'Valid data', () => {
            const ext = [
                              { do: 'draw', tpl: 'dummy' }
                            , { do: 'block', name: 'dummyBlock' }
                        ];

            const result = processTools._validate ( ext );

            expect ( result ).to.be.an ( 'array' )
            expect ( result ).to.be.empty
    }) // it valid data



    it ( 'Empty array', () => {
             const 
                    ext = []
                  , result = processTools._validate ( ext )
                  ;

             expect ( result ).to.be.an ( 'array' )
             expect ( result ).to.have.length ( 1 )
             expect ( result[0] ).to.be.equal ( callErrors('emptyExtProcess') )            
    }) // it empty array



    it ( 'Wrong data format - primitive', () => {
             const 
                   ext    = 'none'
                 , result = processTools._validate ( ext )
                 ;

             expect ( result ).to.be.an ( 'array' )
             expect ( result ).to.have.length ( 1 )
             expect ( result[0] ).to.be.equal ( callErrors('wrongExtProcess') )
    }) // it primitive



    it ( 'Wrong data format - object', () => {
             const 
                   ext    = { do: 'draw', tpl: 'any' }
                 , result = processTools._validate ( ext )
                 ;

             expect ( result ).to.be.an ( 'array' )
             expect ( result ).to.have.length ( 1 )
             expect ( result[0] ).to.be.equal ( callErrors('wrongExtProcess') )            
    }) // it object



    it ( 'Step with missing operation',() => {
             const 
                   ext    = [
                                  { do: 'draw', tpl: 'any' }
                                , { name: 'newBlock' }
                            ]
                 , result = processTools._validate ( ext )
                 ;

             expect ( result ).to.be.an ( 'array' )
             expect ( result ).to.have.length ( 1 )
             expect ( result[0] ).to.be.equal ( callErrors('missingOperation') )            
    }) // it missing operation



    it ( 'Step with wrong operation', () => {
             const 
                   ext    = [
                                  { do: 'wrongOperation', tpl: 'any' }
                                , { do: 'test', name: 'newBlock' }
                            ]
                 , result = processTools._validate ( ext )
                 ;

             expect ( result ).to.be.an ( 'array' )
             expect ( result ).to.have.length ( 2 )
             expect ( result[0] ).to.be.equal ( 'Error: "wrongOperation" is not a valid operation' )
             expect ( result[1] ).to.be.equal ( 'Error: "test" is not a valid operation' )
    }) // it wrong operation

 }) // describe process tools


