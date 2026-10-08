(() => {
  const root=document.documentElement;
  const directionBtn=document.querySelector('[data-action="direction"]');
  const stateBtn=document.querySelector('[data-action="state"]');
  const copyBtn=document.querySelector('[data-action="copy"]');
  const statePanel=document.getElementById('state-panel');
  const mainSections=[...document.querySelectorAll('.sleep-hero,.section-block,.metrics-grid,.insight')];
  const copy=document.getElementById('insight-copy');
  let direction=0, state=0, longCopy=false;
  const directions=[['a','A · 月の水面'],['b','B · 夜の窓'],['c','C · 眠りの帯']];

  directionBtn.addEventListener('click',()=>{
    direction=(direction+1)%directions.length;
    root.dataset.direction=directions[direction][0];
    directionBtn.textContent=directions[direction][1];
    requestAnimationFrame(checkOverflow);
  });

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
      const rect=el.getBoundingClientRect();
      const children=[...el.children];
      const childOverflow=children.some(child=>{
        const r=child.getBoundingClientRect();
        return r.left < rect.left-3 || r.right > rect.right+3 || r.top < rect.top-3 || r.bottom > rect.bottom+3;
      });
      const selfOverflow=el.scrollWidth-el.clientWidth>4 || el.scrollHeight-el.clientHeight>4;
      const bad=childOverflow || selfOverflow;
      el.dataset.overflow=bad?'true':'false';
      if(bad) count++;
    });
    document.getElementById('overflow-readout').textContent='fit checks: '+(count?count+' issue'+(count>1?'s':''):'pass');
    document.getElementById('viewport-readout').textContent='viewport: '+window.innerWidth+'×'+window.innerHeight+' css px';
  }
  window.addEventListener('resize',checkOverflow);
  window.addEventListener('load',checkOverflow);
})();