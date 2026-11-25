import { useCallback, useEffect, useRef, useState } from 'react';
import content from '../content/site-content.json';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FiArrowUp, FiChevronRight, FiHome, FiMail, FiMenu, FiPhone, FiX } from 'react-icons/fi';

const site = content.site;
const ui = site.ui;
const imageUrls = import.meta.glob('../assets/images/*', {
  eager: true,
  import: 'default',
  query: '?url',
});
const image = (name) => imageUrls[`../assets/images/${name}`];
const pageData = (route) => content.pages.find((item) => item.route === route);
const paragraphs = (text = '') => text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);

function Header({ active }) {
  const [panel, setPanel] = useState(null);
  const menuButton = useRef(null);
  const contactButton = useRef(null);

  useEffect(() => {
    if (!panel) return;
    const closeOutside = (event) => {
      if (!event.target.closest('.mobile-buttons, .utility-links, .masthead .nav')) {
        setPanel(null);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setPanel(null);
      (panel === 'menu' ? menuButton : contactButton).current?.focus();
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [panel]);

  const toggle = (name) => setPanel((current) => current === name ? null : name);

  return <>
    <div className="utility" id="topbar">
      <div className="wrap utility-inner">
        <div className="mobile-buttons">
          <button ref={menuButton} type="button" className="mobile-toggle" onClick={() => toggle('menu')} aria-expanded={panel === 'menu'} aria-controls="main-navigation">
            {panel === 'menu' ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
            <span>{ui.menu}</span>
          </button>
          <button ref={contactButton} type="button" className="top-toggle" onClick={() => toggle('contact')} aria-expanded={panel === 'contact'} aria-controls="utility-links">
            {panel === 'contact' ? <FiX aria-hidden="true" /> : <FiPhone aria-hidden="true" />}
            <span>Contatos</span>
          </button>
        </div>
        <div id="utility-links" className={`utility-links ${panel === 'contact' ? 'open' : ''}`}>
          <a className="utility-contact" href="tel:+5511965748539"><FiPhone aria-hidden="true" /><span>{site.phone}</span></a>
          <a className="utility-contact" href={`mailto:${site.email}`}><FiMail aria-hidden="true" /><span>{site.email}</span></a>
        </div>
      </div>
    </div>
    <header className="masthead"><div className="wrap masthead-inner">
      <a className="brand" href="/" onClick={() => setPanel(null)}><strong>{site.name}</strong><small>{site.tagline}</small></a>
      <nav id="main-navigation" className={`nav ${panel === 'menu' ? 'open' : ''}`} aria-label="Navegação principal">
        {site.navigation.map((item) => <a key={item.href} aria-current={active === item.href ? 'page' : undefined} className={active === item.href ? 'active' : ''} href={item.href} onClick={() => setPanel(null)}>{item.label}<FiChevronRight className="mobile-nav-chevron" aria-hidden="true" /></a>)}
      </nav>
    </div></header>
  </>;
}

function Hero({ title, home }) {
  return <section className={`hero ${home ? 'home-hero' : ''}`}><div className="hero-shade" /><div className="wrap hero-content"><h1>{home ? site.name : title}</h1>{home ? <p className="hero-tagline">{site.tagline}</p> : <div className="crumb"><FiHome /><a href="/">Home</a><FiChevronRight /><span>{title}</span></div>}</div></section>;
}

function PostCard() {
  const article = '/aulas-de-guitarra/';
  return (
    <article className="post-card">
      <h2><a href={article}>Aulas de Guitarra</a></h2>
      <div className="meta post-details">
        <span>+20 anos de experiência</span>
        <span aria-hidden="true">·</span>
        <span>Victor Manoel</span>
        <span aria-hidden="true">·</span>
        <a href="/contato/">Contato</a>
      </div>
      <p>Aulas de guitarra – Aulas em Jundiaí-SP e online em todo Brasil! Como Surgiu?</p>
      <a className="read-more" href={article}>Continue lendo <span aria-hidden="true">→</span></a>
    </article>
  );
}

function Sidebar() {
  return <aside className="sidebar"><section className="widget"><h3>Cursos</h3><p>Aulas de guitarra e aulas de violão presenciais na cidade de Jundiaí e/ou região e online em tempo real em qualquer lugar do Brasil!</p><a className="button-link" href="/curso-de-guitarra/">Curso de Guitarra</a></section><section className="widget"><h3>Biografia</h3><p>Ingressei no mundo da guitarra quando criança há 16 anos atrás. Desde então atuei em diversas bandas, trabalhos freelancer, gravações e também como professor de música, trabalho esse que já me dedico a 8 anos.</p></section></aside>;
}

function Footer() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => { const update = () => setShowTop(window.scrollY > 400); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  return <><footer className="footer">{site.footer}</footer><a className="whatsapp-float" href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="Converse pelo WhatsApp"><FaWhatsapp /><span>{ui.chatLabel}</span></a><button className={`to-top ${showTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Voltar ao topo"><FiArrowUp /><span>{ui.backToTop}</span></button></>;
}

function Shell({ title, active, home, children, phase }) {
  return <><Header active={active} /><Hero title={title} home={home} /><main className={`wrap page-content ${home ? 'home-content' : ''}`} aria-busy={phase === 'exiting'}>{children}</main><Footer /></>;
}

function Home() {
  return <div className="home-grid"><div className="home-left"><PostCard /><div className="home-sidebar-mobile"><Sidebar /></div></div><a className="home-portrait" href="/aulas-de-guitarra/" aria-label="Leia sobre as aulas de guitarra"><img src={image('victor-aulas-de-guitarra.jpg')} alt="Victor Manoel com sua guitarra" /></a><div className="home-right"><Sidebar /></div></div>;
}

function Comments() {
  return <section id="comments" className="comments" aria-labelledby="comments-heading"><h2 id="comments-heading">{ui.comments.heading}</h2><p>{ui.comments.notice}</p><form onSubmit={(event) => { event.preventDefault(); window.alert(ui.comments.unavailable); }}><label>{ui.comments.comment}<textarea required rows={6} /></label><label>{ui.comments.name}<input required /></label><label>{ui.comments.email}<input type="email" required /></label><label>{ui.comments.website}<input /></label><label className="check"><input type="checkbox" /> {ui.comments.remember}</label><button className="pill" type="submit">{ui.comments.submit}</button></form></section>;
}

function Course() {
  const data = pageData('/curso-de-guitarra/');
  return <article className="course-content"><img className="course-portrait" src={image(data.sourceImages[0])} alt="Victor Manoel com sua guitarra" />{paragraphs(data.sourceText).map((text, index) => <p key={index}>{text}</p>)}<div className="schedule">{data.sourceImages.slice(1).map((file) => <img key={file} loading="lazy" src={image(file)} alt="Cronograma do curso de guitarra" />)}</div><Comments /></article>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (event) => { event.preventDefault(); const values = new FormData(event.currentTarget); const subject = encodeURIComponent(values.get('subject') || 'Contato pelo site'); const body = encodeURIComponent(`Nome: ${values.get('name') || ''}\nE-mail: ${values.get('email') || ''}\n\n${values.get('message') || ''}`); setSent(true); window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`; };
  return <section className="contact-panel"><a className="social-facebook" href={site.facebook} target="_blank" rel="noreferrer"><FaFacebookF /><span>{ui.facebook}</span></a><form className="contact-form" onSubmit={submit}><label>{ui.contactForm.name}<input name="name" /></label><label>{ui.contactForm.email}<input type="email" name="email" /></label><label>{ui.contactForm.subject}<input name="subject" /></label><label>{ui.contactForm.message}<textarea name="message" rows={5} /></label><button className="pill" type="submit">{ui.submit}</button>{sent && <p role="status">{ui.contactForm.submitNotice}</p>}</form><p className="email-line"><a href={`mailto:${site.email}`}><FiMail aria-hidden="true" /><span>{site.email}</span></a></p></section>;
}

function Gallery() {
  const assets = Array.isArray(content.assets) ? content.assets : content.assets?.images || [];
  return <div className="gallery">{pageData('/fotos/').sourceImages.map((file, index) => <figure key={file}><img loading="lazy" src={image(file)} alt={assets.find((asset) => asset.fileName === file)?.description || `Foto ${index + 1} de Victor Manoel`} /></figure>)}</div>;
}

function Article() {
  const data = pageData('/aulas-de-guitarra/');
  const headings = new Set(['Como Surgiu?', 'O curso', 'Quem pode fazer as aulas?', 'Em quanto tempo vou aprender a tocar?', 'Vou aprender a tocar músicas no curso?', 'Aulas de guitarra online', 'Aulas de guitarra em Jundiaí', 'Aulas de guitarra para Várzea Pta, Louveira e Campo limpo Pta.', 'Como entro em contato?', 'Cronograma do curso', 'Deixe um comentário']);
  const chunks = paragraphs(data.sourceText).flatMap((part, index) => index === 0 ? part.split('\n').map((line) => line.trim()).filter(Boolean).slice(1) : [part]);
  const end = chunks.indexOf('Deixe um comentário');
  const body = end < 0 ? chunks : chunks.slice(0, end);
  return <article className="article-content"><h2>Aulas de guitarra - Aulas em Jundiaí-SP e online em todo Brasil!</h2><div className="meta">10/01/2022　<a href="/author/victorm/">VictorM</a></div><img className="article-photo" src={image(data.sourceImages[0])} alt="Victor Manoel com uma guitarra" />{body.map((text, index) => headings.has(text) ? <h3 key={index}>{text}</h3> : <p key={index}>{text}</p>)}<div className="schedule">{data.sourceImages.slice(1).map((file) => <img key={file} loading="lazy" src={image(file)} alt={file.includes('logotipo') ? 'Logotipo de Victor Manoel' : 'Cronograma do curso de guitarra'} />)}</div><div className="video-wrap"><iframe src={`https://www.youtube-nocookie.com/embed/${content.media.articleVideoYouTubeId}`} title="Vídeo sobre as aulas de guitarra" loading="lazy" allowFullScreen /></div></article>;
}

function Archive({ title }) { return <div className="archive-layout"><div><PostCard /></div><Sidebar /></div>; }

function routeDetails(address) {
  const url = new URL(address, window.location.origin);
  const pathname = url.pathname.replace(/\/{2,}/g, '/') || '/';
  if (pathname === '/' || pathname === '/index.html') return { pathname: '/', title: '', active: '/', home: true, type: 'home' };
  if (pathname.startsWith('/contato')) return { pathname, title: 'Contato', active: '/contato/', home: false, type: 'contact' };
  if (pathname.startsWith('/fotos')) return { pathname, title: 'Fotos', active: '/fotos/', home: false, type: 'gallery' };
  if (pathname.startsWith('/curso-de-guitarra')) return { pathname, title: 'Curso De Guitarra', active: '/curso-de-guitarra/', home: false, type: 'course' };
  if (pathname.startsWith('/aulas-de-guitarra')) return { pathname, title: pageData('/aulas-de-guitarra/').pageTitle, active: '/curso-de-guitarra/', home: false, type: 'article' };
  if (pathname.startsWith('/category/')) return { pathname, title: 'Categoria: Aulas De Música', active: '', home: false, type: 'archive' };
  return { pathname: '/', title: '', active: '/', home: true, type: 'home' };
}

function PageView({ details }) {
  if (details.type === 'home') return <Home />;
  if (details.type === 'course') return <Course />;
  if (details.type === 'contact') return <Contact />;
  if (details.type === 'gallery') return <Gallery />;
  if (details.type === 'article') return <Article />;
  return <Archive title={details.title} />;
}

export default function App() {
  const [address, setAddress] = useState(() => `${window.location.pathname}${window.location.search}${window.location.hash}`);
  const [phase, setPhase] = useState('visible');
  const timer = useRef(null);
  const details = routeDetails(address);
  const navigate = useCallback((next) => {
    const target = new URL(next, window.location.origin);
    const destination = `${target.pathname}${target.search}${target.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (destination === current) return;
    window.history.pushState({}, '', destination);
    setPhase('exiting');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setAddress(destination);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setPhase('entering');
      timer.current = window.setTimeout(() => setPhase('visible'), 280);
    }, 160);
  }, []);

  useEffect(() => {
    const pop = () => {
      const destination = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      setPhase('exiting');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => { setAddress(destination); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); setPhase('entering'); timer.current = window.setTimeout(() => setPhase('visible'), 280); }, 160);
    };
    window.addEventListener('popstate', pop);
    return () => { window.removeEventListener('popstate', pop); window.clearTimeout(timer.current); };
  }, []);

  useEffect(() => {
    const currentPage = details.home ? pageData('/') : content.pages.find((item) => item.route === details.pathname);
    document.title = currentPage?.title || `${details.title} - ${site.name}`;
    if (details.type === 'article' && window.location.hash === '#comments') {
      window.history.replaceState(window.history.state, '', '/curso-de-guitarra/#comments');
      setAddress('/curso-de-guitarra/#comments');
      return;
    }
    const hash = new URL(address, window.location.origin).hash;
    if (hash) window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 330);
  }, [address, details.home, details.pathname, details.title, details.type]);

  const onClick = (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin) return;
    if (target.pathname === window.location.pathname && target.search === window.location.search && target.hash) return;
    event.preventDefault();
    navigate(`${target.pathname}${target.search}${target.hash}`);
  };

  return <div id="site" data-transition={phase} onClick={onClick}><div className="screen-fade" aria-hidden="true" /><Shell title={details.title} active={details.active} home={details.home} phase={phase}><PageView details={details} /></Shell></div>;
}
