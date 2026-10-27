import { courses } from './courses.js';
import { normalize, shuffledTokens, freshProgress, loadProgress, saveProgress, completeStep, summarize, stepKey } from './core.js';

const $ = id => document.getElementById(id);
const el = (tag,text,className) => { const n=document.createElement(tag); if(text!==undefined) n.textContent=text; if(className)n.className=className; return n; };
const button = (text,fn,className='') => {const b=el('button',text,className); b.type='button'; b.addEventListener('click',fn); return b;};
let storage; try {storage=window.localStorage;} catch {storage=null;}
const loaded=loadProgress(storage,courses);
let progress=loaded.progress, course=null, index=0, view='map', generation=0;
let recorder=null, stream=null, recordingURL=null, replay=null, chunks=[], recordingTimer=null;
let audio=null, audioGeneration=0, audioMap={}, lastActivity=Date.now(), lastTick=Date.now(), nextBreak=600;
let recordingReady=false, selfConfirmed=false, cancelPendingRecording=null;
const notice = text => { $('notice').textContent=text; $('notice').hidden=!text; };
const feedback = text => { $('feedback').textContent=text; };
function save(){ const result=saveProgress(storage,progress); if(result.error)notice(result.error); }
if(loaded.error)notice(loaded.error);
fetch(new URL('./audio-map.json',import.meta.url)).then(r=>r.ok?r.json():{}).then(map=>{if(map && typeof map==='object')audioMap=map;}).catch(()=>{});
function stopAudio(){ audioGeneration++; if(audio){audio.pause();audio=null;} if('speechSynthesis' in window)window.speechSynthesis.cancel(); }
function cleanup(){
 generation++; cancelPendingRecording?.(); stopAudio(); clearTimeout(recordingTimer);
 if(recorder && recorder.state!=='inactive'){recorder.ondataavailable=null;recorder.onstop=null;try{recorder.stop();}catch{}}
 recorder=null; if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
 if(replay){replay.pause();replay=null;}
 if(recordingURL){URL.revokeObjectURL(recordingURL);recordingURL=null;}
 chunks=[]; recordingReady=false; selfConfirmed=false;
}
async function browserSpeak(text,token){
 if(token!==audioGeneration)return;
 if(!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)){
  feedback('当前浏览器没有朗读功能。请查看示例，自主朗读；听力题可以切换到看示例练习。'); return;
 }
 const utterance=new SpeechSynthesisUtterance(text); utterance.lang='en-US';utterance.rate=Number($('rate').value);
 const englishVoices=()=>speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('en'));
 let voices=englishVoices();
 // Browsers may populate voices asynchronously after the first getVoices().
 // Bounded polling also works when a browser misses the voiceschanged event.
 for(let attempt=0;!voices.length&&attempt<15;attempt++){
  await new Promise(resolve=>setTimeout(resolve,100));
  if(token!==audioGeneration)return;
  voices=englishVoices();
 }
 const natural=v=>/Samantha|Daniel|Karen|Moira|Tessa|Serena|Microsoft|Google/i.test(v.name);
 const voice=voices.find(v=>v.localService&&natural(v))||voices.find(v=>v.localService&&!/Albert|Boing|Bubbles|Bad News|Good News|Bells|Cellos|Trinoids|Zarvox|Whisper/i.test(v.name))||voices.find(natural)||voices[0];
 if(!voice){notice('未检测到可用的英语朗读声音。可在系统设置中安装英语声音后刷新；现在请展开示例自主练习，听力功能暂不可用。');feedback('没有可用的英语声音，请展开示例阅读。');return;}
 utterance.voice=voice; utterance.lang=voice.lang;
 utterance.onerror=()=>{if(token===audioGeneration)feedback('浏览器朗读未成功。请查看示例练习，不必等待声音。');};
 feedback('正在使用浏览器朗读（不是录音识别）。系统声音可能需要联网。');
 speechSynthesis.speak(utterance);
}
function say(text){
 stopAudio(); const token=audioGeneration;
 const entry=audioMap[text]; const path=typeof entry==='string'?entry:entry?.url || entry?.path;
 if(path){
  try{
   const url=new URL(path,import.meta.url);
   if(url.origin!==location.origin)throw Error('Non-local audio');
   audio=new Audio(url.href); audio.playbackRate=Number($('rate').value);
   audio.onerror=()=>browserSpeak(text,token);
   audio.play().then(()=>{if(token===audioGeneration)feedback('正在播放示范音频。可以反复听，或放慢一点。');}).catch(()=>browserSpeak(text,token));
  }catch{browserSpeak(text,token);}
 }else browserSpeak(text,token);
}
function renderStats(){
 const stats=summarize(progress,courses); $('stars').textContent=stats.completedCourses;$('practiced').textContent=`${stats.practiced} / ${stats.total}`;
 $('timer').textContent=`${Math.floor(progress.activeSeconds/60)}:${String(progress.activeSeconds%60).padStart(2,'0')}`;
 $('continue').hidden=!progress.cursor;
}
function setView(name){view=name; $('map-view').hidden=name!=='map';$('play-view').hidden=name!=='play';$('finish-view').hidden=name!=='finish';}
function showMap(){
 cleanup();setView('map'); renderStats();const map=$('quest-map');map.replaceChildren();
 courses.forEach((c,i)=>{
  const count=c.steps.filter(s=>progress.completed[stepKey(c,s)]).length;
  const card=button('',()=>openCourse(c), 'quest-card');
  card.append(el('span',c.emoji||'✦','emoji'),el('span',`MISSION ${String(i+1).padStart(2,'0')}`,'eyebrow'),el('h3',c.title),el('p',c.goal));
  const foot=el('div',undefined,'card-foot');foot.append(el('span',`${count} / ${c.steps.length} 已练习`),el('span',count===c.steps.length?'★ 再练一次 →':'开始探险 →'));card.append(foot);map.append(card);
 });
}
function openCourse(c,step){
 course=c;index=step??Math.max(0,c.steps.findIndex(s=>!progress.completed[stepKey(c,s)]));setView('play');renderStep();
 $('play-view').scrollIntoView({block:'start',behavior:'smooth'});
}
function modelBlock(step,hidden=true){
 const wrap=el('div');const model=el('div',undefined,'model');model.hidden=hidden;
 model.append(el('div',step.en,'english'),el('div',step.zh,'translation'));
 const toggle=button(hidden?'看看示例 / 无声时查看':'收起示例',()=>{model.hidden=!model.hidden;toggle.textContent=model.hidden?'看看示例 / 无声时查看':'收起示例';});
 wrap.append(toggle,model);return wrap;
}
function mark(method){progress=completeStep(progress,course,course.steps[index],method);save();renderStats();$('next').disabled=false;}
function oralReady(){ $('oral-complete').disabled=!(recordingReady||selfConfirmed); }
async function startRecording(status,start,stop,play){
 if(!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder==='undefined'){
  status.textContent='当前浏览器不支持录音，或页面不是 HTTPS。请使用下方“自主开口练习”，不作评分。';return;
 }
 const token=generation; start.disabled=true;status.textContent='等待麦克风许可；只在本机临时录音。';
 let permissionTimeout=null, permissionExpired=false, requestCancelled=false;
 let cancelRequest;
 const cancelled=new Promise((_,reject)=>{
  cancelRequest=()=>{
   requestCancelled=true;start.disabled=false;
   status.textContent='录音请求已取消，请返回页面后重新点击开始录音。';
   reject(new Error('Microphone request cancelled'));
  };
 });
 cancelPendingRecording=cancelRequest;
 try{
  const request=navigator.mediaDevices.getUserMedia({audio:true});
  request.then(acquired=>{if(permissionExpired||requestCancelled||token!==generation)acquired.getTracks().forEach(t=>t.stop());}).catch(()=>{});
  const acquired=await Promise.race([request,cancelled,new Promise((_,reject)=>{permissionTimeout=setTimeout(()=>{permissionExpired=true;reject(new Error('Microphone permission timeout'));},15000);})]);
  clearTimeout(permissionTimeout);
  if(requestCancelled||token!==generation){acquired.getTracks().forEach(t=>t.stop());return;}
  cancelPendingRecording=null;
  stream=acquired;stopAudio();if(replay){replay.pause();replay=null;}
  if(recordingURL){URL.revokeObjectURL(recordingURL);recordingURL=null;}
  chunks=[];recordingReady=false;oralReady();play.disabled=true;
  recorder=new MediaRecorder(stream);
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  recorder.onerror=()=>{status.textContent='录音出现问题，请重试或选择自主练习。';stopRecording();};
  recorder.onstop=()=>{
   if(token!==generation)return;
   if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
   const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});chunks=[];
   recordingReady=blob.size>0;
   if(recordingReady){recordingURL=URL.createObjectURL(blob);status.textContent='已录下你的尝试！可以回听，自己判断是否清楚；系统不评价发音。';}
   else status.textContent='没有得到可回放的录音，请重试或选择自主练习。';
   start.disabled=false;stop.disabled=true;play.disabled=!recordingReady;oralReady();
  };
  recorder.start();stop.disabled=false;status.textContent='● 录音中。说完点击停止；最多录制 2 分钟，避免忘记关闭麦克风。';
  recordingTimer=setTimeout(stopRecording,120000);
 }catch{
  clearTimeout(permissionTimeout);
  if(token!==generation)return;
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
  start.disabled=false;status.textContent=permissionExpired?'等待麦克风许可超时。请在地址栏允许麦克风后重试，也可以先选择自主开口练习。':'未能打开麦克风（可能未授权或被占用）。你仍可开口说，再勾选“自主开口练习”；不作评分。';
 }
}
function stopRecording(){cancelPendingRecording?.();cancelPendingRecording=null;clearTimeout(recordingTimer);if(recorder?.state==='recording')recorder.stop();if(stream)stream.getTracks().forEach(t=>t.stop());}
function renderOral(step,root){
 root.append(el('p',step.type==='respond'?'想想怎么回答，再用自己的话说。不必和示例一样。可以先想 20 秒，试着说两遍。':'先听示范，再跟读。先小声说一次，再试着完整说两遍。','instruction'));
 if(step.type==='speak')root.append(el('p',step.zh,'prompt'));
 root.append(modelBlock(step,true));
 const controls=el('div',undefined,'actions');
 controls.append(button('▶ 听示例',()=>say(step.en)));
 const status=el('p','录音只用于自己回听，不上传、不识别、不评分。','record-status');status.setAttribute('role','status');
 let start,stop,play;
 start=button('● 开始录音',()=>startRecording(status,start,stop,play));
 stop=button('■ 停止录音',stopRecording); stop.disabled=true;
 play=button('↻ 回听我的声音',()=>{stopAudio();if(replay)replay.pause();replay=new Audio(recordingURL);replay.play().catch(()=>{status.textContent='无法回放这段录音，请重录或自主练习。';});});play.disabled=true;
 controls.append(start,stop,play);root.append(controls,status);
 const label=el('label',undefined,'self-label');const checkbox=el('input');checkbox.type='checkbox';checkbox.id='self-practice';checkbox.addEventListener('change',()=>{selfConfirmed=checkbox.checked;oralReady();});
 label.append(checkbox,el('span','不录音：我已实际开口说过，选择自主练习（自我确认，未被评估）。'));root.append(label);
 const done=button('我练习过了，记下这次勇气',()=>{if(!(recordingReady||selfConfirmed))return;mark(recordingReady?'recorded':'self-practice');feedback(recordingReady?'已记为录音练习。敢开口就是今天的收获！这不是发音评分。':'已记为自主练习（自我确认），不是系统评估。谢谢你的认真尝试！');},'primary');done.id='oral-complete';done.disabled=true;root.append(done);
}
function renderStep(){
 cleanup();lastActivity=Date.now();feedback('');
 const step=course.steps[index];progress.cursor={courseId:course.id,step:index};save();renderStats();
 $('mission-label').textContent=`${course.emoji||'✦'} ${course.title} · ${index+1} / ${course.steps.length}`;
 $('step-progress').max=course.steps.length;$('step-progress').value=index;
 $('previous').disabled=index===0;$('next').disabled=!progress.completed[stepKey(course,step)];$('next').textContent=index===course.steps.length-1?'完成这一站 ★':'下一步 →';
 const root=$('activity');root.replaceChildren();
 const labels={listen:'听一听 · 找到意思',build:'拼一拼 · 句子积木',type:'听写 · 慢慢输入',speak:'开口 · 跟读练习',respond:'挑战 · 自由回答'};
 root.append(el('p',labels[step.type]||'英语练习','eyebrow'));
 const heading=el('h2',step.prompt);heading.tabIndex=-1;root.append(heading);
 if(step.hint){const hints=el('details',undefined,'instruction');hints.append(el('summary','需要一点提示？'),el('p',step.hint));root.append(hints);}
 if(step.type==='speak'||step.type==='respond')renderOral(step,root);
 else if(step.type==='listen'){
  root.append(el('p','先听一句英语，再选择合适的答案。可以多听几遍；没有声音时，展开示例阅读后选择。','instruction'),button('▶ 听一听',()=>say(step.en),'primary'));
  const choices=el('div',undefined,'options');
  (step.options||[]).forEach(option=>choices.append(button(option,e=>{
   choices.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));e.currentTarget.classList.add('selected');
   if(option===step.answer){mark('checked');feedback('选对了！现在试着把这句话也说一遍吧。');}else feedback('再听一遍找找线索。答错也没关系，可以继续试。');
  })));root.append(choices,modelBlock(step));
 }else if(step.type==='build'){
  root.append(el('p',step.zh,'prompt'),el('p','依次点击词块拼句子。点击上方已选词块可放回；相同单词是独立的词块。','instruction'));
  const answer=el('div',undefined,'word-answer'),bank=el('div',undefined,'word-bank');answer.setAttribute('aria-label','已选词块');bank.setAttribute('aria-label','可用词块');
  const tokens=shuffledTokens(step.en);let selected=[];
  const draw=()=>{answer.replaceChildren();bank.replaceChildren();selected.forEach(id=>answer.append(button(tokens.find(t=>t.id===id).word,()=>{selected=selected.filter(v=>v!==id);draw();})));tokens.filter(t=>!selected.includes(t.id)).forEach(t=>bank.append(button(t.word,()=>{selected.push(t.id);draw();})));};draw();
  root.append(answer,bank,button('检查句子',()=>{const text=selected.map(id=>tokens.find(t=>t.id===id).word).join(' ');if(selected.length===tokens.length&&normalize(text)===normalize(step.en)){mark('checked');feedback('拼好了！听一遍，再完整读一遍。');}else feedback('还差一点，试试换一换顺序。你可以听示例寻找线索。');},'primary'),button('▶ 听示例',()=>say(step.en)));
 }else if(step.type==='type'){
  root.append(el('p','听一句、写一句。忽略大小写和句末标点，词语要一致；可以反复听或看示例。','instruction'),button('▶ 播放听写',()=>say(step.en),'primary'));
  const form=el('form');const label=el('label','我听到的是：');label.htmlFor='dictation';const input=el('input');input.id='dictation';input.className='answer-input';input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','off');
  const submit=el('button','检查听写');submit.type='submit';form.append(label,input,submit);
  form.addEventListener('submit',e=>{e.preventDefault();if(normalize(input.value)===normalize(step.en)){mark('checked');feedback('写对了！把这句话读给自己听，让文字变成声音。');}else feedback('再听听，还有词语需要调整。可以看示例对照，不扣分。');});root.append(form,modelBlock(step));
 }else {root.append(el('p','这道题暂时无法显示，请返回地图选择其他任务。'));}
 heading.focus({preventScroll:true});
}
$('back').onclick=showMap;$('finish-map').onclick=showMap;
$('previous').onclick=()=>{if(index>0){index--;renderStep();}};
$('next').onclick=()=>{
 if(!progress.completed[stepKey(course,course.steps[index])])return;
 if(index<course.steps.length-1){index++;renderStep();}
 else{cleanup();setView('finish');const count=course.steps.filter(s=>progress.completed[stepKey(course,s)]).length;
 $('finish-copy').textContent=count===course.steps.length?`「${course.title}」已全部练习，获得一颗完成之星！星星记录坚持，不代表掌握。明天再说一次，会更熟悉。`:`「${course.title}」已练习 ${count} / ${course.steps.length} 题。还有小任务等你继续，完成全部后获得星星。`;
 renderStats();$('finish-title').focus();}
};
$('continue').onclick=()=>{const c=courses.find(c=>c.id===progress.cursor?.courseId);if(c)openCourse(c,progress.cursor.step);};
$('export').onclick=()=>{
 const report={tool:'English Quest',version:1,exportedAt:new Date().toISOString(),notice:'练习记录，不是掌握或发音评估；不含录音。',summary:summarize(progress,courses),progress};
 const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const link=el('a');link.href=url;link.download='english-quest-practice.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('reset').onclick=()=>{if(!window.confirm('确定清除当前浏览器的全部练习进度和时间吗？此操作不能撤销；可先导出报告。'))return;progress=freshProgress();nextBreak=600;const result=saveProgress(storage,progress);showMap();notice(result.error?'本次内存进度已重置，但浏览器存储未能更新。请检查浏览器存储权限，刷新后旧进度可能仍在。':'本机进度已重置。随时可以开始新的冒险。');};
$('dismiss-break').onclick=()=>{$('break-note').hidden=true;};
$('breaks').onchange=()=>{if(!$('breaks').checked)$('break-note').hidden=true;};
['pointerdown','keydown','touchstart'].forEach(name=>document.addEventListener(name,()=>{lastActivity=Date.now();},{passive:true}));
setInterval(()=>{
 const now=Date.now(),delta=Math.min(2,Math.floor((now-lastTick)/1000));lastTick=now;
 const active=view==='play'&&!document.hidden&&(now-lastActivity<90000||recorder?.state==='recording');
 $('timer-state').textContent=active?'有效练习时间':'练习时间 · 已暂停';
 if(active){progress.activeSeconds+=delta;renderStats();if(progress.activeSeconds>=nextBreak){nextBreak=progress.activeSeconds+600;if($('breaks').checked)$('break-note').hidden=false;}if(progress.activeSeconds%5===0)save();}
},1000);
nextBreak=progress.activeSeconds+600;
document.addEventListener('visibilitychange',()=>{lastTick=Date.now();if(document.hidden){stopRecording();stopAudio();save();}else lastActivity=Date.now();});
window.addEventListener('pagehide',()=>{cleanup();save();});
showMap();
