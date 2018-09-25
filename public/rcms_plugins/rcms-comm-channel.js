  $(function () {
    const socket = io();
    let data = {};
    data = {
      author: 1614,
      user_to: 1615,
      type: 'default',
      message: ''
    }

    $(".send-release-alert").click(function () {
      data.message = 'NEWS CMS Release will begin at 12AM. Please Save Your Work !!!';
      socket.emit('chat message', data);
    });

    socket.on('chat message', function(msg){


    if (msg.user_to == $('#user_logged_in_id').val() && msg.type == 'default') {
      if (jQuery('.modal').css('display') == 'none') {
        $('#default-basic-modal .modal-body').html(msg.message);
        jQuery('.open-message-window').click();
      }
    }

    if (msg.user_to == $('#user_logged_in_id').val() && msg.type == 'image_upload') {
      console.log("Received Image Data", msg);
      let imageURL = (msg.message) ? msg.message : '/theme/dist/img/drag-example.jpg';
      setTimeout(function(){
        $('#mainArt-media').attr('src', imageURL);
        $('#media-group-badges img:first').attr('src', imageURL);
        $('#default-basic-modal .modal-body').html('A photo Editor (<strong>Didarul</strong>) Uploaded This Media. </br> <img src ="' + imageURL + '" height = "60" width = "70" />');
        jQuery('.open-message-window').click();
      }, 2000);
    }


      console.log(msg);
    });
  });
