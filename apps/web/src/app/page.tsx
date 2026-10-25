"use client";

import { useEffect, useMemo, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, CircleDollarSign, LayoutDashboard, ReceiptText, ChartNoAxesCombined, BellRing, Plus, Search, ArrowDownLeft, ArrowUpRight, Menu, X, PiggyBank, CreditCard, ChevronDown } from "lucide-react";
import { formatVND, getSummary, type Transaction } from "@moneyflow/finance-core";

const initial: Transaction[] = [
  {id:"t1", title:"Lương tháng", amount:18000000, type:"income", category:"Lương", date:new Date().toISOString().slice(0,10)},
  {id:"t2", title:"Ăn uống & cà phê", amount:85000, type:"expense", category:"Ăn uống", date:new Date().toISOString().slice(0,10)},
  {id:"t3", title:"Thanh toán Internet", amount:220000, type:"expense", category:"Hóa đơn", date:new Date().toISOString().slice(0,10)},
  {id:"t4", title:"Đi siêu thị", amount:465000, type:"expense", category:"Mua sắm", date:new Date().toISOString().slice(0,10)},
  {id:"t5", title:"Freelance", amount:1250000, type:"income", category:"Làm thêm", date:new Date().toISOString().slice(0,10)}
];
const nav = [
  {name:"Tổng quan", icon:LayoutDashboard},
  {name:"Lịch sử giao dịch", icon:ReceiptText},
  {name:"Báo cáo", icon:ChartNoAxesCombined},
  {name:"Nhắc nợ", icon:BellRing},
];
const categories = ["Ăn uống","Di chuyển","Nhà ở","Hóa đơn","Mua sắm","Giải trí","Sức khỏe","Lương","Làm thêm","Khác"];

export default function Home() {
  const [items,setItems] = useState<Transaction[]>(initial);
  const [loaded,setLoaded] = useState(false);
  const [active,setActive] = useState("Tổng quan");
  const [query,setQuery] = useState("");
  const [filter,setFilter] = useState("all");
  const [modal,setModal] = useState(false);
  const [mobileNav,setMobileNav] = useState(false);
  const [form,setForm] = useState({title:"",amount:"",type:"expense" as "income"|"expense",category:"Ăn uống",date:new Date().toISOString().slice(0,10),note:""});

  useEffect(() => {
    try { const saved = localStorage.getItem("moneyflow-transactions"); if(saved) setItems(JSON.parse(saved)); }
    catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if(loaded) localStorage.setItem("moneyflow-transactions",JSON.stringify(items)); },[items,loaded]);

  const summary = useMemo(() => getSummary(items),[items]);
  const visible = useMemo(() => items.filter(t => (filter==="all" || t.type===filter) && `${t.title} ${t.category} ${t.note||""}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>b.date.localeCompare(a.date)),[items,filter,query]);
  const expenseByCategory = useMemo(() => {
    const out: Record<string,number> = {};
    items.filter(x=>x.type==="expense").forEach(x=>out[x.category]=(out[x.category]||0)+x.amount);
    return Object.entries(out).sort((a,b)=>b[1]-a[1]).slice(0,5);
  },[items]);
  const expenseTotal = expenseByCategory.reduce((s,x)=>s+x[1],0);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Math.round(Number(form.amount));
    if(!form.title.trim() || !Number.isFinite(amount) || amount<=0) return;
    setItems(old=>[{...form,id:crypto.randomUUID(),amount,title:form.title.trim()},...old]);
    setForm({...form,title:"",amount:"",note:""});
    setModal(false);
  }
  const greeting = new Date().getHours()<12 ? "Chào buổi sáng" : new Date().getHours()<18 ? "Chào buổi chiều" : "Chào buổi tối";

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?"sidebar-open":""}`}>
      <div className="brand"><div className="brand-mark"><Wallet size={22}/></div><div><b>DUNIX-MONEY</b><small>PERSONAL FINANCE</small></div><button className="icon-btn close-nav" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">KHÔNG GIAN CỦA BẠN</div>
      <nav>{nav.map(n=><button key={n.name} className={`nav-item ${active===n.name?"active":""}`} onClick={()=>{setActive(n.name);setMobileNav(false)}}><n.icon size={18}/><span>{n.name}</span>{n.name==="Nhắc nợ"&&<i className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-divider"/>
      <div className="workspace-label">QUẢN LÝ TÀI CHÍNH</div>
      <button className="nav-item" onClick={()=>setActive("Ngân sách")}><PiggyBank size={18}/><span>Ngân sách</span></button>
      <button className="nav-item" onClick={()=>setActive("Ví tiền")}><Wallet size={18}/><span>Ví tiền</span></button>
      <button className="nav-item" onClick={()=>setActive("Khoản vay")}><CreditCard size={18}/><span>Khoản vay</span></button>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><b>Kiểm soát tiền bạc</b><p>Mỗi khoản chi nhỏ đều tạo nên khác biệt lớn.</p></div><div className="profile"><div className="avatar">MF</div><div className="profile-text"><b>Tài khoản cá nhân</b><span>Bản dùng thử</span></div><ChevronDown size={16}/></div></div>
    </aside>
    {mobileNav&&<button className="scrim" onClick={()=>setMobileNav(false)} aria-label="Đóng menu"/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-btn menu-btn" onClick={()=>setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Không gian cá nhân <span>/</span> <b>{active}</b></div><div className="top-actions"><button className="search-shortcut" onClick={()=>document.getElementById("search-input")?.focus()}><Search size={16}/><span>Tìm giao dịch...</span><kbd>⌘ K</kbd></button><button className="icon-btn notification-btn" aria-label="Thông báo"><BellRing size={18}/><i/></button><div className="top-avatar">MF</div></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">{new Date().toLocaleDateString("vi-VN",{month:"long",year:"numeric"}).toUpperCase()}</div><h1>{active==="Tổng quan"?"Tổng quan tài chính":active}</h1><p>{greeting}! Đây là bức tranh tài chính của bạn.</p></div><button className="primary-btn" onClick={()=>setModal(true)}><Plus size={18}/> Thêm giao dịch</button></div>
        {active==="Tổng quan" ? <>
          <section className="hero-card"><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/><div className="hero-top"><span className="hero-label"><span className="live-dot"/> TỔNG SỐ THU CHI ĐÃ GHI NHẬN</span><span className="period-pill">Tháng này <ChevronDown size={14}/></span></div><div className="hero-value">{formatVND(summary.balance)}</div><div className="hero-foot"><span className="hero-foot-label">Dòng tiền ròng trong dữ liệu hiện có</span><span className={`trend-pill ${summary.balance>=0?"positive":"negative"}`}>{summary.balance>=0?<TrendingUp size={14}/>:<TrendingDown size={14}/>} {summary.balance>=0?"Dương":"Âm"}</span></div><div className="hero-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></section>
          <section className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span className="stat-icon income"><ArrowDownLeft size={18}/></span><span className="stat-caption">Tổng thu nhập</span></div><strong>{formatVND(summary.income)}</strong><small><span className="positive-text">●</span> Tổng giao dịch thu nhập đã ghi</small></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon expense"><ArrowUpRight size={18}/></span><span className="stat-caption">Tổng chi tiêu</span></div><strong>{formatVND(summary.expense)}</strong><small><span className="expense-text">●</span> Tổng giao dịch chi tiêu đã ghi</small></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon savings"><PiggyBank size={18}/></span><span className="stat-caption">Tỷ lệ tiết kiệm</span></div><strong>{summary.income?`${Math.round((summary.balance/summary.income)*100)}%`:"—"}</strong><small>Trên dữ liệu thu chi hiện có</small></article>
          </section>
          <section className="content-grid">
            <article className="panel transactions-panel"><div className="panel-heading"><div><h2>Giao dịch gần đây</h2><p>Theo dõi dòng tiền của bạn</p></div><button className="text-btn" onClick={()=>setActive("Lịch sử giao dịch")}>Xem tất cả <span>→</span></button></div>
              <div className="filters"><div className="search-box"><Search size={16}/><input id="search-input" placeholder="Tìm giao dịch..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Lọc giao dịch"><option value="all">Tất cả</option><option value="income">Thu nhập</option><option value="expense">Chi tiêu</option></select></div>
              <div className="transaction-list">{visible.slice(0,7).map(t=><div className="transaction-row" key={t.id}><div className={`transaction-icon ${t.type}`}>{t.type==="income"?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}</div><div className="transaction-info"><b>{t.title}</b><span>{t.category} · {new Date(t.date+"T12:00:00").toLocaleDateString("vi-VN")}</span></div><div className={`transaction-amount ${t.type}`}>{t.type==="income"?"+":"−"}{formatVND(t.amount)}</div></div>)}
              {visible.length===0&&<div className="empty-state">Không tìm thấy giao dịch phù hợp.</div>}</div>
            </article>
            <article className="panel category-panel"><div className="panel-heading"><div><h2>Chi tiêu theo danh mục</h2><p>Phân bổ khoản chi đã ghi nhận</p></div><span className="mini-badge">TOP 5</span></div><div className="category-total">{formatVND(expenseTotal)}<span>Tổng chi đã phân loại</span></div><div className="category-list">{expenseByCategory.map(([name,value],i)=><div className="category-item" key={name}><div className="category-line"><span><i className={`category-dot dot-${i}`}/>{name}</span><b>{formatVND(value)}</b></div><div className="progress-track"><i className={`progress-fill fill-${i}`} style={{width:`${expenseTotal?value/expenseTotal*100:0}%`}}/></div></div>)}{expenseByCategory.length===0&&<div className="empty-state">Chưa có khoản chi để phân tích.</div>}</div></article>
          </section>
        </>: active==="Lịch sử giao dịch" ? <section className="panel full-panel"><div className="panel-heading"><div><h2>Tất cả giao dịch</h2><p>{visible.length} giao dịch trong dữ liệu hiện có</p></div></div><div className="filters"><div className="search-box"><Search size={16}/><input placeholder="Tìm theo tên, danh mục..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Tất cả</option><option value="income">Thu nhập</option><option value="expense">Chi tiêu</option></select></div><div className="transaction-list">{visible.map(t=><div className="transaction-row" key={t.id}><div className={`transaction-icon ${t.type}`}>{t.type==="income"?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}</div><div className="transaction-info"><b>{t.title}</b><span>{t.category} · {new Date(t.date+"T12:00:00").toLocaleDateString("vi-VN")}</span></div><div className={`transaction-amount ${t.type}`}>{t.type==="income"?"+":"−"}{formatVND(t.amount)}</div></div>)}</div></section>
        : <section className="panel feature-placeholder"><div className="feature-symbol">{active==="Báo cáo"?<ChartNoAxesCombined size={28}/>:active==="Nhắc nợ"?<BellRing size={28}/>:active==="Ngân sách"?<PiggyBank size={28}/>:<Wallet size={28}/>}</div><h2>{active}</h2><p>Phân hệ này đã có vị trí trong kiến trúc MONEYFLOW và sẽ được triển khai ở giai đoạn tiếp theo.</p><span className="coming-soon">ĐANG TRONG LỘ TRÌNH PHÁT TRIỂN</span></section>}
        <footer className="footer"><span>© 2026 MONEYFLOW</span><span>Quản lý tài chính, rõ ràng hơn mỗi ngày.</span><span className="footer-status"><i/> Bản MVP</span></footer>
      </div>
    </main>
    {modal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="transaction-modal" onSubmit={submit}><div className="modal-heading"><div><span className="eyebrow">GHI NHẬN DÒNG TIỀN</span><h2>Thêm giao dịch</h2></div><button type="button" className="icon-btn" onClick={()=>setModal(false)}><X size={19}/></button></div><div className="type-switch"><button type="button" className={form.type==="expense"?"selected expense-tab":""} onClick={()=>setForm({...form,type:"expense",category:"Ăn uống"})}><ArrowUpRight size={16}/> Chi tiêu</button><button type="button" className={form.type==="income"?"selected income-tab":""} onClick={()=>setForm({...form,type:"income",category:"Lương"})}><ArrowDownLeft size={16}/> Thu nhập</button></div><label>Số tiền (VNĐ)<input autoFocus type="number" min="1" step="1" required placeholder="Ví dụ: 150000" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><label>Tên giao dịch<input required maxLength={100} placeholder="Ví dụ: Ăn trưa" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="form-row"><label>Danh mục<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.filter(c=>form.type==="income"?["Lương","Làm thêm","Khác"].includes(c):!["Lương","Làm thêm"].includes(c)).map(c=><option key={c}>{c}</option>)}</select></label><label>Ngày<input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label></div><label>Ghi chú (không bắt buộc)<textarea rows={2} placeholder="Thêm ghi chú..." value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Hủy</button><button className="primary-btn" type="submit"><Plus size={17}/> Lưu giao dịch</button></div></form></div>}
  </div>;
}
