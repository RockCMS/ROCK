/*let widgetHTMLContent = `

  <!-- Bootstrap 3.3.7 -->
  <link rel="stylesheet" href="/theme/bower_components/bootstrap/dist/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="/theme/bower_components/font-awesome/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="/theme/bower_components/Ionicons/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="/theme/dist/css/AdminLTE.min.css">


<div class="bootstrap-wysihtml5-insert-image2-modal modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class = "close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" > &times; </span></button>
                        <h4 class="modal-title" id = "myModalLabel" > Image list </h4>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="selectedIndex" value="0" />
                        <div class="image-list" >
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="btn-modal-close" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
</div>`;
*/


function thumbnailCreator() {
    var div = null;
    var imageList = null;
    var idx;

    function create(div) {
        var thumbs = div.append("div").attr("class", "row")
                .selectAll("div")
                .data(imageList).enter()
                .append("div")
                .attr("class", "col-lg-3 col-md-4 col-xs-6 thumb");
        thumbs.append("a")
                .attr("class", "thumbnail")
                .attr("href", "#")
                .append("img").attr("src", function (d) {
            return d.imagePathThumb;
        }).attr("class", "img-responsive")
                .on('click', function (d, i) {
                    $('#selectedIndex').val(i);
                });
        var thumbcontrol = thumbs.append("div");
        thumbcontrol.append("p").html(function (d) {
            return d.description;
        });
    }

    create.imageListProcessorCallback = function(data) {
        create.imageList(data);
        create(d3.select("div.image-list"));
    }

    create.createImageNode = function () {
        idx = d3.select("#selectedIndex").node().value;
        if (idx === undefined || idx === "" || idx === null || idx === false) {
            return null;
        }
        var linkNode = document.createElement("A");
        linkNode.setAttribute("class", "mfp-image image-link");
        linkNode.setAttribute("href", imageList[idx].imagePathNormal);
        var imgNode = document.createElement("IMG");
        imgNode.setAttribute("src", imageList[idx].imagePathThumb);
        imgNode.setAttribute("alt", imageList[idx].alternativeText);
        linkNode.appendChild(imgNode);
        d3.select("#selectedIndex").node().value = "";
        return linkNode;
    }

    create.imageList = function (value) {
        if (!arguments.length)
            return imageList;
        imageList = value;
        return create;
    }

    return create;
}




tinymce.PluginManager.add('rcms_widget', function(editor, url) {
   var tc = thumbnailCreator();


  //Action when modal is closed
  $('#myModal').on('hidden.bs.modal', function () {
      if ((node = tc.createImageNode()) !== null)
          editor.selection.setNode(node)
  });







document.querySelector('textarea').addEventListener('paste', (e) => {
  console.log(e);
  window.setTimeout(() => {
    alert("What???");
  });
});





// jQuery('#myModal').modal('show');


  // Add a button that opens a window
  editor.addButton('rcms_widget', {
    text: ' Widgets',
    icon: true,
    image: '/public/rcms_plugins/widgets/widget-icon.png',
            // Listen for paste event
        onclick: function () {
                $.ajax({url: 'http://localhost:4000/media', data: {format: 'json'},
                  type: 'GET',
                    crossDomain: true,
                    success: function (output) {
                        //var imagelist = JSON.parse(output);
                        //tc.imageListProcessorCallback(imagelist);
                       $('#myModal').modal('show');


                      $('.insert-to-wsywig').click(function() {

                        editor.insertContent(window.document.getElementById ('widget_embed-code').value);
                        $('#myModal').modal('close');
                      });

                        console.log(output);
                    },
                    error: function (x) {
                        console.log("fail", x);
                    }
                });

        }
  });


  var customButtonHandler = () => {
    // Get the parameters passed into the window from the top frame
    var args = top.tinymce.activeEditor.windowManager.getParams();
    console.log(args.arg1, args.arg2);
    alert("Hey There !!!" + args.arg1 + args.arg2);
    //editor.insertContent('Title: ' + args.arg2 + window.document.getElementById ('widget_embed-code').value);
    editor.insertContent('Title: ' + args.arg2);
    editor.windowManager.close();
  }



  return {
    getMetadata: function () {
      return  {
        name: "Example plugin",
        url: "http://exampleplugindocsurl.com"
      };
    }
  };
});
