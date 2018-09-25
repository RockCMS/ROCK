// TEST PLAYGROUND

const config = require('../../config');
const Rcms = require('../../modules/rcms.js');
const fieldConfig = require('../article/field-config.json');
const NodeObj = require('../../modules/node.js');

const sqlc = new Rcms();
sqlc.config(config);

const node = new NodeObj();

const rcmslib = require("../../modules/library.js");
rcmsLib = new rcmslib();
const forms = require("../../modules/forms/forms.js");
let frm = new forms();

module.exports = function () {
  return {
    render: (urlParams, res, req) => {
      const nodeData = res.nodeData || null;
      const savedFlag = (urlParams.section === 'submit') ? true : false;
      let topInputBoxes = [];
      let modalObj = require("../../modules/modal.js");
      let modal = new modalObj();
      let hidden_dom_containers = modal.mediaModal({
        modalTarget: 'media_modal',
        title: 'Media Browser',
        totalPage: 7,
        currentPage: 3,
        activeTab: 'image',
        tabs: {
          image: 'Image',
          video: 'Video',
          upload: 'Upload',
        },
        dropdowns: {
          'Action': 'action',
          'Another Action': 'another-action',
        },
        buttons: {
          'Insert': 'modal-insert-button',
          'Exit': 'modal-exit-button'
        }
      });

      hidden_dom_containers += modal.widgetModal();
      let globalJSHeader = rcmsLib.resetJSHeader();
      globalJSHeader = rcmsLib.injectGlobalHeader(frm.formJSHeader());
      globalJSHeader = rcmsLib.injectGlobalHeader(modal.returnJSHeader());

      if (nodeData) {
        (function asyncTask() {
          return sqlc.getNodeDetails(req.params.node_id)
            .then((resultA) => {
              if (req.session.userData.uid != resultA.locked_by && resultA.locked == 0) {
                sqlc.update("UPDATE contents SET locked = '1', locked_by = '" + req.session.userData.uid + "' WHERE nid = '" + req.params.node_id + "'");
              }

            })
            .then((valueB) => {
              sqlc.getNodeDetails(req.params.node_id)
                .then(function (resultB) {
                  res.localNodeData = resultB;
                  req.session.localNodeData = resultB;
                  //console.log('Current Node Data (Article.JS): ', req.session.localNodeData);
                  const currentBrand = (nodeData.publisher.name) ? nodeData.publisher.name : 'nbcnews';
                  node.article(nodeData, {
                    savedFlag,
                    userData: req.session.userData,
                    reqData: req,
                    dal: sqlc,
                    currentBrand,
                    template: {
                      handler: res,
                      template: 'article',
                      data: {
                        localNodeData: req.session.localNodeData,
                        fieldConfig,
                        topInputBoxes,
                        formJSHeader: globalJSHeader,
                        hidden_dom_containers,
                      },
                    },
                  });
                })
            })
            .then((valueC) => { })
            .catch((err) => console.log("Async error: " + err))
        })();
      } else { // New article.
        const currentBrand = 'nbcnews';
        node.article(nodeData, {
          savedFlag,
          userData: req.session.userData,
          reqData: req,
          dal: sqlc,
          currentBrand,
          template: {
            handler: res,
            template: 'article',
            data: {
              localNodeData: req.session.localNodeData,
              fieldConfig,
              topInputBoxes,
              formJSHeader: globalJSHeader,
              hidden_dom_containers,
            },
          },
        });
      }
    },
  };
};
