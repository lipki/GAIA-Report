if(top['bookmarkletGAIAreport']) {
   top['bookmarkletGAIAreport'];
} else {
  (function(d){
    if(window.location.host.indexOf('alphabounce.com') != -1 && d.getElementById('gaia') == null) {
      if (d.getElementById('GAIA')) return;
      var E = d.createElementNS && d.documentElement.namespaceURI;
      E = E ? d.createElementNS(E, 'script') : d.createElement('script');
      E.setAttribute('id', 'GAIA');
      E.setAttribute('src', 'http://localhost/GAIA-Report/js/app.js');
      //E.setAttribute('src', 'http://lipki.github.io/GAIA-Report/js/app.js');
      (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(E);
    }
  })(document);
}
