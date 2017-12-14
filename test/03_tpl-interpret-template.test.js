'use strict';

const 
      chai          = require ('chai')
    , showError     = require ( '../src/errors' )
    , templateTools = require ('../src/template-tools' )

    , expect = chai.expect
    , str2intTemplate = templateTools.str2intTemplate
    , load_interpretTemplate = templateTools.load_interpretTemplate
    , interpret = load_interpretTemplate ( str2intTemplate )
    ;



describe ( 'Template interpreter', () => {
    
    it ( 'Well formated string template', () => {
         const str = 'Someone should {{action}} it.';
         const result = interpret ( str );

         expect ( result ).to.be.an('object')
         expect ( result ).to.have.property('tpl')
         expect ( result ).to.not.have.property ( 'errors' )
         expect ( result ).to.have.property('placeholders').that.has.property('action')
         expect ( result.placeholders.action ).to.be.an ( 'array' )
         expect ( result.placeholders.action ).to.have.length ( 1 )
         expect ( result.placeholders.action ).to.contain ( 1 )
    }) // it well formated template



    it ( 'Errors within string template', () => {
         const str = 'So }} errors happend{{';
         const result = interpret ( str );

         expect ( result ).to.have.property ('errors' )
         expect ( result.errors[0] ).to.be.equal ( showError('brokenTemplate') )
         expect ( result ).to.have.property ('tpl')
         expect ( result.tpl ).to.be.an('array')
         expect ( result.tpl ).contains ( showError('brokenTemplate') )
         expect ( result ).to.have.property ( 'placeholders' ).that.is.empty
       }) // it error string template
    

    
    it ( 'Wrong data format: object', () => {
        const data = { hello: 'hello, {{user}}' };
        const result = interpret ( data );

        expect ( result ).to.have.property ( 'errors' )
        expect ( result ).to.not.have.property ( 'tpl' )
        expect ( result ).to.not.have.property ( 'placeholders' )
    }) // it light data template



    it ( 'Wrong data format: number', () => {
        const data = 43;
        const result = interpret ( data );

        expect ( result ).to.have.property ( 'errors' );
        expect ( result.errors[0] ).to.be.equal ( showError('wrongDataTemplate') )
    }) // it wrong data format

}) // Describe interpret a template


