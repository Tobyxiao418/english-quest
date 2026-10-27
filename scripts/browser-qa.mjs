import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { courses } from '../courses.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base=process.env.SITE_URL||'http://127.0.0.1:8765/';
const args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'];
if(process.env.AUDIO_FIXTURE)args.push(`--use-file-for-fake-audio-capture=${process.env.AUDIO_FIXTURE}`);
const browser=await chromium.launch({channel:'chrome',headless:true,args});
const context=await browser.newContext({permissions:['microphone'],acceptDownloads:true});
const page=await context.newPage();
// Synthetic audio source; exercise the real browser MediaRecorder, not host microphone permission.
await page.addInitScript(()=>{
 navigator.mediaDevices.getUserMedia=async()=>{
  const ac=new AudioContext();await ac.resume();const oscillator=ac.createOscillator();
  const gain=ac.createGain();gain.gain.value=0.08;const dest=ac.createMediaStreamDestination();
  oscillator.connect(gain);gain.connect(dest);oscillator.start();
  for(const track of dest.stream.getTracks()){const stop=track.stop.bind(track);let stopped=false;track.stop=()=>{if(stopped)return;stopped=true;stop();oscillator.stop();ac.close();};}
  return dest.stream;
 };
});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const network=[];page.on('request',r=>network.push(r.url()));
let exercised=0;
try {
 await page.goto(base); await page.locator('.quest-card').first().waitFor();
 assert.equal(await page.locator('.quest-card').count(),3);
 for(let ci=0;ci<courses.length;ci++) {
  const c=courses[ci];await page.locator('.quest-card').nth(ci).click();
  for(let si=0;si<c.steps.length;si++){
   const s=c.steps[si];await page.locator('#activity h2').waitFor();
   assert.ok((await page.locator('#mission-label').innerText()).includes(`${si+1} / ${c.steps.length}`));
   if(s.type==='listen'){
    if(si===0){const wrong=s.options.find(x=>x!==s.answer);await page.locator('.options').getByRole('button',{name:wrong,exact:true}).click();assert.equal(await page.locator('#next').isDisabled(),true);}
    await page.locator('.options').getByRole('button',{name:s.answer,exact:true}).click();
   } else if(s.type==='type'){
    await page.locator('#dictation').fill('incorrect');await page.getByRole('button',{name:'检查听写',exact:true}).click();assert.equal(await page.locator('#next').isDisabled(),true);
    await page.locator('#dictation').fill(s.en);await page.getByRole('button',{name:'检查听写',exact:true}).click();
   } else if(s.type==='build'){
    for(const word of s.en.split(/\s+/))await page.locator('.word-bank').getByRole('button',{name:word,exact:true}).first().click();
    await page.getByRole('button',{name:'检查句子',exact:true}).click();
   } else {
    assert.equal(await page.locator('#oral-complete').isDisabled(),true);
    if(ci===0&&si===1){
     await page.getByRole('button',{name:'● 开始录音',exact:true}).click();
     await page.waitForFunction(()=>document.querySelector('.record-status')?.textContent.includes('录音中'));
     await page.waitForTimeout(1600);
     await page.getByRole('button',{name:'■ 停止录音',exact:true}).click();
     await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(x=>x.textContent==='↻ 回听我的声音')?.disabled);
     await page.getByRole('button',{name:'↻ 回听我的声音',exact:true}).click();
    } else await page.locator('#self-practice').check();
    await page.locator('#oral-complete').click();
   }
   assert.equal(await page.locator('#next').isDisabled(),false);
   exercised++;
   if(ci===0&&si===3){await page.reload();await page.locator('#continue').click();assert.ok((await page.locator('#mission-label').innerText()).includes('4 / 18'));assert.equal(await page.locator('#next').isDisabled(),false);}
   await page.locator('#next').click();
  }
  await page.locator('#finish-map').click();
 }
 assert.equal(await page.locator('#stars').innerText(),'3');
 assert.equal(await page.locator('#practiced').innerText(),'54 / 54');
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;
 const {readFile}=await import('node:fs/promises');const report=JSON.parse(await readFile(await download.path(),'utf8'));
 assert.equal(report.summary.practiced,54);assert.equal(report.summary.recorded,1);assert.equal(report.summary.selfPracticed,29);assert.equal(JSON.stringify(report).includes('blob:'),false);
 page.once('dialog',d=>d.dismiss());await page.locator('#reset').click();assert.equal(await page.locator('#stars').innerText(),'3');
 const bad=await browser.newContext();const denied=await bad.newPage();await denied.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError')};});
 await denied.goto(base);await denied.locator('.quest-card').first().click();await denied.locator('.options').getByRole('button',{name:courses[0].steps[0].answer,exact:true}).click();await denied.locator('#next').click();await denied.getByRole('button',{name:'● 开始录音',exact:true}).click();await denied.waitForFunction(()=>document.querySelector('.record-status').textContent.includes('未能打开'));await denied.locator('#self-practice').check();await denied.locator('#oral-complete').click();assert.equal(await denied.locator('#next').isDisabled(),false);await bad.close();
 assert.deepEqual(errors,[]);
 const foreign=network.filter(url=>url.startsWith('http')&&new URL(url).origin!==new URL(base).origin);assert.deepEqual(foreign,[]);
 console.log(JSON.stringify({base,exercised,completed:report.summary,checks:['all visible steps','wrong-answer rejection','reload resume','synthetic microphone record/replay','mic denial fallback','no audio export','reset cancel','no app cross-origin requests'],errors},null,2));
} finally {await browser.close();}
