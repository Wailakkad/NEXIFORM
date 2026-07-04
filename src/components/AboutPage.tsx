import React, { useState, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Mail, Phone, MapPin, Send, ShieldCheck, Award, HeartHandshake, Check, ChevronRight, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive Contact Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    sector: 'Medical',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Home navigation handler
  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#/';
  };

  // Scroll target hook
  React.useEffect(() => {
    const target = sessionStorage.getItem('scroll_target');
    if (target) {
      sessionStorage.removeItem('scroll_target');
      setTimeout(() => {
        const targetElement = document.getElementById(target);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  // GSAP Premium Entrances
  useGSAP(() => {
    // Elegant slide and fade-in for section elements
    gsap.fromTo(
      '.about-fade-in',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
    );
  }, { scope: containerRef });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*Nouveau Projet B2B - NEXIFORM*
*Nom:* ${formData.name}
*Email:* ${formData.email}
*Société:* ${formData.company}
*Téléphone:* ${formData.phone || 'Non renseigné'}
*Secteur:* ${formData.sector}
*Message:* ${formData.message}`;
    const url = `https://wa.me/212660763128?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const sectorsList = [
    {
      id: 'medical',
      title: 'Santé & Médical',
      description: 'Blouses, ensembles de chirurgie (scrubs) et vestes de consultation ergonomiques certifiés antibactériens.',
      image: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782858217/Ensemble_M%C3%A9dical_Professionnel_Bleu_Ciel.jpg',
      features: ['Lavage industriel 60°C', 'Traitement hydrofuge', 'Fibres respirantes']
    },
    {
      id: 'hotellerie',
      title: 'Hôtellerie & Restauration',
      description: 'Costumes sur-mesure, tabliers en lin premium et vestes de chef alliant haute prestance et confort extrême.',
      image: 'https://res.cloudinary.com/fnxxj10k/image/upload/v1782920770/gilet_cafe_3_cu2nc8.jpg',
      features: ['Anti-froissement', 'Finitions broderie d\'or', 'Confort stretch']
    },
    {
      id: 'nettoyage',
      title: 'Nettoyage & Entretien',
      description: 'Tabliers résistants et uniformes fonctionnels pour les professionnels du nettoyage et de l\'entretien. Conçus pour une utilisation intensive en milieu professionnel.',
      image: 'https://res.cloudinary.com/fnxxj10k/image/upload/v1782927939/uniforme_de_neto_4P_wsahrp.jpg',
      features: ['Résistant aux produits chimiques', 'Tissu imperméable', 'Personnalisation logo disponible']
    },
    {
      id: 'technique',
      title: 'Industrie & Technique',
      description: 'Équipements de protection individuels (EPI) stylisés et uniformes de terrain haute résistance.',
      image: 'https://res.cloudinary.com/fnxxj10k/image/upload/v1782914216/GILET_SERGE_N.O_3_p34qji.jpg',
      features: ['Normes CE de sécurité', 'Coutures triples renforcées', 'Poches ergonomiques']
    }
  ];

  const valueCards = [
    {
      icon: <Award className="w-6 h-6 text-[#3B82F6]" />,
      title: 'Excellence Marocaine',
      description: 'Conception, coupe et broderie minutieuse réalisées au cœur de nos ateliers à Casablanca.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#3B82F6]" />,
      title: 'Qualité Certifiée',
      description: 'Sélection rigoureuse de tissus OEKO-TEX® assurant durabilité optimale et lavage à haute température.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#3B82F6]" />,
      title: 'Partenariat B2B Agile',
      description: 'Accompagnement de A à Z avec prototypage rapide et gestion de flotte simplifiée pour vos équipes.'
    }
  ];

  return (
    <div ref={containerRef} className="bg-[#FFFFFF] min-h-screen text-black font-sans pt-28 pb-32 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-6 flex items-center justify-between">
        <button
          onClick={handleGoHome}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0F172A] hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </button>

        <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> NEXIFORM / À Propos & Secteurs
        </span>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-12 border-b border-neutral-100">
        <span className="text-[#3B82F6] text-xs font-mono uppercase tracking-[0.25em] font-bold block mb-3 about-fade-in">
          NOTRE HISTOIRE & SAVOIR-FAIRE
        </span>
        <h1 className="text-[#0F172A] font-sans font-black text-[clamp(40px,9vw,100px)] leading-[0.9] tracking-tighter uppercase select-none mb-6 about-fade-in">
          L'Élégance B2B
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div>
            <p className="text-[#0F172A] text-sm md:text-base font-medium leading-relaxed max-w-lg about-fade-in">
              NEXIFORM redéfinit le vêtement d'image professionnel au Maroc. Nous façonnons des lignes de vêtements haut de gamme qui rehaussent l'identité visuelle de votre entreprise tout en garantissant un bien-être inégalé.
            </p>
          </div>
          <div className="flex md:justify-end items-end">
            <p className="text-neutral-500 text-xs md:text-sm max-w-sm leading-relaxed md:text-right about-fade-in">
              Chaque pli, chaque broderie de fil de coton est pensée pour sublimer la stature de vos ambassadeurs auprès d'une clientèle exigeante.
            </p>
          </div>
        </div>
      </div>

      {/* Values & Manifesto Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueCards.map((card, idx) => (
            <div key={idx} className="about-fade-in bg-neutral-50 border border-neutral-100/80 rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-neutral-100 shadow-sm mb-6">
                {card.icon}
              </div>
              <h3 className="text-[#0F172A] font-sans font-bold text-base mb-3">{card.title}</h3>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sectors Section */}
      <div id="secteurs-detail" className="bg-[#0F172A] text-white py-24 rounded-3xl mx-6 md:mx-12 lg:mx-16 px-8 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.15)_0%,_transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-xl mb-16">
            <span className="text-[#3B82F6] text-xs font-mono uppercase tracking-[0.25em] font-bold block mb-3">
              NOS DOMAINES D'EXPERTISES
            </span>
            <h2 className="font-sans font-black text-3xl md:text-4xl tracking-tight mb-4">
              Des uniformes d'exception pour chaque secteur clé
            </h2>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed">
              Nous maîtrisons les codes de chaque domaine pour proposer des pièces qui s'accordent idéalement à votre univers de marque et aux exigences opérationnelles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {sectorsList.map((sector) => (
              <div 
                key={sector.id} 
                className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col md:flex-row gap-6"
              >
                <div className="w-full md:w-36 h-48 md:h-full rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-800 border border-white/10">
                  <img 
                    src={sector.image} 
                    alt={sector.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-lg mb-2 group-hover:text-[#3B82F6] transition-colors">
                      {sector.title}
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed mb-4">
                      {sector.description}
                    </p>
                  </div>
                  <ul className="space-y-1.5 pt-3 border-t border-white/5">
                    {sector.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide text-white/40">
                        <Check className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* B2B Contact Form Portal */}
      <div id="contact-portal" className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left info cards */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[#3B82F6] text-xs font-mono uppercase tracking-[0.25em] font-bold block mb-3">
                LANCER VOTRE PROJET
              </span>
              <h2 className="text-[#0F172A] font-sans font-black text-3xl md:text-4xl tracking-tight leading-none mb-4">
                Parlons de votre future collection
              </h2>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed">
                Remplissez notre formulaire confidentiel de demande de projet. Nos experts à Casablanca étudient vos besoins sous 24h ouvrées.
              </p>
            </div>

            {/* Address cards */}
            <div className="space-y-4 pt-6 border-t border-neutral-100">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-600 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Atelier & Showroom Principal</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    124 Boulevard d'Anfa, 4ème étage<br />Casablanca, Maroc
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-600 flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Ligne Commerciale Directe</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    0660763128
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-600 flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Service Commercial Grands Comptes</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    nexiformatelier@gmail.com
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right contact form */}
          <div className="lg:col-span-7 bg-neutral-50 border border-neutral-100 rounded-3xl p-8 md:p-10 shadow-sm">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-2 font-bold">
                    Votre Nom Complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Amine Benjelloun"
                    className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-xs font-sans font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-black"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-2 font-bold">
                    Adresse Email Professionnelle *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: a.benjelloun@clinique.ma"
                    className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-xs font-sans font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-2 font-bold">
                    Raison Sociale / Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ex: Clinique du Cœur Casablanca"
                    className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-xs font-sans font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-black"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-2 font-bold">
                    Téléphone de Contact
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: +212 661 23 45 67"
                    className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-xs font-sans font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-black"
                  />
                </div>
              </div>

              {/* Selector radio cards */}
              <div>
                <label className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-3 font-bold">
                  Secteur de votre Projet *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Medical', 'Hotellerie', 'Nettoyage', 'Technique'].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setFormData({ ...formData, sector: sec })}
                      className={`h-11 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all ${
                        formData.sector === sec
                          ? 'border-[#3B82F6] bg-[#3B82F6]/5 text-[#3B82F6]'
                          : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-2 font-bold">
                  Description de vos besoins (Modèles, volumes indicatifs...)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ex: Nous souhaitons habiller une équipe de 45 soignants avec des ensembles scrubs bleu marine personnalisés à notre logo..."
                  className="w-full p-4 rounded-xl border border-neutral-200 text-xs font-sans font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-black hover:bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group shadow-md"
              >
                <Send className="w-4 h-4 text-[#3B82F6] group-hover:translate-x-1 transition-transform" />
                <span>Soumettre le Projet B2B</span>
              </button>

            </form>

            {isSubmitted && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                <Sparkles className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5 animate-spin" />
                <div>
                  <span className="block font-bold">Votre message a été transmis avec succès !</span>
                  <span className="text-emerald-700/80 font-normal block mt-0.5">
                    Un conseiller commercial de notre équipe Nexiform vous contactera sous peu pour organiser un rendez-vous showroom ou une démonstration de maquettes physiques.
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
