/* Experimental AR preview: camera and general bearing only, not route guidance. */
(function(root) {
'use strict';
const radians = x => x * Math.PI / 180;
const degrees = x => x * 180 / Math.PI;
const normalize = x => (x % 360 + 360) % 360;
function bearing(a,b) {
 const p1=radians(a[0]),p2=radians(b[0]),dl=radians(b[1]-a[1]);
 return normalize(degrees(Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl))));
}
function relative(target,heading) { return ((target-heading+540)%360)-180; }
const destinations = [
 {name:'Zoo center (approximate test point)',lat:39.9725,lon:-75.1957},
 {name:'North test point (not a verified facility)',lat:39.9740,lon:-75.1957},
 {name:'East test point (not a verified facility)',lat:39.9725,lon:-75.1938}
];
function mount(getFix) {
 const open=document.getElementById('ar-open'), panel=document.getElementById('ar-panel'), close=document.getElementById('ar-close'), video=document.getElementById('ar-video'), arrow=document.getElementById('ar-arrow'), status=document.getElementById('ar-status'), target=document.getElementById('ar-target'), distance=document.getElementById('ar-distance'), headingText=document.getElementById('ar-heading'), select=document.getElementById('ar-destination');
 if (!open || !panel) return;
 destinations.forEach((d,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=d.name;select.append(option);});
 let stream=null,heading=null,orientationEnabled=false,frame=null;
 function update() {
  if(panel.hidden)return;
  const fix=getFix(),d=destinations[Number(select.value)||0];
  target.textContent=d.name;
  if(!fix || Date.now()-fix.timestamp>30000 || fix.accuracy>50) {
   distance.textContent='GPS unavailable or uncertain';arrow.hidden=true;
   status.textContent='Start live GPS and wait for a reliable on-site fix. No route guidance is available.';
  } else {
   const origin=fix.latlng, dest=[d.lat,d.lon], meters=root.ZooLocationPolicy.distance(origin,dest);
   distance.textContent=Math.round(meters)+' m straight-line · GPS ±'+Math.round(fix.accuracy)+' m';
   if(heading===null) {arrow.hidden=true;status.textContent='Compass unavailable. Use Map View; heading cannot be trusted.';}
   else {
    const delta=relative(bearing(origin,dest),heading);
    arrow.hidden=false;arrow.style.transform='rotate('+delta+'deg)';
    status.textContent='Experimental direction only — NOT a walking route. Follow physical signs and paths.';
   }
  }
  headingText.textContent=heading===null?'Heading unavailable':'Approx. heading '+Math.round(heading)+'°';
  frame=setTimeout(update,500);
 }
 function orient(event) {
  if(typeof event.webkitCompassHeading==='number' && Number.isFinite(event.webkitCompassHeading) && event.webkitCompassAccuracy<=45) heading=normalize(event.webkitCompassHeading);
  else if(event.absolute===true && Number.isFinite(event.alpha)) heading=normalize(360-event.alpha);
  else heading=null;
 }
 async function start() {
  if(!panel.hidden)return;
  panel.hidden=false;open.setAttribute('aria-expanded','true');status.textContent='Requesting camera permission…';
  try {
   if(!root.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw Error('Camera requires a supported HTTPS browser.');
   if(typeof DeviceOrientationEvent!=='undefined' && typeof DeviceOrientationEvent.requestPermission==='function') {
    try {orientationEnabled=(await DeviceOrientationEvent.requestPermission())==='granted';} catch {orientationEnabled=false;}
   } else orientationEnabled=true;
   if(orientationEnabled)root.addEventListener('deviceorientationabsolute',orient);
   if(orientationEnabled)root.addEventListener('deviceorientation',orient);
   stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
   video.srcObject=stream;await video.play();
  } catch(err) {status.textContent='Camera unavailable: '+(err?.message||'permission denied')+'. Return to Map View.';}
  update();
 }
 function stop() {
  panel.hidden=true;open.setAttribute('aria-expanded','false');clearTimeout(frame);frame=null;
  root.removeEventListener('deviceorientationabsolute',orient);root.removeEventListener('deviceorientation',orient);
  if(stream){stream.getTracks().forEach(track=>track.stop());stream=null;}video.pause();video.srcObject=null;heading=null;arrow.hidden=true;
 }
 open.addEventListener('click',start);close.addEventListener('click',stop);select.addEventListener('change',()=>{});
 document.addEventListener('visibilitychange',()=>{if(document.hidden && !panel.hidden)stop();});
 root.addEventListener('pagehide',stop);
}
const api={bearing,relative,destinations,mount};
if(typeof module==='object'&&module.exports)module.exports=api;else root.ZooARPreview=api;
})(typeof globalThis!=='undefined'?globalThis:this);
