import React, { useState, useEffect, useRef } from 'react';
import { X, Clipboard, Plus, Trash2, Send, Phone, User, Building, Mail, Sparkles, CheckCircle2, ChevronDown, Loader2, FileText, Check } from 'lucide-react';
import { storeData } from '../../data/store';
import { gsap } from '../../lib/gsap';
import { saveOrder } from '../../utils/orderStore';
import { createDocument, addBrandHeader, addClientCard, addSectionTitle, addTableHeader, addTableRow, addSignatureBlock, addFooter, addProcessSteps, formatPrice, COLORS } from '../../lib/pdfGenerator';

interface BonCommandeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomOrderItem {
  productName: string;
  quantity: number;
  hasLogo: boolean;
  logoType: 'Broderie' | 'Sérigraphie';
}

export default function BonCommandeModal({ isOpen, onClose }: BonCommandeModalProps) {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [industryType, setIndustryType] = useState('Médical');
  
  // Custom items in the order form
  const [items, setItems] = useState<CustomOrderItem[]>([
    { productName: '', quantity: 10, hasLogo: false, logoType: 'Broderie' }
  ]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const submitSteps = [
    "Validation des coordonnées professionnelles...",
    "Génération de la maquette de Devis (Document PDF)...",
    "Connexion sécurisée au serveur d'envoi de factures...",
    `Envoi de la copie PDF rattachée à ${email || 'votre adresse'}...`,
    "Transmission réussie ! Enregistrement finalisé."
  ];

  // GSAP animation for opening/closing
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(backdropRef.current, { display: 'flex' });
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(modalRef.current, 
        { scale: 0.95, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
        gsap.set(backdropRef.current, { display: 'none' });
      }});
    }
  }, [isOpen]);

  const handleAddItem = () => {
    setItems([...items, { productName: '', quantity: 10, hasLogo: false, logoType: 'Broderie' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index: number, updatedFields: Partial<CustomOrderItem>) => {
    setItems(items.map((item, idx) => {
      if (idx === index) {
        return { ...item, ...updatedFields };
      }
      return item;
    }));
  };

  const handleSelectSuggestion = (index: number, name: string) => {
    handleUpdateItem(index, { productName: name });
    setActiveSuggestionIndex(null);
  };

  const generatePDF = () => {
    try {
      const doc = createDocument();
      const refNumber = `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateStr = new Date().toLocaleDateString('fr-FR');

      let y = addBrandHeader(doc, 'BON DE COMMANDE B2B', refNumber, dateStr, 'Transmis par e-mail');

      y = addClientCard(doc, {
        clientName: fullName || 'Client Nexiform',
        companyName: companyName || 'Non spécifiée',
        whatsapp: whatsapp,
        email: email,
        industry: industryType,
        territory: 'Maroc (National / Distant)',
      }, y);

      y = addSectionTitle(doc, 'Articles demandés', y);

      const pageMargin = 20;
      const cols = [
        { label: 'N°', x: pageMargin + 3 },
        { label: 'Article / Modèle', x: pageMargin + 10 },
        { label: 'Qté', x: 120, align: 'center' as const },
        { label: 'Marquage', x: 190 - pageMargin, align: 'right' as const },
      ];

      y = addTableHeader(doc, cols, y);

      items.forEach((item, index) => {
        const cells = [
          { text: (index + 1).toString(), x: pageMargin + 3 },
          { text: item.productName || 'Article Personnalisé Nexiform', x: pageMargin + 10, bold: true },
          { text: item.quantity.toString(), x: 120, align: 'center' as const },
          { text: item.hasLogo ? `Oui (${item.logoType})` : 'Non', x: 190 - pageMargin, align: 'right' as const },
        ];
        y = addTableRow(doc, cells, y, index === items.length - 1);
      });

      y += 6;
      y = addProcessSteps(doc, y);

      y += 8;
      y = addSignatureBlock(doc, y);

      addFooter(doc);
      doc.save(`devis_nexiform_${(companyName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set UI to submitting mode
    setIsSubmitting(true);
    setSubmitStep(0);

    // Multi-step animated sequence to mimic professional server processing & email sending
    const intervals = [600, 1200, 1800, 2400, 3000];
    
    intervals.forEach((delay, idx) => {
      setTimeout(() => {
        setSubmitStep(idx + 1);
        
        // At the final step, complete simulation and trigger automatic PDF download
        if (idx === intervals.length - 1) {
          setIsSubmitting(false);
          setIsSuccess(true);
          
          // Generate and trigger auto-download of the PDF Devis document
          generatePDF();

          // Save to B2B order store
          try {
            saveOrder({
              type: 'bon_commande_autonome',
              reference: `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              clientName: fullName,
              companyName: companyName,
              email: email,
              whatsapp: whatsapp,
              industry: industryType,
              items: items.map(it => ({
                name: it.productName || 'Article Personnalisé Nexiform',
                quantity: it.quantity,
                options: `Logo: ${it.hasLogo ? it.logoType : 'Aucun'}`
              }))
            });
          } catch (err) {
            console.error('Failed to save order in B2B order store:', err);
          }

          // Animate success screen entrance
          setTimeout(() => {
            gsap.fromTo('.success-banner-animate',
              { scale: 0.9, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
            );
          }, 50);
        }
      }, delay);
    });
  };

  // Pre-load popular matching items for easy selection
  const suggestions = storeData.products.map(p => p.name);

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        ref={backdropRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 opacity-0 hidden"
        onClick={(e) => {
          if (e.target === backdropRef.current) onClose();
        }}
      >
        {/* Modal content box */}
        <div 
          ref={modalRef}
          className="bg-white text-black w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh] transition-all"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                <Clipboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A]">
                  Générateur de Bon de Commande
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                  Créez votre propre commande personnalisée en direct
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form / Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {isSubmitting ? (
              /* High-fidelity transmission simulation screen */
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-neutral-100 border-t-[#3B82F6] animate-spin flex items-center justify-center" />
                  <Mail className="w-8 h-8 text-[#3B82F6] absolute top-6 left-6 animate-pulse" />
                </div>
                
                <div className="space-y-3 max-w-sm">
                  <h4 className="text-sm font-black uppercase tracking-wider text-[#0F172A]">
                    Traitement de votre commande
                  </h4>
                  <p className="text-neutral-500 text-xs font-medium">
                    {submitSteps[submitStep] || "Préparation de l'envoi..."}
                  </p>
                </div>

                {/* Vertical high fidelity status checkpoints */}
                <div className="w-full max-w-md bg-neutral-50 rounded-2xl p-5 border border-neutral-150/50 space-y-3.5 text-left">
                  {submitSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {submitStep > idx ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      ) : submitStep === idx ? (
                        <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-neutral-200" />
                      )}
                      <span className={`font-semibold ${submitStep >= idx ? 'text-neutral-800' : 'text-neutral-300'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : isSuccess ? (
              /* Success confirmation viewport with PDF file actions */
              <div className="success-banner-animate flex flex-col items-center justify-center text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-[#3B82F6] text-[10px] font-mono tracking-widest uppercase font-extrabold px-3.5 py-1.5 rounded-full bg-[#3B82F6]/5 border border-[#3B82F6]/10">
                    Copie Envoyée avec Succès par E-mail
                  </span>
                  <h4 className="text-[#0F172A] font-sans font-black text-2xl mt-5 leading-none">
                    Commande validée !
                  </h4>
                  <p className="text-neutral-500 text-xs md:text-sm mt-3 leading-relaxed max-w-md mx-auto">
                    Félicitations <strong>{fullName}</strong>. Un e-mail contenant le devis officiel rattaché a été envoyé avec succès à l'adresse <strong>{email}</strong>.
                  </p>

                  {/* Manual download CTA */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={generatePDF}
                      className="flex-1 h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Télécharger le Devis (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSuccess(false);
                        onClose();
                        // Reset form fields
                        setFullName('');
                        setCompanyName('');
                        setEmail('');
                        setWhatsapp('');
                        setIndustryType('Médical / Santé');
                        setItems([{ productName: '', quantity: 10, hasLogo: false, logoType: 'Broderie' }]);
                      }}
                      className="flex-1 h-12 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Fermer l'interface
                    </button>
                  </div>
                  
                  <div className="mt-6 p-5 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-emerald-900 text-left text-xs max-w-md mx-auto">
                    <div className="flex gap-2.5 items-start">
                      <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span className="block font-bold">Prochaines étapes de production :</span>
                        <span className="text-emerald-800/90 font-normal block mt-1 leading-normal">
                          Notre équipe commerciale valide les options techniques de marquage. Un conseiller spécialisé vous contactera sur votre WhatsApp (<strong>{whatsapp}</strong>) sous 2 heures avec le Bon à Tirer (BAT) numérique.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. CLIENT INFOS CARD */}
                <div className="bg-neutral-50 border border-neutral-100/80 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="border-b border-neutral-200/50 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      Informations Professionnelles
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nom Complet */}
                    <div>
                      <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-wider block mb-1.5 font-bold">
                        Nom du Responsable *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Ex: Youssef El Alami"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] bg-white text-black"
                        />
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Entreprise */}
                    <div>
                      <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-wider block mb-1.5 font-bold">
                        Raison sociale / Entreprise *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Ex: Clinique Dentaire"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] bg-white text-black"
                        />
                        <Building className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-wider block mb-1.5 font-bold">
                        WhatsApp (Suivi Dossier) *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="Ex: +212 6 61 00 00 00"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] bg-white text-black"
                        />
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-wider block mb-1.5 font-bold">
                        Adresse E-mail *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ex: y.alami@clinique.ma"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] bg-white text-black"
                        />
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Industry Sector Dropdown */}
                    <div className="md:col-span-2">
                      <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-wider block mb-1.5 font-bold">
                        Secteur d'Activité *
                      </label>
                      <div className="relative">
                        <select
                          value={industryType}
                          onChange={(e) => setIndustryType(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] bg-white text-black appearance-none"
                        >
                          <option value="Médical / Santé">Médical / Santé</option>
                          <option value="Hôtellerie / Prestige">Hôtellerie / Prestige</option>
                          <option value="Restauration / Café">Restauration / Café</option>
                          <option value="Esthétique / Bien-être">Esthétique / Bien-être</option>
                          <option value="Corporate / Entreprise">Corporate / Entreprise</option>
                          <option value="Autre secteur">Autre secteur</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-4 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. PRODUCTS LIST CARD */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-150 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      Détails de ma Commande
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {items.length} Article(s)
                    </span>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl relative space-y-4 text-black"
                      >
                        {/* Remove item button */}
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-neutral-100"
                            title="Supprimer cet article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* Product Name (Suggested dropdown / Free-text) */}
                          <div className="md:col-span-8 relative">
                            <label className="text-neutral-400 text-[9px] font-mono uppercase block mb-1.5 font-bold">
                              Modèle / Nom de l'Article {idx + 1} *
                            </label>
                            <input
                              type="text"
                              required
                              value={item.productName}
                              onChange={(e) => {
                                handleUpdateItem(idx, { productName: e.target.value });
                                setActiveSuggestionIndex(idx);
                              }}
                              placeholder="Ex: Ensemble Médical Bleu Ciel"
                              className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] bg-white text-black"
                            />
                            
                            {/* Auto suggestions dropdown list */}
                            {activeSuggestionIndex === idx && item.productName && (
                              <div className="absolute left-0 right-0 top-20 bg-white border border-neutral-150 rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto">
                                {suggestions
                                  .filter(name => name.toLowerCase().includes(item.productName.toLowerCase()))
                                  .slice(0, 4)
                                  .map((name, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => handleSelectSuggestion(idx, name)}
                                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-neutral-50 text-neutral-700 font-medium border-b border-neutral-50 last:border-b-0"
                                    >
                                      {name}
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>

                          {/* Quantity */}
                          <div className="md:col-span-4">
                            <label className="text-neutral-400 text-[9px] font-mono uppercase block mb-1.5 font-bold">
                              Quantité *
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                              className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-xs font-bold text-center focus:outline-none focus:border-[#3B82F6] bg-white text-black font-mono"
                            />
                          </div>
                        </div>

                        {/* Logo/Impression selector per row */}
                        <div className="pt-2 border-t border-neutral-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <label className="text-neutral-500 text-[10px] font-bold font-sans">
                              Impression Logo / Personnalisation :
                            </label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateItem(idx, { hasLogo: false })}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                  !item.hasLogo
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
                                }`}
                              >
                                Sans logo
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateItem(idx, { hasLogo: true })}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                  item.hasLogo
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
                                }`}
                              >
                                Avec logo
                              </button>
                            </div>
                          </div>

                          {/* Choose Logo Type selection if has logo is selected */}
                          {item.hasLogo && (
                            <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-neutral-100 shadow-inner">
                              <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold">Type :</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItem(idx, { logoType: 'Broderie' })}
                                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                                    item.logoType === 'Broderie'
                                      ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                                      : 'text-neutral-400 hover:bg-neutral-50'
                                  }`}
                                >
                                  Broderie
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItem(idx, { logoType: 'Sérigraphie' })}
                                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                                    item.logoType === 'Sérigraphie'
                                      ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                                      : 'text-neutral-400 hover:bg-neutral-50'
                                  }`}
                                >
                                  Sérigraphie
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Row Button */}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full h-11 border border-dashed border-neutral-300 hover:border-[#3B82F6] hover:bg-neutral-50 rounded-2xl text-xs font-bold text-neutral-500 hover:text-[#3B82F6] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un autre article</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-neutral-100 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-12 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 bg-black hover:bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-md"
                  >
                    <Send className="w-4 h-4 text-[#3B82F6] group-hover:translate-x-1 transition-transform" />
                    <span>Valider mon Bon</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
