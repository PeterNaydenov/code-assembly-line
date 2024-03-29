'use strict';

import { expect } from 'chai';
import chop from '../src/template-chop.js';
import callError from '../src/errors.js';



describe ( 'Chop string templates', () => {

  it ( 'No placeholder', () => {
        const tpl = 'Hello, Peter.';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length(1)
  }) // it no placeholder


  
  it ( 'Regular template', () => {
        const tpl = 'Hello, {{user}}.';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length(3)
        expect ( result[1] ).to.be.equal('{{user}}')
  }) // it regular 



  it ( 'Starts with placeholder', () => {
        const tpl = '{{user}} is logged in.';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length(2)
        expect ( result[0] ).to.be.equal('{{user}}')
  }) // it Starts with



  it ( 'Many placeholders', () => {
        const tpl = '{{user}} is {{age}} years old.';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length(4)
        expect ( result[0] ).to.be.equal('{{user}}')
        expect ( result[2] ).to.be.equal('{{age}}')
  }) // it Many placeholders



  it ( 'Finish with placeholder', () => {
        const tpl = '{{user}} and {{user}}';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length(3)
        expect ( result[0] ).to.be.equal('{{user}}')
        expect ( result[2] ).to.be.equal('{{user}}')
  }) // it finish with placeholder



  it ( 'Missing closing tags', () => {
        const tpl = 'Pardon {{error is coming out.';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length(1)
        expect ( result[0] ).to.be.equal ( callError('brokenTemplate') )
  }) // it missing closing tag



  it ( 'Other placeholder after missing closing tag', () => {
        const tpl = '{{user is {{age}} years old.';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length(1)
        expect ( result).to.include ( callError('brokenTemplate') )        
  }) // it 
  

  
  it ( 'Closing tags before open ones', () => {
        const tpl = 'user}} is {{age years}} old.';
        const result = chop (tpl);

        expect ( result ).to.be.an('array')
        expect ( result).to.include ( callError('brokenTemplate') )
  }) // it Closing tags before open ones



  it ( 'Not a string template', () => {
      const tpl = { a: 'something', b: 12 };
      const result = chop ( tpl );

      expect ( result ).to.be.an ( 'array' )
      expect ( result[0] ).to.be.equal ( callError('brokenTemplate') )
  }) // it not a string template

}) // describe