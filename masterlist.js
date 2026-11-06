/* BrizKing V6 Master Lists */
(function(){
"use strict";
if(window.__brizKingMasterListsLoaded)return;window.__brizKingMasterListsLoaded=true;
function uid(){return "ml_"+Math.random().toString(36).slice(2,10);}
const KEY="brizking_v6_master_lists";
const tradeNames=["Mason / Bricklayer","Labourer","Carpenter","Steel bender / Iron fixer","Electrician","Plumber","Tiler","Plasterer","Painter","POP installer","Roofer","Welder","Aluminium installer","Glazier","Excavation worker","Concrete casting crew","Screeding worker","Waterproofing technician","Ceiling installer","Fascia / Parapet installer","Site supervisor","Surveyor","Architect","Structural engineer"];
const materialNames=["Cement","9-inch block","6-inch block","Sharp sand","Plaster sand","Filling sand","Granite","8mm reinforcement rod","10mm reinforcement rod","12mm reinforcement rod","16mm reinforcement rod","20mm reinforcement rod","Binding wire","Nails","Planks","Bamboo","Roofing timber","Roofing sheets","Floor tiles","Tile adhesive","POP cement","POP materials","Paint","Electrical cable","PVC conduit","Switch / socket","Plumbing pipe","Plumbing fittings","Water closet (WC)","Wash basin","Kitchen sink","Water tank","Waterproofing chemical","Aluminium window","Door","Door lock","Glass","Polystyrene fascia"];
const defaults={trades:tradeNames.map(n=>({id:uid(),name:n,unit:"unit",rate:0})),materials:materialNames.map(n=>({id:uid(),name:n,unit:"unit",price:0}))};
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&Array.isArray(d.trades)&&Array.isArray(d.materials))return d;}catch(e){}return defaults;}
let data=load();
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const css="#bkml-launch{position:fixed;right:14px;bottom:18px;z-index:2147483000;background:#173d32;color:white;border:0;border-radius:28px;padding:13px 17px;font:600 14px Arial;box-shadow:0 3px 14px #0005}"+
"#bkml-shade{position:fixed;inset:0;z-index:2147483001;background:#0008;display:none;align-items:center;justify-content:center;padding:12px;box-sizing:border-box}"+
"#bkml-panel{width:min(760px,100%);max-height:92vh;overflow:auto;background:white;color:#18231f;border-radius:14px;padding:16px;box-sizing:border-box;font:14px Arial,sans-serif}"+
"#bkml-panel *{box-sizing:border-box}#bkml-panel h2{margin:0 0 5px;font-size:21px}#bkml-panel .sub{color:#65716c;font-size:12px;margin-bottom:14px}"+
"#bkml-panel .tabs{display:flex;gap:8px;margin:10px 0 14px}#bkml-panel button{cursor:pointer}#bkml-panel .tab{border:1px solid #cbd5d0;background:#f4f7f5;padding:9px 13px;border-radius:8px}"+
"#bkml-panel .tab.active{background:#173d32;color:white;border-color:#173d32}#bkml-panel .addrow{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:7px;margin-bottom:12px}"+
"#bkml-panel input{min-width:0;width:100%;padding:10px;border:1px solid #cbd5d0;border-radius:7px;font-size:14px}#bkml-panel .add{background:#173d32;color:white;border:0;border-radius:7px;padding:0 14px}"+
"#bkml-panel table{width:100%;border-collapse:collapse}#bkml-panel th,#bkml-panel td{text-align:left;padding:7px 5px;border-bottom:1px solid #e5ebe7;vertical-align:middle}"+
"#bkml-panel th{font-size:12px;color:#5b6862}#bkml-panel td input{padding:8px}#bkml-panel .del{border:0;background:#fff0f0;color:#a22;padding:8px;border-radius:6px}"+
"#bkml-panel .foot{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:14px;flex-wrap:wrap}#bkml-panel .close{background:#e9efeb;border:0;border-radius:8px;padding:10px 15px}"+
"#bkml-panel .note{font-size:11px;color:#68756e;line-height:1.4}@media(max-width:520px){#bkml-panel{padding:12px}#bkml-panel .addrow{grid-template-columns:1fr 1fr}#bkml-panel .addrow input:first-child{grid-column:1/-1}#bkml-panel .add{min-height:38px}}";
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
const launch=document.createElement("button");launch.id="bkml-launch";launch.textContent="Master Lists";document.body.appendChild(launch);
const shade=document.createElement("div");shade.id="bkml-shade";shade.innerHTML='<section id="bkml-panel" role="dialog" aria-modal="true"><h2>BrizKing Master Lists</h2><div class="sub">Maintain standard trade rates and material prices. All values are editable and saved on this device.</div><div class="tabs"><button class="tab active" data-tab="trades">Trade Master List</button><button class="tab" data-tab="materials">Material Master List</button></div><div id="bkml-content"></div><div class="foot"><span class="note">Enter your current local rates. Editing this list does not rewrite previous project records.</span><button class="close" id="bkml-close">Close</button></div></section>';document.body.appendChild(shade);
let current="trades";
function render(){
const isTrade=current==="trades",rows=data[current],priceLabel=isTrade?"Rate (₦)":"Price (₦)";
document.querySelectorAll("#bkml-panel .tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===current));
let html='<div class="addrow"><input id="bkml-name" placeholder="'+(isTrade?"Trade / job name":"Material name")+'"><input id="bkml-unit" placeholder="Unit (e.g. bag, sqm)"><input id="bkml-price" type="number" min="0" step="0.01" placeholder="'+priceLabel+'"><button class="add" id="bkml-add">Add</button></div><table><thead><tr><th>Name</th><th>Unit</th><th>'+priceLabel+'</th><th></th></tr></thead><tbody>';
rows.forEach(r=>{html+='<tr data-id="'+esc(r.id)+'"><td><input data-field="name" value="'+esc(r.name)+'"></td><td><input data-field="unit" value="'+esc(r.unit)+'"></td><td><input data-field="'+(isTrade?"rate":"price")+'" type="number" min="0" step="0.01" value="'+(Number(isTrade?r.rate:r.price)||0)+'"></td><td><button class="del" data-delete="'+esc(r.id)+'">Delete</button></td></tr>';});
document.getElementById("bkml-content").innerHTML=html+"</tbody></table>";
document.getElementById("bkml-add").onclick=function(){const name=document.getElementById("bkml-name").value.trim(),unit=document.getElementById("bkml-unit").value.trim()||"unit",price=Number(document.getElementById("bkml-price").value)||0;if(!name){alert("Enter a name first.");return;}rows.push(isTrade?{id:uid(),name:name,unit:unit,rate:price}:{id:uid(),name:name,unit:unit,price:price});save();render();};
document.querySelectorAll("#bkml-content tbody tr").forEach(tr=>tr.querySelectorAll("input").forEach(inp=>inp.addEventListener("change",function(){const row=rows.find(x=>x.id===tr.dataset.id);if(!row)return;const f=inp.dataset.field;row[f]=(f==="rate"||f==="price")?(Number(inp.value)||0):inp.value.trim();save();})));
document.querySelectorAll("[data-delete]").forEach(btn=>btn.onclick=function(){if(confirm("Delete this master-list item?")){data[current]=data[current].filter(x=>x.id!==btn.dataset.delete);save();render();}});
}
launch.onclick=function(){shade.style.display="flex";render();};
document.getElementById("bkml-close").onclick=function(){shade.style.display="none";};
shade.addEventListener("click",e=>{if(e.target===shade)shade.style.display="none";});
document.querySelectorAll("#bkml-panel .tab").forEach(b=>b.addEventListener("click",function(){current=b.dataset.tab;render();}));
window.BrizKingMasterLists={getTrades:()=>JSON.parse(JSON.stringify(data.trades)),getMaterials:()=>JSON.parse(JSON.stringify(data.materials)),getTrade:name=>data.trades.find(x=>x.name===name)||null,getMaterial:name=>data.materials.find(x=>x.name===name)||null};
})();