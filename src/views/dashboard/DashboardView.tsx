import type { Achievement, Page, Role, Student } from "../../models/app";
import { Badge, Button, Icon } from "../shared";

export function StatCard({ label, value, detail, icon, tone = "green" }: { label: string; value: string | number; detail: string; icon: string; tone?: string }) {
  return <div className="stat-card"><div className={`stat-icon tone-${tone}`}><Icon name={icon}/></div><div className="stat-label">{label}</div><strong className="stat-value">{value}</strong><span className="stat-detail">{detail}</span></div>;
}

export function MiniChart({ type = "line" }: { type?: "line" | "bar" }) {
  if (type === "bar") return <div className="bar-chart">{[76,82,80,87,90,88].map((x,i)=><div key={i}><span style={{height:`${x-30}%`}}/><small>{["Sep","Okt","Nov","Des","Jan","Feb"][i]}</small></div>)}</div>;
  return <div className="line-chart"><svg viewBox="0 0 500 150" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#137a5a" stopOpacity=".2"/><stop offset="1" stopColor="#137a5a" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 120 C70 112,80 75,145 88 S240 60,290 72 S385 28,500 38 L500 150 L0 150Z"/><path className="line" d="M0 120 C70 112,80 75,145 88 S240 60,290 72 S385 28,500 38"/></svg><div className="chart-labels"><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span><span>Jan</span><span>Feb</span></div></div>;
}

export function Dashboard({ role, students, achievements, go }: { role: Role; students: Student[]; achievements: Achievement[]; go: (p: Page) => void }) {
  const attention = students.filter(s => s.current < s.previous || s.attendance < 80);
  const pending = achievements.filter(a => role === "admin" ? a.status === "Menunggu Verifikasi" : a.status === "Perlu Revisi");
  return <div className="page">
    <div className="welcome"><div><span className="eyebrow">{role === "admin" ? "DASHBOARD ADMIN" : "RUANG KERJA GURU"}</span><h1>Selamat datang, {role === "admin" ? "Ibu Rahmi" : "Bapak Andi"}</h1><p>Berikut ringkasan aktivitas akademik Semester Genap 2024/2025.</p></div><div className="date-chip"><Icon name="calendar"/><div><small>Hari ini</small><strong>Senin, 24 Februari 2025</strong></div></div></div>
    <div className="stats-grid">{role === "admin" ? <>
      <StatCard label="Total Siswa" value={students.length} detail="3 kelas aktif" icon="users"/><StatCard label="Total Guru" value="8" detail="Semua akun aktif" icon="teacher" tone="blue"/><StatCard label="Kelas Aktif" value="3" detail="Semester Genap" icon="class" tone="purple"/><StatCard label="Prestasi Terverifikasi" value={achievements.filter(a=>a.status==="Terverifikasi").length} detail="Tahun ajaran ini" icon="award" tone="amber"/>
    </> : <><StatCard label="Kelas Diampu" value="2" detail="Kelas A dan B" icon="class"/><StatCard label="Mata Pelajaran" value="2" detail="Matematika, IPA" icon="book" tone="blue"/><StatCard label="Siswa Ditangani" value={students.filter(s=>s.className!=="Kelas C").length} detail="Dari 2 kelas" icon="users" tone="purple"/><StatCard label="Pengajuan Prestasi" value={achievements.length} detail="1 perlu revisi" icon="award" tone="amber"/></>}</div>
    {role === "guru" && <div className="quick-actions"><div><strong>Aksi cepat</strong><span>Lanjutkan pekerjaan utama Anda</span></div><Button icon="edit" onClick={()=>go("grades")}>Input Nilai</Button><Button variant="secondary" icon="calendar" onClick={()=>go("attendance")}>Catat Kehadiran</Button><Button variant="secondary" icon="plus" onClick={()=>go("achievements")}>Tambah Prestasi</Button></div>}
    <div className="dashboard-grid">
      <section className="card chart-card"><div className="card-head"><div><h2>Tren Rata-rata Nilai</h2><p>Perkembangan enam periode terakhir</p></div><Badge status="+3,2 poin"/></div><MiniChart/><div className="chart-summary"><div><span>Rata-rata terkini</span><strong>83,6</strong></div><div><span>Periode sebelumnya</span><strong>80,4</strong></div><div><span>Perubahan</span><strong className="positive">+3,2</strong></div></div></section>
      <section className="card chart-card"><div className="card-head"><div><h2>Tren Kehadiran</h2><p>Persentase kehadiran per bulan</p></div><Badge status="Stabil"/></div><MiniChart type="bar"/><div className="chart-summary"><div><span>Rata-rata hadir</span><strong>88,9%</strong></div><div><span>Target demo</span><strong>≥ 80%</strong></div><div><span>Di bawah batas</span><strong className="danger-text">2 siswa</strong></div></div></section>
    </div>
    <div className="dashboard-grid lower">
      <section className="card"><div className="card-head"><div><h2>Siswa Membutuhkan Perhatian</h2><p>Indikator nilai dan kehadiran terkini</p></div><button className="text-btn" onClick={()=>go("monitoring")}>Lihat semua <Icon name="arrow" size={15}/></button></div>
        <div className="people-list">{attention.map(s=><button className="person-row" key={s.id} onClick={()=>go("monitoring")}><div className="avatar">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div className="person-main"><strong>{s.name}</strong><span>{s.className} · {s.nis}</span></div><div className="reason"><Badge status={s.attendance<80?"Kehadiran Rendah":"Nilai Menurun"}/><small>{s.attendance<80?`${s.attendance}% kehadiran`:`Turun ${s.previous-s.current} poin`}</small></div><Icon name="arrow" size={16}/></button>)}</div>
      </section>
      <section className="card"><div className="card-head"><div><h2>{role==="admin"?"Menunggu Verifikasi":"Perlu Direvisi"}</h2><p>Pengajuan prestasi siswa</p></div><button className="text-btn" onClick={()=>go("achievements")}>Lihat semua <Icon name="arrow" size={15}/></button></div>
        <div className="submission-list">{pending.length ? pending.map(a=><button className="submission-row" key={a.id} onClick={()=>go("achievements")}><div className="submission-icon"><Icon name="award"/></div><div><strong>{a.name}</strong><span>{a.student} · {a.level}</span></div><Badge status={a.status}/></button>) : <div className="empty-small">Tidak ada pengajuan saat ini.</div>}</div>
      </section>
    </div>
  </div>;
}
