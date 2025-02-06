!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).codeAssemblyLine=t()}(this,(function(){"use strict";const e={notDefined:"Not defined error.",brokenTemplate:"Broken string template. Placeholder with missing closing tag.",wrongDataTemplate:"Broken data template. Object is not according the standards.",overwriteTemplate:"Error: Overwrite of existing template is not permited by configuration.",missingTemplate:'Error: Template "%s" doesn\'t exist.',wrongExtProcess:'Wrong process data. Should be an array of "processSteps".',emptyExtProcess:"Empty process! Process should contain steps(processSteps)",brokenProcess:"Broken process description.",missingOperation:'Process has step with missing operation. Set parameter "do".',overwriteProcess:'Error: Process with name "%s" is already defined.',notaValidOperation:'Error: "%s" is not a valid operation',blockExpectString:"Block expects string data. %s",dataExpectObject:"Data operations require objects. %s",overwriteData:'Error: Data with name "%s" is already defined.',processNotExists:'Error: Process "%s" does not exist.',templateNotExists:'Error: Template "%s" is not available',invalidStorageName:'Error: Process-step "save" has param "as: %s". Param "as" should be "data", "template" or "process". ',invalidJSON:'Error: Invalid JSON format was provided for saving in "processes": %s'},t=function(t,r){let s=e[t]||e.notDefined;return r&&(r instanceof Array||(r=[r]),r.forEach((e=>s=s.replace("%s",e)))),s};const r={renameTemplate:function(e,t){const r=Object.keys(t);return Object.keys(e).reduce(((s,o)=>(r.includes(o)?s[t[o]]=e[o]:s[o]=e[o],s)),{})}};const s=["draw","alterTemplate","alter","set","add","copy","remove","hook","block","save"];const o=function({chop:e,showError:t}){const r={str2intTemplate(s){const o=e(s),a=o.includes(t("brokenTemplate"));let n={},c={};if(!a){const e=r._findPlaceholdersAndSpaces(o);c=e.spaces,n=e.placeholders}const i={tpl:o,placeholders:n,spaces:c};return a&&(i.errors=[t("brokenTemplate")]),i},load_interpretTemplate:e=>r=>{let s={};return s="string"==("string"==typeof r?"string":"error")?e(r):{errors:[t("wrongDataTemplate")]},s},_findPlaceholdersAndSpaces(e){const t={},r={};return e.forEach(((e,s)=>{if("{{"==e.slice(0,2)){let o=2,a=-2;const n="~~"==e.slice(2,4),c="~~"==e.slice(-4,-2);n&&(o=4),c&&(a=-4);const i=e.slice(o,a);n&&c?r[i]=3:c?r[i]=2:n&&(r[i]=1),t.hasOwnProperty(i)?t[i].push(s):t[i]=[s]}})),{spaces:r,placeholders:t}}};return r}({chop:function e(r){let s,o,a,n=[];if("string"!=typeof r)return[t("brokenTemplate")];if(0==r.length)return[];if(s=r.indexOf("{{"),0<s&&n.push(r.slice(0,s)),-1==s)return n.push(r),n;{if(a=r.indexOf("{{",s+2),o=r.indexOf("}}"),-1==o)return[t("brokenTemplate")];if(o<s)return[t("brokenTemplate")];if(o+=2,-1!=a&&a<o)return[t("brokenTemplate")];n.push(r.slice(s,o));let c=e(r.slice(o));return n.concat(c)}},showError:t}),a=function({showError:e}){const t={_validateProcess(t,r){let s=[];const o=t.processes.hasOwnProperty(r),a=t.processes[r];return o&&a.errors&&(s=s.concat(a.errors)),o?a.arguments.reduce(((e,t)=>("draw"==t.do&&t.tpl&&e.push(t.tpl),e)),[]).forEach((r=>{const o=t.templates[r];o&&o.errors&&(s=s.concat(o.errors)),o||s.push(e("templateNotExists",r))})):s.push(e("processNotExists",r)),s},_extractLib(e,t){const r=Object.keys(e).filter((e=>e.includes("/")));let s={};if(t)s=t.reduce(((t,s)=>(r.filter((e=>0==e.indexOf(s))).forEach((r=>{const s=r.indexOf("/"),o=r.slice(s+1);t[o]=e[r].tpl.join("")})),t)),{});else{Object.keys(e).forEach((t=>s[t]=e[t].tpl.join("")))}return s},_flatten(e,r=[],s={}){let o=Object.assign({},s),a=!1;if(!e){const[t,s]=r.pop();a=t,e=s}for(let s in e){const n=e[s];let c=s;a&&(c=`${a}/${s}`),"function"!=typeof n&&(t._isPrimitive(n)?o[c]=n:r.push([c,n]))}return 0!=r.length?t._flatten(!1,r,o):o},_isPrimitive:e=>"object"!=typeof e};return t}({showError:t}),n=function({help:e}){const t={draw(r){let{template:s,data:o,sharedData:a,htmlAttributes:n,missField:c,missData:i,hookFn:l}=r,p=[];return o.forEach(((r,o)=>{const d=e._flatten(r),h=Object.keys(d);let u=t._copyList(s.tpl),f=Object.assign({},s.placeholders),m=s.spaces,b="",k="";if(f._attr){const e=f._attr[0];b=m._attr&&m._attr%2?" ":"",k=m._attr&&m._attr>1?" ":"";const r=t._createAttributes(d,n).trim();u[e]=r?`${b}${r}${k}`:"",delete f._attr}if(f._count){const e=f._count;b=m._count&&m._count%2?" ":"",k=m._count&&m._count>1?" ":"",e.forEach((e=>u[e]=`${b}${o+1}${k}`)),delete f._count}h.forEach((e=>{const t=f[e];if(b=m[e]&&m[e]%2?" ":"",k=m[e]&&m[e]>1?" ":"",t){for(let r of t)u[r]=`${b}${d[e]}${k}`;delete f[e]}}));let g=Object.keys(f),y=g.length>0;if(y&&a)for(let e of g)if(a[e]){const t=f[e];b=m[e]&&m[e]%2?" ":"",k=m[e]&&m[e]>1?" ":"",t.forEach((t=>u[t]=`${b}${a[e]}${k}`)),delete f[e]}if(g=Object.keys(f),y=g.length>0,y&&c){let e;switch("_fn"==c&&"function"!=typeof l&&(c="_hide"),c){case"_fn":e=l;break;case"_hide":e=()=>"";break;case"_position":e=e=>e;break;default:e=()=>c}for(let t of g){f[t].forEach((r=>u[r]=e(t)))}}if(y&&i){let e;switch("_fn"==i&&"function"!=typeof l&&(i="_hide"),i){case"_fn":e=e=>[l(e)];break;case"_hide":e=()=>[];break;default:e=()=>[i]}u=e(g)}u.length>0&&p.push(u.join(""))})),p},_createAttributes(e,t){const r={},s=new RegExp("^data-");let o="";for(let a in e)"name"!==a&&("id"!==a?"className"!==a?t.includes(a)?r[a]=`${a}="${e[a]}"`:s.test(a)&&(r[a]=`${a}="${e[a]}"`,o+=` ${r[a]}`):r.class=`class="${e[a]}"`:(r.id=`id="${e[a]}"`,r.name=`name="${e[a]}"`));return t.reduce(((e,t)=>(r[t]&&(e+=` ${r[t]}`),"data"==t&&(e+=` ${o}`),e)),"")},_copyList:e=>e.map((e=>e)),alterTemplate(e,t){const r=e.data,s=Object.keys(t),o={};return s.forEach((e=>{const s=r[e]||e;o[s]=t[e]})),o},block:(e,t)=>[e.join(t)],set(e,t){const r=e.as;return t.reduce(((e,t)=>{if(!t)return e;let s={};return s[r]=t,e.push(s),e}),[])},alter(e,r){const s=e.data,o=Object.keys(s),a=t._normalizeSelection(e.select,r.length);let n=r.map((e=>Object.assign({},e)));return a.forEach((e=>{const t=n[e],r=Object.keys(t);let a={};r.forEach((e=>{let r=t[e];o.includes(e)&&(e=s[e]),a[e]=r})),n[e]=a})),n},_normalizeSelection(e,r){let s=[];return e?("object"!=typeof e&&(e=[e]),e.forEach((e=>{if("all"==e)return s=t._generateList(r),s;switch(e){case"first":s.push(0);break;case"last":s.push(r-1);break;default:e<0?s.push(r-1+e):s.push(e-1)}})),s):(s=t._generateList(r),s)},_generateList(e){let t=[];for(let r=0;r<e;r++)t.push(r);return t},add(e,r){const s=e.data,o=Object.keys(s),a=t._normalizeSelection(e.select,r.length);let n=r.map((e=>Object.assign({},e)));return a.forEach((e=>{const r=n[e];let a=o.reduce(((e,o)=>(r[o]?e[o]=t._combineValues(r[o],s[o]):e[o]=s[o],e)),{});n[e]=Object.assign(r,a)})),n},_combineValues(e,t){let r,s=!1;return"object"!=typeof e&&(s=!0),r=s?[e]:e,r.concat(t).join(" ")},copy(e,r){const s=e.data,o=Object.keys(s),a=t._normalizeSelection(e.select,r.length),n=r.map((e=>Object.assign({},e)));return a.forEach((e=>{o.forEach((t=>{const r=n[e][t],o=s[t];n[e][o]=r}))})),n},remove(e,r){const s=e.keys,o=t._normalizeSelection(e.select,r.length),a=r.map((e=>Object.assign({},e)));return o.forEach((e=>{s.forEach((t=>{delete a[e][t]}))})),a},hook(e,r,s){return r?r(e,t.modify(this,s)):e},_findIfString:e=>"string"==typeof e[0],modify:(e,r)=>function(s,o){let a=o.do,n=t._findIfString(s),c=o.space||" ";switch(a){case"draw":const i=e._getTemplate(o.tpl,r.templates,{}),l=r.data,p=o.missField,d=o.missData,h=!1;return n?(console.error(`Hook-modifier require an 'object' data-segment but has a 'string'. {do:'draw', tpl: '${o.tpl}'}`),s):t[a]({template:i,data:s,sharedData:l,missField:p,missData:d,hookFn:h});case"set":return n?t[a](o,s):(console.error(`Hook-modifier require a 'string' data-segment but has an 'object'. { do:'${o.do}', as:'${o.as}' }`),s);case"block":return n?t[a](s,c):(console.error("Hook-modifier require a 'string' data-segment but have an 'object'. { do:'block' }"),s);default:return n?(console.error(`Data operations require objects but have strings. Data: ${s}`),s):t[a](o,s)}}};return t}({help:a}),c=function({showError:e,operation:t}){const r={interpret(e){const t={steps:[],arguments:[],hooks:[]},s=r._validate(e);return s.length>0?(t.errors=s,t):(e.forEach((e=>{t.steps.push(e.do),t.arguments.push(e),"hook"==e.do&&t.hooks.push(e.name),e.hook&&t.hooks.push(e.hook)})),t)},_validate(t){const r=[];return t instanceof Array?0==t.length?[e("emptyExtProcess")]:(t.forEach((t=>{let o=!1;t.do?(o=s.includes(t.do),o||r.push(e("notaValidOperation",[t.do]))):r.push(e("missingOperation"))})),r):[e("wrongExtProcess")]},_findIfString:e=>"string"==typeof e[0],_copyList(e){let t=e.length,r=[];for(;t--;)r[t]=e[t];return r},_parse(e){try{return JSON.parse(e)}catch(e){return!1}},_setupDrawDependencies:(e,t,r,s,o)=>({template:r,data:s,sharedData:e.data,htmlAttributes:e.config.htmlAttributes,missField:t.missField||!1,missData:t.missData||!1,hookFn:o}),_getTemplate(e,t,r){let s={},o=t[e],a=r[e]||t[e].placeholders,n=Object.keys(a);return s.tpl=o.tpl.map((e=>e)),s.spaces=Object.assign({},o.spaces),s.placeholders={},n.forEach((e=>{s.placeholders[e]=a[e].map((e=>e))})),s},run(s,o,a){let n=this,c=n.templates,i=o,l=r._findIfString(i),p=r._getTemplate,d=r._setupDrawDependencies,h={};return s.steps.forEach(((o,u)=>{const f=s.arguments[u];let m,b=f.watchHook&&a[f.watchHook]||!1,k=[],g=null!=f.space?f.space:" ",y=f.method||"add";switch(o){case"draw":m=f.tpl,l&&console.warn(e("dataExpectObject",`Step "draw" with template "${m}"`));const s=a&&a[f.hook]||!1,u=!(null==f.as);if(b)i.forEach((e=>{let[r,a]=b(e,m),i=p(a,c,h),l={};r instanceof Array||(r=[r]),l=d(n,f,i,r,s),k=k.concat(t[o](l))})),u&&(k=[k.join(g)]);else{const e=p(m,c,h),r=d(n,f,e,i,s);k=t[o](r)}u?i=i.reduce(((e,t,r)=>{switch(y){case"add":t[f.as]||(t[f.as]=k[r]);break;case"update":t[f.as]&&(t[f.as]=k[r]);break;case"overwrite":t[f.as]=k[r];break;case"heap":t[f.as]+=g+k[r]}return e.push(t),e}),[]):(i=k,l=!0);break;case"block":if(!l)return void console.error(e("blockExpectString",JSON.stringify(i)));const E=f.space||"";if(i=t[o](i,E),f.name){let e={};e[`block/${f.name}`]=i.join(""),n.insertData(e,y)}break;case"add":i=t[o](f,i);break;case"alterTemplate":m=f.tpl;const _=c[m];h[m]=t[o](f,_.placeholders);break;case"set":i=t[o](f,i),l=!1;break;case"hook":let j=f.as||!1,w=[];if(i.forEach(((e,s)=>{const c=[e,s];w.push(t[o].call(r,c,a[f.name],n)[0])})),j){i=i.map(((e,t)=>{const r=w[t],s=r instanceof Array?r.join(g):r;switch(y){case"add":e[j]||(e[j]=s);break;case"update":e[j]&&(e[j]=s);break;case"overwrite":e[j]=s;break;case"heap":e[j]+=g+s}return e}));break}i=w.reduce(((e,t)=>{const s=t instanceof Array,o=r._findIfString(t);return s&&o?(t=t.join(g),e.push(t),e):s?e=e.concat(t):(e.push(t),e)}),[]),l=r._findIfString(i);break;case"save":const O="block"!=f.as?f.name:`block/${f.name}`;let v={};switch(f.as){case"block":case"data":if(!l){console.log(e("blockExpectString",JSON.stringify(i)));break}v[O]=i.join(""),n.insertData(v,y);break;case"template":v[O]=i[0],n.insertTemplate(v,y);break;case"process":let t=r._parse(i[0]);t?n.insertProcess(t,O):console.error(e("invalidJSON",i[0]));break;default:return void console.error(e("invalidStorageName",f.as))}}})),i}};return r}({showError:t,operation:n}),i=function({help:e,templateTools:t,showError:r}){const s=t.str2intTemplate,o=t.load_interpretTemplate(s),a={insert(e,t="add"){let r=this;return Object.keys(e).forEach((s=>{const a=null!=r.templates[s];if((!a||"add"!=t)&&(a||"update"!=t))if(a&&"heap"==t){let t=r.templates[s].tpl.join("")+" "+e[s];r.templates[s]=o(t)}else r.templates[s]=o(e[s])})),r},insertLib(e,t,r="add"){let s=this;return Object.keys(e).forEach((o=>{const n={};n[`${t}/${o}`]=e[o],a.insert.call(s,n,r)})),s},rename(e){const t=this,s=Object.keys(e),o=t.config.overwriteTemplates;return s.forEach((s=>{if(!t.templates[s])return;const a=e[s];!!!t.templates[a]||o?(t.templates[a]=t.templates[s],delete t.templates[s]):console.error(r("overwriteTemplate"))})),t},remove(e){const t=this;let r;if(e instanceof Array)r=e;else{r=Object.keys(arguments).map((e=>arguments[e]))}return r.forEach((e=>delete t.templates[e])),t},get(e){const t=this.templates;let r;if(e instanceof Array)r=e;else{r=Object.keys(arguments).map((e=>arguments[e]))}return r.reduce(((e,r)=>(t[r]?e[r]=t[r].tpl.join(""):e[r]="",e)),{})},getLib(t){let r;if(null==t)r=null;else if(t instanceof Array)r=t;else{r=Object.keys(arguments).map((e=>arguments[e]))}return e._extractLib(this.templates,r)},getPlaceholders(e){const t=this.templates[e];return t?Object.keys(t.placeholders):[]}};return a}({help:a,showError:t,templateTools:o}),l=function({help:e,showError:t}){const r={insert(t,r="add"){const s=this,o=e._flatten(t);return Object.keys(o).forEach((e=>{const t=!!s.data[e];t&&"add"==r||(t||"update"!=r)&&(t&&"heap"==r?s.data[e]+=" "+o[e]:s.data[e]=o[e])})),s},insertLib(t,r,s="add"){const o=this,a=e._flatten(t);return Object.keys(a).forEach((e=>{const t=`${r}/${e}`,n=o.data[t];n&&"add"==s||(n||"update"!=s)&&(n&&"heap"==s?o.data[t]+=" "+a[e]:o.data[t]=a[e])})),o},rename(e){const r=this,s=Object.keys(e),o=r.config.overwriteData;return s.forEach((s=>{if(!r.data[s])return;const a=e[s];!!!r.data[a]||o?(r.data[a]=r.data[s],delete r.data[s]):console.error(t("overwriteData",a))})),r},remove(e){const t=this;let r;if(e instanceof Array)r=e;else{r=Object.keys(arguments).map((e=>arguments[e]))}return r.forEach((e=>delete t.data[e])),t},getBlock(e){const t=this;let r=[];if(e instanceof Array)r=e;else{r=Object.keys(arguments).map((e=>arguments[e]))}return r.reduce(((e,r)=>e+=t.data[`block/${r}`]?t.data[`block/${r}`]:""),"")}};return r}({help:a,showError:t}),p=function({help:e,showError:t,processTools:r}){const s={insert(e,s,o="add"){const a=this,n=a.processes[s]||!1;switch(o){case"add":if(n)return void console.error(t("overwriteProcess",s));break;case"update":if(!n)return void console.error(`Can not update process "${s}". It is still not defined.`)}return a.processes[s]=r.interpret(e),a},insertLib(e,t){return Object.keys(e).forEach((r=>{const o=t?`${t}/${r}`:r;let a;e[r]instanceof Array&&(a=[].concat(e[r]),s.insert.call(this,a,o))})),this},mix(e,r,s="add"){const o=this,a=o.processes,n=o.processes[r]||!1;let c={};switch(s){case"add":if(n)return console.error(t("overwriteProcess",r)),o;break;case"update":if(!n)return console.error(t("overwriteProcess",r)),o}return c.steps=[],c.arguments=[],c.hooks=[],e.forEach((e=>{if(!a[e])return;const t=a[e],r=t.hooks.map((t=>`${e}/${t}`)),s=t.arguments.map((t=>"hook"!=t.do?t:{do:"hook",name:`${e}/${t.name}`}));c.steps=c.steps.concat(t.steps),c.arguments=c.arguments.concat(s),c.hooks=c.hooks.concat(r)})),o.processes[r]=c,o},getLib(e){const t=this,r=Object.keys(t.processes),s=!e;return r.reduce(((r,o)=>{if(s)r[o]=t.processes[o].arguments;else if(o.includes(e)){const e=o.split("/");e.shift();r[e.join("/")]=t.processes[o].arguments}return r}),{})},rename(e){const r=this,s=Object.keys(e),o=r.config.overwriteProcesses;return s.forEach((s=>{if(!r.processes[s])return;const a=e[s];!!!r.processes[a]||o?(r.processes[a]=r.processes[s],delete r.processes[s]):console.error(t("overwriteProcess",a))})),r},remove(e){const t=this;let r;if(e instanceof Array)r=e;else{r=Object.keys(arguments).map((e=>arguments[e]))}return r.forEach((e=>delete t.processes[e])),t},getHooks(e){if(this.processes.hasOwnProperty(e)){return this.processes[e].hooks.reduce(((e,t)=>(e[t]=void 0,e)),{})}return{}},run(t,s,o){t instanceof Array||(t=[t]);let a,n=t.reduce(((t,r)=>{const s=e._validateProcess(this,r);return t.concat(s)}),[]);if(a=null==s?[{}]:s instanceof Array?s:[s],0==n.length){let e=a;return t.forEach((t=>{e=r.run.call(this,this.processes[t],e,o)})),e}return console.error(n),n}};return s}({help:a,showError:t,processTools:c}),d={htmlAttributes:["id","name","href","src","value","data","alt","role","class"]};function h(e){this.templates={},this.processes={},this.data={},this.config={},Object.keys(d).forEach((e=>this.config[e]=d[e])),e&&Object.keys(e).forEach((t=>this.config[t]=e[t]))}return h.prototype={tools:r,insertTemplate:i.insert,insertTemplateLib:i.insertLib,getTemplate:i.get,getTemplateLib:i.getLib,getPlaceholders:i.getPlaceholders,renameTemplate:i.rename,removeTemplate:i.remove,insertProcess:p.insert,insertProcessLib:p.insertLib,mixProcess:p.mix,getProcessLib:p.getLib,getHooks:p.getHooks,run:p.run,renameProcess:p.rename,removeProcess:p.remove,insertData:l.insert,insertDataLib:l.insertLib,getBlock:l.getBlock,getBlocks:l.getBlock,renameData:l.rename,removeData:l.remove},h}));
