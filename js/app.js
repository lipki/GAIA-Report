
$( document ).ready(function() {
    
    // post gaia
    
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var get = {};
    for (var i=0;i<vars.length;i++) {
        var va = vars[i].split('=');
        get[va[0]] = va[1];
    }
    
    var coord = get.c.split('][').join(',').split(']').join('').split('[').join('').split(',');
    
    var user = {
        login: get.p,
        X: Number(coord[0]),
        Y: Number(coord[1]),
        rank:0
    };
    
    CRUD.isUserExist( {login:user.login}, initGaia );
    
    function initGaia (data){
        
        console.log('Retour de user_exist');
        console.log(data);
        
        if( data.rank == 0 ) {
            console.log('new');
            user.rank = 1;
            $("#welcome").show('slow');
        } else {
            console.log('old');
            user.rank = Number(data.rank);
            $( "#butReport" ).click();
        }
        
        var rank = $("#rank").attr('src', "img/rank"+user.rank+".png");
        rank.attr('alt', user.rank+" (GAIA)");
        $("#login").text(user.login);
        
    }
    
    // gaia
    
    $( "a.butmenu" ).click(function( event ) {
        
        $(this).toggleClass("active");
        
        $(".toggle_container").hide('slow');
        $( $(this).attr('href') ).show('slow');
        
        return false;
        
    });
    
    $(".toggle_container").hide();
    
});

var CRUD = {
    
    isUserExist: function( vars, callback ) {
        vars.action = 'user_exist';
        $.post( 'crud.php', vars, callback, "json" );
    }
    
};
