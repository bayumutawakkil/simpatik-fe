import React from "react";

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
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

export function Button({ children, variant = "primary", icon, onClick, type = "button", disabled = false }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  return <button type={type} className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={17}/>}<span>{children}</span></button>;
}

export function Badge({ status }: { status: string }) {
  const kind = status.includes("Terverifikasi") || status === "Aktif" || status === "Hadir" ? "success" : status.includes("Revisi") || status === "Alpa" ? "danger" : status.includes("Menunggu") || status === "Izin" ? "warning" : "neutral";
  return <span className={`badge badge-${kind}`}><span className="badge-dot"/>{status}</span>;
}

export function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return <label className="field"><span>{label}</span>{children}{error && <small className="field-error">{error}</small>}</label>;
}

export function Modal({ title, children, onClose, footer }: { title: string; children: React.ReactNode; onClose: () => void; footer?: React.ReactNode }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">SIMPATIK</span><h2>{title}</h2></div><button className="icon-btn" onClick={onClose}>×</button></div><div className="modal-body">{children}</div>{footer && <div className="modal-foot">{footer}</div>}</div></div>;
}

export function Empty({title,desc}:{title:string;desc:string}) { return <div className="empty"><div className="empty-icon"><Icon name="search"/></div><h3>{title}</h3><p>{desc}</p></div>; }

export function PageShell({eyebrow,title,desc,action,children}:{eyebrow:string;title:string;desc:string;action?:React.ReactNode;children:React.ReactNode}) { return <div className="page"><div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>{action}</div>{children}</div>; }
