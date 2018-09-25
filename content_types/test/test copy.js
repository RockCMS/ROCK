// Article
//

var config = require('../../config');

const axios = require('axios');
const forms = require("../../modules/forms/forms.js");
let frm = new forms();

var rcms = require("../../modules/rcms.js");
var sqlc = new rcms();
sqlc.config(config);


const rcmslib = require("../../modules/library.js");
rcmsLib = new rcmslib();



module.exports = function () {
  return {
    render: function (urlParams, res, req) {
      console.log("HIIII I'm in Article");
      console.log(urlParams);
      let node_id = urlParams.node_id;

      if (urlParams.section == 'submit') {
        console.log("IN SAVE");
        var updateQ = "UPDATE content_node SET title = '" + req.body.article_headline + "', content = '" + req.body.article_body + "' WHERE nid = " + node_id;
        //console.log(updateQ);
        var result = sqlc.getData(updateQ);

        var jsonObject = require("../../modules/msg_templates/article.json");
        jsonObject.entry.content = req.body.article_body;
        jsonObject.entry.summary = req.body.article_headline;
        jsonObject.entry.title = req.body.article_headline;
        //console.log(jsonObject.entry.content);

        var redirectPage = function (result) {
          return res.redirect('/edit/' + node_id + '/?f=s');
        }
        var result = sqlc.SendMSG(jsonObject, redirectPage);


      } else {

            let headline = '';
            let seo_headline = '';
            let deck = '';
            let contentBody = '';
            let teaseImage = '';

            axios.get('http://localhost:4000/jobyapi/node-details/' + node_id)
              .then(data => {
                //console.log(data);
                 headline = data.data.headline;
                 seo_headline = data.data.headline;
                 deck = data.data.headline;
                 contentBody = data.data.body;
                 teaseImage = data.data.image;

                 console.log(headline);
                 let contentObject = {
                 //'saved': req.query.f,
                 'nid': node_id,
                 'title': headline,
                 'body': contentBody
                 }

                 let topInputBoxes = [
                 {
                    formData: frm.inputTextField({
                    title: 'My Headline',
                    name: 'test_headline',
                    value: 'Demo Demo Demo Value',
                    id: 'test_headline',
                    class: 'test_headline',
                    validation: {
                      presence: true,
                      length: {
                        minimum: 3,
                        maximum: 20
                      },
                      format: {
                        pattern: "[a-z0-9]+",
                        flags: "i",
                        message: "SOOOOO can only contain a-z and 0-9"
                      }
                    }
                    })},
                  {
                    formData: frm.inputTextField({
                    title: 'Go TO Hell',
                    name: 'goto_hell',
                    value: 'Yayayayyayay',
                    id: 'my_heya_valueadline',
                    class: 'my_headline',
                    validation: false,
                    })},
                  {
                    formData: frm.inputTextField({
                    title: 'This is Third Item',
                    name: 'third_item',
                    value: 'Third Item Value',
                    id: 'thirddddd',
                    class: 'myddafdeadline',
                    validation: {
                      presence: true,
                      length: {
                        minimum: 3,
                        maximum: 20
                      },
                      format: {
                        pattern: "[a-z0-9]+",
                        flags: "i",
                        message: "THIS IS TEST 222 ontain a-z and 0-9"
                      }
                    }
                    })},

                  {
                    formData: frm.inputTextField({
                    title: 'Another Empty Input Box',
                    name: 'empty_input_box',
                    value: '',
                    id: 'thirdddasfadd',
                    class: 'myddafasdfasdadline',
                    validation: {
                      presence: true,
                      length: {
                        minimum: 3,
                        maximum: 20
                      },
                      format: {
                        pattern: "[a-z0-9]+",
                        flags: "i",
                        message: "Checking to see if it still works here. Validation Failed!!"
                      }
                    }
                    })},



                  {
                    formData: frm.inputListField({
                    title: 'My DropDown',
                    name: 'test_dropdown',
                    value: 'normal',
                    list_values: {
                      'no_rails': 'NO RAILS',
                      'normal': 'NORMAL',
                      'hello': 'HIIIIII',
                    },
                    id: 'my_headline',
                    class: 'my_headline',
                    validation : false,
                    })},

                    {
                      formData: frm.inputListField({
                      title: 'Dropdown Data from JSON File',
                      name: 'test_dropdown2',
                      value: '6',
                      list_values: './content_types/article/data.json',
                      id: 'my_headline',
                      class: 'my_headline',
                      validation: false
                      })
                    },

                    {
                      formData: frm.inputListField({
                      title: 'Multi Select Dropdown',
                      name: 'test_dhjhhn2',
                      multiselect: true,
                      value: '6',
                      list_values: './content_types/article/data.json',
                      id: 'my_headline',
                      class: 'my_headline',
                      validation: false
                      })
                    },



                    {
                      formData: frm.inputTextAreaField({
                      title: 'Text Area Field',
                      name: 'test_dropdown2',
                      value: 'sdfasdf as asd fasd fsad fasd fas fas fas fd',
                      id: 'my_headline',
                      class: 'my_headline',
                      validation: false
                      })
                    },

                    {
                      formData: frm.inputCheckBoxField({
                      title: 'CheckBox Field',
                      name: 'checkbox field',
                      value: true,
                      id: 'dafdfas',
                      class: 'my_heasdfsdfadline',
                      validation: false
                      })
                    },


                    {
                      formData: frm.inputRadioField({
                      title: 'Radio Field',
                      name: 'checkbox field',
                      value: true,
                      id: 'dafdfas',
                      class: 'my_heasdfsdfadline',
                      validation: false
                      })
                    },

                    {
                      formData: frm.inputRadioField({
                      title: 'Radio False Field',
                      name: 'checkbox field',
                      value: false,
                      id: 'dafdfas',
                      class: 'my_heasdfsdfadline',
                      validation: false
                      })
                    },

                  {
                    formData: frm.inputTextField({
                    title: 'Auto Complete',
                    name: 'auto_complete_text1',
                    value: '',
                    id: 'auto_complete_text',
                    class: 'my_auto_complete',
                    validation: false
                    })
                  },

                    {
                      formData: frm.inputTextField({
                      title: 'Auto Complete AJAX',
                      name: 'widget_product_id',
                      value: 'Amazon',
                      id: 'widget_product-id',
                      ajax: true,
                      remote_url: '/public/data/product.json',
                      class: 'widget_product-id',
                      validation: false
                      })
                    },


                  ];

const modalObj = require("../../modules/modal.js");
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

let globalJSHeader = rcmsLib.injectGlobalHeader(frm.formJSHeader());
globalJSHeader = rcmsLib.injectGlobalHeader(modal.returnJSHeader());
//media.returnJSHeader()
//console.log(globalJSHeader);


/*

// Amazon Product API Integration
var amazon = require('amazon-product-api');
var client = amazon.createClient({
  awsId: "",
  awsSecret: "",
  awsTag: ""
});

client.itemLookup({
  idType: 'ASIN',
  itemId: 'B01N32NCPM'
}).then(function(results) {
      Object.keys(results).forEach(key => {
       console.log(key);
       console.log(results[key]);
       console.log(results[key].ItemAttributes[0]);
      });
}).catch(function(err) {
  console.log(err);
});
*/




//let result = sqlc.displayData('SELECT * FROM content_node LIMIT 2', res);
//console.log(result);


var users = require("../../modules/acl.js");
var user = new users(sqlc);
user.user();
res.send("TEST PAGE");
return;

                 res.render('form-static-page', { hidden_dom_containers: hidden_dom_containers, topInputBoxes: topInputBoxes, node_id: node_id, validPattern: frm.validationOutput(), formJSHeader: globalJSHeader, contentObject: contentObject });
              });


      }



    },
  };
}

