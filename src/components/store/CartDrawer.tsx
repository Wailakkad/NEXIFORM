import React, { useState, useEffect, useRef } from 'react';
import { getInitialCartState, cartReducer, CartItem, CART_UPDATE_EVENT, notifyCartUpdate, calculateDiscountedPrice } from '../../lib/cartStore';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, Phone, User, Building, MessageSquare, Mail, Sparkles, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { gsap } from '../../lib/gsap';
import { saveOrder } from '../../utils/orderStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Use simple robust useState synchronized with event listener
  const [cartState, setCartState] = useState(getInitialCartState);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);
  
  // Checkout form state
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    whatsapp: '',
    email: '',
    notes: ''
  });

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const submitSteps = [
    "Vérification de la conformité du panier (MOQ)...",
    "Génération du Devis Officiel certifié (Document PDF)...",
    "Sécurisation des serveurs de messagerie professionnelle...",
    `Rattachement et envoi de la pièce jointe à ${formData.email || 'votre email'}...`,
    "Envoi finalisé avec succès ! Transmis à la direction."
  ];

  // Sync cart state on update events
  useEffect(() => {
    const handleUpdate = () => {
      setCartState(getInitialCartState());
    };
    window.addEventListener(CART_UPDATE_EVENT, handleUpdate);
    // Initial sync
    handleUpdate();
    return () => window.removeEventListener(CART_UPDATE_EVENT, handleUpdate);
  }, [isOpen]);

  // GSAP animation for sliding drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(backdropRef.current, { opacity: 0.5, duration: 0.3, display: 'block', ease: 'power2.out' });
      gsap.fromTo(drawerRef.current, 
        { x: '100%' }, 
        { x: '0%', duration: 0.45, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, display: 'none', ease: 'power2.in' });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
    }
  }, [isOpen]);

  const handleUpdateQuantity = (item: CartItem, newQty: number) => {
    if (newQty < 10) return; // Standard corporate MOQ is 10
    const currentState = getInitialCartState();
    cartReducer(currentState, {
      type: 'UPDATE_QUANTITY',
      payload: { id: item.id, quantity: newQty }
    });
    notifyCartUpdate();
  };

  const handleRemoveItem = (id: string) => {
    const currentState = getInitialCartState();
    cartReducer(currentState, { type: 'REMOVE_ITEM', payload: { id } });
    notifyCartUpdate();
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Color palette definitions
      const primaryColor = [15, 23, 42]; // #0F172A
      const accentColor = [59, 130, 246]; // #3B82F6
      const textColor = [51, 65, 85]; // #334155
      const lightBg = [248, 250, 252]; // #F8FAFC
      const borderColor = [226, 232, 240]; // #E2E8F0

      // Brand Header Banner
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('NEXIFORM', 20, 25);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text('CONFECTION TEXTILE PROFESSIONNELLE DE PRESTIGE - MAROC', 20, 30);

      // Document metadata
      const refNumber = `DEVIS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('DEVIS OFFICIEL CERTIFIÉ B2B', 120, 25);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`N° Devis : ${refNumber}`, 120, 31);
      doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 120, 36);
      doc.text('Validité : 30 Jours', 120, 41);

      // Decorative divider
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.5);
      doc.line(20, 46, 190, 46);

      // Client Info Block card
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(20, 52, 170, 45, 3, 3, 'F');

      // Card Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('DESTINATAIRE / COORDONNÉES CLIENT', 25, 59);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      // Column 1
      doc.setFont('helvetica', 'bold');
      doc.text('Client :', 25, 66);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.fullName || 'Client Nexiform', 45, 66);

      doc.setFont('helvetica', 'bold');
      doc.text('Entreprise :', 25, 72);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.companyName || 'Non spécifiée', 45, 72);

      doc.setFont('helvetica', 'bold');
      doc.text('Origine :', 25, 78);
      doc.setFont('helvetica', 'normal');
      doc.text('Boutique Digitale Nexiform', 45, 78);

      // Column 2
      doc.setFont('helvetica', 'bold');
      doc.text('WhatsApp :', 115, 66);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.whatsapp || 'Non spécifié', 138, 66);

      doc.setFont('helvetica', 'bold');
      doc.text('E-mail :', 115, 72);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.email || 'Non spécifié', 138, 72);

      doc.setFont('helvetica', 'bold');
      doc.text('Territoire :', 115, 78);
      doc.setFont('helvetica', 'normal');
      doc.text('Maroc (National)', 138, 78);

      // Notes and specifics block if provided
      if (formData.notes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Spécifications :', 25, 84);
        doc.setFont('helvetica', 'normal');
        // Truncate to avoid overflow
        const notesTruncated = formData.notes.length > 70 ? formData.notes.substring(0, 67) + '...' : formData.notes;
        doc.text(notesTruncated, 53, 84);
      }

      const formatPricePDF = (val: number) => {
        return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      };

      // Table Header
      const tableTopY = 105;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(20, tableTopY, 170, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('N°', 23, tableTopY + 5.5);
      doc.text('Désignation de l\'Article / Options', 30, tableTopY + 5.5);
      doc.text('Taille', 110, tableTopY + 5.5, { align: 'center' });
      doc.text('Qté', 122, tableTopY + 5.5, { align: 'center' });
      doc.text('P.U. HT (DH)', 153, tableTopY + 5.5, { align: 'right' });
      doc.text('Total HT (DH)', 187, tableTopY + 5.5, { align: 'right' });

      // Rows
      let currentY = tableTopY + 8;
      
      cartState.items.forEach((item, index) => {
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.line(20, currentY + 9, 190, currentY + 9);

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(8);
        
        // Item No
        doc.setFont('helvetica', 'normal');
        doc.text((index + 1).toString(), 23, currentY + 5.5);
        
        // Description
        doc.setFont('helvetica', 'bold');
        doc.text(item.product.name, 30, currentY + 4.5);
        
        // Logo details on secondary subline
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(110, 110, 110);
        const logoText = item.hasLogo ? `Marquage Logo: ${item.logoType} (+${item.discountedLogoUnitPrice} DH)` : 'Marquage Logo: Aucun';
        doc.text(`${item.product.color} | ${logoText}`, 30, currentY + 8);
        
        // Reset styles for remaining columns
        doc.setFontSize(8);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFont('helvetica', 'normal');
        
        // Size
        doc.text(item.size, 110, currentY + 5.5, { align: 'center' });
        
        // Qty
        doc.text(item.quantity.toString(), 122, currentY + 5.5, { align: 'center' });
        
        // Unit Price
        const itemUnitPrice = item.discountedUnitPrice + (item.hasLogo ? item.discountedLogoUnitPrice : 0);
        doc.text(formatPricePDF(itemUnitPrice), 153, currentY + 5.5, { align: 'right' });
        
        // Line Subtotal
        doc.setFont('helvetica', 'bold');
        doc.text(formatPricePDF(item.totalPrice), 187, currentY + 5.5, { align: 'right' });

        currentY += 9;
      });

      // Totals Calculations Box (HT, TVA, TTC)
      currentY += 5;
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.line(110, currentY, 190, currentY);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      // Total HT
      doc.text('Total HT :', 145, currentY + 5);
      doc.setFont('helvetica', 'bold');
      doc.text(`${formatPricePDF(cartState.totalAmount)} DH`, 187, currentY + 5, { align: 'right' });

      // TVA (20%)
      doc.setFont('helvetica', 'normal');
      doc.text('TVA (20%) :', 145, currentY + 10);
      doc.setFont('helvetica', 'bold');
      const tvaValue = cartState.totalAmount * 0.2;
      doc.text(`${formatPricePDF(tvaValue)} DH`, 187, currentY + 10, { align: 'right' });

      // Total TTC
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Net à payer TTC :', 145, currentY + 16);
      doc.setFont('helvetica', 'bold');
      const ttcValue = cartState.totalAmount * 1.2;
      doc.text(`${formatPricePDF(ttcValue)} DH`, 187, currentY + 16, { align: 'right' });

      // Remise Tier Info Note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(16, 185, 129);
      doc.text('* Tarification dégressive spéciale B2B appliquée avec succès.', 110, currentY + 22);

      // Signature blocks
      const sigY = currentY + 28;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Le Client (Pour Accord)', 35, sigY);
      doc.text('Ateliers NEXIFORM Maroc', 135, sigY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text('(Signature électronique & cachet)', 30, sigY + 5);
      doc.text('(Document certifié d\'origine)', 132, sigY + 5);

      // Decorative production rules box at bottom
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.roundedRect(20, sigY + 12, 170, 16, 2, 2, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('VALIDATION TECHNIQUE ET CONFECTION :', 23, sigY + 17);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text('Ce projet de devis intègre les remises dégressives de l\'atelier. La maquette et le Bon à Tirer (BAT) broderie vous seront', 23, sigY + 21);
      doc.text('transmis sur WhatsApp pour accord écrit avant lancement définitif de la découpe laser des tissus.', 23, sigY + 24);

      // Absolute Footer
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.5);
      doc.line(20, 274, 190, 274);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('NEXIFORM Maroc S.A.R.L - Ateliers de Confection Moderne, Boulevard d\'Anfa, Casablanca.', 105, 279, { align: 'center' });
      doc.text('E-mail: contact@nexiform.ma | WhatsApp: +212 6 61 00 00 00 | Document certifié conforme.', 105, 283, { align: 'center' });

      doc.save(`devis_nexiform_${(formData.companyName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set UI to submitting mode
    setIsSubmitting(true);
    setSubmitStep(0);

    // Multi-step animated sequence to mimic professional server processing & email sending
    const intervals = [500, 1000, 1600, 2200, 2800];
    
    intervals.forEach((delay, idx) => {
      setTimeout(() => {
        setSubmitStep(idx + 1);
        
        // At the final step, complete simulation and trigger automatic PDF download
        if (idx === intervals.length - 1) {
          setIsSubmitting(false);
          setIsSuccess(true);
          
          // Generate and trigger auto-download of the PDF Devis document
          generatePDF();

          // Save to local B2B order store
          try {
            saveOrder({
              type: 'devis_boutique',
              reference: `DEVIS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              clientName: formData.fullName,
              companyName: formData.companyName,
              email: formData.email,
              whatsapp: formData.whatsapp,
              industry: 'E-Commerce / Boutique',
              notes: formData.notes,
              totalAmount: cartState.totalAmount * 1.2, // TTC
              items: cartState.items.map(it => ({
                name: it.product.name,
                quantity: it.quantity,
                options: `${it.product.color} | Taille: ${it.size} | Marquage: ${it.hasLogo ? it.logoType : 'Aucun'}`,
                price: it.discountedUnitPrice + (it.hasLogo ? it.discountedLogoUnitPrice : 0),
                totalPrice: it.totalPrice
              }))
            });
          } catch (err) {
            console.error('Failed to save order in local B2B store:', err);
          }

          // Clear cart in store AFTER PDF generation succeeds to prevent empty PDF issues
          const currentState = getInitialCartState();
          cartReducer(currentState, { type: 'CLEAR_CART' });
          notifyCartUpdate();

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

  return (
    <>
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black z-50 opacity-0 hidden"
      />

      {/* Drawer panel */}
      <div 
        ref={drawerRef}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col justify-between font-sans border-l border-neutral-100 transform translate-x-full overflow-hidden text-black"
      >
        {/* Header Block */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0F172A]">
                Votre Devis B2B
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono">
                {cartState.totalQuantity} ARTICLES SÉLECTIONNÉS
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

        {/* Dynamic scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isSubmitting ? (
            /* High-fidelity transmission simulation screen */
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-neutral-100 border-t-[#3B82F6] animate-spin flex items-center justify-center" />
                <Mail className="w-6 h-6 text-[#3B82F6] absolute top-5 left-5 animate-pulse" />
              </div>
              
              <div className="space-y-3 max-w-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  Envoi de votre Devis B2B
                </h4>
                <p className="text-neutral-500 text-[10px] font-medium">
                  {submitSteps[submitStep] || "Préparation de l'envoi..."}
                </p>
              </div>

              {/* Vertical high-fidelity status checkpoints */}
              <div className="w-full bg-neutral-50 rounded-2xl p-4 border border-neutral-150/50 space-y-3 text-left">
                {submitSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[10.5px]">
                    {submitStep > idx ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </div>
                    ) : submitStep === idx ? (
                      <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-neutral-200" />
                    )}
                    <span className={`font-semibold ${submitStep >= idx ? 'text-neutral-800' : 'text-neutral-300'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : isSuccess ? (
            /* Success confirmation panel with manual PDF download actions */
            <div className="success-banner-animate flex flex-col items-center justify-center text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[#3B82F6] text-[10px] font-mono tracking-widest uppercase font-extrabold px-3 py-1.5 rounded-full bg-[#3B82F6]/5 border border-[#3B82F6]/10">
                  Devis Transmis par E-mail avec Succès
                </span>
                <h4 className="text-[#0F172A] font-sans font-black text-xl mt-4 leading-none">
                  Devis validé !
                </h4>
                <p className="text-neutral-500 text-xs mt-3 leading-relaxed max-w-sm mx-auto">
                  Merci <strong>{formData.fullName}</strong>. Votre demande de devis personnalisé pour <strong>{formData.companyName}</strong> a été synchronisée et envoyée à l'adresse <strong>{formData.email}</strong>.
                </p>

                {/* Manual download CTA */}
                <div className="mt-6 flex flex-col gap-3 justify-center">
                  <button
                    type="button"
                    onClick={generatePDF}
                    className="w-full h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Télécharger le Devis Officiel (PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setIsCheckout(false);
                      onClose();
                      setFormData({
                        fullName: '',
                        companyName: '',
                        whatsapp: '',
                        email: '',
                        notes: ''
                      });
                    }}
                    className="w-full h-11 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Fermer l'interface
                  </button>
                </div>

                <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-emerald-800 text-left text-xs max-w-xs mx-auto">
                  <div className="flex gap-2 items-start">
                    <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Nos équipes commerciales valident vos options et vous contacteront sur votre WhatsApp (<strong>{formData.whatsapp}</strong>) sous 2 heures avec le Bon à Tirer (BAT) numérique.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : isCheckout ? (
            /* Checkout Form Panel */
            <form onSubmit={handleSubmitCheckout} className="space-y-5">
              <div className="pb-2 border-b border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Coordonnées du Projet B2B</h4>
                <p className="text-[10px] text-neutral-400">Renseignez vos informations professionnelles pour recevoir le devis officiel.</p>
              </div>

              {/* Name */}
              <div>
                <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-widest block mb-1.5 font-bold">
                  Nom complet du responsable *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ex: Youssef El Alami"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-neutral-50/30 text-black"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-widest block mb-1.5 font-bold">
                  Raison sociale / Entreprise *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Ex: Clinique Dentaire Gauthier"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-neutral-50/30 text-black"
                  />
                  <Building className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-widest block mb-1.5 font-bold">
                  Numéro WhatsApp (Suivi Projet) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Ex: +212 6 61 00 00 00"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-neutral-50/30 text-black"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-widest block mb-1.5 font-bold">
                  Adresse Email (Optionnelle)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: y.alami@clinique.ma"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-neutral-50/30 text-black"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-neutral-400 text-[9px] font-mono uppercase tracking-widest block mb-1.5 font-bold">
                  Spécificités / Logo / Broderie (Optionnel)
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Précisez ici les détails de personnalisation (ex: broderie de logo côté cœur)..."
                    className="w-full p-3 pl-10 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-neutral-50/30 resize-none font-sans text-black"
                  />
                  <MessageSquare className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Totals Recaps inside checkout */}
              <div className="p-4 bg-neutral-50 rounded-2xl space-y-2 border border-neutral-100">
                <div className="flex justify-between text-xs text-neutral-500 font-mono">
                  <span>Volume global :</span>
                  <span className="font-bold text-neutral-800">{cartState.totalQuantity} pièces</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 font-mono">
                  <span>Remise B2B appliquée :</span>
                  <span className="font-bold text-emerald-600">Offre groupée incluse</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-200/60">
                  <span className="text-[#0F172A]">Estimation HT :</span>
                  <span className="text-[#3B82F6] font-black">{cartState.totalAmount.toLocaleString()} DH</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckout(false)}
                  className="flex-1 h-11 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Retour au panier
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-black hover:bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-[#3B82F6] group-hover:translate-x-1 transition-transform" />
                  <span>Envoyer la commande</span>
                </button>
              </div>
            </form>
          ) : cartState.items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-700">Votre panier est vide</h4>
              <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Parcourez notre boutique officielle et sélectionnez vos tenues professionnelles de prestige avec broderies personnalisées.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-md"
              >
                Découvrir les modèles
              </button>
            </div>
          ) : (
            /* Standard Items List */
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Modèles configurés</span>
              {cartState.items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-neutral-50/60 border border-neutral-100 rounded-2xl p-3.5 flex gap-4 hover:shadow-sm transition-all text-black"
                >
                  {/* Thumbnail */}
                  <div className="w-20 aspect-[3/4] bg-neutral-200 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-100">
                    <img src={item.product.image} className="w-full h-full object-cover" />
                  </div>

                  {/* Body info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-black text-neutral-800 line-clamp-1 pr-4">{item.product.name}</h4>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Interactive metadata details */}
                      <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                        <span className="bg-black text-[9px] font-mono text-white px-2 py-0.5 rounded-full font-bold">Taille: {item.size}</span>
                        <span className="text-neutral-400 text-[9px] font-mono uppercase">{item.product.color}</span>
                        {item.hasLogo && item.logoType ? (
                          <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 animate-pulse text-[#3B82F6]" />
                            {item.logoType} (+{item.discountedLogoUnitPrice} DH)
                          </span>
                        ) : (
                          <span className="bg-neutral-100 text-neutral-500 text-[9px] px-2 py-0.5 rounded-full font-bold">Sans logo</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom controls & tiers pricing info */}
                    <div className="flex items-end justify-between pt-2">
                      <div className="flex items-center border border-neutral-200 bg-white rounded-lg p-0.5 shadow-inner">
                        <button 
                          type="button"
                          onClick={() => handleUpdateQuantity(item, item.quantity - 5)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-3 text-neutral-800 font-mono w-10 text-center">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => handleUpdateQuantity(item, item.quantity + 5)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        {item.quantity >= 15 && (
                          <span className="text-[9px] font-bold text-emerald-600 block mb-0.5">
                            U. {(item.discountedUnitPrice + (item.hasLogo ? item.discountedLogoUnitPrice : 0))} DH
                          </span>
                        )}
                        <span className="text-[#0F172A] font-black text-sm block">
                          {item.totalPrice.toLocaleString()} DH <span className="text-[9px] text-neutral-400 font-normal">HT</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions block */}
        {!isSuccess && !isSubmitting && cartState.items.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-4 text-black">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-500 font-mono">
                <span>Nombre de modèles :</span>
                <span>{cartState.items.length}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 font-mono">
                <span>Quantité cumulée :</span>
                <span>{cartState.totalQuantity} pièces</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-800 pt-2 border-t border-neutral-200/50">
                <span>Total Estimé HT :</span>
                <span className="text-[#3B82F6] font-black text-lg">{cartState.totalAmount.toLocaleString()} DH</span>
              </div>
            </div>

            {!isCheckout ? (
              <button
                onClick={() => setIsCheckout(true)}
                className="w-full h-12 bg-black hover:bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Procéder au Devis</span>
                <Send className="w-4 h-4 text-[#3B82F6] group-hover:translate-x-1 transition-transform" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
