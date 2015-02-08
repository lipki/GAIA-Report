
//debug 
var debug = window.location.toString().indexOf('localhost') != -1 ? true : false;
//debug = false;
if(debug) console.log('debug');

$( document ).ready(function() {
    
    // post gaia
    var vars = window.location.search.substring(1).split("&");
    for (var i=0, get={} ;i<vars.length;i++) {
        var va = vars[i].split('=');
        get[va[0]] = va[1];
    }
    
    var coord = get.c.split('][').join(',').split(']').join('').split('[').join('').split(',');
    
    var user = {
        login: get.p,
        X: Number(coord[0]),
        Y: Number(coord[1]),
        rank: 0,
        group: '',
        create_date: new Date(),
        last_login_date: new Date(),
        suspend: 0
    };
    
    console.log(user);
    
    CRUD.call( {login:user.login}, 'isUserExist', initGaia );
    
    // gaia
    
    $( "a.butmenu" ).click(function( event ) {
        
        $(this).toggleClass("active");
        
        $(".toggle_container").hide('slow');
        $( $(this).attr('href') ).show('slow');
        
        switch ( $(this).attr('id') ) {
            case 'butReport' : report(); break;
            case 'butMap' : map(); break;
        }
        
        return false;
        
    });
    
    function initGaia (reply){
        
        console.log('Retour de user_exist');
        console.log(reply);
        
        //for (var a in user) user[a] = reply.data[0][a];
        user.rank = reply.data[0].rank;
        user.create_date = new Date(reply.data[0].create_date.split(' ').join('T'));
        user.last_login_date = new Date(reply.data[0].last_login_date.split(' ').join('T'));
        
        var rank = $("#rank").attr('src', "img/rank"+user.rank+".png");
        rank.attr('alt', user.rank+" (GAIA)");
        $("#login").text(user.login);
        $("#coord").text('['+user.X+']['+user.Y+']');
        
        var msecPerDay = 1000 * 60 * 60 * 24;
        var interval = new Date().getTime() - user.create_date.getTime();
        var days = Math.floor(interval / msecPerDay );
        
        $("#date").text(days+' jours');
        
        if( !reply.success ) {
            console.log('new');
            $("#welcome").show('slow');
        } else {
            console.log('old');
            $( "#butReport" ).click();
        }
        
    }
    
    function report () {
        console.log( 'report' );
        CRUD.call( {X:user.X, Y:user.Y}, 'getCellInfo', initReport );
    }
    
    function map () {
        console.log( 'map' );
        CRUD.call( {login:user.login}, 'getUserMove', initUserMove );
    }
    
    function initUserMove (reply) {
        
        console.log('Retour de User Move');
        console.log(reply);
        
        for (var i=0, pos=[] ; i < reply.data.length ; i++) {
            pos[i] = {};
            pos[i].X = reply.data[i].X;
            pos[i].Y = reply.data[i].Y;
            
            var time = new Date(reply.data[i].time.split(' ').join('T'))
            pos[i].time = time.toLocaleString();
            
            $("#position").append('<li>'+'['+pos[i].X+']['+pos[i].Y+']<span>'+pos[i].time+'</span></li>')
            
        }
        
        console.log(pos);
            
    }
    
    function initReport (reply) {
        
        console.log('Retour de get Info');
        console.log(reply);
            
        $("#space p.submit input[type='submit']")
            .val("Modifier ou valider ce secteur")
            .unbind("click")
            .bind("click", (function (evt) {
                evt.preventDefault();
                var cell = {
                    mineral: $("#mineral").val(),
                    missile: $("#missile").val(),
                    antiradar: $("#antiradar").val(),
                    bonusp: $("#bonusp").val(),
                    X: user.X,
                    Y: user.Y,
                    user: user.login
                };
                CRUD.call( cell, 'setCellInfo', initReport );
            }));
        
        if( reply.data.length > 0 ) {
            
            $("#mineral").val(reply.data[0].mineral);
            $("#missile").val(reply.data[0].missile);
            if( reply.data[0].antiradar )
                $("#antiradar").attr('checked', true);
            $("#bonusp").val(reply.data[0].bonus);
            $("#X").val(user.X);
            $("#Y").val(user.Y);
            $("#user").val(user.login);
            
            $("#space p.submit input[type='submit']").val("Modifier ou valider ce secteur");
            
        } else {
            $("#space p.submit input[type='submit']").val("Ajouter ce secteur");
        }
            
    }
    
    /*
    
    */
    
});

var CRUD = {
    
    call: function( vars, action, success ) {
        vars.action = action;
        $.getJSON( debug ? 'crud.php' : 'http://a4edfd900b.url-de-test.ws/gaia/crud.php', vars, success )
        .fail(CRUD.fail)
    },
    
    success2: function reportReturn (data) {
        console.log('success2');
        console.log(data);
    },
    
    fail: function reportReturn (data) {
        console.log('fail');
        console.log(data);
    },
    
    always: function reportReturn (data) {
        console.log('always');
        console.log(data);
    }
    
};
