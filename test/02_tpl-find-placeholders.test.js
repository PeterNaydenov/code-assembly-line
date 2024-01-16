'use strict';

import { expect }  from 'chai'
import chop        from '../src/template-chop.js'
import showError   from '../src/errors.js'
import templateToolsModule from '../src/template-tools.js'
      
const findPlaceholdersAndSpaces = templateToolsModule ({ chop, showError })._findPlaceholdersAndSpaces;



describe ( 'Find a placeholders', () => {

    it ( 'No placeholders', () => {
        const tpl = [ 'Good morning!' ];
        const result = findPlaceholdersAndSpaces ( tpl ).placeholders;

        expect ( result ).to.be.an('object')
        expect ( result ).to.be.empty
    }) // it no placeholders 



    it ( 'One placeholder', () => {
        const tpl = [ 'Good morning, ', '{{user}}' ];
        const result = findPlaceholdersAndSpaces ( tpl ).placeholders;

        expect ( result ).to.be.an('object')
        expect ( result ).to.contain.property( 'user' )
        expect ( result.user ).to.be.an('array')
        expect ( result.user ).to.includes(1)
    }) // it one placeholder



    it ( 'Many placeholders', () => {
        const tpl = [ 'Today user ', '{{user}}', ' has a birthday. Turns ', '{{age}}', ' years.' ];
        const result = findPlaceholdersAndSpaces ( tpl ).placeholders;

        expect ( result ).to.be.an('object')
        expect ( result ).to.contain.property( 'user' ).that.is.an ( 'array' )
        expect ( result ).to.contain.property( 'age'  ).that.is.an ( 'array' )
        expect ( result.user ).to.be.an('array')
        expect ( result.user ).to.includes(1)
        expect ( result.age  ).to.be.an('array')
        expect ( result.age  ).to.includes(3)
    }) // it many placeholders



    it ( 'Multiple used placeholders', () => {
        const tpl = [ '{{age}}', ' is like ', '{{age}}', '. Happy birthday ', '{{user}}' ];
        const result = findPlaceholdersAndSpaces ( tpl ).placeholders;

        expect ( result ).to.be.an('object');
        expect ( result ).to.contain.property ('age' ).that.is.an ( 'array' )
        expect ( result ).to.contain.property ('user').that.is.an ( 'array' )
        expect ( result.age ).to.have.length(2)
        expect ( result.age ).to.includes (0)
        expect ( result.age ).to.includes (2)
        expect ( result.user).to.includes (4) 
    }) // it multiple used placeholders

}) // describe findPlaceholders


