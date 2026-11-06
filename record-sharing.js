(function(){
'use strict';
if(window.__bkRecordTextShareV2)return;window.__bkRecordTextShareV2=true;
const COMPANY='BRIZ KING CONCEPT\n08033750266\n3 Uwa Street, off Sapele Road\nBriz.king@gmail.com';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function shareText(text,title,email){
 if(email){const to=prompt('Enter the recipient email address:','');if(!to)return;if(window.BrizKingNative&&window.BrizKingNative.emailText){window.BrizKingNative.emailText(to,title,text);return;}location.href='mailto:'+encodeURIComponent(to)+'?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(text);return;}
 if(window.BrizKingNative&&window.BrizKingNative.shareText){window.BrizKingNative.shareText(text,title);return;}
 if(navigator.share){navigator.share({title:title,text:text}).catch(()=>{});return;}
 const a=document.createElement('a'),u=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.href=u;a.download='BrizKing-Record.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),20000);
}
function sharePdf(blob,filename,title){
 if(!blob||blob.type!=='application/pdf'){alert('Could not create the PDF document.');return;}
 if(window.BrizKingNative&&window.BrizKingNative.sharePdfBase64){const r=new FileReader();r.onload=()=>{const d=String(r.result||'').split(',')[1]||'';if(d)window.BrizKingNative.sharePdfBase64(d,filename);else alert('Could not prepare the PDF for sharing.');};r.onerror=()=>alert('Could not read the PDF for sharing.');r.readAsDataURL(blob);return;}
 const f=new File([blob],filename,{type:'application/pdf'});
 if(navigator.share&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:title}).catch(e=>{if(!e||e.name!=='AbortError')alert('PDF sharing was unavailable.');});return;}
 const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);alert('PDF saved to Downloads. You can share it from your Downloads folder.');
}
window.BrizKingSharePdf=sharePdf;
function formLines(form){const out=[];form.querySelectorAll('input,select,textarea').forEach(el=>{if(['hidden','submit','button','file'].includes(el.type)||el.disabled)return;const value=clean(el.value);if(!value)return;let label=el.getAttribute('aria-label')||el.placeholder||el.name||el.id||'Field';const l=el.closest('label');if(l)label=clean(l.textContent.replace(el.value,''))||label;out.push(label+': '+value);});return out;}
function makeAndShare(lines,title,filename){
 if(!window.BrizKingPdfTools||typeof window.BrizKingPdfTools.makeProjectPdf!=='function'){alert('PDF service is not ready. Please close and reopen the app.');return;}
 try{const blob=window.BrizKingPdfTools.makeProjectPdf({name:title,rows:lines.map(x=>({name:String(x),qty:1,rate:0})),updatedAt:new Date().toISOString()});sharePdf(blob,filename,title);}catch(e){alert('Could not create PDF: '+(e&&e.message||e));}
}
function addForm(form){
 if(form.dataset.bkShareAdded||form.closest('#bke-panel')||form.closest('#bkml-panel'))return;
 form.dataset.bkShareAdded='1';const bar=document.createElement('div');bar.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:10px 0';
 const text=document.createElement('button');text.type='button';text.textContent='Share Record Text';text.style.cssText='background:#174536;color:white;border:0;border-radius:7px;padding:9px 12px';
 text.onclick=()=>{const lines=formLines(form);if(!lines.length){alert('Enter the record details first.');return;}shareText(COMPANY+'\n\nRECORD DETAILS\n'+lines.join('\n'),'Briz King Record',false);};
 const email=document.createElement('button');email.type='button';email.textContent='Email Record Text';email.style.cssText='background:#edf1ee;color:#173d32;border:0;border-radius:7px;padding:9px 12px';
 email.onclick=()=>{const lines=formLines(form);if(!lines.length){alert('Enter the record details first.');return;}shareText(COMPANY+'\n\nRECORD DETAILS\n'+lines.join('\n'),'Briz King Record',true);};
 const pdf=document.createElement('button');pdf.type='button';pdf.textContent='Share Record as PDF';pdf.style.cssText=text.style.cssText;
 pdf.onclick=()=>{const lines=formLines(form);if(!lines.length){alert('Enter the record details first.');return;}const title=(form.closest('section')?.querySelector('h2,h3')?.textContent||'Briz King Record').trim();makeAndShare([COMPANY,title].concat(lines),title,title.replace(/[^a-z0-9-_]/gi,'_')+'.pdf');};
 bar.append(text,email,pdf);form.appendChild(bar);
}
function addRow(row){
 if(row.dataset.bkShareAdded||row.closest('#bke-panel')||row.closest('#bkml-panel')||row.closest('#projectCosts')||row.querySelector('th'))return;
 const cells=Array.from(row.cells||[]);if(!cells.length||!clean(row.innerText))return;row.dataset.bkShareAdded='1';
 const parts=cells.map((c,i)=>{const h=row.closest('table')?.querySelectorAll('thead th')[i]?.innerText;return(h?clean(h)+': ':'')+clean(c.innerText);}).filter(Boolean);
 const cell=document.createElement('td');cell.style.whiteSpace='nowrap';
 const text=document.createElement('button');text.type='button';text.textContent='Share';text.style.cssText='background:#174536;color:white;border:0;border-radius:6px;padding:6px 9px;margin:2px';text.onclick=()=>shareText(COMPANY+'\n\nSAVED RECORD\n'+parts.join('\n'),'Briz King Record',false);
 const pdf=document.createElement('button');pdf.type='button';pdf.textContent='PDF';pdf.style.cssText=text.style.cssText;pdf.onclick=()=>makeAndShare([COMPANY,'SAVED RECORD'].concat(parts),'Briz King Saved Record','BrizKing-Saved-Record.pdf');
 cell.append(text,pdf);row.appendChild(cell);
}
function scan(){document.querySelectorAll('form').forEach(addForm);document.querySelectorAll('main table tbody tr, .section table tbody tr').forEach(addRow);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();