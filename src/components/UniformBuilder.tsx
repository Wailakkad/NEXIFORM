'use client';

import { useState, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Check, Sliders, Sparkles } from 'lucide-react';

interface UniformKit {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  priceEstimate: string;
  tag: string;
  items: {
    leftItem: { name: string; type: string; img: string };
    rightItem: { name: string; type: string; img: string };
    centerBase: { name: string; type: string; img: string };
    bottomLeft: { name: string; type: string; img: string };
    bottomRight: { name: string; type: string; img: string };
  };
}

const KITS_DATA: UniformKit[] = [
  {
    id: 'corporate',
    name: 'Kit Corporate Elite',
    tag: 'Executive & Accueil',
    subtitle: 'L\'allure de la haute direction',
    description: 'Une chemise ajustée en coton égyptien sans repassage, mariée à un gilet ajusté et un pantalon de tailleur haute résistance.',
    priceEstimate: 'Sur devis (Dès 10 pièces)',
    items: {
      leftItem: {
        name: 'Chemise Oxford Bleue',
        type: 'TISSU INFROISSABLE',
        img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400',
      },
      rightItem: {
        name: 'Gilet Ajusté Marine',
        type: 'FINITION DOUBLE FIL',
        img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400',
      },
      centerBase: {
        name: 'Costume Blazer Royal',
        type: 'BASE MANNEQUIN',
        img: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821001/Professional_corporate_headshot_photography__shot_202606301310_6.jpg',
      },
      bottomLeft: {
        name: 'Cravate Soie Broderie',
        type: 'LIGNE DE SIGNATURE',
        img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=400',
      },
      bottomRight: {
        name: 'Chino Premium Coupe Slim',
        type: 'ERGONOMIQUE G3',
        img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400',
      }
    }
  },
  {
    id: 'chef',
    name: 'Kit Chef Prestige',
    tag: 'Gastronomie d\'Exception',
    subtitle: 'La signature des grands chefs',
    description: 'Veste de cuisine respirante à double boutonnage, tablier croisé en lin technique et calot brodé haute densité.',
    priceEstimate: 'Sur devis (Dès 10 pièces)',
    items: {
      leftItem: {
        name: 'Veste de Chef Blanche',
        type: 'MAILLE RESPIRANTE',
        img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400',
      },
      rightItem: {
        name: 'Tablier Cuir & Toile',
        type: 'ATELIER MAROQUINIER',
        img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400',
      },
      centerBase: {
        name: 'Veste Prestige Col Officier',
        type: 'BASE MANNEQUIN',
        img: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820831/Professional_corporate_headshot_photography__shot_202606301310_9.jpg',
      },
      bottomLeft: {
        name: 'Torchons Brodés Logo',
        type: 'FINITION INTENSIVE',
        img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
      },
      bottomRight: {
        name: 'Pantalon de Cuisine Tech',
        type: 'CEINTURE EXTENSIBLE',
        img: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=400',
      }
    }
  },
  {
    id: 'horizon',
    name: 'Kit Horizon Technique',
    tag: 'Ingénierie & Logistique',
    subtitle: 'L\'armure de l\'industrie',
    description: 'Veste softshell technique imperméable, pantalon multipoches en ripstop renforcé et polo de sécurité haute-visibilité.',
    priceEstimate: 'Sur devis (Dès 10 pièces)',
    items: {
      leftItem: {
        name: 'Polo Technique Respirant',
        type: 'TRAITEMENT ANTI-ODEUR',
        img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400',
      },
      rightItem: {
        name: 'Veste Softshell Protect',
        type: 'CORDURA RECONVERTI',
        img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
      },
      centerBase: {
        name: 'Combinaison Horizon G4',
        type: 'BASE MANNEQUIN',
        img: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820697/Professional_corporate_headshot_photography__shot_202606301310_10.jpg',
      },
      bottomLeft: {
        name: 'Casquette Gilet Réfléchissant',
        type: 'NORMES ISO 20471',
        img: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&q=80&w=400',
      },
      bottomRight: {
        name: 'Pantalon Heavy-Duty',
        type: 'REMPLISSAGE KEVLAR',
        img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400',
      }
    }
  }
];

export default function UniformBuilder() {
  const [activeKitId, setActiveKitId] = useState('corporate');
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeKit = KITS_DATA.find((k) => k.id === activeKitId) || KITS_DATA[0];

  // GSAP animation triggered when switching tabs
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Reset positions and animate items assembling back into center
    gsap.fromTo(
      '.kit-item-left',
      { opacity: 0, x: -60, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.kit-item-right',
      { opacity: 0, x: 60, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.kit-item-bottom-left',
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.kit-item-bottom-right',
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.center-ambassador',
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }
    );

  }, [activeKitId]);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 bg-[#FAFAFA] py-24 md:py-32 w-full text-black select-none overflow-hidden border-t border-neutral-200"
    >
      {/* Background Subtle Lines for technical uniform architecture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Top Header Block */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#3B82F6] text-xs font-mono uppercase tracking-[0.25em] font-bold flex items-center gap-1.5 mb-3">
            <Sliders className="w-3.5 h-3.5" /> Configurateur Intelligent
          </span>
          <h2 className="text-[#0A0A0A] font-sans font-bold text-3xl md:text-5xl tracking-tight leading-tight">
            Dress the Atlas Leader.
          </h2>
          <p className="text-[#666666] text-sm mt-4 leading-relaxed font-sans font-normal">
            Visualisez et concevez le vestiaire parfait pour vos équipes au Maroc. Basculez d'une collection à l'autre et observez l'harmonie des pièces brodées.
          </p>
        </div>

        {/* Dynamic Studio Stage mimicking soccer kit/dressing layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[500px]">
          
          {/* Left Column: Left items (Polos, Base shirts) */}
          <div className="lg:col-span-3 flex flex-col gap-6 md:gap-8">
            <div className="kit-item-left bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
              <span className="text-[#888888] text-[9px] font-mono tracking-wider uppercase">
                {activeKit.items.leftItem.type}
              </span>
              <h4 className="text-[#0A0A0A] font-sans font-bold text-sm mt-1 mb-3">
                {activeKit.items.leftItem.name}
              </h4>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-50 relative border border-neutral-100">
                <img
                  src={activeKit.items.leftItem.img}
                  alt={activeKit.items.leftItem.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="kit-item-bottom-left bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
              <span className="text-[#888888] text-[9px] font-mono tracking-wider uppercase">
                {activeKit.items.bottomLeft.type}
              </span>
              <h4 className="text-[#0A0A0A] font-sans font-bold text-sm mt-1 mb-3">
                {activeKit.items.bottomLeft.name}
              </h4>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-50 relative border border-neutral-100">
                <img
                  src={activeKit.items.bottomLeft.img}
                  alt={activeKit.items.bottomLeft.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Central Model Stage */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[420px] md:min-h-[500px]">
            {/* Soft Elliptical studio spotlight */}
            <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[70%] h-12 bg-[#3B82F6]/5 blur-[24px] rounded-[100%] z-0" />
            
            {/* Four Corner reticle brackets around center stage */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-neutral-300" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-neutral-300" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-neutral-300" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-neutral-300" />

            <div className="center-ambassador relative z-10 w-[240px] md:w-[300px] aspect-[4/5] rounded-xl overflow-hidden bg-white border border-neutral-200/60 shadow-xl p-4">
              <img
                src={activeKit.items.centerBase.img}
                alt="NEXIFORM Brand Ambassador Customizer"
                className="w-full h-full object-cover rounded-lg select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-[#0A0E1A]/90 backdrop-blur-md rounded-xl p-3 border border-white/10 flex justify-between items-center text-white">
                <div>
                  <p className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-wider">Modèle Certifié</p>
                  <p className="text-xs font-bold font-sans mt-0.5">{activeKit.name}</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              </div>
            </div>
          </div>

          {/* Right Column: Right items (Vests, Pants) */}
          <div className="lg:col-span-3 flex flex-col gap-6 md:gap-8">
            <div className="kit-item-right bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
              <span className="text-[#888888] text-[9px] font-mono tracking-wider uppercase">
                {activeKit.items.rightItem.type}
              </span>
              <h4 className="text-[#0A0A0A] font-sans font-bold text-sm mt-1 mb-3">
                {activeKit.items.rightItem.name}
              </h4>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-50 relative border border-neutral-100">
                <img
                  src={activeKit.items.rightItem.img}
                  alt={activeKit.items.rightItem.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="kit-item-bottom-right bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
              <span className="text-[#888888] text-[9px] font-mono tracking-wider uppercase">
                {activeKit.items.bottomRight.type}
              </span>
              <h4 className="text-[#0A0A0A] font-sans font-bold text-sm mt-1 mb-3">
                {activeKit.items.bottomRight.name}
              </h4>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-50 relative border border-neutral-100">
                <img
                  src={activeKit.items.bottomRight.img}
                  alt={activeKit.items.bottomRight.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Selector & Conversion Box */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Tabs Selector list */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-[#888888] text-[10px] font-mono tracking-wider uppercase mb-1">
              Choisissez votre univers
            </span>
            <div className="flex flex-wrap gap-2">
              {KITS_DATA.map((kit) => (
                <button
                  key={kit.id}
                  onClick={() => setActiveKitId(kit.id)}
                  className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                    activeKitId === kit.id
                      ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {activeKitId === kit.id && <Check className="w-3.5 h-3.5" />}
                  {kit.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Description & CTA button */}
          <div className="flex flex-col items-start gap-4 flex-1 md:max-w-md">
            <div>
              <p className="text-[#0A0A0A] font-bold text-base font-sans">{activeKit.subtitle}</p>
              <p className="text-[#666666] text-xs font-sans mt-1 leading-relaxed">
                {activeKit.description}
              </p>
            </div>
            
            <a
              href="#contact"
              className="group flex items-center justify-between bg-[#0A0E1A] hover:bg-[#3B82F6] text-white w-full h-11 px-4 rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300"
            >
              <span>Personnaliser ce kit</span>
              <div className="w-6 h-6 rounded-lg bg-white/15 text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
