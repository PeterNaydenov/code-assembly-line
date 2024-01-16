'use strict'

import { expect } from 'chai'
import CodeAssemblyLine from '../src/index.js'



describe ( 'Tools', () => {
    
it ( 'Rename templates', () => {
    const
            tplEngine  = new CodeAssemblyLine()
            , tplLib     = { 
                                'random' : 'Some text with {{place}}.' 
                              , 'hi'     : 'Hi {{user}}'
                            }
            ;

    const result =  tplEngine.tools.renameTemplate ( tplLib, { 'hi':'hello'} )

    expect ( result ).to.have.property('hello')
    expect ( result ).to.not.have.property('hi')
}) // it modify template
    
}) // describe Tools