// Form API


module.exports = function () {

  let global_js_header = '';

  return {

    returnJSHeader: function (params) {
      return global_js_header;
    },

    mediaModal: function (params) {

      global_js_header += `
let modalObj = (endPoint, params) => {
  $.ajax({
    url: endPoint,
    crossDomain: true,
    type: params.type,
    context: document.getElementsByClassName(params.contextClass)
  }).done(function (data) {
    //var jsonData = JSON.parse(data);
    console.log(data);
    $('.' + params.contextClass).html(data);
    $('.rock-cms-image-grid').html(data.imageData.html);
    $('ul.pagination').html(data.imageData.pageInfo);
    $('.rock-cms-video-grid').html(data.videoData.html);
    $('.' + params.contextClass + ' a').on("click", params.callBack(this));
  });
  $(params.modalContainer).modal('show');
};
`;

      let mainTabs = '';
      let i = 1;
      Object.keys(params.tabs).forEach(key => {
        let activeTab = (key == params.activeTab) ? 'active' : '';
        mainTabs += `<li class="${activeTab}"><a href="#tab_${i}" data-toggle="tab" class ="modal-tab-${key}">${params.tabs[key]}</a></li>`;
        i++;
      });

      let dropDownOptions = '';
      Object.keys(params.dropdowns).forEach(key => {
        dropDownOptions += `<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class = "modal-dropdown-${params.dropdowns[key]}">${key}</a></li>`;
      });

      i = 1;
      let modalTabContent = '';
      Object.keys(params.tabs).forEach(key => {
        let activeTab = (key == params.activeTab) ? 'active' : '';
        modalTabContent += `
                              <div class="tab-pane ${activeTab}" id="tab_${i}">
                                <div class = "rock-cms-${key}-grid"></div>
                              </div>
`;
        i++;
      });


      let modalPagination = '';
      for(i = 1; i <= params.totalPage; i++) {
        let activeTab = (i == params.currentPage) ? 'active' : '';
        modalPagination += `<li class="paginate_button ${activeTab}"><a href="#" aria-controls="example2" data-dt-idx="${i}" tabindex="0">${i}</a></li>`;
      };
      let pagePrev = 0;
      let pageNext = i + 1;

      let buttons = '';
      Object.keys(params.buttons).forEach(key => {
        buttons += `<button type="button" class="btn btn-primary ${params.buttons[key]}">${key}</button>`;
      });


      return `
<div class="bootstrap-wysihtml5-insert-image2-modal modal fade" id="${params.modalTarget}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class = "close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" > &times; </span></button>
                        <h4 class="modal-title" >${params.title}</h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="selectedIndex" value="0" />

                          <!-- Custom Tabs -->
                          <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs">
                              ${mainTabs}
                              <li class="dropdown">
                                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                  More Options <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu">
                                  ${dropDownOptions}
                                </ul>
                              </li>
                              <li class="pull-right"><a href="#" class="text-muted modal-settings"><i class="fa fa-gear"></i></a></li>
                            </ul>
                            <div class="tab-content">
                              ${modalTabContent}
                            </div>
                            <!-- /.tab-content -->
          </div>
          <!-- nav-tabs-custom -->

                    </div>
                    <div class="modal-footer">


                          <div class="dataTables_paginate paging_simple_numbers" id="example2_paginate" style = "float:left; margin-top:-20px;">
                              <ul class="pagination">
                                  <li class="paginate_button previous disabled" id="example2_previous"><a href="#" aria-controls="example2" data-dt-idx="${pagePrev}" tabindex="0">Previous</a></li>
                                    ${modalPagination}
                                  <li class="paginate_button next" id="example2_next"><a href="#" aria-controls="example2" data-dt-idx="${pageNext}" tabindex="0">Next</a></li>
                              </ul>
                          </div>

                        ${buttons}
                        <button type="button" id="btn-modal-close" class="btn btn-primary modal-close-button" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
</div>
`;
    },

    widgetModal: function (params) {

      return `
<div class="bootstrap-wysihtml5-insert-image2-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class = "close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" > &times; </span></button>
                        <h4 class="modal-title" id = "myModalLabel" >RockCMS Widgets </h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="selectedIndex" value="0" />



                          <!-- Custom Tabs -->
                          <div class="nav-tabs-custom">
                            <ul class="nav nav-tabs">
                              <li class="active"><a href="#tab_1" data-toggle="tab">All Purpose</a></li>
                              <li><a href="#tab_2" data-toggle="tab">Product</a></li>
                              <li><a href="#tab_3" data-toggle="tab">Featured Links</a></li>
                              <li class="dropdown">
                                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                  Other Widgets <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu">
                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
                                  <li role="presentation" class="divider"></li>
                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>
                                </ul>
                              </li>
                              <li class="pull-right"><a href="#" class="text-muted"><i class="fa fa-gear"></i></a></li>
                            </ul>
                            <div class="tab-content">
                              <div class="tab-pane active" id="tab_1">



                          <!-- general form elements -->
                          <div class="box box-primary">
                            <div class="box-header with-border">
                              <h4 class="box-title">All Purpose Widget</h4>
                            </div>
                            <!-- /.box-header -->
                            <!-- form start -->
                            <form role="form">
                              <div class="box-body">
                                <div class="form-group">
                                  <label for="exampleInputEmail1">CMS Display Name</label>
                                  <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Display Name">
                                </div>
                                <div class="form-group">
                                  <label for="exampleInputPassword1">Embed Code</label>
                                  <textarea class="form-control widget-form-element widget_embed-code" name="embed-code" id="widget_embed-code" value="" rows="8" cols="50"></textarea>

                                </div>
                                <div class="form-group">
                                  <label for="exampleInputFile">Presentation</label>
                                  <select id="widget_advanced_embed_size" name="presentation_size">
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                    <option value="fullwidth">Full-Width</option>
                                    <option value="edgetoedge">Edge-To-Edge</option>
                                  </select>
                                </div>

                                <!--
                                <div class="checkbox">
                                  <label>
                                    <input type="checkbox"> Check me out
                                  </label>
                                </div>
                                -->

                              </div>
                              <!-- /.box-body -->

                               <!-- <div class="box-footer"></div> -->

                            </form>
                          </div>
                          <!-- /.box -->


                <b>How to use:</b>

                <p>Be sure to enter the embed code, not the ID number or the URL. If you're attempting to embed unusual code, check with the product team first. Examples of standard embed codes: <code>&lt;iframe width=&quot;560&quot; height=&quot;315&quot; src=&quot;https://www.youtube.com/embed/Cc8Rpk9HhUM&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;</code>.</p>


              </div>
              <!-- /.tab-pane -->
              <div class="tab-pane" id="tab_2">
Hello
              </div>
              <!-- /.tab-pane -->
              <div class="tab-pane" id="tab_3">
Hello
              </div>
              <!-- /.tab-pane -->
            </div>
            <!-- /.tab-content -->
          </div>
          <!-- nav-tabs-custom -->


                    </div>
                    <div class="modal-footer">
                         <button type="submit" class="btn btn-primary insert-to-wsywig" data-dismiss="modal">Insert</button>
                        <button type="button" id="btn-modal-close" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
</div>
`;
    },



  };
}
