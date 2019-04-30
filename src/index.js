'use strict';

/* 
   Code Assembly Line
   ==================

    History notes:
     - Project was started on September 23th, 2017.
     - Published on GitHub for first time: November 16th, 2017
     - Version 2.0. January 9th, 2018
     - WatchHooks. April 30th, 2019
*/

const 
       showError         = require ( './errors'             )
     , chop              = require ( './template-chop'      )
     , tools             = require ( './general-tools'      )
     , templateTools     = require ( './template-tools'     )({ chop, showError })
     , help              = require ( './help'               )({ showError })
     , operation         = require ( './process-operations' )({ help })
     , processTools      = require ( './process-tools'      )({ help, showError, operation })
     , lib_Template      = require ( './lib-template'       )({ help, showError, templateTools })
     , lib_Data          = require ( './lib-data'           )({ help, showError })
     , lib_Process       = require ( './lib-process'        )({ help, showError, processTools })
     ;



// Default config object applied to every codeAssembly object.
const codeAssemblyConfig = { 
    overwriteTemplates : false
  , overwriteProcesses : false
  , overwriteData      : false
  , htmlAttributes     : [ 'id', 'name', 'href', 'src', 'value', 'data', 'alt', 'role', 'class' ]
} // config



function codeAssembly ( cfg ) {
            this.templates = {}
            this.processes = {}
            this.data = {}
            this.config = {}

            Object.keys(codeAssemblyConfig).forEach ( k => this.config[k] = codeAssemblyConfig[k] )
            if ( cfg )  Object.keys(cfg).forEach ( k => this.config[k] = cfg[k] )
  } // codeAssembly func.









  
// * Code-Assembly-Line API
codeAssembly.prototype = {
      tools : tools              // Usefull template and process related functions (external)
   
    // Template I/O Operations
    , insertTemplate    : lib_Template.insert     // Insert templates;
    , insertTemplateLib : lib_Template.insertLib  // Insert templates as a template-library;    
    , getTemplate       : lib_Template.get        // Export templates;
    , getTemplateLib    : lib_Template.getLib     // Export templates from template-library;
    , getPlaceholders   : lib_Template.getPlaceholders    // Return placeholders per template;
      
    // Template Manipulation
    , renameTemplate : lib_Template.rename    // Change name of template/templates;
    , removeTemplate : lib_Template.remove    // Remove template/templates;

    // Processes
    , insertProcess    : lib_Process.insert     // Insert new process;
    , insertProcessLib : lib_Process.insertLib  // Insert list of processes with a single operation;
    , mixProcess       : lib_Process.mix        // Set new process as combination of existing processes;
    , getProcessLib    : lib_Process.getLib     // Export processes from process-library;
    , getHooks         : lib_Process.getHooks   // Provide information about hooks available;
    , run              : lib_Process.run        // Execute process/processes;

    // Process Manipulation
    , renameProcess : lib_Process.rename  // Renames a process
    , removeProcess : lib_Process.remove  // Remove process/processes

    // Data I/O
    , insertData    : lib_Data.insert      // Insert data. Save data. Word 'blocks'
    , insertDataLib : lib_Data.insertLib   // Insert set of data
    , getBlock      : lib_Data.getBlock    // Obtain rendered code snippets 
    , getBlocks     : lib_Data.getBlock    

    // Data Manipulation
    , renameData       : lib_Data.rename   // Change name of data record
    , removeData       : lib_Data.remove   // Remove data record from template engine
} // codeAssembly prototype



module.exports = codeAssembly;


