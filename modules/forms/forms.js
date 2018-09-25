// Form API

const fs = require('fs');
const fetch = require('node-fetch');
const utils = require('../../modules/utils');

module.exports = function () {

  const constraints = {};
  let global_js_header = '';

  const addItem = function addItem(field, element) {
    constraints[field] = element;
  };

  return {

    validationOutput: function () {
      return constraints;
    },

    formJSHeader: function () {
      return global_js_header;
    },

    inputTextAreaField: (params) => {
      const field_name = (params.name) ? params.name : utils.slugify(params.title);
      let ValidationPattern, DataError, RequiredLabel = '';
      if (params.validation !== false) {
        addItem(field_name, params.validation);
        RequiredLabel = '<span class="form-required" title="This field is required.">*</span>';
      }

      return `
<div class="form-group">
  <label>${params.title} ${RequiredLabel} </label>
  <textarea class="form-control ${params.class}" rows="3" id = "${params.id}" name = "${field_name}" placeholder="Enter ...">${params.value}</textarea>
  <div class="messages"></div>
  <div class="form-text text-muted help-text">${params.helpText}</div>
</div>
`;
    },

    inputCheckBoxField: (params) => {
      let collapsed = '';
      const field_name = (params.name) ? params.name : utils.slugify(params.title);
      if (params.settings.collapsed) {
        collapsed = "collapse";
      }
      if (params.settings.collapsed) {
        collapsed = 'collapse';
      }
      let ValidationPattern, DataError, RequiredLabel = '';
      if (params.validation !== false) {
        addItem(field_name, params.validation);
        RequiredLabel = '<span class="form-required" title="This field is required.">*</span>';
      }

      let checked = '';
      if (params.value == true) {
        checked = 'checked';
      }

      return `
  <div class="checkbox ${params.class} ${collapsed}">
    <label>
      <input type="checkbox" title="${params.title}" id="${params.id}" name="${field_name}" value="${params.value}" ${checked}>
      ${params.title} ${RequiredLabel}
    </label>
    <div class="messages"></div>
    <div class="form-text text-muted help-text">${params.helpText}</div>
  </div>
`;
    },


    inputRadioField: (params) => {
      let collapsed = '';
      const field_name = (params.name) ? params.name : utils.slugify(params.title);
      if (params.settings.collapsed) {
        collapsed = "collapse";
      }
      let ValidationPattern, DataError, RequiredLabel = '';
      if (params.validation !== false) {
        addItem(field_name, params.validation);
        RequiredLabel = '<span class="form-required" title="This field is required.">*</span>';
      }

      let checked = '';
      if (params.value == true) {
        checked = 'checked';
      }

      return `
<div class="form-group">
  <div class="radio">
    <label>
      <input type="radio" class="${params.class}" id = "${params.id}" name = "${field_name}" value = "${params.value}" ${checked}>
      ${params.title} ${RequiredLabel}
    </label>
    <div class="messages"></div>
    <div class="form-text text-muted help-text">${params.helpText}</div>
  </div>
</div>
`;
    },

    inputTextField: (params) => {
      let multiple = '';
      let max = '';
      let addMore = '';
      let multiInputGroupBegin = '';
      let multiInputGroupEnd = '';
      let collapsed = '';
      const field_name = (params.name) ? params.name : utils.slugify(params.title);
      if (params.settings.collapsed) {
        collapsed = "collapse";
      }
      let ValidationPattern, DataError, RequiredLabel = '';
      if (params.validation !== false) {
        addItem(field_name, params.validation);
        // console.log(constraints);
        // ValidationPattern = params.validation.pattern;
        // DataError = params.validation.error;
        RequiredLabel = '<span class="form-required" title="This field is required.">*</span>';
      }
      if (params.settings) {
        if (params.settings.cardinality > 0) {
          multiInputGroupBegin = '<tr class="form-group"><td class="input-group">';
          multiInputGroupEnd = '</td></tr>';
          multiple = 'multiple-form-group';
          max = `data-max="${params.settings.cardinality}"`;
          addMore = '<span class="input-group-btn"><button type="button" class="btn btn-default btn-add">+</button></span><div class="messages"></div>';
        }
      }
      if (params.ajax) {
        global_js_header += `
$("#${params.id}").autocomplete({
  source: function(request, response) {
    $.ajax( {
      url: '${params.remote_url}',
      data: {
        term: request.term
      },
      beforeSend: function(xhr) {
      },
      success: function(data) {
        response(data);
      }
    } );
  },
  minLength: 1,
  select: function( event, ui ) {
    $("#${params.id}").val(ui.item.value);
    //$("#hidden_${params.id}").val(ui.item.node_id);
    return false;
  }
});
        `;
      }

      return `
<div class="form-group cont-block-${field_name} ${params.class} ${multiple} ${collapsed}" ${max}>
  <label>${params.title} ${RequiredLabel} </label>
  <table>
    <tbody id="tableDragTest">
      ${multiInputGroupBegin}
      <input type="text" class="form-control" id = "${params.id}" name = "${field_name}" value = "${params.value}" placeholder="Enter ...">
      <div class="messages"></div>
      ${addMore}
      ${multiInputGroupEnd}
    </tbody>
  </table>
  <div class="form-text text-muted help-text">${params.helpText}</div>
  </div>
`;
    },

    inputDateField: (params) => {
      if (params.settings.collapsed) {
        collapsed = "collapse";
      }
      return `
      <div class="form-group ${params.class} ${collapsed}">
        <label>${params.title}</label>
        <div class="input-group">
          <div class="input-group-addon">
            <i class="fa fa-calendar"></i>
          </div>
          <input type="text" value="${params.value}" title="${params.title}" class="form-control pull-right publishing-timestamp" id="${params.id}-timestamp">
        </div>
      </div>`;
    },

    inputListField: (params) => {
      let collapsed = '';
      const field_name = (params.name) ? params.name : utils.slugify(params.title);
      if (params.settings.collapsed) {
        collapsed = "collapse";
      }
      let ValidationPattern, DataError, RequiredLabel = '';
      if (params.validation !== false) {
        addItem(field_name, params.validation);
        RequiredLabel = '<span class="form-required" title="This field is required.">*</span>';
      }

      const multiSelect = (params.multiselect) ? ' multiple="multiple"' : '';

      // console.log(typeof params.list_values);
      let listValuesDOM = '';
      if (typeof params.list_values == 'string') {
        params.list_values = JSON.parse(fs.readFileSync(params.list_values, 'utf8'));
      }

      Object.keys(params.list_values).forEach((key) => {
        const selectedVal = (params.value === key) ? 'selected' : '';
        listValuesDOM += `<option title="${params.list_values[key]}" value="${key}" ${selectedVal}>${params.list_values[key]}</option>`;
      });

      return `
<div class="form-group ${params.class} ${collapsed}">
  <label>${params.title} ${RequiredLabel}</label>
  <div class="form-text text-muted help-text">${params.helpText}</div>
  <select class="form-control select2 ${params.class}" id = "${params.id}" name = "${field_name}" ${multiSelect}>`
        +
        listValuesDOM
        +
        `
  </select>
<div class="messages"></div>
</div>`;
    },

    fieldGroup: function (params) {
      let collapse = '';
      let collapsed = '';
      if (params.settings.collapsed) {
        collapsed = 'collapse';
      }
      if (params.settings.collapseTarget) {
        collapse = `data-toggle="collapse" data-target=".${params.settings.collapseTarget}"`;
      }
      const title = params.label || params.name;
      let fcHTML = '';
      fcHTML = `<legend class="fieldset-legend" ${collapse}>
      <h4>${title}<span id="${utils.slugify(params.name)}-badges" class="fieldgroup-badges"></span><i class="fa fa-fw fa-chevron-down pull-right"></i></h4>
      </legend><div class="fieldset-content fieldset-wrapper fieldset-${utils.slugify(params.name)} ${collapsed} ${params.settings.collapseTarget}" id="fieldset-${utils.slugify(params.name)}">`;
      Object.keys(params.fields).forEach((key) => {
        fcHTML += this[params.fields[key].inputType](params.fields[key]);
      });
      fcHTML += `</div>`;
      return fcHTML;

    },


    fieldCollection: function (params) {
      let multiple = '';
      let max = '';
      let addMore = '';
      let multiInputGroupBegin = '';
      let multiInputGroupEnd = '';
      if (params.settings) {
        if (params.settings.cardinality > 0) {
          multiInputGroupBegin = `<div class="form-group input-group">`;
          multiInputGroupEnd = `</div>`;
          multiple = 'multiple-form-group';
          max = `data-max="${params.settings.cardinality}"`;
          addMore = `<span class="input-group-btn"><button type="button" class="btn btn-default btn-add">+</button></span><div class="messages"></div>`;
        }
      }
      let fcHTML = '';
      fcHTML = `<legend class="fieldset-legend">
      <span class="fieldset-title fieldset-legend">${params.name}</span>
      </legend>`;
      fcHTML += `<div class="fieldset-content fieldset-wrapper fieldset-${utils.slugify(params.name)} ${multiple}" ${max}>`;
      fcHTML += `${multiInputGroupBegin}`;
      Object.keys(params.fields).forEach(key => {
        fcHTML += this[params.fields[key].inputType](params.fields[key]);
      });
      fcHTML += `${addMore}
      ${multiInputGroupEnd}`;
      fcHTML += `</div>`;
      return fcHTML;
    },

    inputFileField: (params) => {
      let collapsed = '';
      const field_name = (params.name) ? params.name : utils.slugify(params.title);
      if (params.settings.collapsed) {
        collapsed = "collapse";
      }
      return `<div class="row ${collapsed} ${params.class}">
<div class="col-xs-4">
    <div class="form-group">
      <label for="exampleInputFile">${params.title}</label>
      <input type="file" id="imgUploader" name="imgUploader">
      <p class="help-block">Example block-level help text here.</p>
      <button type="button" class="btn btn-block btn-default" id ="insert_media">Insert Media</button>
      </div>
      <div class="col-xs-5">
        <img id="${params.id}-media" title="${params.title}" src=" ${params.value}" class="img-box" alt="User Image">
      </div>
      <div class="col-xs-2">
    </div>
  </div>
</div>`;
    },

    workflow: (state, url) => {
      let saveButton = `
<div class="btn-group">
  <button type="submit" class="btn btn-info btn-workflow-save">Save</button>
  <button type="submit" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a href="#" class = "btn-save-preview">Save & Preview</a></li>
    <li><a href="#">Save & Unlock</a></li>
  </ul>
</div>
`;
      let publishButton = `
<div class="btn-group">
  <button type="submit" class="btn btn-success btn-workflow-publish">Publish</button>
  <button type="submit" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a href="#">Publish & Unlock</a></li>
    <li><a href="#">Unpublish</a></li>
  </ul>
</div>
`;
      let cancelButton = `
<div class="btn-group">
  <button type="button" class="btn btn-danger btn-workflow-cancel" onclick="location.href = '/';">Cancel</button>
  <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a href="#">Delete</a></li>
  </ul>
</div>
`;

      let previewButton = `
<div class="btn-group">
  <button type="button" id="preview-button" data-node-url="${url}" class="btn btn-primary btn-workflow-preview">Preview</button>
</div>
`;

      let requestUnlock = `
<div class="btn-group">
  <button type="button" class="btn btn-warning btn-workflow-unlock">Unlock</button>
</div>
`;

      let button = '';
      let buttonList = {};
      switch (state) {
        case 'new':
          button += saveButton + previewButton + publishButton + cancelButton;
          break;
        case 'edit-published':
        case 'edit-draft':
          break;
        case 'locked':
          button += previewButton + cancelButton + requestUnlock;
          break;
        default:
          button += saveButton + previewButton + publishButton + cancelButton;
      }
      return `<div class = "publish-button-group"> ${button} </div>`;
    },

  };
}
