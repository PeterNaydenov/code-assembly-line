'use strict'

const 
        chai         = require ('chai')
      , expect       = chai.expect
      , processTools = require ( '../process-tools' )
      , errors       = require ( '../errors' )
      ;



 describe ( 'Process interpreter', () => {
        
    it ('General', () => {
        const 
               ext = [
                        { do: 'draw', tpl: 'any' }
                      , { do: 'block', name: 'anyBlock' }
                    ]
             , result = processTools.interpret ( ext )
             ;

        expect ( result ).to.have.property ( 'steps' )
        expect ( result ).to.have.property ( 'arguments' )
        expect ( result ).to.have.property ( 'hooks' )
        expect ( result ).to.not.have.property ( 'errors' )

        expect ( result.steps ).to.be.an( 'array' )
        expect ( result.steps ).includes ('draw')
        expect ( result.steps ).includes ('block')

        expect ( result.hooks).to.be.an('array')
        expect ( result.hooks).to.be.empty
    }) // it general



    it ( 'Hook', () => {
        const 
                ext = [ 
                           { do: 'draw', tpl: 'link' }
                         , { do: 'hook', name: 'test'} 
                      ]
              , result = processTools.interpret ( ext )
              ;

        expect ( result ).to.not.have.property ( 'errors' )
        expect ( result.hooks ).to.have.length (1)
        expect ( result.hooks ).to.includes( 'test' )

        expect ( result.steps ).to.have.length (2)
        expect ( result.steps ).to.includes ( 'draw' )
        expect ( result.steps ).to.includes ( 'hook' )
    }) // it hook 



    it ( 'Error', () => {
        const
                ext = {}
              , result = processTools.interpret ( ext )
              ;

        expect ( result ).to.have.property ( 'errors'    )
        expect ( result ).to.have.property ( 'steps'     )
        expect ( result ).to.have.property ( 'arguments' )
        expect ( result ).to.have.property ( 'hooks'     )
        
        expect ( result.errors ).to.have.length (1)
        expect ( result.steps     ).to.be.empty
        expect ( result.arguments ).to.be.empty
        expect ( result.hooks     ).to.be.empty
    }) // it error

 }) // describe process interpreter