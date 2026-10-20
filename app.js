const $=id=>document.getElementById(id);
const video=$('video'), canvas=$('photoCanvas'), ctx=canvas.getContext('2d');
let stream=null, sourceImage=null, currentFrame='frame-none', saved=[], filterMode='none', shotData=null;
const filterValues={brightness:100,contrast:100,saturation:100};
function setStatus(t){$('cameraStatus').textContent=t}
function activeFilter(){let extra='';if(filterMode==='warm')extra=' sepia(.18) saturate(1.15)';if(filterMode==='soft')extra=' sepia(.08) brightness(1.04)';if(filterMode==='bw')extra=' grayscale(1)';return `brightness(${filterValues.brightness}%) contrast(${filterValues.contrast}%) saturate(${filterValues.saturation}%)${extra}`}
function applyPreviewFilter(){video.style.filter=activeFilter();if(sourceImage){renderResult()} }
async function startCamera(){
 try{
  if(!navigator.mediaDevices?.getUserMedia){setStatus('Browser tidak mendukung akses kamera. Coba Chrome terbaru dan buka lewat HTTPS atau localhost.');return}
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1920},height:{ideal:1080}},audio:false});
  video.srcObject=stream;await video.play();video.hidden=false;$('placeholder').hidden=true;$('capture').disabled=false;
  $('startCamera').textContent='↻ Kamera aktif';setStatus('Kamera aktif! Senyum dulu, lalu tekan Foto! ♡');
 }catch(e){setStatus(e.name==='NotAllowedError'?'Akses kamera ditolak. Izinkan Camera dari ikon gembok/pengaturan situs, lalu coba lagi.':'Kamera tidak bisa dibuka. Tutup aplikasi lain yang memakai kamera, lalu coba lagi.')}
}
function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}video.srcObject=null}
function setFrame(frame){currentFrame=frame;$('frameOverlay').className='frame-overlay '+frame;document.querySelectorAll('.frame-option').forEach(b=>b.classList.toggle('selected',b.dataset.frame===frame));if(sourceImage)renderResult()}
function drawCover(image,w,h,mirror=false){
 const iw=image.videoWidth||image.naturalWidth||image.width, ih=image.videoHeight||image.naturalHeight||image.height;
 const scale=Math.max(w/iw,h/ih), sw=w/scale, sh=h/scale, sx=(iw-sw)/2, sy=(ih-sh)/2;
 ctx.save();if(mirror){ctx.translate(w,0);ctx.scale(-1,1)}ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h);ctx.restore()
}
function drawFrame(w,h){
 const s=Math.min(w,h), line=Math.max(12,Math.round(s*.035));
 ctx.save();
 switch(currentFrame){
 case'frame-pink':ctx.strokeStyle='#ff9fc9';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.fillStyle='#ff9fc9';ctx.fillRect(0,h-line*1.8,w,line*1.8);ctx.fillStyle='white';ctx.font=`900 ${Math.round(line*.75)}px Nunito, sans-serif`;ctx.textAlign='center';ctx.fillText('♡  XOXO  ♡',w/2,h-line*.55);break;
 case'frame-daisy':ctx.strokeStyle='#fff4a8';ctx.lineWidth=line;ctx.setLineDash([line*.45,line*.65]);ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.setLineDash([]);ctx.fillStyle='#fff';ctx.font=`900 ${Math.round(line*1.05)}px sans-serif`;ctx.textAlign='center';ctx.fillText('✿  daisy days  ✿',w/2,h-line*.65);break;
 case'frame-y2k':ctx.strokeStyle='#d9c7ff';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.strokeStyle='#fff';ctx.lineWidth=line*.35;ctx.strokeRect(line*1.3,line*1.3,w-line*2.6,h-line*2.6);ctx.fillStyle='#fff';ctx.font=`900 ${line*1.8}px sans-serif`;ctx.textAlign='center';ctx.fillText('✦ ★ ☆ ✦',w/2,line*2.5);break;
 case'frame-film':ctx.fillStyle='#26232c';ctx.fillRect(0,0,w,line*2);ctx.fillRect(0,h-line*2,w,line*2);ctx.fillStyle='#fff';for(let x=line*.6;x<w;x+=line*1.6){ctx.fillRect(x,line*.4,line*.7,line*.65);ctx.fillRect(x,h-line*1.3,line*.7,line*.65)}ctx.font=`900 ${line*.65}px sans-serif`;ctx.textAlign='center';ctx.fillText('SNAPPOP • 01',w/2,h-line*.45);break;
 case'frame-lavender':ctx.strokeStyle='#c9b9ff';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.fillStyle='#c9b9ff';ctx.fillRect(0,h-line*1.6,w,line*1.6);ctx.fillStyle='#fff';ctx.font=`900 ${line*.8}px sans-serif`;ctx.textAlign='center';ctx.fillText('☾ dreamy mood ☾',w/2,h-line*.5);break;
 case'frame-hearts':ctx.strokeStyle='#ffb4c9';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.fillStyle='#fff0f5';ctx.fillRect(0,h-line*1.7,w,line*1.7);ctx.fillStyle='#e34f83';ctx.font=`900 ${line*.75}px sans-serif`;ctx.textAlign='center';ctx.fillText('♥  made with love  ♥',w/2,h-line*.5);break;
 case'frame-check':ctx.strokeStyle='#f4d9a0';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.strokeStyle='#8eaf7d';ctx.lineWidth=line*.25;ctx.setLineDash([line*.4,line*.35]);ctx.strokeRect(line*1.1,line*1.1,w-line*2.2,h-line*2.2);ctx.setLineDash([]);ctx.fillStyle='#f4d9a0';ctx.fillRect(0,h-line*1.5,w,line*1.5);ctx.fillStyle='#77583c';ctx.font=`900 ${line*.8}px sans-serif`;ctx.textAlign='center';ctx.fillText('picnic club ☼',w/2,h-line*.45);break;
 case'frame-blue':ctx.strokeStyle='#a9dfff';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.fillStyle='#a9dfff';ctx.fillRect(0,h-line*1.5,w,line*1.5);ctx.fillStyle='#fff';ctx.font=`900 ${line*.8}px sans-serif`;ctx.textAlign='center';ctx.fillText('✧ little sky ✧',w/2,h-line*.45);break;
 case'frame-retro':ctx.strokeStyle='#e9a96b';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.fillStyle='#e9a96b';ctx.fillRect(0,h-line*1.6,w,line*1.6);ctx.fillStyle='#fff9e8';ctx.font=`900 ${line*.7}px sans-serif`;ctx.textAlign='center';ctx.fillText('1999 • GOOD TIMES',w/2,h-line*.5);break;
 case'frame-mint':ctx.strokeStyle='#a8e6cf';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.fillStyle='#a8e6cf';ctx.fillRect(0,h-line*1.6,w,line*1.6);ctx.fillStyle='#fff';ctx.font=`900 ${line*.75}px sans-serif`;ctx.textAlign='center';ctx.fillText('❀ fresh & happy ❀',w/2,h-line*.5);break;
 case'frame-cloud':ctx.strokeStyle='#d7e7ff';ctx.lineWidth=line;ctx.strokeRect(line/2,line/2,w-line,h-line);ctx.fillStyle='#d7e7ff';ctx.fillRect(0,h-line*1.6,w,line*1.6);ctx.fillStyle='#7195c8';ctx.font=`900 ${line*.8}px sans-serif`;ctx.textAlign='center';ctx.fillText('☁ cloud nine ☁',w/2,h-line*.5);break;
 }
 ctx.restore()
}
function renderResult(){
 if(!sourceImage)return;
 const iw=sourceImage.videoWidth||sourceImage.naturalWidth||sourceImage.width, ih=sourceImage.videoHeight||sourceImage.naturalHeight||sourceImage.height;
 // Keep the original image dimensions to avoid unnecessary upscaling and preserve clarity.
 canvas.width=iw;canvas.height=ih;
 ctx.save();ctx.filter=activeFilter();
 if(sourceImage===video)drawCover(sourceImage,iw,ih,true);else ctx.drawImage(sourceImage,0,0,iw,ih);
 ctx.restore();drawFrame(iw,ih);
 const url=canvas.toDataURL('image/png');
 $('resultImage').innerHTML='';const img=new Image();img.alt='Hasil photobooth';img.src=url;$('resultImage').appendChild(img);
 $('save').disabled=false;$('retake').disabled=false;shotData=url;
}
async function capturePhoto(){
 if(!stream){setStatus('Buka kamera dulu atau upload foto dari galeri.');return}
 const cd=$('countdown');cd.hidden=false;
 for(let i=3;i>0;i--){cd.textContent=i;await new Promise(r=>setTimeout(r,650))}
 cd.textContent='✦';await new Promise(r=>setTimeout(r,250));cd.hidden=true;
 sourceImage=video;renderResult();setStatus('Jepretan berhasil! Pilih frame/filter, lalu simpan HD. ♡');
}
function loadUpload(file){
 if(!file||!file.type.startsWith('image/'))return;
 const img=new Image();img.onload=()=>{sourceImage=img;video.hidden=true;$('placeholder').hidden=true;$('capture').disabled=true;renderResult();setStatus('Foto berhasil dimuat. Sekarang pilih frame dan edit look kamu! ♡');URL.revokeObjectURL(img.src)};img.onerror=()=>setStatus('Foto tidak bisa dibuka. Coba file gambar lain.');
 img.src=URL.createObjectURL(file)
}
function savePhoto(){if(!sourceImage)return;renderResult();const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=`snappop-${new Date().toISOString().slice(0,10)}.png`;document.body.appendChild(a);a.click();a.remove();saved.unshift(a.href);$('savedCount').textContent=saved.length;renderGallery();setStatus('Foto disimpan! Cek folder Downloads/Galeri perangkatmu ✨')}
function renderGallery(){const grid=$('galleryGrid');grid.innerHTML='';if(!saved.length){grid.innerHTML='<p class="gallery-empty">Belum ada foto tersimpan. Yuk, bikin kenangan! 📷</p>';return}saved.forEach((src,i)=>{const card=document.createElement('div');card.className='gallery-item';const img=new Image();img.src=src;const b=document.createElement('button');b.textContent='↓ Unduh lagi';b.onclick=()=>{const a=document.createElement('a');a.href=src;a.download=`snappop-${i+1}.png`;a.click()};card.append(img,b);grid.appendChild(card)})}
$('startCamera').onclick=startCamera;$('capture').onclick=capturePhoto;$('upload').onchange=e=>loadUpload(e.target.files[0]);
document.querySelectorAll('.frame-option').forEach(b=>b.onclick=()=>setFrame(b.dataset.frame));
[['brightness','brightOut'],['contrast','contrastOut'],['saturation','satOut']].forEach(([id,out])=>$(id).oninput=e=>{filterValues[id]=+e.target.value;$(out).textContent=e.target.value+'%';applyPreviewFilter()});
function chooseFilter(mode,button){filterMode=mode;document.querySelectorAll('.chip').forEach(b=>b.classList.remove('active'));if(button)button.classList.add('active');applyPreviewFilter()}
$('filterWarm').onclick=()=>chooseFilter('warm',$('filterWarm'));$('filterSoft').onclick=()=>chooseFilter('soft',$('filterSoft'));$('filterBw').onclick=()=>chooseFilter('bw',$('filterBw'));
$('resetEdit').onclick=()=>{filterValues.brightness=filterValues.contrast=filterValues.saturation=100;['brightness','contrast','saturation'].forEach(id=>$(id).value=100);$('brightOut').textContent=$('contrastOut').textContent=$('satOut').textContent='100%';chooseFilter('none',null);setFrame(currentFrame)};
$('save').onclick=savePhoto;$('retake').onclick=()=>{sourceImage=null;shotData=null;$('resultImage').innerHTML='<div class="empty-result"><span>🪄</span><b>Foto kamu bakal muncul di sini</b><small>Ambil foto atau upload dulu, ya!</small></div>';$('save').disabled=true;$('retake').disabled=true;if(stream){video.hidden=false;$('placeholder').hidden=true;$('capture').disabled=false}else{$('video').hidden=true;$('placeholder').hidden=false;$('capture').disabled=true}};
$('galleryOpen').onclick=()=>{$('galleryModal').hidden=false;renderGallery()};$('galleryClose').onclick=()=> $('galleryModal').hidden=true;$('galleryModal').onclick=e=>{if(e.target===$('galleryModal'))$('galleryModal').hidden=true};
window.addEventListener('beforeunload',stopCamera);
