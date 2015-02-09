function GAIA () {
    
    //debug
    if(GAIADebug) console.log('debug');
    
    // link css
    var lien_css = document.createElement('link');
    lien_css.href = 'http://lipki.github.io/GAIA-Report/css/style.css';
    if(GAIADebug)
    lien_css.href = "http://localhost/GAIA-Report/css/style.css";
    lien_css.rel = "stylesheet";
    lien_css.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(lien_css);
    
    // get elements
    this.first = false;
    this.dom = {};
    this.dom.iframe = document.getElementById('iframe');
    this.dom.innerDoc = this.dom.iframe.contentDocument || this.dom.iframe.contentWindow.document;
    var menu = this.dom.innerDoc.getElementById('menu');
    var liMaPage = menu.getElementsByTagName('li')[1];
    var aMaPage = liMaPage.getElementsByTagName('a')[0];

    //install
    var center = document.getElementById('center');
    var onglet = this.dom.onglet = document.createElement('button');
    onglet.setAttribute('id', 'gaia');
    center.appendChild(onglet);
    center.insertBefore(onglet, this.dom.iframe);
    onglet.style.display = 'block';
    
    // event
    var _this = this;
    if (onglet.addEventListener) onglet.addEventListener('click', function(){_this.gaiaSwitch()}, false);
    else if (onglet.attachEvent) onglet.attachEvent('onclick', function(){_this.gaiaSwitch()});

    if (this.dom.iframe.addEventListener) this.dom.iframe.addEventListener('load', function(){_this.pageLoad()}, false);
    else if (this.dom.iframe.attachEvent) this.dom.iframe.attachEvent('onload', function(){_this.pageLoad()});
        
    // set user
    this.user = {};
    this.user.login = '';
    this.user.X = 0;
    this.user.Y = 0;
    this.user.rank = 0;
    this.user.group = '';
    this.user.create_date = new Date();
    this.user.last_login_date = new Date();
    this.user.suspend = 0;
    this.user.linkMaPage = aMaPage.href;

    //start
    this.gaiaSwitch(null);
    
};

GAIA.prototype.gaiaSwitch = function(evt) {
    console.log('switch');
    this.dom.iframe.src = this.user.linkMaPage;
};

GAIA.prototype.pageLoad = function(evt) {
    console.log('load');
        
    var dom = this.dom, user = this.user;

    var href = window.open('','iframe').location.href;
    if(    href.indexOf('/user/') != -1
        && href.indexOf('/ranking/') == -1
        && href.indexOf('/missions/') == -1
        && href.search(/\/$/) == -1) {
        
        var iframe   = dom.iframe   = document.getElementById('iframe');
        var innerDoc = dom.innerDoc = dom.iframe.contentDocument || dom.iframe.contentWindow.document;
        var section = dom.innerDoc.getElementById('section');
        var card = section.getElementsByClassName('card')[0];
        var a = card.getElementsByTagName('a')[0];
        
        if( !this.first ) {
            user.login = a.textContent;
            this.testUser();
        }
        
        this.dom.onglet.style.backgroundImage = 'url(http://lipki.github.io/GAIA-Report/img/tab_on.gif)';

        active = innerDoc.getElementsByClassName('active')[0];
        if( active != undefined ) active.className = '';
        
        /*var menu     = dom.menu     = dom.innerDoc.getElementById('menu');
        var liMaPage = dom.liMaPage = menu.getElementsByTagName('li')[1];
        var aMaPage  = dom.aMaPage  = liMaPage.getElementsByTagName('a')[0];*/
        
        var span = card.getElementsByTagName('span')[0];
        var coord = span.textContent;
            coord = coord.split('][').join(',').split(']').join('').split('[').join('').split(',');
        
        var X = user.X = Number(coord[0]);
        var Y = user.Y = Number(coord[1]);
        
        user = section.getElementsByClassName('user')[0];
        card = user.getElementsByClassName('card')[0];

        user.innerHTML = null;
        user.appendChild(card);
        
        a.href = a.href+'/';
        
    } else {
        dom.onglet.style.backgroundImage = 'url(http://lipki.github.io/GAIA-Report/img/tab_off.gif)';
    }
};

GAIA.prototype.testUser = function() {
    console.log('CRUD');
    CRUD.call( {login:this.user.login}, 'isUserExist', this, 'isUserExist' );
};

GAIA.prototype.isUserExist = function( reply ) {
    
    console.log('Retour de user_exist');
    console.log(reply);
    
    var user = this.user;
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
        var pop = this.dom.pop = document.getElementById('pop');
        var innerpop = this.dom.innerpop = document.getElementById('inner');
        pop.style.display = 'block';
        innerpop.innerHTML = ''+
        '<div class="GAIAMissionStart">'+
            '<div class="mission">'+
                '<div id="mDate" class="date"></div>'+
                '<h3>GAIA Report</h3>'+
                '<div class="content">'+
                    '<div class="pic">'+
                        '<img src="http://lipki.github.io/GAIA-Report/img/missiongaia.png" alt="Img">'+
                    '</div>'+
                    'Bien joué détenu <span id="mUser"></span>.'+
                    "Grâce à votre aide les laboratoires d'ESCorp vont pouvoir mettre la main sur des informations précieuses."+
                    "<strong>Le programme d'extension</strong>"+
                    "vient d'être transféré comme promis non loin de votre secteur d'origine <em>[-1][0]</em>."+
                '</div>'+
            '</div>'+
        '</div>';
    } else {
        console.log('old');
        ///$( "#butReport" ).click();
    }

    //pop.style.display = 'block';
    //innerpop.innerHTML = 'pouf<br/>pouf';
    
    //for (var a in user) user[a] = reply.data[0][a];
    
};













var CRUD = {
    
    call: function( vars, action, _this, success ) {
        vars.action = action;
        
        var data = [];
        for( var va in vars ) data.push(va+'='+vars[va]);
    
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(){ _this[success](JSON.parse(xhr.responseText)) }, false);
        xhr.addEventListener("error", function(){CRUD.fail()}, false);
        //xhr.open('POST', 'http://127.0.0.1/GAIA-Report/crud.php');
        xhr.open('GET', 'http://a4edfd900b.url-de-test.ws/gaia/crud.php?'+data.join('&'));
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
        xhr.send();
        
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

new GAIA();
