var $hangman = {
  life: 0,
  maxlife: 7,
  found: 0,
  found: 0,
  maxfound: 0,
  inigame: false,
  guessword: '',
  ini: function() {
    //draw alphabet
    for (var $i = 65; $i <= 90; $i++) {
      $aux = document.createElement('div');
      $($aux).addClass('letter').html(String.fromCharCode($i));
      $('.alphabet').append($aux);
    }
    // pick a letter event
    $(document).on('click' ,'.letter', function() {
      var $letter = $(this);
      var $l = $letter.html();
      if (!$hangman.inigame) { //game not started
        return;
      }
      if ($letter.hasClass("letter-disabled")) {
        return;
      }
      $letter.addClass("letter-disabled");
      $hangman.proc_letter($l);
    });
    // init game event
    $('#init-game').click(function() {
      $('#guessword').val(''); //input
      $('#gword').val(''); //draw
      $('#dialog-message').dialog({
        modal: true,
        position: { horizontal: "center", vertical: "center",},
        buttons: {
          Ok: function() {
            $hangman.guessword = $('#guessword').val();
            if (!$hangman.validate_word($hangman.guessword)) {
              $('#errguessword').html("<b>ERROR</b>: That's not a word");
            }
            else {
              $hangman.reset_game();
              $hangman.inigame = true;
              $hangman.guessword = $hangman.guessword.toUpperCase();
              $hangman.maxfound = $hangman.guessword.length;
              $hangman.draw_word($hangman.guessword);
              $(this).dialog("close");
            }
          }
        }
      });
    });
  },
  reset_game: function() {
    $hangman.life = 0;
    $hangman.found = 0;
    $('#errguessword').html('');
    $('.gletter').remove();
    $('.letter').removeClass("letter-disabled");
    $(".hangman").css("opacity", 0);
    $("#hangman-f0").css("opacity", 1);
  },

  validate_word: function ($s) {
    return /^[a-zA-Z\u00C0-\u00ff]+$/.test($s)
  },
  draw_word: function($s) {
    var $n = $s.length;
    for ($i=0; $i<$n; $i++) {
      var $ndiv = $("<div id='gletter' class='gletter'>&nbsp;</div>");
      $('#gword').append($ndiv);
    }
  },
  replace_diacritics: function($l) {
    var $diacritics =[
      /[\300-\306]/g, /[\340-\346]/g,  // A, a
      /[\310-\313]/g, /[\350-\353]/g,  // E, e
      /[\314-\317]/g, /[\354-\357]/g,  // I, i
      /[\322-\330]/g, /[\362-\370]/g,  // O, o
      /[\331-\334]/g, /[\371-\374]/g,  // U, u
      /[\321]/g, /[\361]/g, // N, n
      /[\307]/g, /[\347]/g, // C, c
    ];
    var $chars = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
    for (var $i = 0; $i < $diacritics.length; $i++){
      $l = $l.replace($diacritics[$i],$chars[$i]);
    }
    return $l;
  },
  check_winner: function() {
    if($hangman.found === $hangman.maxfound) {
      $('#dialog-winner').dialog({
        modal: true,
        position: { horizontal: "center", vertical: "center",},
        buttons: {
          Ok: function() {
            $hangman.inigame = false;
            $(this).dialog("close");
          }
        }
      });
    }
  },
  check_loser: function() {
    if ($hangman.life === $hangman.maxlife) {
      $('#dialog-loser').dialog({
        modal: true,
        position: { horizontal: "center", vertical: "center",},
        buttons: {
          Ok: function() {
            $hangman.inigame = false;
            $(this).dialog("close");
          }
        }
      });
    }
  },
  proc_letter: function($l) {
    var $res = [];
    var $word = $hangman.replace_diacritics($hangman.guessword);
    var $i = $word.indexOf($l);
    while ($i !== -1) {
      $res.push($i);
      $i = $word.indexOf($l, $i + 1);
    }
    $al = $res.length;
    if ($al > 0) {
      for ($i = 0; $i < $al; $i++) { 
        $("div.gletter").each(function($index) {
          if ($index === $res[$i]) {
            $(this).text($hangman.guessword.charAt($res[$i]));
          }
        });
      }
      $hangman.found += $al;
      $hangman.check_winner();
    }
    else {
      $hangman.life++;
      navigator.notification.vibrate(300);
      $("#hangman-f" + $hangman.life).css("opacity", 1);
      $hangman.check_loser();
    }
  },
}
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
    $hangman.ini();
  }, false);
  document.addEventListener("deviceready", function(){
    var onShake = function () {
      alert('shaking!');
    };
    var onError = function () {
      console.log('Error Shaking');
    };
    shake.startWatch(onShake, 40, onError);    
  },false)
}