(function(){
'use strict';
function start(){
  const api=window.BrizKingMasterLists;
  if(!api)return;
  const materialForm=document.getElementById('materialForm');
  if(materialForm){
    const name=materialForm.elements.name,unit=materialForm.elements.unit,rate=materialForm.elements.rate;
    const wrap=document.createElement('div');wrap.innerHTML='<label>Choose from Master List</label><select id="bk-material-master"><option value="">Select a saved material…</option></select>';
    name.parentNode.insertBefore(wrap,name);
    const select=wrap.querySelector('select');
    api.getMaterials().forEach((m,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=m.name;select.appendChild(o);});
    select.addEventListener('change',()=>{const m=api.getMaterials()[Number(select.value)];if(!m)return;name.value=m.name;unit.value=m.unit||'unit';if(Number(m.price)>0)rate.value=m.price;calc();});
    const total=document.createElement('div');total.className='wide';total.innerHTML='<label>Calculated line total</label><div id="bk-material-total" style="font-weight:800;font-size:18px;color:#123b35">₦0.00</div>';
    const submit=materialForm.querySelector('button[type="submit"]')?.parentNode;if(submit)materialForm.insertBefore(total,submit);
    function calc(){const n=(Number(materialForm.elements.qty.value)||0)*(Number(rate.value)||0);document.getElementById('bk-material-total').textContent='₦'+n.toLocaleString('en-NG',{minimumFractionDigits:2,maximumFractionDigits:2});}
    ['qty','rate'].forEach(k=>materialForm.elements[k]?.addEventListener('input',calc));
  }
  const workerForm=document.getElementById('workerForm');
  if(workerForm){
    const trade=workerForm.elements.trade,wage=workerForm.elements.wage;
    const wrap=document.createElement('div');wrap.innerHTML='<label>Choose from Master List</label><select id="bk-trade-master"><option value="">Select a saved trade…</option></select>';
    trade.parentNode.insertBefore(wrap,trade);
    const select=wrap.querySelector('select');
    api.getTrades().forEach((t,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=t.name;select.appendChild(o);});
    select.addEventListener('change',()=>{const t=api.getTrades()[Number(select.value)];if(!t)return;trade.value=t.name;if(Number(t.rate)>0)wage.value=t.rate;});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();