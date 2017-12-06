'use strict'

// * Error Messages


const msg = {
      'notDefined'        : 'Not defined error.' 
       // Template errors
    , 'brokenTemplate'    : 'Broken string template. Placeholder with missing closing tag.'
    , 'wrongDataTemplate' : 'Broken data template. Object is not according the standards.'
    , 'overwriteTemplate' : 'Error: Overwrite of existing template is not permited by configuration.'
    , 'missingTemplate'   : `Error: Template "%s" doesn't exist.`
       
       // Process errors
    , 'wrongExtProcess'    : 'Wrong process data. Should be an array of "processSteps".'
    , 'emptyExtProcess'    : 'Empty process! Process should contain steps(processSteps)'
    , 'brokenProcess'      : 'Broken process description.'
    , 'missingOperation'   : 'Process has step with missing operation. Set parameter "do".'
    , 'overwriteProcess'   : 'Error: Process with name "%s" is already defined.'
    , 'notaValidOperation' : `Error: "%s" is not a valid operation`

    , 'blockExpectString'  : `Block expects string data. %s`
    , 'dataExpectObject'   : `Data operations require objects. %s`


    // Data errors
    , 'overwriteData'      : 'Error: Data with name "%s" is already defined.'

    // Validation errors
    , 'processNotExists'   : 'Error: Process "%s" does not exist.'
    , 'templateNotExists'  : 'Error: Template "%s" is not available'
    , 'invalidStorageName' : 'Error: Process-step "save" has param "as: %s". Param "as" should be "data", "template" or "process". '
    , 'invalidJSON'        : 'Error: Invalid JSON format was provided for saving in "processes": %s'

  }



const showError = function ( msgName, vars ) {
  let result = msg[msgName] || msg['notDefined'];
  if ( vars ) {
          if ( !(vars instanceof Array))   vars = [vars]
          vars.forEach ( v => result = result.replace('%s', v )   )
    }
  return result
 } // msg func.

module.exports = showError;