import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, shuffledTokens, freshProgress, parseProgress, completeStep, summarize, loadProgress, saveProgress, progressKey } from '../core.js';
const courses = [{id:'a',steps:[{id:'1',type:'listen'},{id:'2',type:'speak'},{id:'3',type:'respond'}]}];
test('normalization ignores case, punctuation and whitespace but preserves words',()=>{
 assert.equal(normalize('  Hello,  WORLD! '),'hello world');
 assert.equal(normalize('I’m ready.'), normalize("I'm ready"));
 assert.notEqual(normalize('I like cats'),normalize('I like dogs'));
 assert.equal(normalize(null),'');
});
test('shuffle preserves repeated tokens and stable unique ids',()=>{
 const tokens=shuffledTokens('I think I can',()=>0);
 assert.deepEqual(tokens.map(x=>x.word).sort(),['I','I','can','think'].sort());
 assert.equal(new Set(tokens.map(x=>x.id)).size,4);
});
test('fresh and malformed progress safely recover',()=>{
 for(const x of ['bad','null','{}','{"version":99}', '{"version":1,"completed":null}']){
  assert.deepEqual(parseProgress(x,courses).completed,{});
 }
 assert.equal(freshProgress().version,1);
});
test('validated progress rejects unknown steps and invalid methods',()=>{
 const p=parseProgress(JSON.stringify({version:1,activeSeconds:-5,cursor:{courseId:'bad',step:999},completed:{'a/1':{method:'checked'},'a/2':{method:'recorded'},'a/3':{method:'mastered'},'bad/x':{method:'checked'}}}),courses);
 assert.equal(p.activeSeconds,0); assert.equal(p.cursor,null);
 assert.deepEqual(Object.keys(p.completed),['a/1','a/2']);
});
test('oral progress requires explicit practice evidence and never mastery',()=>{
 let p=freshProgress();
 assert.throws(()=>completeStep(p,courses[0],courses[0].steps[1],'checked'));
 p=completeStep(p,courses[0],courses[0].steps[0],'checked');
 p=completeStep(p,courses[0],courses[0].steps[1],'recorded');
 p=completeStep(p,courses[0],courses[0].steps[2],'self-practice');
 assert.deepEqual(summarize(p,courses),{total:3,practiced:3,recorded:1,selfPracticed:1,checked:1,completedCourses:1});
 assert.equal(Object.keys(completeStep(p,courses[0],courses[0].steps[2],'self-practice').completed).length,3);
});
test('storage failures are reported, not thrown',()=>{
 const storage={getItem(){throw Error('denied')},setItem(){throw Error('quota')}};
 assert.ok(loadProgress(storage,courses).error);
 assert.ok(saveProgress(storage,freshProgress()).error);
});
test('storage round trip keeps cursor and local study time',()=>{
 const map=new Map(); const storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 const p=freshProgress(); p.cursor={courseId:'a',step:1}; p.activeSeconds=45;
 assert.equal(saveProgress(storage,p).error,null);
 assert.ok(map.has(progressKey));
 assert.deepEqual(loadProgress(storage,courses).progress,p);
});
test('untrusted counters and cursor are bounded',()=>{
 const p=parseProgress(JSON.stringify({version:1,activeSeconds:1e99,cursor:{courseId:'a',step:500},completed:{}}),courses);
 assert.equal(p.cursor,null); assert.ok(p.activeSeconds<=31536000);
});
