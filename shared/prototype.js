(() => {
  const root=document.documentElement;
  const stateBtn=document.querySelector('[data-action="state"]');
  const copyBtn=document.querySelector('[data-action="copy"]');
  const statePanel=document.getElementById('state-panel');
  const mainSections=[...document.querySelectorAll('.sleep-hero,.section-block,.metrics-grid,.insight')];
  const copy=document.getElementById('insight-copy');
  let state=0, longCopy=false;

  document.querySelector('[data-action="theme"]').addEventListener('click',()=>{
    root.dataset.theme=root.dataset.theme==='night'?'day':'night';
    requestAnimationFrame(checkOverflow);
  });

  stateBtn.addEventListener('click',()=>{
    state=(state+1)%4;
    const labels=['Normal','Missing','Loading','Unsupported'];
    stateBtn.textContent=labels[state];
    const messages=[
      ['', ''],
      ['データなし','昨夜の睡眠データは見つかりませんでした。0時間としては扱いません。'],
      ['読み込み中','保存済みデータがないため、睡眠データを取得しています。'],
      ['現在取得できません','この指標は現在取得できません。対応状況を確認してください。']
    ];
    const normal=state===0;
    mainSections.forEach(el=>el.hidden=!normal);
    statePanel.hidden=normal;
    if(!normal){
      document.getElementById('state-title').textContent=messages[state][0];
      document.getElementById('state-message').textContent=messages[state][1];
    }
    requestAnimationFrame(checkOverflow);
  });

  copyBtn.addEventListener('click',()=>{
    longCopy=!longCopy;
    copyBtn.textContent=longCopy?'Standard copy':'Long copy';
    copy.textContent=longCopy
      ? '昨夜は途中で目が覚める時間が少しあり、睡眠時間も最近のあなたより短めでした。ただし一晩だけで良し悪しは決めず、今日の体調や数日間の流れも一緒に見ていきましょう。'
      : 'いつもより少し短めの睡眠でした。今日は無理を決めつけず、体調も一緒に見てみましょう。';
    requestAnimationFrame(checkOverflow);
  });

  function checkOverflow(){
    let count=0;
    document.querySelectorAll('[data-fit-probe]').forEach(el=>{
      delete el.dataset.overflow;
      if(el.closest('[hidden]')) return;
      const rect=el.getBoundingClientRect();
      const childOverflow=[...el.children].some(child=>{
        const r=child.getBoundingClientRect();
        return r.left < rect.left-3 || r.right > rect.right+3;
      });
      // Only horizontal overflow is meaningful for this typography probe.
      // Inline baseline ascenders / descenders are not a clipped-layout error.
      const bad=childOverflow || el.scrollWidth-el.clientWidth>4;
      el.dataset.overflow=bad?'true':'false';
      if(bad) count++;
    });
    const copy=document.querySelector('[data-hero-safe-probe]');
    const hero=document.querySelector('.sleep-hero');
    if(copy && hero && !hero.hidden){
      const a=copy.getBoundingClientRect(), b=hero.getBoundingClientRect();
      const unsafe=a.left<b.left+14 || a.right>b.right-14 || a.top<b.top+12 || a.bottom>b.bottom-12;
      if(unsafe) count++;
    }
    const art=document.querySelector(root.dataset.theme==='night'?'.hero-art-night':'.hero-art-day');
    const artOk=!!(art && art.complete && art.naturalWidth>0);
    document.getElementById('art-readout').textContent='hero art: '+(artOk?'loaded':'loading / failed');
    if(art && art.complete && !artOk) count++;
    document.getElementById('overflow-readout').textContent='fit checks: '+(count?count+' issue'+(count>1?'s':''):'pass');
    document.getElementById('viewport-readout').textContent='viewport: '+window.innerWidth+'×'+window.innerHeight+' css px';
  }
  document.querySelectorAll('.hero-art').forEach(art=>{
    art.addEventListener('load',checkOverflow);
    art.addEventListener('error',checkOverflow);
  });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(checkOverflow);
  window.addEventListener('resize',checkOverflow);
  window.addEventListener('load',checkOverflow);
})();