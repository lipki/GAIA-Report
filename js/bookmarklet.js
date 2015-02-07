if(top['bookmarkletGAIAreport']) {
   top['bookmarkletGAIAreport'];
} else {
  (function(){
    if(window.location.host.indexOf('alphabounce.com') != -1 && document.getElementById('gaia') == null) {
      var d = document, iframe, innerDoc, menu, li, onglet, center, card;

      onglet = d.createElement('a');
      onglet.setAttribute('href', 'http://lipki.github.io/GAIA-Report/gaia.html');
      onglet.setAttribute('id', 'gaia');
      onglet.style.position = 'absolute';
      onglet.style.right = '10px';
      onglet.style.top = '96px';
      onglet.style.zIndex = '10';
      onglet.style.display = 'block';
      onglet.style.backgroundImage = 'url(http://lipki.github.io/GAIA-Report/img/tab_off.gif)';
      onglet.style.width = '21px';
      onglet.style.height = '29px';

      iframe = d.getElementById('iframe');
      center = d.getElementById('center');
      center.appendChild(onglet);
      center.insertBefore(onglet, iframe);
      center.style.position = 'relative';

      function pageLoad(evt) {
        var href, newIframe, section, user, active, pseudo, span, coord, a;

        iframe = d.getElementById('iframe');
        innerDoc = iframe.contentDocument || iframe.contentWindow.document;

        href = window.open('','iframe').location.href;
        if(   href.indexOf('/user/') != -1
           && href.indexOf('/ranking/') == -1
           && href.indexOf('/missions/') == -1
           && href.search(/\/$/) == -1) {
          
          onglet.style.backgroundImage = 'url(http://lipki.github.io/GAIA-Report/img/tab_on.gif)';

          section = innerDoc.getElementById('section');
          card = section.getElementsByClassName('card')[0];
          a = card.getElementsByTagName('a')[0];
          pseudo = a.textContent;
          span = card.getElementsByTagName('span')[0];
          coord = span.textContent;

          a = d.getElementById('gaia');

          newIframe = innerDoc.createElement('iframe');
          newIframe.setAttribute('id', 'gaiaIframe');
          newIframe.setAttribute('frameborder', '');
          newIframe.setAttribute('allowtransparency', 'true');
          newIframe.setAttribute('scrolling', 'no');
          newIframe.setAttribute('src', a.href+'?p='+pseudo+'&c='+coord);
          newIframe.style.border = '0';
          newIframe.style.width = '468px';
          newIframe.style.height = '385px';

          section = innerDoc.getElementById('section');
          section.style.overflow = 'hidden';
          user = section.getElementsByClassName('user')[0];
          card = user.getElementsByClassName('card')[0];
          section.style.width = '468px';

          user.innerHTML = null;
          user.appendChild(newIframe);

          menu = innerDoc.getElementById('menu');
          li = menu.getElementsByTagName('li')[1];
          a = li.getElementsByTagName('a')[0];
          a.href = a.href+'/';
          
          active = innerDoc.getElementsByClassName('active')[0];
          if( active != undefined ) active.className = '';
        } else {
          onglet.style.backgroundImage = 'url(http://lipki.github.io/GAIA-Report/img/tab_off.gif)';
        }
      }

      function gaiaSwitch(evt) {
        if(evt != null) evt.preventDefault();
        var iframe, innerDoc, menu, li, a;

        iframe = d.getElementById('iframe');
        innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        menu = innerDoc.getElementById('menu');
        li = menu.getElementsByTagName('li')[1];
        a = li.getElementsByTagName('a')[0];
        iframe.src = a.href.replace(/\/$/, '');
      };

      gaiaSwitch(null);

      if (onglet.addEventListener) onglet.addEventListener('click', gaiaSwitch, false);
      else if (onglet.attachEvent) onglet.attachEvent('onclick', gaiaSwitch);

      if (iframe.addEventListener) iframe.addEventListener('load', pageLoad, false);
      else if (iframe.attachEvent) iframe.attachEvent('onload', pageLoad);

    }
  })();
}

/*
Exception: ReferenceError: a is not defined
@Scratchpad/1:93:1
@Scratchpad/1:4:4
*/
