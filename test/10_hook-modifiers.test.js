'use strict'

const 
        chai       = require ('chai')
      , expect     = chai.expect
      , help       = require ( '../src/help' )
      , operation = require ( '../src/process-operations' )({ help })
      , errors     = require ( '../src/errors' )
      ;


describe ( 'Hook Modifiers', () => {

    it ( 'Alter', () => {
        const 
              data = [
                          { user: 'Peter' , age: 43 }
                        , { user: 'Ivo' , age: 19 }
                        , { user: 'Ivan' , age: 39 }
                     ]
            , hook = {}
            ;

        let sample,update;

        hook.test = function ( data , modify ) {
             const step = { do:'alter', data: {'age':'alt'}, select: 'first' };
             update = modify ( data, step );
             sample = data;
             return update;
           }
      
        const final = operation.hook ( data, hook.test )
        expect ( sample[0] ).to.have.property ('age')
        expect ( sample[0] ).to.not.have.property ('alt')
        expect ( update[0] ).to.not.have.property ( 'age' )
        expect ( update[0] ).to.have.property ( 'alt' )
        expect ( final[0]  ).to.not.have.property ( 'age' )
        expect ( final[0]  ).to.have.property ( 'alt' )
        expect ( final[0]['alt'] ).to.be.equal ( 43 )

        expect ( update[1] ).to.have.property ('age')
        expect ( update[1] ).to.not.have.property ('alt')
        expect ( final[1] ).to.have.property ('age')
        expect ( final[1] ).to.not.have.property ('alt')
    }) // it alter
    


    it ( 'Add', () => {
        const data = [{ user: 'Peter' }];

        let sample , update;

        function testFn ( data , modify ) {
             const step = { do : 'add', data: {'age':43}   };
             update = modify ( data,  step );
             sample = data
             return update
           }
      
        const final = operation.hook ( data, testFn )
        
        expect ( sample[0] ).to.not.have.property ('age')
        expect ( update[0] ).to.have.property ( 'age' )
        expect ( final[0]  ).to.have.property ( 'age' )
        expect ( final[0]['age'] ).to.be.equal ( 43 )
    }) // it add



    it ( 'Copy', () => {
        const data = [{ user: 'Peter', age:43 }];
        
        let sample, update;

        function testFn ( data , modify ) {
                  const step = { do:'copy', data: {'age':'alt'} };
                  update = modify ( data, step )
                  sample = data
                  return update
            }
      
        const final = operation.hook ( data, testFn )
        expect ( sample[0] ).to.have.property ('age')
        expect ( sample[0] ).to.not.have.property ('alt')
        expect ( update[0] ).to.have.property ('age')
        expect ( update[0] ).to.have.property ('alt')
        expect ( update[0]['alt'] ).to.be.equal ( data[0].age )
        expect ( final[0]  ).to.have.property ('age')
        expect ( final[0]  ).to.have.property ('alt')
        expect ( final[0]['alt'] ).to.be.equal ( data[0].age )
    }) // it copy



    it ( 'Remove', () => {
        const data = [{ user: 'Peter', age:43 }];
        let update, sample;

        function testFn ( data , modify ) {
                 update = modify ( data, { do : 'remove', keys : ['age']} )
                 sample  = data
                 return update
            }
      
        const final = operation.hook ( data, testFn )
        expect ( sample[0] ).to.have.property ('age')
        expect ( update[0] ).to.not.have.property ('age')
        expect ( final[0]  ).to.not.have.property ('age')
    }) // it remove



    it ( 'Modification not allowed', () => {
        const data = ['Hello Peter', 'Hello Ivan' ];
        let update, sample;

        function testFn ( data , modify ) {
             update = modify ( data, {do:'remove', keys:['age']} )
             sample  = data
             return update
           }
      
        const final = operation.hook ( data, testFn )
        expect ( sample[0] ).to.be.a ( 'string' )
        expect ( update[0] ).to.be.equal ( 'Hello Peter' )
        expect ( final[0]  ).to.be.equal ( 'Hello Peter' )
    }) // it not allowed



}) // describe


