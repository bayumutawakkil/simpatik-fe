import { useState } from "react";
import { api } from "../../api";
import type { Role } from "../../models/app";
import { Button, Field, Icon } from "../shared";

export function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setError("Username dan password wajib diisi.");
    try {
      const user = await api.login(username.includes("@") ? username : `${username}@simpatik.local`, password);
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user.user));
      onLogin(user.user.role === "ADMIN" ? "admin" : user.user.role === "KEPSEK" ? "kepsek" : "guru");
    } catch (err: any) { setError(err.message || "Username atau password tidak sesuai. Silakan coba kembali."); }
  };
  const fill = (role: Role) => { setUsername(role === "admin" ? "admin@simpatik.test" : role === "kepsek" ? "kepsek@simpatik.test" : "bambang@simpatik.test"); setPassword(role === "admin" ? "admin123" : "password123"); setError(""); };
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
      <div className="demo-box"><div><strong>Akun demo</strong><span>Pilih peran untuk mengisi kredensial</span></div><div className="demo-actions"><Button variant="secondary" onClick={() => fill("admin")}>Demo Admin</Button><Button variant="secondary" onClick={() => fill("guru")}>Demo Guru</Button><Button variant="secondary" onClick={() => fill("kepsek")}>Demo Kepsek</Button></div></div>
      <p className="login-help">Butuh bantuan? Hubungi administrator sekolah.</p>
    </div></main>
  </div>;
}
