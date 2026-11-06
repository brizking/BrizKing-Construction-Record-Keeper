(function(){
'use strict';
if(window.__bkProjectSheetSharePdfV2)return;window.__bkProjectSheetSharePdfV2=true;
function install(){
 const print=document.getElementById('printProjectBtn');
 if(!print||document.getElementById('bk-project-sheet-share-pdf'))return;
 const button=document.createElement('button');button.type='button';button.id='bk-project-sheet-share-pdf';button.textContent='Share as PDF';
 button.className=print.className||'';button.style.cssText=print.getAttribute('style')||'';
 button.style.marginLeft='8px';button.style.background='#174536';button.style.color='#fff';button.style.border='0';button.style.borderRadius='10px';button.style.padding='12px 18px';button.style.fontWeight='700';
 button.addEventListener('click',function(){
  const content=document.getElementById('projectSheetContent'),heading=document.getElementById('sheetTitle');
  if(!content||!content.innerText.trim()){alert('Open a saved project sheet before sharing it.');return;}
  if(!window.BrizKingPdfTools||typeof window.BrizKingPdfTools.makeProjectPdf!=='function'||!window.BrizKingSharePdf){alert('PDF sharing is not ready. Please reopen the app.');return;}
  try{
   const title=(heading&&heading.innerText||'Project Sheet').trim();
   const lines=content.innerText.split(/\n+/).map(x=>x.trim()).filter(Boolean);
   const blob=window.BrizKingPdfTools.makeProjectPdf({name:title,rows:lines.map(x=>({name:x,qty:1,rate:0})),updatedAt:new Date().toISOString()});
   window.BrizKingSharePdf(blob,title.replace(/[^a-z0-9-_]/gi,'_')+'.pdf',title);
  }catch(e){alert('Could not create project sheet PDF: '+(e&&e.message||e));}
 });
 print.insertAdjacentElement('afterend',button);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();