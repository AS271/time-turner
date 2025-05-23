// based on https://github.com/mattlag/mTimeLapse

function initializeTimeLapse(){

    /* Customize speed options here */
    var tl = {
        'speeds': {
            'Very_Fast': 10,
            'Fast': 20,
            'Medium': 50,
            'Slow': 100,
            'Very_Slow': 200
        },
        'advancing': false,
        'img':[],
        'currFrame': 0,
        'fadeTime': 500,
        'sitTime': 0,
        'framefront':false,
        'frameback':false,
        'si': 'false'
    };
    // set seekbar to current hour and minute
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const totMin = (hour * 60) + min;
    tl.currFrame = totMin;
    const offset = (tl.img.length - 1) - totMin;
    tl.currFrame = tl.img.length - 1;
    $('#seekbar').val(tl.currFrame);

    $('#seekbar').on('input', function() {
        tl.currFrame = parseInt(this.value, 10);
        updateFrameManually();
    });

    var f = $('#mTimeLapse');

    if(f){
        // Setup
        tl.img = f.children('img');
        $('#seekbar').attr('max', tl.img.length - 1);
        f.before('<div id="frames"><img id="frame_back"/><img id="frame_front"/></div>');

        var c = $('#controls');
        c.append('<input type="button" value="Pause" id="pausebutton" onclick="toggleAdvance();"/><br>');
        for(var s in tl.speeds){ if(tl.speeds.hasOwnProperty(s)){
            c.append('<input type="button" value="' + (s.replace(/_/g, ' ') + '" onclick="setSpeed(\'' + s + '\');"/>'));
        }}

        // Go
        tl.framefront = $('#frame_front');
        tl.frameback = $('#frame_back');
        advance();
    }

    function advanceFrame() {
        tl.frameback.attr('src', getFrameAttribute('src'));
        tl.currFrame = ((tl.currFrame + 1) % tl.img.length);
        tl.framefront.attr('src', getFrameAttribute('src'));
        tl.framefront.css({'opacity': 0.0});
        tl.framefront.animate({'opacity': 1.0},{'duration': tl.fadeTime, 'queue':false});

        $('#data_stamp').html(getFrameAttribute('data-stamp'));
        $('#seekbar').val(tl.currFrame);
    }

    function updateFrameManually() {
        window.clearInterval(tl.si); // stop playback while seeking
        tl.advancing = false;
        $('#pausebutton').attr('value', 'Play');

        tl.framefront.attr('src', getFrameAttribute('src'));
        tl.framefront.css({ 'opacity': 1.0 }); // skip fade
        $('#data_stamp').html(getFrameAttribute('data-stamp'));
    }

    function getFrameAttribute(attr) {
        var idx = (tl.currFrame - offset + tl.img.length) % tl.img.length;
        var s = tl.img[idx].getAttribute(attr);
        return s || '';
    }

    function advance() {
        window.clearInterval(tl.si);
        tl.advancing = true;
        $('#pausebutton').attr('value', 'Pause');
        tl.si = setInterval(advanceFrame, (tl.fadeTime + tl.sitTime));
    }

    window.setSpeed = function(name) {
        tl.fadeTime = tl.speeds[name] || 500;
        advance();
    };

    window.toggleAdvance = function() {
        tl.advancing = !tl.advancing;

        if(tl.advancing) advance();
        else {
            window.clearInterval(tl.si);
            $('#pausebutton').attr('value', 'Play');
        }
    };
}
