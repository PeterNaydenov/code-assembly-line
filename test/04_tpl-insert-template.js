'use strict';

const 
        chai = require ('chai')
      , expect = chai.expect
      , codeAssemblyLine = require ( '../index' )
      , errors = require ( '../errors' )
      ;


describe ( 'Templates', () => {
    
    it ( 'Start Code Assembly Line', () => {
        const tplEngine = new codeAssemblyLine ();

        expect ( tplEngine ).to.have.property ( 'templates' )
        expect ( tplEngine ).to.have.property ( 'processes' )
        expect ( tplEngine ).to.have.property ( 'data'      )
        expect ( tplEngine ).to.have.property ( 'config'    )
    }) // it create Grain Tuple



    it ( 'Insert ExtTempalteString', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { name:'hello', tpl: 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.have.property ( 'hello' )
         expect ( tplEngine.templates.hello ).to.have.property ('tpl')
         expect ( tplEngine.templates.hello ).to.have.property ('placeholders')
         expect ( tplEngine.templates.hello.tpl ).to.be.an ('array')
    }) // it insert  ExtTempalteString



    it ( 'Change template name during insert', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { name:'hello', tpl: 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl , 'ahoy' )         

         expect ( tplEngine.templates ).to.have.property ('ahoy')
         expect ( tplEngine.templates ).to.not.have.property ('hello')
    }) // it use alternative name



    it ( 'Insert template as a library member', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { name:'simple/ah', tpl: 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.have.property ('simple/ah')
    }) // it use alternative name



    it ( 'Insert ExtSimpleTemplate', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { hello: 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.have.property ( 'hello' )
         expect ( tplEngine.templates.hello ).to.have.property ('tpl')
         expect ( tplEngine.templates.hello ).to.have.property ('placeholders')
         expect ( tplEngine.templates.hello.tpl ).to.be.an ('array')
    }) // it insert ExtSimpleTemplate



    it ( 'Insert template and forget the name', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { tpl: 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.be.empty
    }) // it insert template and forget the name
    
    
    
    it ( 'Insert ExtSimpleTemplate with altername', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { hello: 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl, 'up' )         

         expect ( tplEngine.templates       ).to.have.property ( 'up' )
         expect ( tplEngine.templates['up'] ).to.have.property ('tpl')
         expect ( tplEngine.templates['up'] ).to.have.property ('placeholders')
         expect ( tplEngine.templates['up']['tpl'] ).to.be.an ('array')
    }) // it insert ExtSimpleTemplate with altername



    it ( 'Insert ExtTemplateData', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { name:'test', tpl: ['hello, ', '{{user}}'], placeholders: {user:[1]} };
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.have.property ( 'test' )
         expect ( tplEngine.templates ).to.not.have.property ( 'error' )
         expect ( tplEngine.templates.test ).to.have.property ( 'placeholders' )
         expect ( tplEngine.templates.test ).to.have.property ( 'tpl' )
    }) // it insert extTemplateData



    it ( 'Insert ExtTemplateData without placeholders', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { name:'test', tpl: ['hello, ', '{{user}}']  };
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.have.property ( 'test' )
         expect ( tplEngine.templates ).to.not.have.property ( 'error' )
         expect ( tplEngine.templates.test ).to.have.property ( 'placeholders' )
         expect ( tplEngine.templates.test ).to.have.property ( 'tpl' )
    }) // it insert extTemplateData



    it ( 'Wrong data-format', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { hello: { name: 'Hello', age: 43}};

         tplEngine.insertTemplate( tpl )    

         expect ( tplEngine.templates.hello ).to.have.property('error')
         expect ( tplEngine.templates.hello.error ).to.be.equal( errors.wrongDataTemplate )
         expect ( tplEngine.templates.hello ).to.not.have.property ('tpl')
         expect ( tplEngine.templates.hello ).to.not.have.property ('placeholders')
    }) // it wrong data-format



    it ( 'Insert many ExtSimpleTemplate at once', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { 
                           hello: 'Hello, {{name}}!'
                         , birthday: 'Happy birthday {{name}}'
                      };
         
         tplEngine.insertTemplate ( tpl )

         expect ( tplEngine.templates ).to.have.property ( 'hello' )
         expect ( tplEngine.templates ).to.have.property ( 'birthday' )
    }) // it insert many ExtSimpleTemplate



    it ( 'Overwrite templates is forbidden', () => {
         const tplEngine = new codeAssemblyLine ({overwriteTemplates : false});
         const tpl = { name:'hello', tpl: 'Hello, {{name}}!'};
         const tpl2 = { name:'hello', tpl: 'Changes are allowed, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )
         tplEngine.insertTemplate( tpl2 )

         expect ( tplEngine.templates ).to.have.property ('hello')
         expect ( tplEngine.templates.hello.tpl ).to.contain ('Hello, ')
    }) // it use alternative name



    it ( 'Overwrite templates is allowed', () => {
         const tplEngine = new codeAssemblyLine ({overwriteTemplates : true});
         const tpl = { name:'hello', tpl: 'Hello, {{name}}!'};
         const tpl2 = { name:'hello', tpl: 'Changes are allowed, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )
         tplEngine.insertTemplate( tpl2 )

         expect ( tplEngine.templates ).to.have.property ('hello')
         expect ( tplEngine.templates.hello.tpl ).to.contain ('Changes are allowed, ')
    }) // it use alternative name

}) // Describe Add template


