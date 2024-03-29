'use strict'

import { expect } from 'chai'
import showError from '../src/errors.js'
import helpModule from '../src/help.js'
import processOpsModule from '../src/process-operations.js'

const 
        help       = helpModule ({ showError })
      , processOps = processOpsModule ({ help })
      ;

describe ( 'Process Operations', () => {

    it ( 'Draw: One placeholder', () => {
        const 
              template = {
                               tpl : [ 'Hello, ', '{{name}}', '.' ]
                             , placeholders: { name: [1] }
                             , spaces: {}
                           }
              ,   data = [ { name : 'Peter' }, {name: 'Ivan'} ]
              ;
        const result = processOps.draw ( {template, data} )
        expect ( result ).to.be.an ( 'array' )
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.be.equal ( 'Hello, Peter.')
        expect ( result[1] ).to.be.equal ( 'Hello, Ivan.' )
    }) // it Draw: one placeholder



    it ( 'Draw: Two placeholder', () => {
        const 
              template = {
                               tpl : [ '{{name1}}', ' and ', '{{name2}}', ' are working together.' ]
                             , placeholders: { name1: [0], name2: [2] }
                             , spaces: {}
                           }
              ,   data = [ { name1: 'Peter', name2: 'Ivan'} ]
              ;

        const result = processOps.draw ( {template, data} )
        expect ( result ).to.be.an ( 'array' )
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Peter and Ivan are working together.')
    }) // it Draw: one placeholder



    it ( 'Draw: Multiple placeholders', () => {
        const 
              template = {
                               tpl : [ '{{name}}', ' and ', '{{name}}', ' product ', '{{what}}'  ]
                             , placeholders: { name: [0,2], what:[4] }
                             , spaces: {}
                           }
              ,   data = [ { name: 'Johnson', what: 'list'} ]
              ;

        const result = processOps.draw ( {template, data} )
        expect ( result ).to.be.an ( 'array' )
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Johnson and Johnson product list')
    }) // it Draw: Multiple placeholders



    it ( 'Draw: data > placeholders', () => {
        const 
              template = {
                               tpl : [ 'Happy Birthday to my friend ', '{{name}}', '!']
                             , placeholders: { name: [1] }
                             , spaces: {}
                           }
              ,   data = [ { name: 'Peter', age: '43'} ]
              ;

        const result = processOps.draw ( {template, data} )
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Happy Birthday to my friend Peter!')
    }) // it Draw: data > placeholders



    it ( 'Draw: missField strategy "_hide"', () => {
        const 
              template = {
                               tpl : [ 'Hey ', '{{name}}', '!']
                             , placeholders: { name: [1] }
                             , spaces: {}
                           }
              ,   data = [ { myName: 'Peter', age: '43'} ]
              ;

        const result = processOps.draw ( { template, data, missField:'_hide' })
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Hey !')
    }) // it Draw: missField strategy _hide



    it ( 'Draw: missField strategy "_position"', () => {
        const 
              template = {
                               tpl : [ 'Hey ', '{{name}}', '!']
                             , placeholders: { name: [1] }
                             , spaces: {}
                           }
              ,   data = [ { myName: 'Peter', age: '43'} ]
              ;

        const result = processOps.draw ( { template, data,  missField: '_position'} )
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Hey name!')
    }) // it Draw: missField strategy _position



    it ( 'Draw: missField error strategy ', () => {
        const 
              template = {
                               tpl : [ 'Hey ', '{{name}}', '!']
                             , placeholders: { name: [1] }
                             , spaces: {}
                           }
              ,   data = [ { myName: 'Peter', age: '43'} ]
              ;

        const result = processOps.draw ( { template, data, missField:'{error: No data}'} )
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Hey {error: No data}!')
    }) // it Draw: missField error strategy



    it ( 'Draw: missData strategy "_hide"', () => {
        const 
              template = {
                               tpl : [ 'Hey ', '{{name}}', '!']
                             , placeholders: { name: [1] }
                             , spaces : {}
                           }
              ,   data = [ 
                              { myName: 'Peter', age: '43'} 
                            , { name: 'Ivan', age: '41'} 
                            , { name: 'Ivo', age: '19'} 
                         ]
              ;

        const result = processOps.draw ( { template, data, missData: '_hide'} )
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.be.equal ( 'Hey Ivan!')
        expect ( result[1] ).to.be.equal ( 'Hey Ivo!' )
    }) // it Draw: missData strategy "hide"



    it ( 'Draw: missData error strategy', () => {
        const 
              template = {
                               tpl : [ 'Hey ', '{{name}}', '!']
                             , placeholders: { name: [1] }
                             , spaces : {}
                           }
              ,   data = [ 
                              { myName: 'Peter', age: '43'} 
                            , { name: 'Ivan', age: '41'} 
                            , { name: 'Ivo', age: '19'} 
                         ]
              ;

        const result = processOps.draw ({ template, data, missData: 'Error: Missing data' })
        expect ( result ).to.have.length (3)
        expect ( result[0] ).to.be.equal ( 'Error: Missing data')
        expect ( result[1] ).to.be.equal ( 'Hey Ivan!')
        expect ( result[2] ).to.be.equal ( 'Hey Ivo!' )
    }) // it Draw: missData error strategy



   it ( 'Alter Template', () => {
        const
                 step = { do: 'alterTemplate', data: { 'name':'user', 'age': 'alt'} }
               , sourcePlaceholders = { name : 1, fixed: 'will stay' }
               ;
        const result = processOps.alterTemplate ( step, sourcePlaceholders )
        expect ( sourcePlaceholders ).to.have.property ( 'name' )
        expect ( sourcePlaceholders ).to.not.have.property ( 'user' )
        expect ( sourcePlaceholders ).to.not.have.property ( 'age' )
        expect ( sourcePlaceholders ).to.not.have.property ( 'alt' )
        
        expect ( result ).to.have.property ( 'user' )
        expect ( result ).to.not.have.property ( 'name' )
        expect ( result ).to.not.have.property ( 'age' )
        expect ( result ).to.not.have.property ( 'alt' )
    }) // it alter template



    it ( 'Block', () => {
        const 
              data = [
                         'Hey Ivan!'
                        ,'Hey Ivo!'
                     ]
            , space = ' '
            ;
        const result = processOps.block ( data, space )
        expect ( result ).to.be.an ('array')
        expect ( result ).to.have.length (1)
        expect ( result[0] ).to.be.equal ( 'Hey Ivan! Hey Ivo!')
    }) // it Block
  


    it ( 'Set', () => {
        const 
              data = [
                        'Hey Ivan!'
                       ,'Hey Ivo!'
                     ]
             , step = { do:'set', as: 'text' }
             ;

        const result = processOps.set ( step, data )
        expect ( result ).to.be.an ( 'array' )
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.be.an ('object')
        expect ( result[0] ).to.have.property('text')
        expect ( result[0]['text'] ).to.be.equal ('Hey Ivan!')
    }) // it Set 



    it ( 'Alter', () => {
        const 
               step = { do: 'alter', data: {'user':'text'} }
             , data = [
                          { user: 'Peter', age: 43 }
                        , { user: 'Ivo', age: 19 }
                      ]

        const result = processOps.alter ( step, data )
        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.have.property('text')
        expect ( result[0]['text'] ).to.be.equal ( 'Peter' )
        expect ( result[0] ).to.have.property('age')
        expect ( result[0] ).to.not.have.property('user')
    }) // it alter



    it ( 'Alter with selection "all"', () => {
        const 
               step = { do: 'alter', select:'all', data: {'user':'text'} }
             , data = [
                          { user: 'Peter', age: 43 }
                        , { user: 'Ivo', age: 19 }
                      ]

        const result = processOps.alter ( step, data )
        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.have.property('text')
        expect ( result[0]['text'] ).to.be.equal ( 'Peter' )
        expect ( result[0] ).to.have.property('age')
        expect ( result[0] ).to.not.have.property('user')
    }) // it alter with selection "all"



    it ( 'Alter with selection "first"', () => {
        const 
               step = { do: 'alter', select:'first', data: {'user':'text'} }
             , data = [
                          { user: 'Peter', age: 43 }
                        , { user: 'Ivo', age: 19 }
                      ]

        const result = processOps.alter ( step, data )
        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.have.property('text')
        expect ( result[0]['text'] ).to.be.equal ( 'Peter' )
        expect ( result[0] ).to.have.property('age')
        expect ( result[0] ).to.not.have.property('user')
        expect ( result[1] ).to.have.property ('user')
        expect ( result[1] ).to.not.have.property ('text')
    }) // it alter with selection first



    it ( 'Alter with selection "last"', () => {
        const 
               step = { do: 'alter', select:'last', data: {'user':'text'} }
             , data = [
                          { user: 'Peter', age: 43 }
                        , { user: 'Ivo', age: 19 }
                      ]

        const result = processOps.alter ( step, data )
        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[1] ).to.have.property('text')
        expect ( result[1]['text'] ).to.be.equal ( 'Ivo' )
        expect ( result[1] ).to.have.property('age')
        expect ( result[1] ).to.not.have.property('user')
        expect ( result[0] ).to.have.property ('user')
        expect ( result[0] ).to.not.have.property ('text')
    }) // it alter with selection last



    it ( 'Alter with selection -1', () => {
        const 
               step = { do: 'alter', select:-1, data: {'user':'text'} }
             , data = [
                          { user: 'Peter', age: 43 }
                        , { user: 'Ivo', age: 19 }
                      ]

        const result = processOps.alter ( step, data )
        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.have.property('text')
        expect ( result[0]['text'] ).to.be.equal ( 'Peter' )
        expect ( result[0] ).to.have.property('age')
        expect ( result[0] ).to.not.have.property('user')
        expect ( result[1] ).to.have.property ('user')
        expect ( result[1] ).to.not.have.property ('text')
    }) // it alter with selection -1



    it ( 'Alter with selection 1', () => {
        const 
               step = { do: 'alter', select:1, data: {'user':'text'} }
             , data = [
                          { user: 'Peter', age: 43 }
                        , { user: 'Ivo', age: 19 }
                      ]
             ;

        const result = processOps.alter ( step, data )
        expect ( result ).to.be.an('array')
        expect ( result ).to.have.length (2)
        expect ( result[0] ).to.have.property('text')
        expect ( result[0]['text'] ).to.be.equal ( 'Peter' )
        expect ( result[0] ).to.have.property('age')
        expect ( result[0] ).to.not.have.property('user')
        expect ( result[1] ).to.have.property ('user')
        expect ( result[1] ).to.not.have.property ('text')
    }) // it alter with selection 1
    


    it ( 'Add', () => {
        const 
               step = { do: 'add', select:['first',2], data: {'className': 'simple'} }
             , data = [
                          { user: 'Peter' , age: 43, className: 'test' }
                        , { user: 'Stefan', age: 42, className: ['test','second'] }
                        , { user: 'Ivo'   , age: 19, className: 'test' }
                      ]
             ;
        const result = processOps.add ( step, data );
        expect ( result ).to.have.length (3)
        expect ( result[0]['className'] ).to.be.an ( 'string' )
        expect ( result[0]['className'] ).to.be.equal ( 'test simple' )
        expect ( result[1]['className'] ).to.be.an ( 'string' )
        expect ( result[1]['className'] ).to.be.equal ( 'test second simple' )
        expect ( result[2]['className'] ).to.be.a  ( 'string' )
        expect ( result[2]['className'] ).to.be.equal ( 'test' )
    }) // it add



    it ( 'Copy', () => {
        const 
               step = { do: 'copy', select:['first','last'], data: {'className': 'alt'} }
             , data = [
                          { user: 'Peter', age: 43, className: ['test','first'] }
                        , { user: 'Ivo', age: 19, className: 'test' }
                        , { user: 'Ivan', age: 39, className: 'test' }
                      ]
             ;

        const result = processOps.copy ( step, data )
        expect ( result ).to.have.length (3)
        expect ( result[0] ).to.have.property ( 'alt' )
        expect ( result[0]['alt']).to.be.an ( 'array' )
        expect ( result[0]['alt']).to.includes ( 'test' )
        expect ( result[0]['alt']).to.includes ( 'first' )
        expect ( result[1] ).to.not.have.property ( 'alt')
        expect ( result[2] ).to.have.property ( 'alt')
        expect ( result[2]['alt'] ).to.be.a ('string')
        expect ( result[2]['alt'] ).to.be.equal ('test')
    }) // it copy



    it ( 'Remove', () => {
        const 
               step = { do: 'remove', select:['first','last'], keys: ['className', 'age', 'alt'] }
             , data = [
                          { user: 'Peter', age: 43, className: ['test','first'] }
                        , { user: 'Ivo', age: 19, className: 'test' }
                        , { user: 'Ivan', age: 39, className: 'test' }
                      ]
             ;

        const result = processOps.remove ( step, data )
        expect ( result ).to.have.length (3)
        expect ( result[0] ).to.not.have.property ( 'alt' )
        expect ( result[0] ).to.not.have.property ( 'className' )
        expect ( result[0] ).to.not.have.property ( 'age' )
        expect ( result[1] ).to.have.property ( 'className')
        expect ( result[2] ).to.not.have.property ( 'alt')
        expect ( result[2] ).to.not.have.property ( 'age')
        expect ( result[2] ).to.not.have.property ( 'className')
    }) // it remove



    it ( 'Hook. Function defined', () => {
        const data = [{ user: 'Peter', age:43}];
        const fn = data => [{ user: 'Ivo', age:21}];

        const result = processOps.hook ( data, fn )
        expect ( result[0].user ).to.be.equal ('Ivo')
        expect ( result[0].age  ).to.be.equal (21)
    }) // it hook



    it ( 'Hook. Use step-operation to modify hook data', () => {
    // * Get more details in 'Hook Modifiers' chapter
        const 
              data = [{ user: 'Peter', age: 43 }]
            , fn = (data, modify) =>   modify ( data, { do:'alter', data: {'user':'name'}} )
            ;

        const result = processOps.hook ( data, fn )
        expect ( result[0]      ).to.not.have.property ( 'user' )
        expect ( result[0].name ).to.be.equal ( 'Peter' )
        expect ( result[0].age  ).to.be.equal (43)
    }) // it hook



    it ( 'Hook. Function is not defined', () => {
        const 
              data = [{ user: 'Peter', age:43}]
            , hook = {}
            ;

      
        const result = processOps.hook ( data, hook.test )
        expect ( result).is.an ( 'array' )
        expect ( result ).has.length(1)
        expect ( result[0] ).has.property  ( 'user' )
        expect ( result[0] ).has.property  ( 'age'  )
        expect ( result[0].user ).is.equal ( 'Peter' )
    }) // it hook, no function


    it ( 'Calculate "attr"', () => {
        const 
              createAttributes = processOps._createAttributes
            , attributes = [ 'id', 'name', 'href', 'src', 'value', 'data-test', 'alt', 'role', 'class' ]
            , altAttributes = [ 'id', 'data', 'class']
            , data = { 
                          'href'      : 'test.com/anypage.html'
                        , 'text'      : 'Link to nowhere'
                        , 'className' : 'fashion'
                        , 'data-test' : 'yo'
                        , 'data-again': 'hey'
                        , 'id'        : 'top'
                        , 'name'      : 'Ivan'
                     }
            ;
        
    const result = createAttributes ( data, attributes );
    expect ( result ).to.be.a ( 'string' )
    expect ( result ).to.not.include ( 'text' )
    expect ( result ).to.include ( 'data-test' )
    expect ( result ).to.not.include ( 'data-again' )
    
    const altResult = createAttributes ( data, altAttributes );
    expect ( altResult ).to.be.a ( 'string' )
    expect ( altResult ).to.not.include ( 'text' )
    expect ( altResult ).to.include ( 'data-test' )
    expect ( altResult ).to.include ( 'data-again' )
    expect ( altResult ).to.include ( 'class="fashion"' )

    const 
              placeId = result.indexOf('id')
            , placeHref = result.indexOf('href="')
            , placeClass = result.indexOf ('class="fashion"')
            ;

        expect ( placeClass, "Class attribute is missing" ).to.not.be.equal(-1)
        expect ( null, 'Attribute "id" should be first'           ).to.satisfies ( () => placeId < placeHref ) 
        expect ( null, 'Attribute "href" should be before "class"').to.satisfies ( () => placeHref < placeClass ) 
    }) // it calculate attr

}) // describe 