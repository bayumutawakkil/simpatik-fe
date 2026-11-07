import { useState } from "react";
import type React from "react";
import type { Student } from "../../models/app";
import { Badge, Button, Field, Icon, PageShell } from "../shared";
import { MiniChart } from "../dashboard/DashboardView";

export function GradesPage({ students, setStudents, notify, readOnly = false }: { students:Student[];setStudents:React.Dispatch<React.SetStateAction<Student[]>>;notify:(m:string)=>void;readOnly?:boolean }) {
  const scoped=students.filter(s=>s.className==="Kelas A"); const [values,setValues]=useState<Record<string,string>>(()=>Object.fromEntries(scoped.map(s=>[s.id,String(s.current)]))); const [dirty,setDirty]=useState(false); const [errors,setErrors]=useState<string[]>([]);
  const save=()=>{const bad=Object.entries(values).filter(([,v])=>Number(v)<0||Number(v)>100||v==="").map(([k])=>k);if(bad.length){setErrors(bad);return;}setStudents(x=>x.map(s=>values[s.id]!==undefined?{...s,current:Number(values[s.id])}:s));setDirty(false);setErrors([]);notify("Nilai berhasil disimpan dan monitoring diperbarui.");};
  const avg=Math.round(Object.values(values).reduce((a,v)=>a+(Number(v)||0),0)/scoped.length*10)/10;
  return <PageShell eyebrow="PENILAIAN AKADEMIK" title={readOnly ? "Data Nilai" : "Input Nilai"} desc={readOnly ? "Lihat data nilai seluruh siswa." : "Isi dan perbarui nilai sesuai penugasan Anda."} action={!readOnly && dirty?<span className="unsaved"><span/>Perubahan belum disimpan</span>:undefined}>
    <div className="card filters-panel"><div className="three-filters"><Field label="Kelas"><select><option>Kelas A</option><option>Kelas B</option></select></Field><Field label="Mata pelajaran"><select><option>Matematika</option><option>IPA</option></select></Field><Field label="Periode"><select><option>Semester Genap · PTS</option><option>Semester Genap · Tugas 1</option></select></Field></div><div className="assumption"><Icon name="help"/><span>Asumsi prototipe: nilai menggunakan rentang 0–100 dan rata-rata aritmetika. Bobot final perlu dikonfirmasi.</span></div></div>
    <div className="grade-layout"><div className="card table-card"><div className="card-head padded"><div><h2>Daftar Nilai Siswa</h2><p>Kelas A · Matematika · PTS</p></div><strong>{scoped.length} siswa</strong></div><div className="table-wrap"><table><thead><tr><th>Siswa</th><th>Nilai sebelumnya</th><th>Nilai saat ini</th><th>Status</th></tr></thead><tbody>{scoped.map(s=><tr key={s.id}><td><div className="student-cell"><div className="avatar">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><button className="student-link">{s.name}</button></div></td><td>{s.previous}</td><td><div><input disabled={readOnly} className={`score-input ${errors.includes(s.id)?"invalid":""}`} type="number" value={values[s.id]} onChange={e=>{setValues({...values,[s.id]:e.target.value});setDirty(true)}}/>{errors.includes(s.id)&&<small className="field-error">Nilai harus 0–100</small>}</div></td><td>{Number(values[s.id])>=75?<Badge status="Tuntas"/>:<Badge status="Perlu Dukungan"/>}</td></tr>)}</tbody></table></div>    {!readOnly && <div className="savebar"><span>{dirty?"Ada nilai yang berubah. Simpan sebelum berpindah halaman.":"Semua perubahan telah tersimpan."}</span><Button icon="check" onClick={save} disabled={!dirty}>Simpan Nilai</Button></div>}</div>
      <aside className="card grade-summary"><span className="eyebrow">RINGKASAN</span><h2>Rata-rata Kelas</h2><strong className="big-number">{avg}</strong><span className="positive">+{Math.max(0,Math.round((avg-82)*10)/10)} dari periode lalu</span><MiniChart/><div className="summary-list"><div><span>Nilai tertinggi</span><strong>{Math.max(...Object.values(values).map(Number))}</strong></div><div><span>Nilai terendah</span><strong>{Math.min(...Object.values(values).map(Number))}</strong></div><div><span>Siswa tuntas</span><strong>{Object.values(values).filter(v=>Number(v)>=75).length} / {scoped.length}</strong></div></div></aside>
    </div>
  </PageShell>;
}

export function AttendancePage({ students, setStudents, notify, readOnly = false }: { students:Student[];setStudents:React.Dispatch<React.SetStateAction<Student[]>>;notify:(m:string)=>void;readOnly?:boolean }) {
  const scoped=students.filter(s=>s.className==="Kelas A"); const [tab,setTab]=useState("Catat Kehadiran"); const [statuses,setStatuses]=useState<Record<string,string>>({});
  const counts=["Hadir","Sakit","Izin","Alpa"].map(k=>({k,n:Object.values(statuses).filter(x=>x===k).length}));
  const save=()=>{setStudents(x=>x.map(s=>statuses[s.id]?{...s,attendance:statuses[s.id]==="Hadir"?Math.min(100,s.attendance+1):Math.max(0,s.attendance-2)}:s));notify("Kehadiran berhasil disimpan dan rekap diperbarui.");};
  return <PageShell eyebrow="AKADEMIK" title="Kehadiran Siswa" desc={readOnly ? "Lihat rekap kehadiran seluruh siswa." : "Catat kehadiran per pertemuan dengan cepat dan akurat."}>
    <div className="tabs">{["Catat Kehadiran","Riwayat","Rekap"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}</button>)}</div>
    {readOnly ? <div className="card"><div className="history-list">{scoped.map(s=><div className="history-row" key={s.id}><div><strong>{s.name}</strong><span>{s.className} · 12 pertemuan tercatat</span></div><div className="progress"><span><i style={{width:`${s.attendance}%`}}/></span><strong className={s.attendance < 80 ? "danger-text" : ""}>{s.attendance}%</strong></div>{s.attendance < 80 && <Badge status="Kehadiran Rendah"/>}</div>)}</div></div> : tab === "Catat Kehadiran" ? (
      <>
        <div className="card filters-panel">
          <div className="three-filters">
            <Field label="Kelas"><select><option>Kelas A</option></select></Field>
            <Field label="Mata pelajaran"><select><option>Matematika</option></select></Field>
            <Field label="Tanggal pertemuan"><input type="date" defaultValue="2025-02-24"/></Field>
          </div>
        </div>
        <div className="attendance-summary">
          {counts.map((item,index)=><div className="summary-chip" key={item.k}><span className={`status-color c${index}`}/><div><small>{item.k}</small><strong>{item.n}</strong></div></div>)}
          <div className="summary-chip"><span className="status-color c4"/><div><small>Belum Diisi</small><strong>{scoped.length-Object.keys(statuses).length}</strong></div></div>
        </div>
        <div className="card attendance-card">
          <div className="card-head padded"><div><h2>Daftar Siswa · Kelas A</h2><p>Senin, 24 Februari 2025</p></div><Button variant="secondary" icon="check" onClick={()=>setStatuses(Object.fromEntries(scoped.map(s=>[s.id,"Hadir"])))}>Tandai Semua Hadir</Button></div>
          <div className="attendance-list">
            {scoped.map(s=><div className="attendance-row" key={s.id}><div className="student-cell"><div className="avatar">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><strong>{s.name}</strong><span>{s.nis}</span></div></div><div className="attendance-options">{["Hadir","Sakit","Izin","Alpa"].map(x=><button className={statuses[s.id]===x?`selected ${x.toLowerCase()}`:""} onClick={()=>setStatuses({...statuses,[s.id]:x})} key={x}>{x}</button>)}</div></div>)}
          </div>
          <div className="savebar"><span>{Object.keys(statuses).length < scoped.length ? `${scoped.length-Object.keys(statuses).length} siswa belum diisi` : "Semua siswa telah diisi"}</span><Button onClick={save}>Simpan Kehadiran</Button></div>
        </div>
      </>
    ) : (
      <div className="card"><div className="history-list">{scoped.map(s=><div className="history-row" key={s.id}><div><strong>{s.name}</strong><span>{s.className} · 12 pertemuan tercatat</span></div><div className="progress"><span><i style={{width:`${s.attendance}%`}}/></span><strong className={s.attendance < 80 ? "danger-text" : ""}>{s.attendance}%</strong></div>{s.attendance < 80 && <Badge status="Kehadiran Rendah"/>}</div>)}</div></div>
    )}
    <div className="assumption page-note"><Icon name="help"/><span>Asumsi demo: persentase = Hadir ÷ pertemuan tercatat. Belum Diisi tidak dihitung; peringatan muncul di bawah 80%.</span></div>
  </PageShell>;
}
