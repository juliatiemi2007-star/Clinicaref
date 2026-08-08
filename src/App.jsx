import { createClient } from "@supabase/supabase-js";
const SUPA_URL = "https://jfdhqbkvfacbovazshyf.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZGhxYmt2ZmFjYm92YXpzaHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMjMzMTEsImV4cCI6MjEwMTY5OTMxMX0.3TPhlTMpwH5H9dQ26ClskoVESC3J5ovdWxGGmxAWyE0";
const supa = createClient(SUPA_URL, SUPA_KEY);
import { useState, useRef, useEffect, useCallback } from "react";

// ── Dados exemplo ─────────────────────────────────────────────────────────────
const EXEMPLO = [
  {
    id: "ex1", nome: "Apendicite Aguda", categoria: "Cirúrgica",
    sintomas: ["dor abdominal", "dor em fossa ilíaca direita", "náusea", "vômito", "febre", "anorexia", "dor difusa à palpação", "defesa muscular"],
    sinais: ["Blumberg positivo", "Rovsing positivo", "sinal do psoas positivo", "leucocitose", "neutrofilia", "PCR elevado"],
    resumo: "Inflamação do apêndice vermiforme. Início com dor periumbilical migrando para FID. Piora com movimento. Score de Alvarado ≥7 sugere cirurgia. USG ou TC para confirmação.",
    tratamento: "1ª linha: apendicectomia laparoscópica. ATB pré-op: cefazolina ou ceftriaxona + metronidazol. Complicada (perfuração): ATB por 4–7 dias pós-op (pip-tazo ou imipenem).",
    notas: "",
    fotos: [],
    tags: ["abdome agudo", "FID", "cirurgia", "leucocitose"],
  },
  {
    id: "ex2", nome: "Colecistite Aguda", categoria: "Cirúrgica",
    sintomas: ["dor em hipocôndrio direito", "náusea", "vômito", "febre", "intolerância a gordura", "dor após refeição", "dor irradiando para escápula"],
    sinais: ["Murphy positivo", "leucocitose", "PCR elevado", "bilirrubina elevada", "fosfatase alcalina elevada"],
    resumo: "Inflamação da vesícula biliar por cálculo impactado. Murphy positivo é patognomônico. Dor em cólica no HCD irradiando para ombro/escápula direita.",
    tratamento: "ATB: ceftriaxona + metronidazol (ou pip-tazo se grave). Colecistectomia laparoscópica preferencialmente nas primeiras 72h. Analgesia: dipirona + buscopan.",
    notas: "",
    fotos: [],
    tags: ["hepatobiliar", "Murphy", "cálculo", "HCD"],
  },
  {
    id: "ex3", nome: "Pancreatite Aguda", categoria: "Gastrointestinal",
    sintomas: ["dor epigástrica intensa", "dor em faixa", "dor irradiando para dorso", "náusea", "vômito intenso", "distensão abdominal", "febre"],
    sinais: ["Cullen positivo", "Grey Turner positivo", "amilase elevada", "lipase elevada", "leucocitose", "hipocalcemia", "PCR elevado"],
    resumo: "Inflamação pancreática por álcool ou litíase biliar. Lipase >3x o normal é diagnóstico. Dor em faixa que melhora ao sentar. Score de Ranson/APACHE avalia gravidade.",
    tratamento: "Hidratação agressiva (Ringer lactato 250–500 mL/h nas primeiras horas). Jejum nas primeiras 24–48h. Analgesia: dipirona/morfina. ATB só se necrose infectada. Biliar: colecistectomia após resolução.",
    notas: "",
    fotos: [],
    tags: ["pâncreas", "lipase", "amilase", "epigástrio"],
  },
  {
    id: "ex4", nome: "Infarto Agudo do Miocárdio", categoria: "Cardiovascular",
    sintomas: ["dor precordial", "dor retroesternal", "dor irradiando para braço esquerdo", "dor irradiando para mandíbula", "dispneia", "sudorese fria", "náusea"],
    sinais: ["supradesnivelamento de ST", "troponina elevada", "CKMB elevada", "arritmias", "hipotensão", "alteração de ECG"],
    resumo: "Necrose miocárdica por oclusão coronariana. Supra de ST = IAMCSST (cateterismo imediato). Troponina é o marcador mais sensível e específico.",
    tratamento: "MONA: Morfina, O₂, Nitrato, AAS 300 mg. Heparina não-fracionada ou HBPM. IAMCSST: angioplastia primária <90 min (ICP) ou trombólise se ICP indisponível. IAMSSST: estratificação de risco + ICP eletiva.",
    notas: "",
    fotos: [],
    tags: ["cardíaco", "troponina", "ECG", "isquemia"],
  },
  {
    id: "ex5", nome: "Meningite Bacteriana", categoria: "Neurológica",
    sintomas: ["cefaleia intensa", "febre alta", "rigidez de nuca", "fotofobia", "fonofobia", "náusea", "vômito", "rebaixamento de consciência"],
    sinais: ["Kernig positivo", "Brudzinski positivo", "petéquias", "LCR turvo", "pleocitose neutrofílica", "proteína elevada no LCR", "glicose baixa no LCR"],
    resumo: "Emergência neurológica. Tríade: febre + cefaleia + rigidez de nuca. S. pneumoniae e N. meningitidis são os mais comuns em adultos. Não atrasar ATB para punção.",
    tratamento: "ATB imediato: ceftriaxona 2g IV 12/12h + dexametasona 0,15 mg/kg 6/6h (por 4 dias, antes ou junto ao ATB). Suspeita de Listeria: adicionar ampicilina. Quimioprofilaxia de contactantes: rifampicina ou ciprofloxacino.",
    notas: "",
    fotos: [],
    tags: ["meningite", "LCR", "Kernig", "neurologia"],
  },
  {
    id: "ex6", nome: "Tromboembolismo Pulmonar", categoria: "Pulmonar",
    sintomas: ["dispneia súbita", "dor pleurítica", "hemoptise", "taquicardia", "síncope", "palpitações", "tosse"],
    sinais: ["D-dímero elevado", "troponina elevada", "BNP elevado", "S1Q3T3 no ECG", "hipoxemia", "falha de enchimento na angiotomografia"],
    resumo: "Obstrução arterial pulmonar por trombo. Dispneia súbita é o mais comum. Score de Wells estratifica probabilidade. D-dímero negativo exclui em baixa probabilidade. Angio-TC é padrão-ouro.",
    tratamento: "Anticoagulação imediata: heparina não-fracionada (se alto risco) ou HBPM/rivaroxabana. TEP maciço (instabilidade): trombólise sistêmica (alteplase 100 mg) ou embolectomia cirúrgica. Manutenção: anticoagulante oral por ≥3 meses.",
    notas: "",
    fotos: [],
    tags: ["TEP", "embolia", "D-dímero", "Wells"],
  },
];

// ── Utilitários ───────────────────────────────────────────────────────────────
const norm = s => (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const uid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const hoje = () => new Date().toLocaleDateString("pt-BR");

function buscarAchados(doencas, termos) {
  if (!termos.length) return [];
  return doencas.map(d => {
    const campos = [];
    termos.forEach(t => {
      const tn = norm(t);
      d.sintomas.forEach(s => { if(norm(s).includes(tn)) campos.push({tipo:"sintoma",valor:s}); });
      d.sinais.forEach(s =>   { if(norm(s).includes(tn)) campos.push({tipo:"sinal",  valor:s}); });
      d.tags.forEach(s =>     { if(norm(s).includes(tn)) campos.push({tipo:"tag",    valor:s}); });
      if(norm(d.nome).includes(tn))      campos.push({tipo:"nome",     valor:d.nome});
      if(norm(d.categoria).includes(tn)) campos.push({tipo:"categoria",valor:d.categoria});
    });
    return {...d, campos};
  }).filter(d=>d.campos.length>0).sort((a,b)=>b.campos.length-a.campos.length);
}

function buscarNome(doencas, t) {
  if(!t) return [];
  const tn = norm(t);
  return doencas.filter(d=>norm(d.nome).includes(tn)||norm(d.categoria).includes(tn));
}

function todosAchados(doencas) {
  const s = new Set();
  doencas.forEach(d=>{d.sintomas.forEach(x=>s.add(x));d.sinais.forEach(x=>s.add(x));});
  return [...s].sort();
}

const FORM_VAZIO = {nome:"",categoria:"",sintomas:"",sinais:"",resumo:"",tratamento:"",notas:"",tags:"",fotos:[],imagens:{exame:[],laboratorial:[],clinica:[]}};

// ── Paleta ────────────────────────────────────────────────────────────────────
const C = {
  bg:"#f4f1ea", paper:"#fefdf8", ink:"#1a1612", inkMid:"#55504a",
  inkLight:"#9a9088", accent:"#b83226", accentBg:"#f5e9e8",
  border:"#ddd6ca", sint:"#7a4f1a", sintBg:"#f6ead8",
  sinal:"#1a5c3a", sinalBg:"#d8ede2", tag:"#1a3d6e", tagBg:"#d8e6f2",
  trat:"#4a1a6a", tratBg:"#ede0f5",
  caso:"#1a4a5c", casoBg:"#d8eef5",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;900&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${C.bg};font-family:'Source Serif 4',serif}
input,textarea,select{font-family:'Source Serif 4',serif}
input:focus,textarea:focus,select:focus{outline:none}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
.row{display:block;padding:14px 18px;border-radius:4px;border:1px solid ${C.border};background:${C.paper};cursor:pointer;transition:all .15s}
.row:hover{border-color:${C.accent};transform:translateX(3px);background:#fffcf6}
.sug{padding:9px 14px;cursor:pointer;font-size:14px;color:${C.inkMid};border-bottom:1px solid ${C.border};transition:background .1s}
.sug:hover{background:${C.accentBg};color:${C.accent}}
.sug:last-child{border-bottom:none}
.btn{padding:7px 16px;border-radius:3px;border:1px solid ${C.border};background:transparent;color:${C.inkMid};font-family:'Source Serif 4',serif;font-size:13px;cursor:pointer;transition:all .15s}
.btn:hover{border-color:${C.accent};color:${C.accent};background:${C.accentBg}}
.btn:disabled{opacity:.35;cursor:not-allowed}
.btnp{padding:9px 22px;border-radius:3px;border:none;background:${C.accent};color:#fff;font-family:'Source Serif 4',serif;font-size:14px;font-weight:600;cursor:pointer;transition:opacity .15s}
.btnp:hover{opacity:.85}
.btnp:disabled{opacity:.35;cursor:not-allowed}
.nav-a{font-family:'Source Serif 4',serif;font-size:14px;color:${C.inkMid};cursor:pointer;padding:4px 2px;border:none;border-bottom:1px solid transparent;background:none;transition:all .15s}
.nav-a:hover,.nav-a.on{color:${C.accent};border-bottom-color:${C.accent}}
.tab{padding:7px 16px;border:1px solid ${C.border};border-radius:3px;cursor:pointer;font-size:13px;font-family:'Source Serif 4',serif;background:transparent;color:${C.inkMid};transition:all .15s}
.tab.on{background:${C.accent};color:#fff;border-color:${C.accent}}
.dtab{padding:8px 18px;border:none;border-bottom:2px solid transparent;cursor:pointer;font-size:14px;font-family:'Source Serif 4',serif;background:none;color:${C.inkMid};transition:all .15s}
.dtab.on{color:${C.accent};border-bottom-color:${C.accent};font-weight:600}
.lbl{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${C.inkLight};margin-bottom:5px;margin-top:16px}
.fi{width:100%;padding:9px 13px;border:1px solid ${C.border};border-radius:3px;background:${C.bg};color:${C.ink};font-size:14px;font-family:'Source Serif 4',serif}
.fi:focus{border-color:${C.accent}}
textarea.fi{resize:vertical}
.overlay{position:fixed;inset:0;background:rgba(26,22,18,.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:${C.paper};border:1px solid ${C.border};border-radius:6px;padding:32px;width:100%;max-width:640px;max-height:92vh;overflow-y:auto}
.chip{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:2px;background:${C.accentBg};border:1px solid ${C.accent};color:${C.accent};font-size:14px}
.chip .x{cursor:pointer;font-size:17px;opacity:.6;line-height:1}.chip .x:hover{opacity:1}
.upload-z{border:2px dashed ${C.border};border-radius:6px;padding:28px;text-align:center;cursor:pointer;transition:all .2s;background:${C.bg}}
.upload-z:hover,.upload-z.drag{border-color:${C.accent};background:${C.accentBg}}
.spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:7px}
@keyframes sp{to{transform:rotate(360deg)}}
.foto-thumb{width:90px;height:90px;object-fit:cover;border-radius:4px;border:1px solid ${C.border};cursor:pointer;transition:opacity .15s}
.foto-thumb:hover{opacity:.8}
.caso-card{padding:18px 20px;border-radius:4px;border:1px solid ${C.border};background:${C.paper};transition:all .15s}
.caso-card:hover{border-color:${C.caso};background:#f8fdff}
`;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [doencas, setDoencasRaw] = useState(EXEMPLO);
  const [casos, setCasosRaw] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [sincStatus, setSincStatus] = useState("ok"); // ok | salvando | erro

  // ── Carregar dados do Supabase na inicialização ──
  useEffect(() => {
    async function carregar() {
      try {
        const [resD, resC] = await Promise.all([
          supa.from("doencas").select("id, dados"),
          supa.from("casos").select("id, dados"),
        ]);
        if (resD.data?.length > 0) setDoencasRaw(resD.data.map(r => ({...r.dados, id: r.id})));
        if (resC.data?.length > 0) setCasosRaw(resC.data.map(r => ({...r.dados, id: r.id})));
      } catch(e) { console.error("Erro ao carregar:", e); }
      setCarregando(false);
    }
    carregar();
  }, []);

  const setDoencas = useCallback(upd => {
    setDoencasRaw(prev => {
      const next = typeof upd === "function" ? upd(prev) : upd;
      setSincStatus("salvando");
      (async () => {
        try {
          await supa.from("doencas").upsert(next.map(d => ({id: d.id, dados: d})));
          const ids = next.map(d => d.id);
          const {data: existentes} = await supa.from("doencas").select("id");
          const excluir = (existentes||[]).filter(r => !ids.includes(r.id)).map(r => r.id);
          if (excluir.length) await supa.from("doencas").delete().in("id", excluir);
          setSincStatus("ok");
        } catch(e) { console.error("Erro ao salvar:", e); setSincStatus("erro"); }
      })();
      return next;
    });
  }, []);

  const setCasos = useCallback(upd => {
    setCasosRaw(prev => {
      const next = typeof upd === "function" ? upd(prev) : upd;
      setSincStatus("salvando");
      (async () => {
        try {
          await supa.from("casos").upsert(next.map(c => ({id: c.id, dados: c})));
          const ids = next.map(c => c.id);
          const {data: existentes} = await supa.from("casos").select("id");
          const excluir = (existentes||[]).filter(r => !ids.includes(r.id)).map(r => r.id);
          if (excluir.length) await supa.from("casos").delete().in("id", excluir);
          setSincStatus("ok");
        } catch(e) { console.error("Erro ao salvar:", e); setSincStatus("erro"); }
      })();
      return next;
    });
  }, []);

  // ── nav ──
  const [tela, setTela] = useState("busca");
  const [doencaSel, setDoencaSel] = useState(null);
  const [detalheAba, setDetalheAba] = useState("resumo");

  // ── busca direta ──
  const [termo, setTermo] = useState("");
  const [filtros, setFiltros] = useState([]);
  const [sugs, setSugs] = useState([]);
  const inputRef = useRef(null);

  // ── busca reversa ──
  const [termoRev, setTermoRev] = useState("");
  const [doencaRev, setDoencaRev] = useState(null);
  const [filtrosRev, setFiltrosRev] = useState([]);
  const [sugsRev, setSugsRev] = useState([]);

  // ── modal doença (add / edit) ──
  const [modalD, setModalD] = useState(false);
  const [editando, setEditando] = useState(null); // doença sendo editada ou null
  const [modoAdd, setModoAdd] = useState("manual");
  const [form, setForm] = useState(FORM_VAZIO);
  const [imgFile, setImgFile] = useState(null);
  const [imgPrev, setImgPrev] = useState(null);
  const [extraindo, setExtraindo] = useState(false);
  const [extraido, setExtraido] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);
  const importRef = useRef(null);

  // ── modal foto ampliada ──
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  // ── modal caso especial ──
  const [modalCaso, setModalCaso] = useState(false);
  const [casoForm, setCasoForm] = useState({titulo:"",descricao:"",diagnostico:"",aprendizado:"",data:hoje()});
  const [casoEditId, setCasoEditId] = useState(null);

  // ── sugestões busca direta ──
  useEffect(() => {
    if(termo.length<2){setSugs([]);return;}
    const tn=norm(termo);
    setSugs(todosAchados(doencas).filter(a=>norm(a).includes(tn)&&!filtros.includes(a)).slice(0,8));
  },[termo,filtros,doencas]);

  // ── sugestões reversa ──
  useEffect(() => {
    if(termoRev.length<1){setSugsRev([]);return;}
    setSugsRev(buscarNome(doencas,termoRev).slice(0,6));
  },[termoRev,doencas]);

  // ── busca direta ──
  const addFiltro = t => {
    const v=t.trim(); if(v&&!filtros.includes(v)) setFiltros(p=>[...p,v]);
    setTermo(""); setSugs([]); setTimeout(()=>inputRef.current?.focus(),50);
  };
  const resultados = buscarAchados(doencas, filtros);

  // ── busca reversa ──
  const selecionarRev = d => { setDoencaRev(d); setFiltrosRev([]); setTermoRev(d.nome); setSugsRev([]); };
  const achadosRevDisp = doencaRev ? [...doencaRev.sintomas,...doencaRev.sinais].filter(a=>!filtrosRev.includes(a)) : [];
  const outrasRev = filtrosRev.length>0 ? doencas.filter(d=>{
    if(d.id===doencaRev?.id) return false;
    return filtrosRev.every(f=>d.sintomas.some(s=>norm(s)===norm(f))||d.sinais.some(s=>norm(s)===norm(f)));
  }) : [];

  // ── abrir detalhe ──
  const abrirDetalhe = (d,aba="resumo") => { setDoencaSel(d); setDetalheAba(aba); setTela("detalhe"); };

  // ── modal doença ──
  const abrirAdd = () => { setEditando(null); setForm(FORM_VAZIO); setModoAdd("manual"); setImgFile(null); setImgPrev(null); setExtraido(false); setModalD(true); };
  const abrirEdit = d => {
    setEditando(d);
    setForm({ nome:d.nome, categoria:d.categoria, sintomas:d.sintomas.join(", "), sinais:d.sinais.join(", "), resumo:d.resumo, tratamento:d.tratamento||"", notas:d.notas||"", tags:d.tags.join(", "), fotos:d.fotos||[], imagens:d.imagens||{exame:[],laboratorial:[],clinica:[]} });
    setModoAdd("manual"); setImgFile(null); setImgPrev(null); setExtraido(false); setModalD(true);
  };
  const fecharModal = () => { setModalD(false); setEditando(null); setImgFile(null); setImgPrev(null); setExtraido(false); };

  const salvarDoenca = () => {
    const d = {
      id: editando ? editando.id : uid(),
      nome: form.nome.trim(), categoria: form.categoria.trim(),
      sintomas: form.sintomas.split(",").map(s=>s.trim()).filter(Boolean),
      sinais:   form.sinais.split(",").map(s=>s.trim()).filter(Boolean),
      resumo: form.resumo.trim(), tratamento: form.tratamento.trim(),
      notas: form.notas.trim(),
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean),
      fotos: form.fotos || [],
      imagens: form.imagens || {exame:[],laboratorial:[],clinica:[]},
    };
    if(editando) {
      setDoencas(p=>p.map(x=>x.id===editando.id?d:x));
      setDoencaSel(d);
    } else {
      setDoencas(p=>[...p,d]);
    }
    fecharModal();
  };

  const excluirDoenca = id => {
    if(!confirm("Excluir esta doença da biblioteca?")) return;
    setDoencas(p=>p.filter(d=>d.id!==id));
    setTela("biblioteca");
  };

  // ── imagens categorizadas ──
  const imgCatRef = { exame: useRef(null), laboratorial: useRef(null), clinica: useRef(null) };
  const addImgCat = (cat, e) => {
    const files = [...e.target.files];
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => setForm(p => ({
        ...p,
        imagens: { ...p.imagens, [cat]: [...(p.imagens?.[cat]||[]), {id:uid(), src:ev.target.result, legenda:""}] }
      }));
      r.readAsDataURL(f);
    });
    e.target.value="";
  };
  const remImgCat = (cat, id) => setForm(p => ({
    ...p,
    imagens: { ...p.imagens, [cat]: (p.imagens?.[cat]||[]).filter(f=>f.id!==id) }
  }));
  const legImgCat = (cat, id, txt) => setForm(p => ({
    ...p,
    imagens: { ...p.imagens, [cat]: (p.imagens?.[cat]||[]).map(f=>f.id===id?{...f,legenda:txt}:f) }
  }));
  // manter compatibilidade com campo fotos antigo
  const fotoAddRef = useRef(null);

  // ── extração IA por foto ──
  const handleImg = f => { setImgFile(f); const r=new FileReader(); r.onload=e=>setImgPrev(e.target.result); r.readAsDataURL(f); setExtraido(false); };
  const extrairIA = async () => {
    if(!imgFile) return;
    setExtraindo(true);
    try {
      const b64 = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(imgFile); });
      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:imgFile.type||"image/jpeg",data:b64}},
            {type:"text",text:`Analise este material médico e extraia informações clínicas. Retorne APENAS JSON válido sem markdown:\n{"nome":"","categoria":"","sintomas":[],"sinais":[],"resumo":"","tratamento":"","tags":[]}\nResponda em português.`}
          ]}]
        })
      });
      const data = await resp.json();
      const txt = data.content?.map(i=>i.text||"").join("")||"";
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      setExtraido(true);
      setForm(p=>({...p,
        nome: parsed.nome||p.nome, categoria: parsed.categoria||p.categoria,
        sintomas: (parsed.sintomas||[]).join(", ")||p.sintomas,
        sinais:   (parsed.sinais||[]).join(", ")||p.sinais,
        resumo:   parsed.resumo||p.resumo, tratamento: parsed.tratamento||p.tratamento,
        tags:     (parsed.tags||[]).join(", ")||p.tags,
      }));
    } catch { alert("Erro ao extrair. Verifique se a imagem é legível."); }
    setExtraindo(false);
  };

  // ── export / import ──
  const exportar = () => {
    const blob = new Blob([JSON.stringify({doencas,casos},null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`clinicaRef_${new Date().toISOString().slice(0,10)}.json`; a.click();
  };
  const importar = e => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const d=JSON.parse(ev.target.result);
        const novasDoencas = d.doencas||d; // compatível com export antigo
        const novosCasos   = d.casos||[];
        if(!Array.isArray(novasDoencas)) throw new Error();
        if(confirm(`Importar ${novasDoencas.length} doença(s) e ${novosCasos.length} caso(s)?\nOK = mesclar | Cancelar = substituir tudo`)) {
          setDoencas(prev=>{ const ns=new Set(prev.map(x=>x.nome.toLowerCase())); return [...prev,...novasDoencas.filter(x=>!ns.has((x.nome||"").toLowerCase())).map(x=>({...x,id:uid()}))]; });
          if(novosCasos.length) setCasos(prev=>[...prev,...novosCasos.map(x=>({...x,id:uid()}))]);
        } else { setDoencas(novasDoencas.map(x=>({...x,id:uid()}))); setCasos(novosCasos.map(x=>({...x,id:uid()}))); }
        alert("Importação concluída!");
      } catch { alert("Arquivo inválido."); }
      e.target.value="";
    };
    r.readAsText(f);
  };

  // ── casos especiais ──
  const abrirNovoCaso = () => { setCasoForm({titulo:"",descricao:"",diagnostico:"",aprendizado:"",data:hoje()}); setCasoEditId(null); setModalCaso(true); };
  const abrirEditCaso = c => { setCasoForm({titulo:c.titulo,descricao:c.descricao,diagnostico:c.diagnostico,aprendizado:c.aprendizado,data:c.data}); setCasoEditId(c.id); setModalCaso(true); };
  const salvarCaso = () => {
    const c={...casoForm,id:casoEditId||uid()};
    if(casoEditId) setCasos(p=>p.map(x=>x.id===casoEditId?c:x));
    else setCasos(p=>[c,...p]);
    setModalCaso(false);
  };
  const excluirCaso = id => { if(confirm("Excluir este caso?")) setCasos(p=>p.filter(c=>c.id!==id)); };

  // ── render ────────────────────────────────────────────────────────────────
  const PF = ({label,itens,cor,bg,borda,dot}) => (
    <div style={{marginBottom:22}}>
      <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:C.ink,marginBottom:10}}>{label}</h3>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
        {itens.map(s=>{
          const m=filtros.some(f=>norm(s).includes(norm(f)));
          return <span key={s} style={{padding:"5px 12px",borderRadius:2,fontSize:14,background:m?bg:C.bg,color:m?cor:C.inkMid,border:`1px solid ${m?borda:C.border}`,fontWeight:m?600:400}}>{m?dot+" ":""}{s}</span>;
        })}
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:C.bg}}>

        {/* NAV */}
        <header style={{borderBottom:`1px solid ${C.border}`,background:C.paper,padding:"0 24px",position:"sticky",top:0,zIndex:100}}>
          <div style={{maxWidth:860,margin:"0 auto",padding:"13px 0",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
            <div onClick={()=>setTela("busca")} style={{cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:900,color:C.ink}}>Clínica<span style={{color:C.accent}}>Ref</span></span>
              {sincStatus==="salvando" && <span style={{fontSize:11,color:C.inkLight,letterSpacing:".05em"}}>● salvando…</span>}
              {sincStatus==="erro"     && <span style={{fontSize:11,color:C.accent, letterSpacing:".05em"}}>● erro ao salvar</span>}
              {sincStatus==="ok"       && <span style={{fontSize:11,color:"#1a5c3a",letterSpacing:".05em"}}>● sincronizado</span>}
            </div>
            <nav style={{display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
              <button className={`nav-a ${tela==="busca"?"on":""}`}      onClick={()=>setTela("busca")}>Achados</button>
              <button className={`nav-a ${tela==="reversa"?"on":""}`}    onClick={()=>{setTela("reversa");setDoencaRev(null);setFiltrosRev([]);setTermoRev("");}}>Reversa</button>
              <button className={`nav-a ${tela==="biblioteca"?"on":""}`} onClick={()=>setTela("biblioteca")}>Biblioteca</button>
              <button className={`nav-a ${tela==="casos"?"on":""}`}      onClick={()=>setTela("casos")}>Casos</button>
              <button className="btnp" style={{fontSize:13,padding:"6px 15px"}} onClick={abrirAdd}>+ Adicionar</button>
            </nav>
          </div>
        </header>

        <main style={{maxWidth:860,margin:"0 auto",padding:"36px 24px"}}>
          {carregando && (
            <div style={{textAlign:"center",padding:"80px 0",color:C.inkLight}}>
              <div style={{fontSize:32,marginBottom:16}}>⚕</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.ink,marginBottom:8}}>Carregando sua biblioteca…</p>
              <p style={{fontSize:14}}>Buscando dados do servidor</p>
            </div>
          )}
          {!carregando && <>

          {/* ══ BUSCA DIRETA ═══════════════════════════════════════════════ */}
          {tela==="busca" && (
            <div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color:C.ink,marginBottom:6}}>Busca por Achados</h1>
              <p style={{fontSize:15,color:C.inkMid,marginBottom:28,lineHeight:1.6}}>Digite sintomas, sinais ou achados laboratoriais. Cada item adicionado afunila os diagnósticos.</p>

              <div style={{position:"relative",marginBottom:12}}>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1,position:"relative"}}>
                    <input ref={inputRef} value={termo} onChange={e=>setTermo(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"&&termo.trim())addFiltro(termo);if(e.key==="Escape"){setSugs([]);setTermo("");}}}
                      placeholder={filtros.length?"Adicionar outro achado…":"Ex: febre, Blumberg positivo, leucocitose…"}
                      style={{width:"100%",padding:"12px 16px",fontSize:16,border:`2px solid ${termo?C.accent:C.border}`,borderRadius:4,background:C.paper,color:C.ink,transition:"border-color .15s"}}
                      autoFocus
                    />
                    {sugs.length>0 && (
                      <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:C.paper,border:`1px solid ${C.border}`,borderRadius:4,boxShadow:"0 4px 20px rgba(0,0,0,.1)",zIndex:50,overflow:"hidden"}}>
                        {sugs.map(s=><div key={s} className="sug" onClick={()=>addFiltro(s)}>{s}</div>)}
                      </div>
                    )}
                  </div>
                  <button className="btnp" onClick={()=>termo.trim()&&addFiltro(termo)} disabled={!termo.trim()}>Adicionar</button>
                </div>
              </div>

              {filtros.length>0 && (
                <div style={{display:"flex",flexWrap:"wrap",gap:7,alignItems:"center",marginBottom:22}}>
                  <span style={{fontSize:11,color:C.inkLight,textTransform:"uppercase",letterSpacing:".08em",marginRight:4}}>Filtrando:</span>
                  {filtros.map(t=>(
                    <span key={t} className="chip">{t}<span className="x" onClick={()=>setFiltros(p=>p.filter(x=>x!==t))}>×</span></span>
                  ))}
                  <button className="btn" onClick={()=>{setFiltros([]);setTermo("");}}>Limpar</button>
                </div>
              )}

              {filtros.length===0 && (
                <div style={{marginBottom:32}}>
                  <p style={{fontSize:12,color:C.inkLight,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Começar com:</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {["febre","dor abdominal","dispneia","cefaleia","náusea","dor precordial","rigidez de nuca","leucocitose","troponina elevada","D-dímero elevado"].map(s=>(
                      <button key={s} className="btn" onClick={()=>addFiltro(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {filtros.length>0 && (
                <div>
                  <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`,paddingBottom:10,marginBottom:14}}>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.ink}}>{resultados.length===0?"Nenhum resultado":`${resultados.length} diagnóstico${resultados.length>1?"s":""}`}</span>
                    <span style={{fontSize:13,color:C.inkLight}}>por compatibilidade</span>
                  </div>
                  {resultados.length===0 && (
                    <p style={{color:C.inkLight,fontSize:15,padding:"30px 0",textAlign:"center"}}>
                      Nenhuma doença cadastrada contém estes achados. <span style={{color:C.accent,cursor:"pointer"}} onClick={abrirAdd}>Adicionar nova?</span>
                    </p>
                  )}
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    {resultados.map((d,i)=>{
                      const sm=[...new Set(d.campos.filter(c=>c.tipo==="sintoma").map(c=>c.valor))];
                      const sn=[...new Set(d.campos.filter(c=>c.tipo==="sinal").map(c=>c.valor))];
                      return (
                        <div key={d.id} className="row" onClick={()=>abrirDetalhe(d)}>
                          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:8}}>
                                <span style={{fontSize:12,color:C.inkLight,minWidth:18}}>{i+1}.</span>
                                <span style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:C.accent,fontWeight:900}}>{d.nome}</span>
                                <span style={{fontSize:12,color:C.inkLight}}>— {d.categoria}</span>
                              </div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginLeft:28}}>
                                {sm.map(s=><span key={s} style={{padding:"2px 9px",borderRadius:2,background:C.sintBg,color:C.sint,fontSize:12,border:"1px solid #e8cca0"}}>● {s}</span>)}
                                {sn.map(s=><span key={s} style={{padding:"2px 9px",borderRadius:2,background:C.sinalBg,color:C.sinal,fontSize:12,border:"1px solid #a8d8b8"}}>◆ {s}</span>)}
                              </div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontSize:11,color:C.inkLight,marginBottom:4}}>{d.campos.length} compatível{d.campos.length>1?"is":""}</div>
                              <div style={{width:72,height:3,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${Math.min(100,(d.campos.length/(filtros.length*2))*100)}%`,background:d.campos.length>=filtros.length?C.accent:"#e8a020",borderRadius:2}}/></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ BUSCA REVERSA ══════════════════════════════════════════════ */}
          {tela==="reversa" && (
            <div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color:C.ink,marginBottom:6}}>Busca Reversa</h1>
              <p style={{fontSize:15,color:C.inkMid,marginBottom:28,lineHeight:1.6}}>Comece pelo nome da doença. Marque os achados presentes e veja quais outros diagnósticos também se encaixam.</p>
              <div style={{position:"relative",marginBottom:20}}>
                <input value={termoRev} onChange={e=>{setTermoRev(e.target.value);setDoencaRev(null);setFiltrosRev([]);}}
                  placeholder="Digite o nome de uma doença…"
                  style={{width:"100%",padding:"12px 16px",fontSize:16,border:`2px solid ${termoRev?C.accent:C.border}`,borderRadius:4,background:C.paper,color:C.ink}} autoFocus
                />
                {sugsRev.length>0&&!doencaRev&&(
                  <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:C.paper,border:`1px solid ${C.border}`,borderRadius:4,boxShadow:"0 4px 20px rgba(0,0,0,.1)",zIndex:50,overflow:"hidden"}}>
                    {sugsRev.map(d=><div key={d.id} className="sug" onClick={()=>selecionarRev(d)}><strong style={{color:C.ink}}>{d.nome}</strong><span style={{color:C.inkLight,marginLeft:8,fontSize:13}}>— {d.categoria}</span></div>)}
                  </div>
                )}
              </div>
              {doencaRev && (
                <div>
                  <div style={{padding:"14px 18px",background:C.paper,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:18}}>
                    <div style={{fontSize:11,color:C.inkLight,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Doença selecionada</div>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:C.accent}}>{doencaRev.nome}</span>
                    <span style={{fontSize:13,color:C.inkLight,marginLeft:10}}>— {doencaRev.categoria}</span>
                    <p style={{fontSize:13,color:C.inkMid,marginTop:8,lineHeight:1.6,fontStyle:"italic"}}>{doencaRev.resumo}</p>
                  </div>
                  <p style={{fontSize:13,color:C.inkMid,marginBottom:12}}>Marque os achados <strong>presentes no paciente</strong>:</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:18}}>
                    {achadosRevDisp.map(a=>{
                      const isSinal=doencaRev.sinais.includes(a);
                      return <button key={a} className="btn" onClick={()=>setFiltrosRev(p=>[...p,a])} style={{borderColor:isSinal?C.sinal:C.sint,color:isSinal?C.sinal:C.sint}}>{isSinal?"◆":"●"} {a}</button>;
                    })}
                    {achadosRevDisp.length===0&&<span style={{fontSize:14,color:C.inkLight}}>Todos os achados foram selecionados.</span>}
                  </div>
                  {filtrosRev.length>0&&(
                    <div style={{marginBottom:22}}>
                      <div style={{display:"flex",flexWrap:"wrap",gap:7,alignItems:"center"}}>
                        <span style={{fontSize:11,color:C.inkLight,textTransform:"uppercase",letterSpacing:".08em"}}>Presentes:</span>
                        {filtrosRev.map(a=><span key={a} className="chip">{a}<span className="x" onClick={()=>setFiltrosRev(p=>p.filter(x=>x!==a))}>×</span></span>)}
                        <button className="btn" onClick={()=>setFiltrosRev([])}>Limpar</button>
                      </div>
                    </div>
                  )}
                  {filtrosRev.length>0&&(
                    <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18}}>
                      <p style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.ink,marginBottom:12}}>
                        {outrasRev.length===0?"Nenhuma outra doença compartilha todos estes achados.":`${outrasRev.length} outro${outrasRev.length>1?"s":""} diagnóstico${outrasRev.length>1?"s":""} compatível${outrasRev.length>1?"is":""}:`}
                      </p>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {outrasRev.map(d=><div key={d.id} className="row" onClick={()=>abrirDetalhe(d)}><span style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.accent,fontWeight:900}}>{d.nome}</span><span style={{fontSize:13,color:C.inkLight,marginLeft:10}}>— {d.categoria}</span></div>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!doencaRev&&termoRev.length===0&&(
                <div>
                  <p style={{fontSize:12,color:C.inkLight,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Doenças cadastradas:</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{doencas.map(d=><button key={d.id} className="btn" onClick={()=>selecionarRev(d)}>{d.nome}</button>)}</div>
                </div>
              )}
            </div>
          )}

          {/* ══ DETALHE ════════════════════════════════════════════════════ */}
          {tela==="detalhe"&&doencaSel&&(()=>{
            const d = doencas.find(x=>x.id===doencaSel.id)||doencaSel;
            return (
              <div>
                <div style={{marginBottom:20,display:"flex",gap:10,alignItems:"center"}}>
                  <button className="nav-a" onClick={()=>setTela("busca")} style={{fontSize:13}}>← Voltar</button>
                  {filtros.length>0&&<span style={{fontSize:13,color:C.inkLight}}>filtrando: {filtros.join(" + ")}</span>}
                </div>
                <div style={{borderBottom:`2px solid ${C.ink}`,paddingBottom:12,marginBottom:0,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                  <div>
                    <div style={{fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:C.inkLight,marginBottom:4}}>{d.categoria}</div>
                    <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:C.ink,lineHeight:1.1}}>{d.nome}</h1>
                  </div>
                  <div style={{display:"flex",gap:8,flexShrink:0,marginTop:6}}>
                    <button className="btn" onClick={()=>abrirEdit(d)}>✏ Editar</button>
                    <button className="btn" style={{color:C.accent,borderColor:C.accent}} onClick={()=>excluirDoenca(d.id)}>Excluir</button>
                  </div>
                </div>

                {/* Abas */}
                <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,marginBottom:24}}>
                  {["resumo","sintomas","tratamento","fotos","notas"].map(a=>(
                    <button key={a} className={`dtab ${detalheAba===a?"on":""}`} onClick={()=>setDetalheAba(a)}>
                      {{resumo:"📋 Resumo",sintomas:"🔬 Achados",tratamento:"💊 Tratamento",fotos:"🖼 Exames & Imagens",notas:"📝 Notas"}[a]}
                    </button>
                  ))}
                </div>

                {/* Resumo */}
                {detalheAba==="resumo"&&(
                  <p style={{fontSize:16,color:C.inkMid,lineHeight:1.85,fontStyle:"italic",borderLeft:`3px solid ${C.accent}`,paddingLeft:18}}>
                    {d.resumo||<span style={{color:C.inkLight}}>Sem resumo cadastrado.</span>}
                  </p>
                )}

                {/* Achados */}
                {detalheAba==="sintomas"&&(
                  <div>
                    <PF label="Sintomas"             itens={d.sintomas} cor={C.sint}  bg={C.sintBg}  borda="#e8cca0" dot="●"/>
                    <PF label="Sinais & Laboratorial" itens={d.sinais}   cor={C.sinal} bg={C.sinalBg} borda="#a8d8b8" dot="◆"/>
                    {d.tags?.length>0&&(
                      <div style={{marginBottom:22}}>
                        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:C.ink,marginBottom:10}}>Tags</h3>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{d.tags.map(t=><span key={t} style={{padding:"4px 11px",borderRadius:2,fontSize:13,background:C.tagBg,color:C.tag,border:"1px solid #b0c8e0"}}>{t}</span>)}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tratamento */}
                {detalheAba==="tratamento"&&(
                  <div style={{padding:20,background:C.tratBg,border:`1px solid #d0b0e8`,borderRadius:4}}>
                    {d.tratamento
                      ? <p style={{fontSize:15,color:C.trat,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{d.tratamento}</p>
                      : <p style={{color:C.inkLight,fontStyle:"italic"}}>Nenhum tratamento cadastrado. <span style={{color:C.accent,cursor:"pointer"}} onClick={()=>{abrirEdit(d);setDetalheAba("tratamento");}}>Adicionar →</span></p>
                    }
                  </div>
                )}

                {/* Imagens por categoria */}
                {detalheAba==="fotos"&&(()=>{
                  const cats = [
                    {key:"exame",      label:"🫁 Imagem (RX, TC, USG, ECG…)", cor:"#1a3d6e", bg:"#d8e6f2", borda:"#b0c8e0"},
                    {key:"laboratorial",label:"🧪 Laboratorial",               cor:"#1a5c3a", bg:"#d8ede2", borda:"#a8d8b8"},
                    {key:"clinica",    label:"🩺 Apresentação Clínica",         cor:"#7a4f1a", bg:"#f6ead8", borda:"#e8cca0"},
                  ];
                  const totalImgs = cats.reduce((acc,c)=>acc+(d.imagens?.[c.key]||[]).length+(c.key==="clinica"?(d.fotos||[]).length:0),0);
                  return (
                    <div>
                      {totalImgs===0 && (
                        <p style={{color:C.inkLight,fontStyle:"italic",marginBottom:20}}>
                          Nenhuma imagem cadastrada. <span style={{color:C.accent,cursor:"pointer"}} onClick={()=>abrirEdit(d)}>Adicionar ao editar →</span>
                        </p>
                      )}
                      {cats.map(cat=>{
                        // migração: fotos antigas vão para "clinica"
                        const imgs = cat.key==="clinica"
                          ? [...(d.imagens?.[cat.key]||[]), ...(d.fotos||[])]
                          : (d.imagens?.[cat.key]||[]);
                        if(imgs.length===0) return null;
                        return (
                          <div key={cat.key} style={{marginBottom:28}}>
                            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:cat.cor,marginBottom:12,padding:"6px 12px",background:cat.bg,border:`1px solid ${cat.borda}`,borderRadius:3,display:"inline-block"}}>
                              {cat.label}
                            </h3>
                            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14}}>
                              {imgs.map(f=>(
                                <div key={f.id} style={{textAlign:"center"}}>
                                  <img src={f.src} alt={f.legenda||cat.label} className="foto-thumb" style={{width:"100%",height:150,borderColor:cat.borda}} onClick={()=>setFotoAmpliada(f)}/>
                                  {f.legenda&&<p style={{fontSize:12,color:C.inkMid,marginTop:5,lineHeight:1.4}}>{f.legenda}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Notas pessoais */}
                {detalheAba==="notas"&&(
                  <div>
                    {d.notas
                      ? <div style={{padding:18,background:C.paper,border:`1px solid ${C.border}`,borderRadius:4}}><p style={{fontSize:15,color:C.inkMid,lineHeight:1.85,whiteSpace:"pre-wrap"}}>{d.notas}</p></div>
                      : <p style={{color:C.inkLight,fontStyle:"italic"}}>Nenhuma nota pessoal. <span style={{color:C.accent,cursor:"pointer"}} onClick={()=>abrirEdit(d)}>Adicionar ao editar →</span></p>
                    }
                  </div>
                )}

                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18,marginTop:28,display:"flex",gap:10}}>
                  <button className="btnp" onClick={()=>setTela("busca")}>← Continuar filtrando</button>
                  <button className="btn" onClick={()=>{setFiltros([]);setTela("busca");}}>Nova busca</button>
                </div>
              </div>
            );
          })()}

          {/* ══ BIBLIOTECA ═════════════════════════════════════════════════ */}
          {tela==="biblioteca"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,color:C.ink}}>Biblioteca — {doencas.length} doenças</h1>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn" onClick={exportar}>⬇ Exportar</button>
                  <button className="btn" onClick={()=>importRef.current?.click()}>⬆ Importar</button>
                  <input ref={importRef} type="file" accept=".json" style={{display:"none"}} onChange={importar}/>
                  <button className="btnp" onClick={abrirAdd}>+ Adicionar</button>
                </div>
              </div>
              <div style={{border:`1px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
                {doencas.map((d,i)=>(
                  <div key={d.id} className="row" style={{borderRadius:0,borderLeft:"none",borderRight:"none",borderTop:i>0?`1px solid ${C.border}`:"none",borderBottom:"none"}} onClick={()=>abrirDetalhe(d)}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div>
                        <span style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.accent,fontWeight:900}}>{d.nome}</span>
                        <span style={{fontSize:13,color:C.inkLight,marginLeft:10}}>— {d.categoria}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:14}}>
                        {(()=>{const n=(d.fotos?.length||0)+Object.values(d.imagens||{}).reduce((a,v)=>a+v.length,0);return n>0&&<span style={{fontSize:12,color:C.inkLight}}>🖼 {n}</span>;})()}
                        <span style={{fontSize:12,color:C.inkLight}}>{d.sintomas.length} sint. · {d.sinais.length} sinais</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ CASOS ESPECIAIS ════════════════════════════════════════════ */}
          {tela==="casos"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
                <div>
                  <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,color:C.ink}}>Casos Especiais</h1>
                  <p style={{fontSize:14,color:C.inkMid,marginTop:4}}>Registre pacientes marcantes, apresentações atípicas e aprendizados clínicos.</p>
                </div>
                <button className="btnp" onClick={abrirNovoCaso}>+ Novo caso</button>
              </div>
              {casos.length===0&&(
                <div style={{textAlign:"center",padding:"50px 0",color:C.inkLight}}>
                  <div style={{fontSize:40,marginBottom:12}}>📂</div>
                  <p style={{fontSize:15}}>Nenhum caso registrado ainda.</p>
                  <p style={{fontSize:13,marginTop:6}}>Registre casos marcantes para revisar depois.</p>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {casos.map(c=>(
                  <div key={c.id} className="caso-card">
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6}}>
                          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,color:C.caso}}>{c.titulo}</h2>
                          <span style={{fontSize:12,color:C.inkLight}}>{c.data}</span>
                        </div>
                        {c.diagnostico&&<p style={{fontSize:13,color:C.inkMid,marginBottom:6}}><strong>Diagnóstico:</strong> {c.diagnostico}</p>}
                        <p style={{fontSize:14,color:C.inkMid,lineHeight:1.65,marginBottom:c.aprendizado?8:0}}>{c.descricao}</p>
                        {c.aprendizado&&(
                          <div style={{padding:"8px 12px",background:C.casoBg,border:`1px solid #a0d0e0`,borderRadius:3,fontSize:13,color:C.caso}}>
                            💡 <strong>Aprendizado:</strong> {c.aprendizado}
                          </div>
                        )}
                      </div>
                      <div style={{display:"flex",gap:7,flexShrink:0}}>
                        <button className="btn" style={{fontSize:12,padding:"5px 11px"}} onClick={()=>abrirEditCaso(c)}>✏ Editar</button>
                        <button className="btn" style={{fontSize:12,padding:"5px 11px",color:C.accent,borderColor:C.accent}} onClick={()=>excluirCaso(c.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>}
        </main>
        {/* ══ MODAL DOENÇA (ADD / EDIT) ══════════════════════════════════════ */}
        {modalD&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&fecharModal()}>
            <div className="modal">
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:C.ink,marginBottom:4}}>
                {editando?"Editar Doença":"Adicionar Doença"}
              </h2>
              <p style={{fontSize:13,color:C.inkLight,marginBottom:18}}>
                {editando?`Editando: ${editando.nome}`:"Foto do material ou preenchimento manual."}
              </p>

              {!editando&&(
                <div style={{display:"flex",gap:8,marginBottom:22}}>
                  <button className={`tab ${modoAdd==="foto"?"on":""}`}   onClick={()=>setModoAdd("foto")}>📷 Foto / Upload</button>
                  <button className={`tab ${modoAdd==="manual"?"on":""}`} onClick={()=>setModoAdd("manual")}>✏️ Manual</button>
                </div>
              )}

              {/* Extração por foto */}
              {modoAdd==="foto"&&!editando&&(
                <div style={{marginBottom:16}}>
                  {!imgPrev
                    ? <div className={`upload-z ${drag?"drag":""}`} onClick={()=>fileRef.current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleImg(e.dataTransfer.files[0]);}}>
                        <div style={{fontSize:32,marginBottom:8}}>📸</div>
                        <p style={{fontSize:15,color:C.inkMid,marginBottom:4}}>Arraste ou clique para selecionar</p>
                        <p style={{fontSize:13,color:C.inkLight}}>Foto de livro, slide, apostila…</p>
                        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
                      </div>
                    : <div>
                        <img src={imgPrev} alt="preview" style={{width:"100%",maxHeight:220,objectFit:"contain",borderRadius:4,border:`1px solid ${C.border}`,marginBottom:10,background:C.bg}}/>
                        <div style={{display:"flex",gap:8,marginBottom:14}}>
                          <button className="btnp" onClick={extrairIA} disabled={extraindo} style={{flex:1}}>
                            {extraindo?<><span className="spin"/>Extraindo…</>:"✨ Extrair com IA"}
                          </button>
                          <button className="btn" onClick={()=>{setImgFile(null);setImgPrev(null);setExtraido(false);}}>Trocar foto</button>
                        </div>
                        {extraido&&<div style={{padding:"9px 13px",background:C.sinalBg,border:"1px solid #a8d8b8",borderRadius:3,fontSize:13,color:C.sinal,marginBottom:10}}>✓ Dados extraídos! Revise abaixo antes de salvar.</div>}
                      </div>
                  }
                </div>
              )}

              {/* Formulário */}
              {(modoAdd==="manual"||editando||imgPrev)&&(
                <div>
                  <label className="lbl">Nome da doença *</label>
                  <input className="fi" value={form.nome} onChange={e=>setForm(p=>({...p,nome:e.target.value}))} placeholder="Ex: Pneumonia Bacteriana"/>

                  <label className="lbl">Categoria</label>
                  <input className="fi" value={form.categoria} onChange={e=>setForm(p=>({...p,categoria:e.target.value}))} placeholder="Ex: Pulmonar / Infecciosa"/>

                  <label className="lbl">Sintomas <span style={{fontSize:10,color:C.inkLight}}>(separados por vírgula)</span></label>
                  <textarea className="fi" rows={2} value={form.sintomas} onChange={e=>setForm(p=>({...p,sintomas:e.target.value}))} placeholder="febre, tosse produtiva, dispneia…"/>

                  <label className="lbl">Sinais & Laboratorial <span style={{fontSize:10,color:C.inkLight}}>(separados por vírgula)</span></label>
                  <textarea className="fi" rows={2} value={form.sinais} onChange={e=>setForm(p=>({...p,sinais:e.target.value}))} placeholder="leucocitose, PCR elevado, consolidação…"/>

                  <label className="lbl">Resumo clínico</label>
                  <textarea className="fi" rows={3} value={form.resumo} onChange={e=>setForm(p=>({...p,resumo:e.target.value}))} placeholder="Fisiopatologia, diagnóstico…"/>

                  <label className="lbl">Tratamento</label>
                  <textarea className="fi" rows={3} value={form.tratamento} onChange={e=>setForm(p=>({...p,tratamento:e.target.value}))} placeholder="1ª linha, doses, alternativas…"/>

                  <label className="lbl">Notas pessoais</label>
                  <textarea className="fi" rows={2} value={form.notas} onChange={e=>setForm(p=>({...p,notas:e.target.value}))} placeholder="Dicas, macetes, lembretes…"/>

                  <label className="lbl">Tags <span style={{fontSize:10,color:C.inkLight}}>(separadas por vírgula)</span></label>
                  <input className="fi" value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))} placeholder="pulmonar, infecção, antibiótico"/>

                  {/* Imagens por categoria */}
                  {[
                    {key:"exame",       label:"🫁 Imagem (RX, TC, USG, ECG…)", cor:"#1a3d6e", bg:"#d8e6f2", borda:"#b0c8e0"},
                    {key:"laboratorial",label:"🧪 Laboratorial",               cor:"#1a5c3a", bg:"#d8ede2", borda:"#a8d8b8"},
                    {key:"clinica",     label:"🩺 Apresentação Clínica",        cor:"#7a4f1a", bg:"#f6ead8", borda:"#e8cca0"},
                  ].map(cat=>(
                    <div key={cat.key}>
                      <label className="lbl" style={{color:cat.cor}}>{cat.label}</label>
                      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:4,padding:"10px",background:cat.bg,border:`1px solid ${cat.borda}`,borderRadius:4}}>
                        {(form.imagens?.[cat.key]||[]).map(f=>(
                          <div key={f.id} style={{position:"relative",textAlign:"center"}}>
                            <img src={f.src} alt="foto" className="foto-thumb"/>
                            <button onClick={()=>remImgCat(cat.key,f.id)} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",border:"none",background:C.accent,color:"#fff",fontSize:12,cursor:"pointer",lineHeight:"20px",padding:0}}>×</button>
                            <input value={f.legenda} onChange={e=>legImgCat(cat.key,f.id,e.target.value)} placeholder="Legenda…" style={{width:90,marginTop:4,fontSize:11,padding:"3px 6px",border:`1px solid ${cat.borda}`,borderRadius:3,background:"#fff",color:C.ink,fontFamily:"'Source Serif 4',serif"}}/>
                          </div>
                        ))}
                        <div style={{width:90,height:90,border:`2px dashed ${cat.borda}`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:11,color:cat.cor,gap:4,cursor:"pointer",background:"rgba(255,255,255,0.5)"}}
                          onClick={()=>imgCatRef[cat.key].current?.click()}>
                          <span style={{fontSize:22}}>+</span>foto
                          <input ref={imgCatRef[cat.key]} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>addImgCat(cat.key,e)}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{display:"flex",gap:10,marginTop:22,justifyContent:"flex-end"}}>
                <button className="btn" onClick={fecharModal}>Cancelar</button>
                <button className="btnp" onClick={salvarDoenca} disabled={!form.nome.trim()}>{editando?"Salvar alterações":"Cadastrar doença"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ MODAL CASO ESPECIAL ════════════════════════════════════════════ */}
        {modalCaso&&(
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModalCaso(false)}>
            <div className="modal">
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:C.ink,marginBottom:16}}>
                {casoEditId?"Editar Caso":"Novo Caso Especial"}
              </h2>
              <label className="lbl">Título do caso *</label>
              <input className="fi" value={casoForm.titulo} onChange={e=>setCasoForm(p=>({...p,titulo:e.target.value}))} placeholder="Ex: Pancreatite por hipertrigliceridemia em jovem…"/>

              <label className="lbl">Diagnóstico final</label>
              <input className="fi" value={casoForm.diagnostico} onChange={e=>setCasoForm(p=>({...p,diagnostico:e.target.value}))} placeholder="Ex: Pancreatite Aguda + Hipertrigliceridemia familiar"/>

              <label className="lbl">Descrição do caso</label>
              <textarea className="fi" rows={5} value={casoForm.descricao} onChange={e=>setCasoForm(p=>({...p,descricao:e.target.value}))} placeholder="Paciente, apresentação clínica, exames, evolução, conduta…"/>

              <label className="lbl">💡 Aprendizado clínico</label>
              <textarea className="fi" rows={3} value={casoForm.aprendizado} onChange={e=>setCasoForm(p=>({...p,aprendizado:e.target.value}))} placeholder="O que esse caso me ensinou? Apresentação atípica, armadilha diagnóstica…"/>

              <label className="lbl">Data</label>
              <input className="fi" value={casoForm.data} onChange={e=>setCasoForm(p=>({...p,data:e.target.value}))} placeholder="dd/mm/aaaa"/>

              <div style={{display:"flex",gap:10,marginTop:22,justifyContent:"flex-end"}}>
                <button className="btn" onClick={()=>setModalCaso(false)}>Cancelar</button>
                <button className="btnp" onClick={salvarCaso} disabled={!casoForm.titulo.trim()}>Salvar caso</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ FOTO AMPLIADA ══════════════════════════════════════════════════ */}
        {fotoAmpliada&&(
          <div className="overlay" onClick={()=>setFotoAmpliada(null)} style={{background:"rgba(0,0,0,.85)"}}>
            <div style={{maxWidth:800,width:"100%",textAlign:"center"}}>
              <img src={fotoAmpliada.src} alt={fotoAmpliada.legenda} style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:6,objectFit:"contain"}}/>
              {fotoAmpliada.legenda&&<p style={{color:"#ccc",marginTop:12,fontSize:15}}>{fotoAmpliada.legenda}</p>}
              <p style={{color:"#666",marginTop:8,fontSize:13}}>Clique em qualquer lugar para fechar</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
