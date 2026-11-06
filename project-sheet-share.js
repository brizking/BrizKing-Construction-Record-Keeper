(function(){'use strict';if(window.__bkProjectSheetShareAdjacent)return;window.__bkProjectSheetShareAdjacent=true;
function install(){
 const buttons=Array.from(document.querySelectorAll('button'));
 const print=buttons.find(b=>/print\s*\/\s*save\s*project\s*sheet\s*as\s*pdf/i.test((b.innerText||b.textContent||'').trim()));
 if(!print||document.getElementById('bk-project-sheet-share-pdf'))return;
 const share=document.createElement('button');share.type='button';share.id='bk-project-sheet-share-pdf';share.textContent='Share as PDF';
 share.className=print.className||'';share.style.cssText=print.getAttribute('style')||'';
 share.style.marginLeft='8px';share.style.background='#174536';share.style.color='#fff';share.style.border='0';share.style.borderRadius='10px';share.style.padding='12px 18px';share.style.fontWeight='700';
 share.addEventListener('click',function(){
   const form=document.getElementById('projectForm');
   const existing=form&&Array.from(form.querySelectorAll('button')).find(b=>/share\s*record\s*pdf/i.test((b.innerText||b.textContent||'').trim()));
   if(existing){existing.click();return;}
   alert('Project PDF sharing is not available on this screen yet. Please reopen the app and try again.');
 });
 print.insertAdjacentElement('afterend',share);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();