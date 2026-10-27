export const progressKey = 'english-quest.progress.v1';
export function normalize(value) {
 return String(value ?? '').normalize('NFKC').toLowerCase().replace(/[‘’]/g,"'").replace(/[^\p{L}\p{N}'\s]/gu,' ').replace(/\s+/g,' ').trim();
}
export function shuffledTokens(sentence, random = Math.random) {
 const items = sentence.trim().split(/\s+/).filter(Boolean).map((word,id)=>({word,id}));
 for (let i=items.length-1;i>0;i--) { const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1)))); [items[i],items[j]]=[items[j],items[i]]; }
 return items;
}
export function freshProgress() { return {version:1,completed:{},cursor:null,activeSeconds:0}; }
export function stepKey(course,step) { return `${course.id}/${step.id}`; }
function validMethod(step,method) { return ['speak','respond'].includes(step.type) ? ['recorded','self-practice'].includes(method) : method==='checked'; }
export function parseProgress(raw,courses) {
 const clean=freshProgress();
 try {
  const value=JSON.parse(raw);
  if(!value || value.version!==1) return clean;
  clean.activeSeconds=Number.isFinite(value.activeSeconds)?Math.min(31536000,Math.max(0,Math.floor(value.activeSeconds))):0;
  const course=courses.find(c=>c.id===value.cursor?.courseId);
  if(course && Number.isInteger(value.cursor.step) && value.cursor.step>=0 && value.cursor.step<course.steps.length) clean.cursor={courseId:course.id,step:value.cursor.step};
  for(const c of courses) for(const s of c.steps) {
   const record=value.completed?.[stepKey(c,s)];
   if(record && validMethod(s,record.method)) clean.completed[stepKey(c,s)]={method:record.method};
  }
 } catch { /* Corrupt local data must never prevent learning. */ }
 return clean;
}
export function completeStep(progress,course,step,method) {
 if(!course.steps.some(s=>s.id===step.id) || !validMethod(step,method)) throw new Error('Invalid completion evidence');
 return {...progress,completed:{...progress.completed,[stepKey(course,step)]:{method}}};
}
export function summarize(progress,courses) {
 const result={total:0,practiced:0,recorded:0,selfPracticed:0,checked:0,completedCourses:0};
 for(const c of courses) {
  let count=0;
  for(const s of c.steps) {
   result.total++; const method=progress.completed[stepKey(c,s)]?.method;
   if(!validMethod(s,method)) continue;
   count++; result.practiced++;
   if(method==='recorded') result.recorded++;
   if(method==='self-practice') result.selfPracticed++;
   if(method==='checked') result.checked++;
  }
  if(count===c.steps.length && count>0) result.completedCourses++;
 }
 return result;
}
export function loadProgress(storage,courses) {
 try { return {progress:parseProgress(storage.getItem(progressKey),courses),error:null}; }
 catch { return {progress:freshProgress(),error:'浏览器不允许保存进度。本次仍可练习，关闭页面后进度可能丢失。'}; }
}
export function saveProgress(storage,progress) {
 try { storage.setItem(progressKey,JSON.stringify(progress)); return {error:null}; }
 catch { return {error:'进度未能保存到浏览器，请导出练习报告留存。'}; }
}
