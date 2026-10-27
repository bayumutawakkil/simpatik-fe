import { useMemo, useState } from "react";

type Role = "admin" | "guru";
type Page = "dashboard" | "students" | "teachers" | "classes" | "subjects" | "assignments" | "grades" | "attendance" | "achievements" | "monitoring" | "reports" | "security" | "help";
type Student = { id: number; nis: string; name: string; className: string; status: string; current: number; previous: number; attendance: number; achievements: number };
type Achievement = { id: number; student: string; name: string; field: string; level: string; date: string; result: string; status: "Menunggu Verifikasi" | "Perlu Revisi" | "Terverifikasi"; note?: string };
type Toast = { type: "success" | "error"; message: string } | null;

const studentsSeed: Student[] = [
  { id: 1, nis: "2024001", name: "Aulia Rahma", className: "Kelas A", status: "Aktif", current: 88, previous: 84, attendance: 96, achievements: 1 },
  { id: 2, nis: "2024002", name: "Fikri Ramadhan", className: "Kelas A", status: "Aktif", current: 72, previous: 81, attendance: 92, achievements: 0 },
  { id: 3, nis: "2024003", name: "Nabila Putri", className: "Kelas A", status: "Aktif", current: 86, previous: 83, attendance: 76, achievements: 1 },
  { id: 4, nis: "2024004", name: "Rizky Maulana", className: "Kelas B", status: "Aktif", current: 79, previous: 77, attendance: 88, achievements: 0 },
  { id: 5, nis: "2024005", name: "Siti Khadijah", className: "Kelas B", status: "Aktif", current: 91, previous: 87, attendance: 100, achievements: 1 },
  { id: 6, nis: "2024006", name: "Daffa Alfarizi", className: "Kelas C", status: "Aktif", current: 75, previous: 78, attendance: 72, achievements: 0 },
];

const achievementsSeed: Achievement[] = [
  { id: 1, student: "Aulia Rahma", name: "Juara 1 Tahfiz", field: "Keagamaan", level: "Kota", date: "12 Jan 2025", result: "Juara 1", status: "Terverifikasi" },
  { id: 2, student: "Nabila Putri", name: "Olimpiade Matematika", field: "Akademik", level: "Provinsi", date: "18 Feb 2025", result: "Finalis", status: "Menunggu Verifikasi" },
  { id: 3, student: "Siti Khadijah", name: "Lomba Pidato", field: "Bahasa", level: "Kota", date: "03 Mar 2025", result: "Juara 2", status: "Perlu Revisi", note: "Mohon unggah sertifikat yang terlihat utuh dan jelas." },
];

const adminMenu: { page: Page; label: string; icon: string; group?: string }[] = [
  { page: "dashboard", label: "Dashboard", icon: "grid" },
  { page: "students", label: "Siswa", icon: "users", group: "DATA MASTER" },
  { page: "teachers", label: "Guru dan Akun", icon: "teacher" },
  { page: "classes", label: "Kelas", icon: "class" },
  { page: "subjects", label: "Mata Pelajaran", icon: "book" },
  { page: "assignments", label: "Penugasan Guru", icon: "link" },
  { page: "achievements", label: "Prestasi", icon: "award", group: "AKADEMIK" },
  { page: "monitoring", label: "Monitoring Siswa", icon: "chart" },
  { page: "reports", label: "Laporan", icon: "file" },
  { page: "security", label: "Akun dan Keamanan", icon: "shield", group: "PENGATURAN" },
  { page: "help", label: "Bantuan", icon: "help" },
];
const guruMenu: typeof adminMenu = [
  { page: "dashboard", label: "Dashboard", icon: "grid" },
  { page: "students", label: "Siswa Saya", icon: "users" },
  { page: "grades", label: "Penilaian", icon: "edit", group: "AKADEMIK" },
  { page: "attendance", label: "Kehadiran", icon: "calendar" },
  { page: "achievements", label: "Prestasi", icon: "award" },
  { page: "monitoring", label: "Monitoring Siswa", icon: "chart" },
  { page: "reports", label: "Laporan", icon: "file" },
  { page: "security", label: "Akun dan Keamanan", icon: "shield", group: "PENGATURAN" },
  { page: "help", label: "Bantuan", icon: "help" },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    teacher: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0M18 4l3-1v6"/></>,
    class: <><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M7 9h4M7 13h7"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M8 7h8M8 11h6"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M8.2 13 7 22l5-3 5 3-1.2-9"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 5-7"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    help: <><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4M12 18h.01"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.grid}</svg>;
}

function Button({ children, variant = "primary", icon, onClick, type = "button", disabled = false }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  return <button type={type} className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={17}/>}<span>{children}</span></button>;
}
function Badge({ status }: { status: string }) {
  const kind = status.includes("Terverifikasi") || status === "Aktif" || status === "Hadir" ? "success" : status.includes("Revisi") || status === "Alpa" ? "danger" : status.includes("Menunggu") || status === "Izin" ? "warning" : "neutral";
  return <span className={`badge badge-${kind}`}><span className="badge-dot"/>{status}</span>;
}
function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return <label className="field"><span>{label}</span>{children}{error && <small className="field-error">{error}</small>}</label>;
}
function Modal({ title, children, onClose, footer }: { title: string; children: React.ReactNode; onClose: () => void; footer?: React.ReactNode }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">SIMPATIK</span><h2>{title}</h2></div><button className="icon-btn" onClick={onClose}>×</button></div><div className="modal-body">{children}</div>{footer && <div className="modal-foot">{footer}</div>}</div></div>;
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setError("Username dan password wajib diisi.");
    try {
      const r = await fetch("http://localhost:4000/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: username.includes("@") ? username : `${username}@simpatik.local`, password }) });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j?.error?.message || "Login gagal");
      localStorage.setItem("token", j.data.accessToken);
      onLogin(j.data.user.role === "ADMIN" ? "admin" : "guru");
    } catch (err: any) { setError(err.message || "Username atau password tidak sesuai. Silakan coba kembali."); }
  };
  const fill = (role: Role) => { setUsername(role); setPassword(role === "admin" ? "admin123" : "guru123"); setError(""); };
  return <div className="login-page">
    <div className="login-brand">
      <div className="brand-lockup"><div className="brand-logo">S</div><div><strong>SIMPATIK</strong><span>Yayasan Ishlahul Ummah</span></div></div>
      <div className="login-copy"><span className="login-kicker">Sistem informasi terpadu</span><h1>Pendidikan lebih terarah, dalam satu ruang kerja.</h1><p>Kelola data akademik, pantau perkembangan siswa, dan buat keputusan dengan lebih mudah.</p></div>
      <div className="login-location">Kota Sawahlunto, Sumatera Barat</div>
    </div>
    <main className="login-panel"><div className="login-card">
      <div className="mobile-brand"><div className="brand-logo">S</div><strong>SIMPATIK</strong></div>
      <span className="eyebrow">SELAMAT DATANG</span><h2>Masuk ke akun Anda</h2><p className="muted">Gunakan akun yang telah terdaftar untuk melanjutkan.</p>
      <form onSubmit={submit}>
        <Field label="Username"><input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" /></Field>
        <Field label="Password"><div className="input-wrap"><input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="Masukkan password"/><button type="button" className="input-icon" onClick={() => setShow(!show)}><Icon name="eye"/></button></div></Field>
        {error && <div className="alert error"><Icon name="alert"/><span>{error}</span></div>}
        <Button type="submit">Masuk ke SIMPATIK</Button>
      </form>
      <div className="demo-box"><div><strong>Akun demo</strong><span>Pilih peran untuk mengisi kredensial</span></div><div className="demo-actions"><Button variant="secondary" onClick={() => fill("admin")}>Demo Admin</Button><Button variant="secondary" onClick={() => fill("guru")}>Demo Guru</Button></div></div>
      <p className="login-help">Butuh bantuan? Hubungi administrator sekolah.</p>
    </div></main>
  </div>;
}

function StatCard({ label, value, detail, icon, tone = "green" }: { label: string; value: string | number; detail: string; icon: string; tone?: string }) {
  return <div className="stat-card"><div className={`stat-icon tone-${tone}`}><Icon name={icon}/></div><div className="stat-label">{label}</div><strong className="stat-value">{value}</strong><span className="stat-detail">{detail}</span></div>;
}
function MiniChart({ type = "line" }: { type?: "line" | "bar" }) {
  if (type === "bar") return <div className="bar-chart">{[76,82,80,87,90,88].map((x,i)=><div key={i}><span style={{height:`${x-30}%`}}/><small>{["Sep","Okt","Nov","Des","Jan","Feb"][i]}</small></div>)}</div>;
  return <div className="line-chart"><svg viewBox="0 0 500 150" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#137a5a" stopOpacity=".2"/><stop offset="1" stopColor="#137a5a" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 120 C70 112,80 75,145 88 S240 60,290 72 S385 28,500 38 L500 150 L0 150Z"/><path className="line" d="M0 120 C70 112,80 75,145 88 S240 60,290 72 S385 28,500 38"/></svg><div className="chart-labels"><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span><span>Jan</span><span>Feb</span></div></div>;
}

function Dashboard({ role, students, achievements, go }: { role: Role; students: Student[]; achievements: Achievement[]; go: (p: Page) => void }) {
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

function StudentsPage({ role, students, setStudents, notify }: { role: Role; students: Student[]; setStudents: React.Dispatch<React.SetStateAction<Student[]>>; notify: (m:string)=>void }) {
  const [query,setQuery]=useState(""); const [klass,setKlass]=useState("Semua Kelas"); const [modal,setModal]=useState(false); const [edit,setEdit]=useState<Student|null>(null); const [confirm,setConfirm]=useState<Student|null>(null);
  const filtered=students.filter(s=>(klass==="Semua Kelas"||s.className===klass)&&s.name.toLowerCase().includes(query.toLowerCase()));
  const save=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault(); const f=new FormData(e.currentTarget); const name=String(f.get("name")); const nis=String(f.get("nis")); const className=String(f.get("class")); if(edit)setStudents(x=>x.map(s=>s.id===edit.id?{...s,name,nis,className}:s));else setStudents(x=>[...x,{id:Date.now(),name,nis,className,status:"Aktif",current:0,previous:0,attendance:0,achievements:0}]);setModal(false);setEdit(null);notify("Data siswa berhasil disimpan.");};
  return <PageShell eyebrow={role==="admin"?"DATA MASTER":"AKADEMIK"} title={role==="admin"?"Data Siswa":"Siswa Saya"} desc={role==="admin"?"Kelola identitas dan penempatan kelas siswa.":"Siswa dari kelas dan mata pelajaran yang Anda ampu."} action={role==="admin"?<Button icon="plus" onClick={()=>setModal(true)}>Tambah Siswa</Button>:undefined}>
    <div className="card table-card"><div className="filterbar"><div className="search"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari nama siswa..."/></div><select value={klass} onChange={e=>setKlass(e.target.value)}><option>Semua Kelas</option><option>Kelas A</option><option>Kelas B</option><option>Kelas C</option></select><span className="result-count">{filtered.length} siswa ditemukan</span></div>
      {filtered.length?<div className="table-wrap"><table><thead><tr><th>Siswa</th><th>Nomor Induk</th><th>Kelas</th><th>Status</th><th>Ringkasan</th><th/></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td><div className="student-cell"><div className="avatar">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><strong>{s.name}</strong></div></td><td>{s.nis}</td><td>{s.className}</td><td><Badge status={s.status}/></td><td><span className={s.attendance<80?"danger-text":""}>Nilai {s.current || "—"} · Hadir {s.attendance || "—"}%</span></td><td><div className="row-actions"><button onClick={()=>notify(`Detail ${s.name} dibuka.`)}>Lihat</button>{role==="admin"&&<><button onClick={()=>{setEdit(s);setModal(true)}}>Ubah</button><button className="delete" onClick={()=>setConfirm(s)}>Hapus</button></>}</div></td></tr>)}</tbody></table></div>:<Empty title="Siswa tidak ditemukan" desc="Coba ubah kata kunci atau filter kelas yang digunakan."/>}
      <div className="pagination"><span>Menampilkan 1–{filtered.length} dari {filtered.length} data</span><div><button disabled>‹</button><button className="active">1</button><button disabled>›</button></div></div>
    </div>
    {modal&&<Modal title={edit?"Ubah Data Siswa":"Tambah Siswa"} onClose={()=>{setModal(false);setEdit(null)}} footer={<><Button variant="secondary" onClick={()=>setModal(false)}>Batal</Button><Button type="submit" onClick={()=>document.getElementById("student-form")?.dispatchEvent(new Event("submit",{cancelable:true,bubbles:true}))}>Simpan Data</Button></>}><form id="student-form" onSubmit={save} className="form-grid"><Field label="Nama lengkap"><input name="name" required defaultValue={edit?.name} placeholder="Nama siswa"/></Field><Field label="Nomor induk siswa"><input name="nis" required defaultValue={edit?.nis} placeholder="Contoh: 2024007"/></Field><Field label="Penempatan kelas"><select name="class" defaultValue={edit?.className||"Kelas A"}><option>Kelas A</option><option>Kelas B</option><option>Kelas C</option></select></Field><Field label="Status"><select disabled><option>Aktif</option></select></Field></form></Modal>}
    {confirm&&<Modal title="Hapus data siswa?" onClose={()=>setConfirm(null)} footer={<><Button variant="secondary" onClick={()=>setConfirm(null)}>Batal</Button><Button variant="danger" onClick={()=>{setStudents(x=>x.filter(s=>s.id!==confirm.id));setConfirm(null);notify("Data siswa berhasil dihapus.")}}>Ya, Hapus</Button></>}><div className="confirm-content"><div className="confirm-icon"><Icon name="alert"/></div><p>Data <strong>{confirm.name}</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.</p></div></Modal>}
  </PageShell>;
}

function MasterPage({ type, notify }: { type: "teachers"|"classes"|"subjects"|"assignments"; notify:(m:string)=>void }) {
  const config={
    teachers:{eyebrow:"DATA MASTER",title:"Guru dan Akun",desc:"Kelola data guru, kredensial, dan ringkasan penugasan.",button:"Tambah Guru",heads:["Guru","Identitas Guru","Username","Penugasan"],rows:[["Andi Saputra, S.Pd.","GR-001","andi.saputra","2 kelas · 2 mapel"],["Nurhayati, S.Pd.","GR-002","nurhayati","1 kelas · 1 mapel"],["M. Ridwan, S.Ag.","GR-003","m.ridwan","3 kelas · 1 mapel"]]},
    classes:{eyebrow:"DATA MASTER",title:"Data Kelas",desc:"Kelola kelas, siswa, dan guru yang mengajar.",button:"Tambah Kelas",heads:["Nama Kelas","Jumlah Siswa","Guru Mengajar","Status"],rows:[["Kelas A","3 siswa","4 guru","Aktif"],["Kelas B","2 siswa","3 guru","Aktif"],["Kelas C","1 siswa","3 guru","Aktif"]]},
    subjects:{eyebrow:"DATA MASTER",title:"Mata Pelajaran",desc:"Kelola kode dan nama mata pelajaran.",button:"Tambah Mata Pelajaran",heads:["Kode","Mata Pelajaran","Jumlah Penugasan","Status"],rows:[["MTK","Matematika","2 penugasan","Aktif"],["IPA","Ilmu Pengetahuan Alam","2 penugasan","Aktif"],["PAI","Pendidikan Agama Islam","3 penugasan","Aktif"]]},
    assignments:{eyebrow:"AKSES GURU",title:"Penugasan Guru",desc:"Hubungkan guru, kelas, dan mata pelajaran untuk menentukan akses.",button:"Buat Penugasan",heads:["Guru","Kelas","Mata Pelajaran","Semester"],rows:[["Andi Saputra, S.Pd.","Kelas A","Matematika","Genap 2024/2025"],["Andi Saputra, S.Pd.","Kelas B","IPA","Genap 2024/2025"],["Nurhayati, S.Pd.","Kelas A","Bahasa Indonesia","Genap 2024/2025"]]}
  }[type]; const [open,setOpen]=useState(false);
  return <PageShell eyebrow={config.eyebrow} title={config.title} desc={config.desc} action={<Button icon="plus" onClick={()=>setOpen(true)}>{config.button}</Button>}><div className="card table-card"><div className="filterbar"><div className="search"><Icon name="search"/><input placeholder={`Cari ${config.title.toLowerCase()}...`}/></div><select><option>Semua Status</option><option>Aktif</option></select></div><div className="table-wrap"><table><thead><tr>{config.heads.map(h=><th key={h}>{h}</th>)}<th/></tr></thead><tbody>{config.rows.map((r,i)=><tr key={i}>{r.map((x,j)=><td key={j}>{j===0?<strong>{x}</strong>:j===r.length-1&&x==="Aktif"?<Badge status={x}/>:x}</td>)}<td><div className="row-actions"><button onClick={()=>notify("Detail data dibuka.")}>Lihat</button><button onClick={()=>setOpen(true)}>Ubah</button><button className="delete" onClick={()=>notify("Data masih terhubung dan tidak dapat dihapus.")}>Hapus</button></div></td></tr>)}</tbody></table></div></div>
  {open&&<Modal title={config.button} onClose={()=>setOpen(false)} footer={<><Button variant="secondary" onClick={()=>setOpen(false)}>Batal</Button><Button onClick={()=>{setOpen(false);notify("Data berhasil disimpan.")}}>Simpan</Button></>}><div className="form-grid"><Field label={type==="assignments"?"Pilih guru":"Nama"}><input placeholder="Masukkan data"/></Field><Field label={type==="assignments"?"Pilih kelas":"Kode / Identitas"}><select><option>Pilih data</option><option>Kelas A</option><option>Kelas B</option></select></Field>{type==="assignments"&&<Field label="Mata pelajaran"><select><option>Matematika</option><option>IPA</option></select></Field>}</div></Modal>}</PageShell>;
}

function GradesPage({ students, setStudents, notify }: { students:Student[];setStudents:React.Dispatch<React.SetStateAction<Student[]>>;notify:(m:string)=>void }) {
  const scoped=students.filter(s=>s.className==="Kelas A"); const [values,setValues]=useState<Record<number,string>>(()=>Object.fromEntries(scoped.map(s=>[s.id,String(s.current)]))); const [dirty,setDirty]=useState(false); const [errors,setErrors]=useState<number[]>([]);
  const save=()=>{const bad=Object.entries(values).filter(([,v])=>Number(v)<0||Number(v)>100||v==="").map(([k])=>Number(k));if(bad.length){setErrors(bad);return;}setStudents(x=>x.map(s=>values[s.id]!==undefined?{...s,current:Number(values[s.id])}:s));setDirty(false);setErrors([]);notify("Nilai berhasil disimpan dan monitoring diperbarui.");};
  const avg=Math.round(Object.values(values).reduce((a,v)=>a+(Number(v)||0),0)/scoped.length*10)/10;
  return <PageShell eyebrow="PENILAIAN AKADEMIK" title="Input Nilai" desc="Isi dan perbarui nilai sesuai penugasan Anda." action={dirty?<span className="unsaved"><span/>Perubahan belum disimpan</span>:undefined}>
    <div className="card filters-panel"><div className="three-filters"><Field label="Kelas"><select><option>Kelas A</option><option>Kelas B</option></select></Field><Field label="Mata pelajaran"><select><option>Matematika</option><option>IPA</option></select></Field><Field label="Periode"><select><option>Semester Genap · PTS</option><option>Semester Genap · Tugas 1</option></select></Field></div><div className="assumption"><Icon name="help"/><span>Asumsi prototipe: nilai menggunakan rentang 0–100 dan rata-rata aritmetika. Bobot final perlu dikonfirmasi.</span></div></div>
    <div className="grade-layout"><div className="card table-card"><div className="card-head padded"><div><h2>Daftar Nilai Siswa</h2><p>Kelas A · Matematika · PTS</p></div><strong>{scoped.length} siswa</strong></div><div className="table-wrap"><table><thead><tr><th>Siswa</th><th>Nilai sebelumnya</th><th>Nilai saat ini</th><th>Status</th></tr></thead><tbody>{scoped.map(s=><tr key={s.id}><td><div className="student-cell"><div className="avatar">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><button className="student-link">{s.name}</button></div></td><td>{s.previous}</td><td><div><input className={`score-input ${errors.includes(s.id)?"invalid":""}`} type="number" value={values[s.id]} onChange={e=>{setValues({...values,[s.id]:e.target.value});setDirty(true)}}/>{errors.includes(s.id)&&<small className="field-error">Nilai harus 0–100</small>}</div></td><td>{Number(values[s.id])>=75?<Badge status="Tuntas"/>:<Badge status="Perlu Dukungan"/>}</td></tr>)}</tbody></table></div><div className="savebar"><span>{dirty?"Ada nilai yang berubah. Simpan sebelum berpindah halaman.":"Semua perubahan telah tersimpan."}</span><Button icon="check" onClick={save} disabled={!dirty}>Simpan Nilai</Button></div></div>
      <aside className="card grade-summary"><span className="eyebrow">RINGKASAN</span><h2>Rata-rata Kelas</h2><strong className="big-number">{avg}</strong><span className="positive">+{Math.max(0,Math.round((avg-82)*10)/10)} dari periode lalu</span><MiniChart/><div className="summary-list"><div><span>Nilai tertinggi</span><strong>{Math.max(...Object.values(values).map(Number))}</strong></div><div><span>Nilai terendah</span><strong>{Math.min(...Object.values(values).map(Number))}</strong></div><div><span>Siswa tuntas</span><strong>{Object.values(values).filter(v=>Number(v)>=75).length} / {scoped.length}</strong></div></div></aside>
    </div>
  </PageShell>;
}

function AttendancePage({ students, setStudents, notify }: { students:Student[];setStudents:React.Dispatch<React.SetStateAction<Student[]>>;notify:(m:string)=>void }) {
  const scoped=students.filter(s=>s.className==="Kelas A"); const [tab,setTab]=useState("Catat Kehadiran"); const [statuses,setStatuses]=useState<Record<number,string>>({});
  const counts=["Hadir","Sakit","Izin","Alpa"].map(k=>({k,n:Object.values(statuses).filter(x=>x===k).length}));
  const save=()=>{setStudents(x=>x.map(s=>statuses[s.id]?{...s,attendance:statuses[s.id]==="Hadir"?Math.min(100,s.attendance+1):Math.max(0,s.attendance-2)}:s));notify("Kehadiran berhasil disimpan dan rekap diperbarui.");};
  return <PageShell eyebrow="AKADEMIK" title="Kehadiran Siswa" desc="Catat kehadiran per pertemuan dengan cepat dan akurat.">
    <div className="tabs">{["Catat Kehadiran","Riwayat","Rekap"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}</button>)}</div>
    {tab === "Catat Kehadiran" ? (
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

function AchievementsPage({ role, achievements, setAchievements, students, notify }: { role:Role;achievements:Achievement[];setAchievements:React.Dispatch<React.SetStateAction<Achievement[]>>;students:Student[];notify:(m:string)=>void }) {
  const [status,setStatus]=useState("Semua Status"); const [selected,setSelected]=useState<Achievement|null>(null); const [add,setAdd]=useState(false); const list=achievements.filter(a=>status==="Semua Status"||a.status===status);
  const update=(s:Achievement["status"])=>{if(!selected)return;setAchievements(x=>x.map(a=>a.id===selected.id?{...a,status:s,note:s==="Perlu Revisi"?"Mohon unggah bukti yang lebih jelas dan lengkap.":a.note}:a));setSelected(null);notify(s==="Terverifikasi"?"Prestasi berhasil diverifikasi.":"Pengajuan dikembalikan untuk revisi.");};
  return <PageShell eyebrow="PRESTASI SISWA" title={role==="admin"?"Verifikasi Prestasi":"Pengajuan Prestasi"} desc={role==="admin"?"Periksa bukti dan verifikasi pengajuan dari Guru.":"Ajukan dan pantau status prestasi siswa."} action={role==="guru"?<Button icon="plus" onClick={()=>setAdd(true)}>Tambah Prestasi</Button>:undefined}>
    <div className="stats-grid compact"><StatCard label="Menunggu Verifikasi" value={achievements.filter(a=>a.status==="Menunggu Verifikasi").length} detail="Perlu diperiksa" icon="calendar" tone="amber"/><StatCard label="Perlu Revisi" value={achievements.filter(a=>a.status==="Perlu Revisi").length} detail="Menunggu perbaikan" icon="alert" tone="red"/><StatCard label="Terverifikasi" value={achievements.filter(a=>a.status==="Terverifikasi").length} detail="Telah disetujui" icon="check"/></div>
    <div className="card table-card"><div className="filterbar"><div className="search"><Icon name="search"/><input placeholder="Cari prestasi atau siswa..."/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option>Semua Status</option><option>Menunggu Verifikasi</option><option>Perlu Revisi</option><option>Terverifikasi</option></select><select><option>Semua Bidang</option><option>Akademik</option><option>Keagamaan</option></select></div><div className="table-wrap"><table><thead><tr><th>Siswa</th><th>Prestasi</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th/></tr></thead><tbody>{list.map(a=><tr key={a.id}><td><strong>{a.student}</strong></td><td><strong>{a.name}</strong><small className="cell-sub">{a.result}</small></td><td>{a.field} · {a.level}</td><td>{a.date}</td><td><Badge status={a.status}/></td><td><button className="text-btn" onClick={()=>setSelected(a)}>Lihat detail <Icon name="arrow" size={14}/></button></td></tr>)}</tbody></table></div></div>
    {selected&&<Modal title="Detail Pengajuan Prestasi" onClose={()=>setSelected(null)} footer={role==="admin"&&selected.status==="Menunggu Verifikasi"?<><Button variant="secondary" onClick={()=>update("Perlu Revisi")}>Kembalikan untuk Revisi</Button><Button onClick={()=>update("Terverifikasi")}>Verifikasi Prestasi</Button></>:role==="guru"&&selected.status==="Perlu Revisi"?<Button onClick={()=>update("Menunggu Verifikasi")}>Revisi & Ajukan Kembali</Button>:undefined}><div className="achievement-detail"><div className="detail-hero"><div className="submission-icon large"><Icon name="award" size={28}/></div><div><Badge status={selected.status}/><h3>{selected.name}</h3><p>{selected.student} · {selected.field} · Tingkat {selected.level}</p></div></div>{selected.note&&<div className="admin-note"><Icon name="alert"/><div><strong>Catatan Admin</strong><p>{selected.note}</p></div></div>}<div className="detail-grid"><div><span>Pencapaian</span><strong>{selected.result}</strong></div><div><span>Tanggal kegiatan</span><strong>{selected.date}</strong></div><div><span>Bukti pendukung</span><strong>sertifikat-prestasi.pdf</strong></div><div><span>Riwayat</span><strong>Diajukan oleh Guru</strong></div></div><div className="proof"><Icon name="file" size={32}/><div><strong>Pratinjau Bukti</strong><span>Dokumen PDF · 1,2 MB</span></div><Button variant="secondary">Lihat Bukti</Button></div></div></Modal>}
    {add&&<Modal title="Tambah Pengajuan Prestasi" onClose={()=>setAdd(false)} footer={<><Button variant="secondary" onClick={()=>setAdd(false)}>Simpan Draf</Button><Button onClick={()=>{setAchievements(x=>[...x,{id:Date.now(),student:students[0].name,name:"Festival Sains Pelajar",field:"Akademik",level:"Kota",date:"24 Feb 2025",result:"Juara Harapan",status:"Menunggu Verifikasi"}]);setAdd(false);notify("Prestasi berhasil diajukan untuk verifikasi.")}}>Ajukan Prestasi</Button></>}><div className="form-grid"><Field label="Siswa"><select>{students.slice(0,4).map(s=><option key={s.id}>{s.name}</option>)}</select></Field><Field label="Nama prestasi"><input placeholder="Contoh: Juara 1 Tahfiz"/></Field><Field label="Bidang"><select><option>Akademik</option><option>Keagamaan</option><option>Olahraga</option></select></Field><Field label="Tingkat kompetisi"><select><option>Kota</option><option>Provinsi</option><option>Nasional</option></select></Field><Field label="Pencapaian"><input placeholder="Contoh: Juara 1"/></Field><Field label="Tanggal"><input type="date"/></Field><label className="upload"><Icon name="file"/><strong>Unggah sertifikat atau bukti</strong><span>PDF, JPG, atau PNG · Maks. 5 MB</span></label></div></Modal>}
  </PageShell>;
}

function MonitoringPage({ students }: { students:Student[] }) {
  const [klass,setKlass]=useState("Semua Kelas"); const [detail,setDetail]=useState<Student|null>(null); const list=students.filter(s=>klass==="Semua Kelas"||s.className===klass);
  return <PageShell eyebrow="MONITORING" title="Perkembangan Siswa" desc="Lihat nilai, kehadiran, dan prestasi sebagai indikator yang saling melengkapi."><div className="card table-card"><div className="filterbar"><div className="search"><Icon name="search"/><input placeholder="Cari nama siswa..."/></div><select value={klass} onChange={e=>setKlass(e.target.value)}><option>Semua Kelas</option><option>Kelas A</option><option>Kelas B</option><option>Kelas C</option></select><select><option>Semester Genap 2024/2025</option></select></div><div className="table-wrap"><table><thead><tr><th>Siswa</th><th>Kelas</th><th>Rata-rata Nilai</th><th>Kehadiran</th><th>Prestasi</th><th>Indikator</th><th/></tr></thead><tbody>{list.map(s=>{const reason=s.attendance<80?"Kehadiran Rendah":s.current<s.previous?"Nilai Menurun":"Perkembangan Baik";return <tr key={s.id}><td><div className="student-cell"><div className="avatar">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><strong>{s.name}</strong><small className="cell-sub">{s.nis}</small></div></div></td><td>{s.className}</td><td><strong>{s.current}</strong><small className={`cell-sub ${s.current<s.previous?"danger-text":"positive"}`}>{s.current-s.previous>=0?"+":""}{s.current-s.previous} poin</small></td><td><strong className={s.attendance<80?"danger-text":""}>{s.attendance}%</strong></td><td>{s.achievements} terverifikasi</td><td><Badge status={reason}/></td><td><button className="text-btn" onClick={()=>setDetail(s)}>Detail <Icon name="arrow" size={14}/></button></td></tr>})}</tbody></table></div></div>
  <div className="assumption page-note"><Icon name="help"/><span>Penurunan nilai berarti rata-rata periode berjalan lebih rendah dari periode sebelumnya. Skor perkembangan gabungan belum ditetapkan.</span></div>
  {detail&&<Modal title="Detail Perkembangan Siswa" onClose={()=>setDetail(null)}><div className="student-profile"><div className="profile-head"><div className="avatar large">{detail.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><h3>{detail.name}</h3><p>{detail.nis} · {detail.className}</p></div></div><div className="profile-stats"><div><span>Rata-rata nilai</span><strong>{detail.current}</strong><small className={detail.current<detail.previous?"danger-text":"positive"}>{detail.current-detail.previous} poin</small></div><div><span>Kehadiran</span><strong>{detail.attendance}%</strong><small>12 pertemuan</small></div><div><span>Prestasi</span><strong>{detail.achievements}</strong><small>Terverifikasi</small></div></div><div className="tabs mini"><button className="active">Ringkasan</button><button>Nilai</button><button>Kehadiran</button><button>Prestasi</button></div><div className="profile-chart"><h3>Grafik nilai per periode</h3><MiniChart/></div>{(detail.attendance<80||detail.current<detail.previous)&&<div className="admin-note"><Icon name="alert"/><div><strong>Alasan perhatian</strong><p>{detail.attendance<80?`Kehadiran ${detail.attendance}% berada di bawah ambang demo 80%.`:`Nilai turun ${detail.previous-detail.current} poin dibanding periode sebelumnya.`}</p></div></div>}</div></Modal>}</PageShell>;
}

function ReportsPage({ role, students, notify }: { role:Role;students:Student[];notify:(m:string)=>void }) {
  const [shown,setShown]=useState(false); const [type,setType]=useState("Data Siswa");
  const exportCsv=()=>{const csv=["Nama,NIS,Kelas,Nilai,Kehadiran",...students.map(s=>`${s.name},${s.nis},${s.className},${s.current},${s.attendance}%`)].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="laporan-simpatik.csv";a.click();notify("Laporan CSV berhasil diekspor.");};
  return <PageShell eyebrow="LAPORAN" title="Pusat Laporan" desc={`Tampilkan dan ekspor data ${role==="guru"?"sesuai penugasan Anda":"seluruh sekolah"}.`}><div className="card report-filter"><div className="card-head"><div><h2>Atur Laporan</h2><p>Pilih jenis laporan dan filter yang diperlukan.</p></div></div><div className="four-filters"><Field label="Jenis laporan"><select value={type} onChange={e=>setType(e.target.value)}><option>Data Siswa</option><option>Nilai</option><option>Kehadiran</option><option>Prestasi</option></select></Field><Field label="Kelas"><select><option>Semua Kelas</option><option>Kelas A</option><option>Kelas B</option></select></Field><Field label="Mata pelajaran"><select><option>Semua Mata Pelajaran</option><option>Matematika</option></select></Field><Field label="Periode"><select><option>Semester Genap 2024/2025</option></select></Field></div><div className="report-actions"><Button variant="ghost" onClick={()=>setShown(false)}>Reset Filter</Button><Button onClick={()=>setShown(true)}>Tampilkan Laporan</Button></div></div>
  {shown?<div className="card table-card"><div className="card-head padded"><div><span className="eyebrow">PRATINJAU LAPORAN</span><h2>{type}</h2><p>Semua Kelas · Semester Genap 2024/2025 · {students.length} data</p></div><Button variant="secondary" icon="download" onClick={exportCsv}>Ekspor CSV</Button></div><div className="active-filters"><span>Filter aktif:</span><Badge status="Semua Kelas"/><Badge status="Semester Genap 2024/2025"/></div><div className="table-wrap"><table><thead><tr><th>Nama Siswa</th><th>NIS</th><th>Kelas</th><th>Nilai</th><th>Kehadiran</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td><strong>{s.name}</strong></td><td>{s.nis}</td><td>{s.className}</td><td>{s.current}</td><td>{s.attendance}%</td></tr>)}</tbody></table></div></div>:<div className="card"><Empty title="Laporan belum ditampilkan" desc="Atur filter di atas, lalu pilih Tampilkan Laporan untuk melihat pratinjau."/></div>}
  </PageShell>;
}

function SecurityPage({ role, logout, notify }: { role:Role;logout:()=>void;notify:(m:string)=>void }) {
  const [old,setOld]=useState("");const [next,setNext]=useState("");const [confirm,setConfirm]=useState("");const [error,setError]=useState("");
  const save=(e:React.FormEvent)=>{e.preventDefault();if(old!==(role==="admin"?"admin123":"guru123"))return setError("Password lama yang Anda masukkan tidak sesuai.");if(next!==confirm)return setError("Konfirmasi password baru tidak cocok.");if(next.length<8)return setError("Password baru minimal 8 karakter.");setError("");setOld("");setNext("");setConfirm("");notify("Password berhasil diubah.");};
  return <PageShell eyebrow="PENGATURAN" title="Akun dan Keamanan" desc="Kelola informasi akun dan keamanan akses Anda."><div className="settings-grid"><div className="card account-card"><div className="profile-head"><div className="avatar profile">{role==="admin"?"RA":"AS"}</div><div><h2>{role==="admin"?"Rahmi Ananda":"Andi Saputra, S.Pd."}</h2><p>{role==="admin"?"Administrator Sistem":"Guru Matematika dan IPA"}</p><Badge status={role==="admin"?"Admin":"Guru"}/></div></div><div className="account-info"><div><span>Username</span><strong>{role==="admin"?"admin":"guru"}</strong></div><div><span>Peran</span><strong>{role==="admin"?"Administrator":"Guru"}</strong></div><div><span>Status akun</span><strong>Aktif</strong></div><div><span>Login terakhir</span><strong>24 Feb 2025, 07.42</strong></div></div><Button variant="danger" icon="logout" onClick={logout}>Keluar dari Akun</Button></div><form className="card password-card" onSubmit={save}><div className="card-head"><div><h2>Ubah Password</h2><p>Gunakan kombinasi yang kuat dan mudah Anda ingat.</p></div></div><Field label="Password lama"><input type="password" value={old} onChange={e=>setOld(e.target.value)} required/></Field><Field label="Password baru"><input type="password" value={next} onChange={e=>setNext(e.target.value)} required/><small>Minimal 8 karakter.</small></Field><Field label="Konfirmasi password baru"><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/></Field>{error&&<div className="alert error"><Icon name="alert"/>{error}</div>}<Button type="submit">Simpan Password Baru</Button></form></div></PageShell>;
}

function HelpPage() { return <PageShell eyebrow="BANTUAN" title="Pusat Bantuan" desc="Panduan singkat menggunakan SIMPATIK."><div className="help-grid">{[["Memulai dengan SIMPATIK","Kenali dashboard, navigasi, dan konteks periode."],["Mengelola data akademik","Panduan nilai, kehadiran, dan monitoring siswa."],["Prestasi siswa","Alur pengajuan, revisi, hingga verifikasi."],["Akun dan keamanan","Jaga keamanan akun dan ubah password Anda."]].map((x,i)=><button className="card help-card" key={x[0]}><div className="stat-icon tone-green"><Icon name={["grid","book","award","shield"][i]}/></div><div><h2>{x[0]}</h2><p>{x[1]}</p></div><Icon name="arrow"/></button>)}</div><div className="card support"><div><h2>Masih membutuhkan bantuan?</h2><p>Hubungi administrator Yayasan Ishlahul Ummah.</p></div><Button variant="secondary">Hubungi Administrator</Button></div></PageShell>; }
function Empty({title,desc}:{title:string;desc:string}) { return <div className="empty"><div className="empty-icon"><Icon name="search"/></div><h3>{title}</h3><p>{desc}</p></div>; }
function PageShell({eyebrow,title,desc,action,children}:{eyebrow:string;title:string;desc:string;action?:React.ReactNode;children:React.ReactNode}) { return <div className="page"><div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>{action}</div>{children}</div>; }

export default function App() {
  const [role,setRole]=useState<Role|null>(null); const [page,setPage]=useState<Page>("dashboard"); const [students,setStudents]=useState(studentsSeed); const [achievements,setAchievements]=useState(achievementsSeed); const [toast,setToast]=useState<Toast>(null); const [sidebar,setSidebar]=useState(false);
  const notify=(message:string,type:"success"|"error"="success")=>{setToast({message,type});window.setTimeout(()=>setToast(null),3000)};
  const menu=role==="admin"?adminMenu:guruMenu; const title=menu.find(x=>x.page===page)?.label||"Dashboard";
  const content=useMemo(()=>{if(!role)return null;switch(page){
    case "dashboard":return <Dashboard role={role} students={students} achievements={achievements} go={setPage}/>;
    case "students":return <StudentsPage role={role} students={role==="guru"?students.filter(s=>s.className!=="Kelas C"):students} setStudents={setStudents} notify={notify}/>;
    case "teachers":case "classes":case "subjects":case "assignments":return <MasterPage type={page} notify={notify}/>;
    case "grades":return <GradesPage students={students} setStudents={setStudents} notify={notify}/>;
    case "attendance":return <AttendancePage students={students} setStudents={setStudents} notify={notify}/>;
    case "achievements":return <AchievementsPage role={role} achievements={achievements} setAchievements={setAchievements} students={students} notify={notify}/>;
    case "monitoring":return <MonitoringPage students={role==="guru"?students.filter(s=>s.className!=="Kelas C"):students}/>;
    case "reports":return <ReportsPage role={role} students={role==="guru"?students.filter(s=>s.className!=="Kelas C"):students} notify={notify}/>;
    case "security":return <SecurityPage role={role} logout={()=>{setRole(null);setPage("dashboard")}} notify={notify}/>;
    default:return <HelpPage/>;
  }},[role,page,students,achievements]);
  if(!role)return <Login onLogin={(r)=>{setRole(r);setPage("dashboard")}}/>;
  let lastGroup="";
  return <div className="app-shell">
    <aside className={`sidebar ${sidebar?"open":""}`}><div className="sidebar-brand"><div className="brand-logo">S</div><div><strong>SIMPATIK</strong><span>Yayasan Ishlahul Ummah</span></div><button className="sidebar-close" onClick={()=>setSidebar(false)}>×</button></div><div className="role-card"><div className="role-icon"><Icon name={role==="admin"?"shield":"teacher"}/></div><div><span>Masuk sebagai</span><strong>{role==="admin"?"Administrator":"Guru"}</strong></div></div><nav>{menu.map(item=>{const group=item.group;const label=group&&group!==lastGroup?group:"";if(group)lastGroup=group;return <div key={item.page}>{label&&<div className="nav-group">{label}</div>}<button className={page===item.page?"active":""} onClick={()=>{setPage(item.page);setSidebar(false)}}><Icon name={item.icon}/><span>{item.label}</span>{page===item.page&&<i/>}</button></div>})}</nav><div className="sidebar-footer"><div className="foundation-mark">YIU</div><div><strong>Yayasan Ishlahul Ummah</strong><span>Kota Sawahlunto</span></div></div></aside>
    {sidebar&&<div className="mobile-overlay" onClick={()=>setSidebar(false)}/>}
    <div className="main-shell"><header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={()=>setSidebar(true)}><Icon name="menu"/></button><div className="breadcrumb"><span>SIMPATIK</span><Icon name="arrow" size={13}/><strong>{title}</strong></div></div><div className="topbar-right"><div className="period"><span>Tahun Ajaran / Semester</span><select><option>2024/2025 · Genap</option><option>2024/2025 · Ganjil</option></select></div><button className="notification"><Icon name="bell"/><i/></button><button className="user-menu" onClick={()=>setPage("security")}><div className="avatar">{role==="admin"?"RA":"AS"}</div><div><strong>{role==="admin"?"Rahmi Ananda":"Andi Saputra"}</strong><span>{role==="admin"?"Administrator":"Guru"}</span></div><span>⌄</span></button></div></header><main className="content">{content}</main></div>
    {toast&&<div className={`toast ${toast.type}`}><div><Icon name={toast.type==="success"?"check":"alert"}/></div><span>{toast.message}</span><button onClick={()=>setToast(null)}>×</button></div>}
  </div>;
}
