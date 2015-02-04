if(top['bookmarkletgaia']) {
   top['bookmarkletgaia'];
} else {
  (function(){
    if(window.location.host.indexOf('alphabounce.com') != -1 && document.getElementById('gaia') == null) {
      var d = document, iframe, innerDoc, menu, li, a, center, card;

      a = d.createElement('a');
      a.setAttribute('href', 'http://a4edfd900b.url-de-test.ws/gaia/gaia.html');
      a.setAttribute('id', 'gaia');
      a.style.position = 'absolute';
      a.style.right = '10px';
      a.style.top = '96px';
      a.style.zIndex = '10';
      a.style.display = 'block';
      a.style.backgroundImage = 'url(http://a4edfd900b.url-de-test.ws/gaia/img/tab_on.gif)';
      a.style.width = '21px';
      a.style.height = '29px';

      iframe = d.getElementById('iframe');
      center = d.getElementById('center');
      center.appendChild(a);
      center.insertBefore(a, iframe);
      center.style.position = 'relative';

      function pageLoad(evt) {
        var href, newIframe, section, user, active, pseudo, span, coord;

        iframe = d.getElementById('iframe');
        innerDoc = iframe.contentDocument || iframe.contentWindow.document;

        if (iframe.removeEventListener) iframe.removeEventListener('load', pageLoad, false);
        else if (iframe.detachEvent) iframe.detachEvent('onload', pageLoad);

        href = window.open('','iframe').location.href;
        if( href.indexOf('/user/') != -1 && href.indexOf('/ranking/') == -1 && href.indexOf('/missions/') == -1 ) {

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

          active = innerDoc.getElementsByClassName('active')[0];
          if( active != undefined ) active.className = '';
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
        iframe.src = a.href;

        if (iframe.addEventListener) iframe.addEventListener('load', pageLoad, false);
        else if (iframe.attachEvent) iframe.attachEvent('onload', pageLoad);

      };

      gaiaSwitch(null);

      if (a.addEventListener) a.addEventListener('click', gaiaSwitch, false);
      else if (a.attachEvent) a.attachEvent('onclick', gaiaSwitch);

    }
  })();
}
