  $(function() {
      var INDEX = 0;
      $("#chat-submit").click(function(e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() == '') {
          return false;
        }
        generate_message(msg, 'self');
        var buttons = [{
            name: 'Existing User',
            value: 'existing'
          },
          {
            name: 'New User',
            value: 'new'
          }
        ];
        setTimeout(function() {
          generate_message(msg, 'user');
        }, 1000)

      })

      var accessToken = "397038e8-9359-49d2-99e3-37d5313f862a";
      var baseUrl = "https://csis19-chatbot.azurewebsites.net/qnamaker";

      function send() {

      }

      function generate_message(msg, type) {
        INDEX++;

        if (type == "self") {
          var str = "";
          str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";

          str += "          <div class=\"cm-msg-text\">";
          str += msg;
          str += "          <\/div>";
          str += "        <\/div>";
          $(".chat-logs").append(str);
          $("#cm-msg-" + INDEX).hide().fadeIn(300);
          $("#chat-input").val('');

        } else {
          $.ajax({
            type: "POST",
            url: baseUrl + "/knowledgebases/393dc31b-37ab-4b3f-8c34-e6d914444280/generateAnswer",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
              "Authorization": "EndpointKey " + accessToken
            },
            data: JSON.stringify({
              "question": msg
            }),
            success: function(data) {
              //console.log(JSON.stringify(data.result.fulfillment.speech, undefined, 2));
              var output = JSON.stringify(data);
              var result = JSON.parse(output);
              var reply = result.answers[0].answer;
              var str = "";
              str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
              str += "          <span class=\"msg-avatar\">";
              str += "            <img src=\"assets/img/chat-bot/logo-light.png\">";
              str += "          <\/span>";
              str += "          <div class=\"cm-msg-text\">";
              str += reply;
              str += "          <\/div>";
              str += "        <\/div>";
              $(".chat-logs").append(str);
              $("#cm-msg-" + INDEX).hide().fadeIn(300);
              $(".chat-logs").stop().animate({
                scrollTop: $(".chat-logs")[0].scrollHeight
              }, 1000);

            }

          });
        }

      }

      function generate_button_message(msg, buttons) {
        /* Buttons should be object array
          [
            {
              name: 'Existing User',
              value: 'existing'
            },
            {
              name: 'New User',
              value: 'new'
            }
          ]
        */
        INDEX++;
        var btn_obj = buttons.map(function(button) {
          return "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\"" + button.value + "\">" + button.name + "<\/a><\/li>";
        }).join('');
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg user\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "          <div class=\"cm-msg-button\">";
        str += "            <ul>";
        str += btn_obj;
        str += "            <\/ul>";
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        $(".chat-logs").stop().animate({
          scrollTop: $(".chat-logs")[0].scrollHeight
        }, 1000);
        $("#chat-input").attr("disabled", true);
      }

      $(document).delegate(".chat-btn", "click", function() {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
      })

      $("#chat-circle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
      })

      $(".chat-box-toggle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
      })

    })