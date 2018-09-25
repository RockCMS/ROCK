// RockCMS Module
const Forms = require('../modules/forms/forms.js');
const Article = require('../content_types/article/transform');
const utils = require('../modules/utils');
const articleFactory = new Article();

const frm = new Forms();

let jsonObject = {};

module.exports = function () {
  const replaceDefaultTokens = (params) => {
    // Set Default Token To Null If Not Passed
    const defaultTemplateTokens = ['hidden_dom_containers', 'formJSHeader'];
    Object.keys(defaultTemplateTokens).forEach((key) => {
      if (this[defaultTemplateTokens[key]] === undefined) {
        params.template.data[defaultTemplateTokens[key]] = '';
      }
    });
    return params;
  }

  return {
    article: (nodeData, params) => {
      const currentBrand = (params.currentBrand) ? params.currentBrand : 'nbcnews';
      //console.log('User Data (node.js): ', params.reqData.session.userData);
      console.log('Current Brand: (node.js): ', params.currentBrand);
      let contentObject = {};
      const fieldGroups = [];
      let headlineGroup = [];
      let metadataGroup = [];
      let mediaGroup = [];
      let publishingGroup = [];
      let groupName = '';

      let flattenedFields = [];
      const field = params.template.data.fieldConfig;
      if (nodeData) {
        contentObject = articleFactory.transform(nodeData);
        contentObject.savedFlag = null;
        contentObject.nid = nodeData.nid;
      }
      Object.keys(field).forEach((key) => {
        // Check for field collection
        if (!field[key].inputType) {
          Object.keys(field[key]).forEach((fcKey) => {
            if (contentObject.hasOwnProperty(field[key][fcKey].name)) {
              field[key][fcKey].value = contentObject[field[key][fcKey].name];
            }
            flattenedFields.push(field[key][fcKey]);
          });
        } else {
          if (contentObject.hasOwnProperty(field[key].name)) {
            field[key].value = contentObject[field[key].name];
          }
          if (field[key].inputType == 'fieldGroup') {
            groupName = utils.slugify(field[key].name);
            if (!fieldGroups.includes(groupName)) {
              fieldGroups[`${groupName}`] = {};
            }
            field[key].group = utils.slugify(field[key].name);
            Object.keys(field[key].fields).forEach((fgKey) => {
              if (field[key].fields[fgKey].inputType !== 'fieldCollection') {
                field[key].fields[fgKey].value = contentObject[field[key].fields[fgKey].id];
              } else {
                Object.keys(field[key].fields[fgKey].fields).forEach((fcKey) => {
                  field[key].fields[fgKey].fields[fcKey].value = contentObject[field[key].fields[fgKey].fields[fcKey].id];
                });
              }
            });
          }
          flattenedFields.push(field[key]);
        }
      });

      for (let field in flattenedFields) {
        if (flattenedFields[field].transform.send) {
          if (params.savedFlag) {
            jsonObject.entry[flattenedFields[field].name] = params.reqData.body[flattenedFields[field].name];
          }
        }
        if (flattenedFields[field].brands.hasOwnProperty(currentBrand)) {
          if (flattenedFields[field].inputType == 'fieldGroup') {
           group = utils.slugify(flattenedFields[field].name);
            if (group == 'headline-group') {
              headlineGroup.push(frm[flattenedFields[field].inputType](flattenedFields[field]));
            }
            if (group == 'metadata-group') {
              metadataGroup.push(frm[flattenedFields[field].inputType](flattenedFields[field]));
            }
            if (group == 'media-group') {
              mediaGroup.push(frm[flattenedFields[field].inputType](flattenedFields[field]));
            }
            if (group == 'publishing-group') {
              publishingGroup.push(frm[flattenedFields[field].inputType](flattenedFields[field]));
            }
          }
        }
      }
      if (params.savedFlag) {
        Object.keys(contentObject).forEach((key) => {
          contentObject[key] = params.reqData.body[key];
        });

        jsonObject.entry.content = contentObject.body;
        jsonObject.entry.summary = contentObject.headline;
        jsonObject.entry.title = contentObject.title;
        params.dal.SendMSG(jsonObject);
        params.template.handler.redirect(`/test2/${nid}/?f=s`);
      }

      if (params.reqData.session.localNodeData !== undefined) {
        params.template.data.frm_buttons = (params.reqData.session.localNodeData.locked === 1 && params.reqData.session.userData.uid !== params.reqData.session.localNodeData.locked_by) ? frm.workflow('locked', nodeData.url.primary) : frm.workflow('new', nodeData.url.primary);
      } else {
        params.template.data.frm_buttons = frm.workflow('new', null);
      }

      contentObject.savedFlag = (params.reqData.query.f === 's');
      //params = replaceDefaultTokens(params);
      params.template.data.userData = params.reqData.session.userData;
      params.template.data.contentObject = contentObject;
      params.template.data.headlineGroup = headlineGroup;
      params.template.data.metadataGroup = metadataGroup;
      params.template.data.mediaGroup = mediaGroup;
      params.template.data.publishingGroup = publishingGroup;
      params.template.data.validPattern = frm.validationOutput();
      params.template.data.currentBrand = currentBrand;
      params.template.data.localNodeData = params.reqData.session.localNodeData;
      //console.log("*******======PARAMS ====== *******", params.template.data);
      params.template.handler.render(params.template.template, params.template.data);
    }

  }
}
