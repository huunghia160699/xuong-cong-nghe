import Link from "next/link";
import {ArrowRight, Check, Mail, ShieldCheck, Sparkles} from "lucide-react";

export function PublicHero({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children?:React.ReactNode}){
 return <section className="xcn-content-hero"><div className="xcn-container xcn-content-hero-grid">
  <div><span className="xcn-content-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children}</div>
 </div></section>;
}

export function SectionTitle({eyebrow,title,description}:{eyebrow?:string;title:string;description?:string}){
 return <div className="xcn-content-section-title">{eyebrow&&<span className="xcn-content-eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description&&<p>{description}</p>}</div>;
}

export function FeatureCard({title,description,href,label="Khám phá"}:{title:string;description:string;href?:string;label?:string}){
 return <article className="xcn-content-card"><div className="xcn-content-card-mark"><Sparkles size={17} aria-hidden="true"/></div><h3>{title}</h3><p>{description}</p>{href&&<Link href={href}>{label}<ArrowRight size={16} aria-hidden="true"/></Link>}</article>;
}

export function Bullet({children}:{children:React.ReactNode}){return <li><Check size={17} aria-hidden="true"/>{children}</li>}
export function ContactCard({title,description,href,label}:{title:string;description:string;href:string;label:string}){return <article className="xcn-contact-card"><div className="xcn-content-card-mark"><Mail size={17} aria-hidden="true"/></div><h3>{title}</h3><p>{description}</p><Link href={href}>{label}<ArrowRight size={16} aria-hidden="true"/></Link></article>}
export function TrustNote({children}:{children:React.ReactNode}){return <div className="xcn-trust-note"><ShieldCheck size={18} aria-hidden="true"/><span>{children}</span></div>}
