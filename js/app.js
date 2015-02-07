
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
        create_date: 0,
        last_login_date: 0,
        suspend: 0
    };
    
    console.log(user);
    
    CRUD.isUserExist( {login:user.login, X:user.X, Y:user.Y}, initGaia );
    
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
    
    function initGaia (data){
        
        console.log('Retour de user_exist');
        console.log(data);
        
        user.group = data.group;
        user.create_date = new Date(data.create_date);
        user.last_login_date = new Date(data.last_login_date);
        user.suspend = !!Number(data.suspend);
        user.rank = Number(data.rank);
        
        console.log(user);
        
        if( !data.reply ) {
            console.log('new');
            $("#welcome").show('slow');
        } else {
            console.log('old');
            $( "#butReport" ).click();
        }
        
        var rank = $("#rank").attr('src', "img/rank"+user.rank+".png");
        rank.attr('alt', user.rank+" (GAIA)");
        $("#login").text(user.login);
        $("#coord").text('['+user.X+']['+user.Y+']');
        
        var msecPerDay = 1000 * 60 * 60 * 24;
        var interval = new Date().getTime() - user.create_date.getTime();
        var days = Math.floor(interval / msecPerDay );
        
        $("#date").text(days+' jours');
        
    }
    
    function report () {
        console.log( 'report' );
        CRUD.getInfo( {X:user.X, Y:user.Y}, initReport );
    }
    
    function map () {
        console.log( 'map' );
        CRUD.getMove( {login:user.login}, initUserMove );
    }
    
    function initUserMove (data) {
        
        console.log('Retour de User Move');
        console.log(data);
        
        for (var i=0, pos=[] ; i < data.length ; i++) {
            pos[i] = {};
            pos[i].X = data[i].X;
            pos[i].Y = data[i].Y;
            pos[i].time = data[i].time;
            
            $("#position").append('<li>'+pos[i].time+'</li>')
            
        }
        
        console.log(pos);
            
    }
    
    function initReport (data) {
        
        
        // picture
        //$("#space").show();
        
        console.log('Retour de get Info');
        console.log(data);
        
        /*for (var i=0, pos=[] ; i < data.length ; i++) {
            pos[i] = {};
            pos[i].X = data[i].X;
            pos[i].Y = data[i].Y;
            pos[i].time = data[i].time;
            
            $("#position").append('<li>'+pos[i].time+'</li>')
            
        }
        
        console.log(pos);*/
            
    }
    
});

var CRUD = {
    
    isUserExist: function( vars, success, success2, fail, always ) {
        vars.action = 'user_exist';
        $.getJSON( debug ? 'crud.php' : 'http://a4edfd900b.url-de-test.ws/gaia/crud.php', vars, success )
        .done(success2)
        .fail(fail)
        .always(always);
    },
    
    getMove: function( vars, success, success2, fail, always ) {
        vars.action = 'user_move';
        $.getJSON( debug ? 'crud.php' : 'http://a4edfd900b.url-de-test.ws/gaia/crud.php', vars, success )
        .done(success2)
        .fail(fail)
        .always(always);
    },
    
    getInfo: function( vars, success, success2, fail, always ) {
        vars.action = 'get_info';
        $.getJSON( debug ? 'crud.php' : 'http://a4edfd900b.url-de-test.ws/gaia/crud.php', vars, success )
        .done(success2)
        .fail(fail)
        .always(always);
    }
    
};
