/* Original PLOTR implementations: Gielis radial formula and isometric height fields.
   Creative references: jasonwebb/SuperformulaSVG and wblut/isogrid (see README).
   No third-party source code is embedded. Geometry is in paper millimeters. */
const geometryDefaults={
 super:{m:6,n1:.7,n2:1.7,n3:1.7,a:1,b:1,iterations:36,decay:1.35,twist:24,morph:0,rotation:0,columns:1,rows:1},
 iso:{cells:12,height:6,frequency:2.3,occupancy:88,hatch:3,rotation:0,mode:'terrain'}
};
const geometrySpecs={
 super:[['m','Symétrie · nombre de pointes',2,16,2],['n1','n₁ · tension',.15,10,.05],['n2','n₂ · courbure cosinus',.15,10,.05],['n3','n₃ · courbure sinus',.15,10,.05],['a','a · axe cosinus',.3,2,.05],['b','b · axe sinus',.3,2,.05],['iterations','Contours imbriqués',1,90,1],['decay','Décroissance des contours',.4,3,.05],['twist','Torsion entre contours (°)',-120,120,1],['morph','Variation de forme',0,1,.05],['rotation','Rotation (°)',-180,180,1],['columns','Colonnes',1,4,1],['rows','Rangées',1,5,1]],
 iso:[['cells','Grille · cellules par côté',4,22,1],['height','Hauteur maximale',1,12,1],['frequency','Fréquence du relief',.5,5,.1],['occupancy','Occupation (%)',25,100,1],['hatch','Hachures par face',0,8,1],['rotation','Point de vue · quarts de tour',0,3,1]]
};
const superPresets={petal:{m:6,n1:.7,n2:1.7,n3:1.7,a:1,b:1,twist:24,morph:0},star:{m:8,n1:.3,n2:1,n3:1,a:1,b:1,twist:0,morph:.1},square:{m:4,n1:4,n2:4,n3:4,a:1,b:1,twist:35,morph:.3},shell:{m:10,n1:1.7,n2:3,n3:3,a:1,b:1,twist:90,morph:.8}};
function geometryControlsHTML(){if(s.engine==='super')return '<label>Point de départ<select id="shapePreset"><option value="">Réglages libres</option><option value="petal">Corolle</option><option value="star">Étoile</option><option value="square">Carré souple</option><option value="shell">Coquille</option></select></label>';if(s.engine==='iso')return '<label>Construction<select id="mode"><option value="terrain">Relief · strates organiques</option><option value="city">Architecture · tours</option><option value="steps">Gradins · pyramide</option></select></label>';return ''}
function bindGeometryControls(){if(s.engine==='iso'){const mode=$('mode'),original=mode.onchange,show=()=>document.querySelector('[data-param="frequency"]').closest('label').hidden=s.params.mode!=='terrain';show();mode.onchange=e=>{original(e);show()}}if($('shapePreset'))$('shapePreset').onchange=e=>{const preset=superPresets[e.target.value];if(!preset)return;Object.assign(s.params,preset);phase=0;controls();schedule()}}
function randomizeGeometry(r){if(s.engine==='super'){const preset=Object.values(superPresets)[Math.floor(r()*4)];Object.assign(s.params,preset,{m:2*(2+Math.floor(r()*5)),iterations:20+Math.floor(r()*45),decay:+(.7+r()*1.3).toFixed(2),rotation:Math.floor(r()*180),twist:Math.floor((r()-.5)*120)});}if(s.engine==='iso')Object.assign(s.params,{cells:8+Math.floor(r()*9),height:3+Math.floor(r()*7),frequency:+(1+r()*3).toFixed(1),occupancy:65+Math.floor(r()*35),rotation:Math.floor(r()*4)});}
function generateSuper(p,colors){
 const [w,h]=dims,m=s.margin,cw=(w-2*m)/p.columns,ch=(h-2*m)/p.rows;
 for(let row=0;row<p.rows;row++)for(let col=0;col<p.columns;col++){
  const cx=m+(col+.5)*cw,cy=m+(row+.5)*ch,curves=[];let maxRadius=0;
  for(let k=0;k<p.iterations;k++){
   const t=p.iterations===1?0:k/(p.iterations-1),size=p.iterations===1?1:Math.pow(1-.93*t,p.decay),n1=p.n1*(1+p.morph*t*3),pts=[];
   const rotation=(p.rotation+p.twist*t)*Math.PI/180+phase*.18,steps=Math.max(96,Math.min(640,Math.floor(240000/(p.columns*p.rows*p.iterations))));
   for(let j=0;j<steps;j++){
    const angle=j/steps*Math.PI*2;
    const sum=Math.pow(Math.abs(Math.cos(p.m*angle/4)/p.a),p.n2)+Math.pow(Math.abs(Math.sin(p.m*angle/4)/p.b),p.n3);
    const radius=Math.exp(Math.max(-20,Math.min(20,-Math.log(Math.max(1e-20,sum))/n1)))*size;
    maxRadius=Math.max(maxRadius,radius);pts.push([Math.cos(angle+rotation)*radius,Math.sin(angle+rotation)*radius]);
   }curves.push(pts);
  }
  const scale=Math.min(cw,ch)*.46/Math.max(maxRadius,1e-12);
  curves.forEach((pts,i)=>{const curve=pts.map(([x,y])=>[cx+x*scale,cy+y*scale]);curve.push(curve[0]);add(curve,(i+row+col)%colors)});
 }
}
// Convex polygon clipping returns the interval of a line inside the face.
function isoInsideInterval(a,b,poly){let lo=0,hi=1;const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];let area=0;for(let i=0;i<poly.length;i++)area+=cross(poly[i],poly[(i+1)%poly.length]);const sign=area>=0?1:-1;
 for(let i=0;i<poly.length;i++){const u=poly[i],v=poly[(i+1)%poly.length],edge=[v[0]-u[0],v[1]-u[1]],f0=sign*cross(edge,[a[0]-u[0],a[1]-u[1]]),f1=sign*cross(edge,[b[0]-u[0],b[1]-u[1]]),df=f1-f0;if(Math.abs(df)<1e-10){if(f0< -1e-8)return null;continue}const t=-f0/df;if(df>0)lo=Math.max(lo,t);else hi=Math.min(hi,t);if(lo>=hi-1e-9)return null;}return[lo,hi]}
function generateIso(p,colors){
 const N=p.cells,r=random(s.seed),noise=noiseFactory(s.seed),grid=Array.from({length:N},()=>Array(N).fill(0));
 for(let x=0;x<N;x++)for(let y=0;y<N;y++){
  const u=(x+.5)/N,v=(y+.5)/N;let f;
  if(p.mode==='city')f=.12+.88*r();else if(p.mode==='steps')f=1-Math.max(Math.abs(u-.5),Math.abs(v-.5))*2;else f=.5+.35*noise(u*p.frequency+4,v*p.frequency+7)+.15*noise(u*p.frequency*2+9,v*p.frequency*2);
  grid[x][y]=r()*100<p.occupancy?Math.max(1,Math.min(p.height,Math.ceil(f*p.height))):0;
 }
 let heights=grid;for(let q=0;q<p.rotation;q++){const old=heights;heights=Array.from({length:N},(_,x)=>Array.from({length:N},(_,y)=>old[N-1-y][x]));}
 const faces=[],c=Math.sqrt(3)/2,project=([x,y,z])=>[(x-y)*c,(x+y)*.5-z,x+y+z];
 const face=(verts,side)=>{
  const poly=verts.map(project),[a,b,d]=poly,dx=b[0]-a[0],dy=b[1]-a[1],ex=d[0]-a[0],ey=d[1]-a[1],det=dx*ey-dy*ex;
  const A=((b[2]-a[2])*ey-(d[2]-a[2])*dy)/det,B=(dx*(d[2]-a[2])-ex*(b[2]-a[2]))/det;
  faces.push({poly,side,A,B,C:a[2]-A*a[0]-B*a[1],box:[Math.min(...poly.map(v=>v[0])),Math.min(...poly.map(v=>v[1])),Math.max(...poly.map(v=>v[0])),Math.max(...poly.map(v=>v[1]))]});
 };
 for(let x=0;x<N;x++)for(let y=0;y<N;y++){const H=heights[x][y];if(!H)continue;
  face([[x,y,H],[x+1,y,H],[x+1,y+1,H],[x,y+1,H]],0);
  for(let z=(x+1<N?heights[x+1][y]:0);z<H;z++)face([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],1);
  for(let z=(y+1<N?heights[x][y+1]:0);z<H;z++)face([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],2);
 }
 if(!faces.length)return;
 // Projected spatial buckets keep visibility queries local, even for tall cities.
 const buckets=new Map,unit=2;
 const bins=box=>{const keys=[];for(let x=Math.floor(box[0]/unit);x<=Math.floor(box[2]/unit);x++)for(let y=Math.floor(box[1]/unit);y<=Math.floor(box[3]/unit);y++)keys.push(x+','+y);return keys};
 faces.forEach((f,i)=>bins(f.box).forEach(key=>{if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i)}));
 const allBox=[Math.min(...faces.map(f=>f.box[0])),Math.min(...faces.map(f=>f.box[1])),Math.max(...faces.map(f=>f.box[2])),Math.max(...faces.map(f=>f.box[3]))],scale=.94*Math.min((dims[0]-2*s.margin)/(allBox[2]-allBox[0]),(dims[1]-2*s.margin)/(allBox[3]-allBox[1]));
 const paper=v=>[dims[0]/2+(v[0]-(allBox[0]+allBox[2])/2)*scale,dims[1]/2+(v[1]-(allBox[1]+allBox[3])/2)*scale],seen=new Set;
 const visible=(a,b,owner)=>{
  let intervals=[[0,1]];const candidates=new Set(bins([Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[0],b[0]),Math.max(a[1],b[1])]).flatMap(k=>buckets.get(k)||[]));
  for(const id of candidates){const f=faces[id];if(f===owner)continue;let range=isoInsideInterval(a,b,f.poly);if(!range)continue;
   // Occlude only where the other face is nearer along the viewing ray.
   const da=f.A*a[0]+f.B*a[1]+f.C-a[2]-1e-7,db=f.A*b[0]+f.B*b[1]+f.C-b[2]-1e-7,diff=db-da;
   if(Math.abs(diff)<1e-10){if(da<=0)continue}else if(diff>0)range[0]=Math.max(range[0],-da/diff);else range[1]=Math.min(range[1],-da/diff);
   const [lo,hi]=range;if(hi<=lo)continue;const out=[];for(const [u,v]of intervals){if(hi<=u||lo>=v)out.push([u,v]);else{if(lo>u)out.push([u,lo]);if(hi<v)out.push([hi,v])}}intervals=out;if(!intervals.length)break;
  }
  for(const [u,v]of intervals){if(v-u<1e-7)continue;const lerp=t=>a.map((x,k)=>x+(b[k]-x)*t),aa=paper(lerp(u)),bb=paper(lerp(v)),key=[aa.map(x=>x.toFixed(5)).join(','),bb.map(x=>x.toFixed(5)).join(',')].sort().join('|');if(seen.has(key))continue;seen.add(key);add([aa,bb],owner.side%colors)}
 };
 for(const f of faces){for(let i=0;i<4;i++)visible(f.poly[i],f.poly[(i+1)%4],f);const count=f.side===0?0:f.side===1?p.hatch:Math.floor(p.hatch/2);for(let k=1;k<=count;k++){const t=k/(count+1),mix=(a,b)=>a.map((v,j)=>v+(b[j]-v)*t);visible(mix(f.poly[0],f.poly[1]),mix(f.poly[3],f.poly[2]),f)}}
}
