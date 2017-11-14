'use strict';
<% if (props.importPkgDevDeps && props.importPkgDevDeps.length > 0) { -%>
import '<%- props.importPkgDevDeps.join("\';\rimport \'") %>';
<% }; -%>
<% if (props.importPkgDeps && props.importPkgDeps.length > 0) { -%>
import '<%- props.importPkgDeps.join("\';\rimport \'") %>';
<% }; -%>
<% -%>
<% if (props.ngSrcDeps && props.ngSrcDeps.length > 0) { -%>
import '<%- props.ngSrcDeps.join("\';\rimport \'") %>';
<% }; -%>
<% /*the filenames in have paths, they need to be trimmed for the di*/ -%>
<% let ngSrcDepsFileNames = []; -%>
<% props.ngSrcDeps.forEach(file => { -%>
<% /*the template assumes all file dependencies are \*\*\/\*.module.js files*/ -%>
<%  ngSrcDepsFileNames.push(file.substring(file.lastIndexOf('/') + 1, file.indexOf('.module'))); -%>
<% }); -%>
<% let allDiDeps = props.ngNonSrcDeps.concat(ngSrcDepsFileNames) -%>

export default angular.module('<%= props.moduleName %>', [
  <% if (allDiDeps && allDiDeps.length > 0) { -%>
  '<%- allDiDeps.join("\'\r\t, \'") %>'
  <% } -%>
  ]
);
