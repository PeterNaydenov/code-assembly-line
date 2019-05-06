'use strict';

const 
        chai = require ('chai')
      , expect = chai.expect
      , codeAssemblyLine = require ( '../src/index' )
      , errors = require ( '../src/errors' )
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



    it ( 'Insert ExternalTemplate, method="update" on existing field', () => {
         const 
               tplEngine = new codeAssemblyLine ()
             , tpl  = { 'hello' : 'Hello, {{name}}!'}
             , tpl1 = { 'hello' : 'Hi, {{name}}!'   }
             ;
         
         tplEngine
            .insertTemplate ( tpl )
            .insertTemplate ( tpl1, 'update')

          const tlib = tplEngine.templates

         expect ( tlib ).to.have.property ( 'hello' )
         expect ( tlib.hello ).to.have.property ('tpl')

         expect ( tlib.hello.tpl[0]).to.be.equal ( 'Hi, ' )

         expect ( tlib.hello ).to.have.property ('placeholders')
         expect ( tlib.hello.tpl ).to.be.an ('array')
    }) // it insert  ExternalTemplate, method="update" on existing field



    it ( 'Insert ExternalTemplate, method="update" on non-existing field', () => {
         const 
               tplEngine = new codeAssemblyLine ()
             , tpl  = { 'hello' : 'Hello, {{name}}!'}
             , tpl1 = { 'hi' : 'Hi, {{name}}!'   }
             ;
         
         tplEngine
            .insertTemplate ( tpl )
            .insertTemplate ( tpl1, 'update')

         const tlib = tplEngine.templates

         expect ( tlib ).to.have.property ( 'hello' )
         expect ( tlib ).to.not.have.property ( 'hi' )
         expect ( tlib.hello ).to.have.property ('tpl')
         
         expect ( tlib.hello.tpl[0]).to.be.equal ( 'Hello, ' )

         expect ( tlib.hello ).to.have.property ('placeholders')
         expect ( tlib.hello.tpl ).to.be.an ('array')
    }) // it insert  ExternalTemplate, method="update" on non-existing field



    it ( 'Insert ExternalTemplate, method="heap" on existing field', () => {
         const 
               tplEngine = new codeAssemblyLine ()
             , tpl  = { 'hello' : 'Hello, {{name}}!'}
             , tpl1 = { 'hello' : 'Hi, {{name}}!'   }
             ;
         
         tplEngine
            .insertTemplate ( tpl )
            .insertTemplate ( tpl1, 'heap')

          const namePositions = tplEngine.templates.hello.placeholders.name.join(',')
         
          expect ( namePositions ).to.be.equal ( '1,3' )
    }) // it insert  ExternalTemplate, method="heap" on existing field



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

         expect ( tplEngine.templates.hello ).to.have.property('errors')
         expect ( tplEngine.templates.hello.errors[0] ).to.be.equal( errors('wrongDataTemplate') )
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
         const tplEngine = new codeAssemblyLine ();
         const tpl = { 'hello': 'Hello, {{name}}!'};
         const tpl2 = { 'hello': 'Changes are allowed, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )
         tplEngine.insertTemplate( tpl2 )

         expect ( tplEngine.templates ).to.have.property ('hello')
         expect ( tplEngine.templates.hello.tpl ).to.contain ('Hello, ')
    }) // it use alternative name



    it ( 'Overwrite templates is allowed', () => {
         const tplEngine = new codeAssemblyLine ();
         const tpl = { 'hello': 'Hello, {{name}}!'};
         const tpl2 = { 'hello': 'Changes are allowed, {{name}}!'};
         
         tplEngine.insertTemplate( tpl )
         tplEngine.insertTemplate( tpl2, 'overwrite' )

         expect ( tplEngine.templates ).to.have.property ('hello')
         expect ( tplEngine.templates.hello.tpl ).to.contain ('Changes are allowed, ')
    }) // it use alternative name

}) // Describe Add template


