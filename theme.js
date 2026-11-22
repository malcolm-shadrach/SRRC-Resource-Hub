(function(){
  'use strict';
  var KEY='srrc-resource-hub-theme';
  function valid(t){return t==='light'||t==='dark'}
  function apply(theme, persist){
    if(!valid(theme)) theme='dark';
    document.documentElement.setAttribute('data-theme',theme);
    document.documentElement.style.colorScheme=theme;
    if(persist!==false){try{localStorage.setItem(KEY,theme)}catch(e){}}
    var btn=document.getElementById('srrcThemeToggle');
    if(btn){btn.textContent=theme==='dark'?'☀ Light mode':'☾ Dark mode';btn.setAttribute('aria-pressed',String(theme==='dark'));btn.setAttribute('aria-label','Switch to '+(theme==='dark'?'light':'dark')+' theme')}
    if(window.parent!==window){try{window.parent.postMessage({type:'SRRC_THEME_READY',theme:theme},location.origin)}catch(e){}}
    return theme;
  }
  var initial='dark';
  try{initial=localStorage.getItem(KEY)||'dark'}catch(e){}
  apply(initial,false);
  window.SRRCTheme={get:function(){return document.documentElement.getAttribute('data-theme')||'dark'},set:apply,toggle:function(){return apply(this.get()==='dark'?'light':'dark',true)}};
  window.addEventListener('storage',function(e){if(e.key===KEY&&valid(e.newValue))apply(e.newValue,false)});
  window.addEventListener('message',function(e){
    if(e.origin!==location.origin||!e.data)return;
    if(e.data.type==='SRRC_THEME_CHANGE'&&valid(e.data.theme))apply(e.data.theme,false);
    if(e.data.type==='SRRC_EMBEDDED')document.documentElement.classList.toggle('srrc-embedded',!!e.data.value);
  });
  document.addEventListener('DOMContentLoaded',function(){
    if(!document.getElementById('srrcThemeToggle')){
      var b=document.createElement('button');b.id='srrcThemeToggle';b.type='button';b.className='srrc-theme-toggle';b.addEventListener('click',function(){window.SRRCTheme.toggle()});document.body.appendChild(b);
    }
    apply(window.SRRCTheme.get(),false);
    if(window.parent!==window){document.documentElement.classList.add('srrc-embedded');try{window.parent.postMessage({type:'SRRC_THEME_READY',theme:window.SRRCTheme.get()},location.origin)}catch(e){}}
  });
})();
