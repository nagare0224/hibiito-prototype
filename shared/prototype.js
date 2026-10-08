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
    document.querySelectorAll('[data-overflow-watch]').forEach(el=>{
      const bad=el.scrollWidth>el.clientWidth+1 || el.scrollHeight>el.clientHeight+1;
      el.dataset.overflow=bad?'true':'false';
      if(bad) count++;
    });
    document.getElementById('overflow-readout').textContent='overflow: '+(count?count+' detected':'none');
    document.getElementById('viewport-readout').textContent='viewport: '+window.innerWidth+'×'+window.innerHeight+' css px';
  }
  window.addEventListener('resize',checkOverflow);
  window.addEventListener('load',checkOverflow);
})();