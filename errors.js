'use strict'

// * Error Messages


const errors = {
       
       // Template errors
      'brokenTemplate'    : 'Broken string template. Placeholder with missing closing tag.'
    , 'wrongDataTemplate' : 'Broken data template. Object is not according the standards.'
       
       // Process errors
    , 'wrongExtProcess'   : 'Wrong process data. "extProcess" should be an array of "processSteps".'
    , 'emptyExtProcess'   : 'Empty process! Process should contain steps(processSteps)'
    , 'brokenProcess'     : 'Broken process description.'
    , 'missingOperation'  : 'Process has step with missing operation. Set parameter "do".' 
}

module.exports = errors;