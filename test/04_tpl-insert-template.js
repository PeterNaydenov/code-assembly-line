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



    it ( 'Insert ExternalTemplate', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { 'hello' : 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.have.property ( 'hello' )
         expect ( tplEngine.templates.hello ).to.have.property ('tpl')
         expect ( tplEngine.templates.hello ).to.have.property ('placeholders')
         expect ( tplEngine.templates.hello.tpl ).to.be.an ('array')
    }) // it insert  ExternalTemplate



    it ( 'Insert template as a library member', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { 'simple/ah': 'Hello, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )         

         expect ( tplEngine.templates ).to.have.property ('simple/ah')
    }) // it use alternative name



    it ( 'Wrong data-format', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { hello: { name: 'Hello', age: 43}};

         tplEngine.insertTemplate( tpl )    

         expect ( tplEngine.templates.hello ).to.have.property('error')
         expect ( tplEngine.templates.hello.error ).to.be.equal( errors('wrongDataTemplate') )
         expect ( tplEngine.templates.hello ).to.not.have.property ('tpl')
         expect ( tplEngine.templates.hello ).to.not.have.property ('placeholders')
    }) // it wrong data-format



    it ( 'Insert many ExternalTemplate at once', () => {
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
         const tpl = { 'hello': 'Hello, {{name}}!'};
         const tpl2 = { 'hello': 'Changes are allowed, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )
         tplEngine.insertTemplate( tpl2 )

         expect ( tplEngine.templates ).to.have.property ('hello')
         expect ( tplEngine.templates.hello.tpl ).to.contain ('Hello, ')
    }) // it use alternative name



    it ( 'Overwrite templates is allowed', () => {
         const tplEngine = new codeAssemblyLine ({overwriteTemplates : true});
         const tpl = { 'hello': 'Hello, {{name}}!'};
         const tpl2 = { 'hello': 'Changes are allowed, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )
         tplEngine.insertTemplate( tpl2 )

         expect ( tplEngine.templates ).to.have.property ('hello')
         expect ( tplEngine.templates.hello.tpl ).to.contain ('Changes are allowed, ')
    }) // it use alternative name

}) // Describe Add template


