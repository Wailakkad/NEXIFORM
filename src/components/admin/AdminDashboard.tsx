import React, { useState, useEffect } from 'react';
import { 
  Lock, User, LogOut, TrendingUp, ShoppingCart, Activity, RefreshCw, 
  Trash2, Mail, MessageSquare, ExternalLink, Calendar, Check, AlertCircle,
  Clock, Shield, Eye, Building, FileText, Download, CheckCircle, ChevronDown, CheckCircle2, Award
} from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder, Order, OrderItem } from '../../utils/orderStore';
import { storeData } from '../../data/store';
import { createDocument, addBrandHeader, addClientCard, addSectionTitle, addTableHeader, addTableRow, addTotalsPanel, addSignatureBlock, addFooter, addProcessSteps, formatPrice, formatPriceFull, COLORS } from '../../lib/pdfGenerator';
import { gsap } from '../../lib/gsap';
import credentials from '../../data/adminCredentials.json';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'nouveau' | 'en_preparation' | 'bat_envoye' | 'valide' | 'livre'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeProduction: 0,
    completedDeliveries: 0
  });

  // Verify session on mount
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('nexiform_admin_token');
      if (token === 'valid_token_2026') {
        setIsAuthenticated(true);
        await refreshData();
      }
    };
    init();
  }, []);

  // Update stats whenever orders change
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const total = orders.length;
    const rev = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const active = orders.filter(o => o.status !== 'livre' && o.status !== 'valide').length;
    const completed = orders.filter(o => o.status === 'livre').length;

    setStats({
      totalOrders: total,
      totalRevenue: rev,
      activeProduction: active,
      completedDeliveries: completed
    });
  }, [orders, isAuthenticated]);

  const refreshData = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === credentials.username && password === credentials.password) {
      localStorage.setItem('nexiform_admin_token', 'valid_token_2026');
      setIsAuthenticated(true);
      setLoginError('');
      await refreshData();
      
      setTimeout(() => {
        gsap.fromTo('.admin-panel-animate', 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }, 50);
    } else {
      setLoginError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexiform_admin_token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleStatusChange = async (orderId: string, nextStatus: Order['status']) => {
    await updateOrderStatus(orderId, nextStatus);
    await refreshData();
  };

  const handleDelete = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce projet de commande de l\'atelier ?')) {
      await deleteOrder(orderId);
      await refreshData();
      setSelectedOrder(null);
    }
  };

  const regeneratePDF = (order: Order) => {
    try {
      const doc = createDocument();
      const isAutonome = order.type === 'bon_commande_autonome';
      const docTitle = isAutonome ? 'BON DE COMMANDE B2B' : 'DEVIS OFFICIEL B2B';
      const statusLabel = order.status === 'en_preparation' ? 'En couture' : order.status === 'bat_envoye' ? 'BAT envoyé' : order.status;

      let y = addBrandHeader(doc, docTitle, order.reference, order.date, statusLabel);

      y = addClientCard(doc, {
        clientName: order.clientName,
        companyName: order.companyName,
        whatsapp: order.whatsapp,
        email: order.email,
        industry: order.industry,
        territory: 'Maroc (National / Distant)',
        notes: order.notes,
      }, y);

      y = addSectionTitle(doc, isAutonome ? 'Détail de la commande personnalisée' : 'Détail de la commande', y);

      const pageMargin = 20;

      if (!isAutonome) {
        const cols = [
          { label: 'N°', x: pageMargin + 3 },
          { label: 'Article / Options', x: pageMargin + 10 },
          { label: 'Qté', x: 110, align: 'center' as const },
          { label: 'P.U. HT (DH)', x: 153, align: 'right' as const },
          { label: 'Total HT (DH)', x: 190 - pageMargin, align: 'right' as const },
        ];

        y = addTableHeader(doc, cols, y);

        order.items.forEach((item, index) => {
          const cells = [
            { text: (index + 1).toString(), x: pageMargin + 3 },
            { text: item.name, x: pageMargin + 10, bold: true },
            { text: item.quantity.toString(), x: 110, align: 'center' as const },
            { text: formatPrice(item.price || 0), x: 153, align: 'right' as const },
            { text: formatPrice(item.totalPrice || 0), x: 190 - pageMargin, align: 'right' as const, bold: true },
          ];
          y = addTableRow(doc, cells, y, index === order.items.length - 1);
        });

        y += 4;
        const htAmount = order.totalAmount ? order.totalAmount / 1.2 : 0;
        y = addTotalsPanel(doc, htAmount, htAmount * 0.2, order.totalAmount || 0, y, 'Tarification B2B dégressive appliquée');
      } else {
        const cols = [
          { label: 'N°', x: pageMargin + 3 },
          { label: 'Article demandé', x: pageMargin + 10 },
          { label: 'Qté', x: 110, align: 'center' as const },
          { label: 'Marquage', x: 190 - pageMargin, align: 'right' as const },
        ];

        y = addTableHeader(doc, cols, y);

        order.items.forEach((item, index) => {
          const cells = [
            { text: (index + 1).toString(), x: pageMargin + 3 },
            { text: item.name, x: pageMargin + 10, bold: true },
            { text: item.quantity.toString(), x: 110, align: 'center' as const },
            { text: item.options || 'Aucun marquage', x: 190 - pageMargin, align: 'right' as const },
          ];
          y = addTableRow(doc, cells, y, index === order.items.length - 1);
        });

        y += 6;
        y = addProcessSteps(doc, y);
      }

      y += 8;
      y = addSignatureBlock(doc, y);

      addFooter(doc);
      doc.save(`${order.reference.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const filteredOrders = orders.filter(ord => {
    const matchesTab = activeTab === 'all' || ord.status === activeTab;
    const matchesSearch = 
      ord.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'nouveau':
        return <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Nouveau</span>;
      case 'en_preparation':
        return <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">En Couture</span>;
      case 'bat_envoye':
        return <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">BAT Envoyé</span>;
      case 'valide':
        return <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Validé</span>;
      case 'livre':
        return <span className="bg-neutral-500/10 border border-neutral-500/20 text-neutral-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Livré</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#070B16] text-white pt-24 pb-16 font-sans">
      {!isAuthenticated ? (
        /* GORGEOUS ADMIN LOGIN VIEW */
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="bg-[#0B1226]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase mt-4">Nexiform Portal</h2>
              <p className="text-neutral-400 text-xs font-semibold">
                Gestion des Ateliers de Confection Prestige
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider block">Identifiant</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-4 top-3.5" />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: admin"
                    className="w-full h-11 bg-[#070B16] border border-white/10 rounded-xl px-11 text-xs font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider block">Mot de Passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-4 top-3.5" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 bg-[#070B16] border border-white/10 rounded-xl px-11 text-xs font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[11px] font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Connexion sécurisée
              </button>
            </form>

            <div className="bg-neutral-900/40 rounded-2xl p-4 border border-white/5 text-[10.5px] text-neutral-500 space-y-1">
              <span className="font-bold text-neutral-400 block mb-1">💡 Guide d'accès rapide (Démonstration B2B) :</span>
              <p>Identifiant : <strong className="text-neutral-300">admin</strong></p>
              <p>Mot de passe : <strong className="text-neutral-300">nexiform-maroc-2026</strong></p>
            </div>
          </div>
        </div>
      ) : (
        /* GORGEOUS HIGH-FIDELITY ADMIN PANEL */
        <div className="admin-panel-animate max-w-7xl mx-auto px-4 space-y-8">
          {/* Header Block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1226]/80 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Terminal Live Confection
                </span>
                <span className="text-neutral-500 text-xs">| {credentials.role}</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Espace Direction Nexiform</h2>
              <p className="text-neutral-400 text-xs font-semibold">
                Supervision des commandes, validation des BAT, et logistique nationale marocaine.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={refreshData}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
                title="Rafraîchir les données"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <div className="h-9 w-px bg-white/10" />

              <div className="text-right">
                <span className="block text-xs font-black text-neutral-200">{credentials.fullName}</span>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Admin Connecté</span>
              </div>

              <button 
                onClick={handleLogout}
                className="h-11 px-4 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Quitter</span>
              </button>
            </div>
          </div>

          {/* Core Analytics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0B1226]/80 border border-white/5 p-5 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-white/5 transform translate-x-3 translate-y-3">
                <ShoppingCart className="w-24 h-24" />
              </div>
              <span className="text-neutral-400 text-[10px] font-black uppercase tracking-wider block">Total Commandes</span>
              <h3 className="text-3xl font-black tracking-tight font-mono">{stats.totalOrders}</h3>
              <p className="text-[10.5px] text-neutral-400 font-semibold">Projets de confection enregistrés</p>
            </div>

            <div className="bg-[#0B1226]/80 border border-white/5 p-5 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-white/5 transform translate-x-3 translate-y-3">
                <TrendingUp className="w-24 h-24" />
              </div>
              <span className="text-neutral-400 text-[10px] font-black uppercase tracking-wider block">Volume Émis (TTC)</span>
              <h3 className="text-3xl font-black tracking-tight font-mono text-blue-400">
                {Math.round(stats.totalRevenue).toLocaleString('fr-FR')} <span className="text-xs font-bold">DH</span>
              </h3>
              <p className="text-[10.5px] text-neutral-400 font-semibold">Devis dégressifs générés</p>
            </div>

            <div className="bg-[#0B1226]/80 border border-white/5 p-5 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-white/5 transform translate-x-3 translate-y-3">
                <Activity className="w-24 h-24" />
              </div>
              <span className="text-neutral-400 text-[10px] font-black uppercase tracking-wider block">Production Active</span>
              <h3 className="text-3xl font-black tracking-tight font-mono text-amber-400">{stats.activeProduction}</h3>
              <p className="text-[10.5px] text-neutral-400 font-semibold">En attente de couture ou validation BAT</p>
            </div>

            <div className="bg-[#0B1226]/80 border border-white/5 p-5 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-white/5 transform translate-x-3 translate-y-3">
                <CheckCircle2 className="w-24 h-24" />
              </div>
              <span className="text-neutral-400 text-[10px] font-black uppercase tracking-wider block">Projets Livrés</span>
              <h3 className="text-3xl font-black tracking-tight font-mono text-emerald-400">{stats.completedDeliveries}</h3>
              <p className="text-[10.5px] text-neutral-400 font-semibold">Expédiés avec succès au Maroc</p>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Table & List Area (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filter Tabs & Search Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0B1226]/80 border border-white/10 p-4 rounded-3xl">
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'nouveau', 'en_preparation', 'bat_envoye', 'valide', 'livre'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all ${
                        activeTab === tab 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                      }`}
                    >
                      {tab === 'all' ? 'Tous' : tab === 'en_preparation' ? 'Couture' : tab === 'bat_envoye' ? 'BAT' : tab}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer par Client, Référence..."
                    className="w-full sm:w-60 h-9 bg-neutral-900/80 border border-white/10 rounded-xl px-4 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Orders Database Container */}
              <div className="bg-[#0B1226]/80 border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Registre des Commandes Client</h4>
                  <span className="text-[10px] font-mono text-neutral-500 font-semibold">{filteredOrders.length} résultat(s)</span>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <p className="text-neutral-400 text-sm font-semibold">Aucun projet de commande ne correspond aux filtres.</p>
                    <p className="text-neutral-500 text-xs">Les soumissions de la boutique ou du bon de commande autonome s'afficheront ici en temps réel.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                          <th className="py-4 px-6">Référence / Date</th>
                          <th className="py-4 px-6">Client / Entreprise</th>
                          <th className="py-4 px-6 text-center">Articles</th>
                          <th className="py-4 px-6">Statut</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredOrders.map((order) => (
                          <tr 
                            key={order.id}
                            className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-white/[0.03]' : ''}`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            {/* Ref/Date */}
                            <td className="py-4 px-6 space-y-1">
                              <span className="text-xs font-mono font-bold block text-white">
                                {order.reference}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-medium block flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {order.date}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block ${
                                order.type === 'devis_boutique' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {order.type === 'devis_boutique' ? 'Boutique' : 'Custom'}
                              </span>
                            </td>

                            {/* Client/Company */}
                            <td className="py-4 px-6 space-y-1">
                              <span className="text-xs font-bold text-neutral-100 block">{order.clientName}</span>
                              <span className="text-[10px] text-neutral-400 font-bold block flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {order.companyName}
                              </span>
                              <span className="text-[9px] text-neutral-500 block">{order.industry}</span>
                            </td>

                            {/* Items count */}
                            <td className="py-4 px-6 text-center">
                              <span className="text-xs font-bold bg-neutral-900 px-3 py-1.5 rounded-lg text-neutral-200">
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} Pcs
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6">
                              {getStatusBadge(order.status)}
                            </td>

                            {/* Actions buttons */}
                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => regeneratePDF(order)}
                                  className="p-2 bg-neutral-950 hover:bg-blue-500/10 border border-white/5 text-neutral-300 hover:text-blue-400 rounded-lg transition-all"
                                  title="Télécharger la maquette PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(order.id)}
                                  className="p-2 bg-neutral-950 hover:bg-rose-500/10 border border-white/5 text-neutral-300 hover:text-rose-400 rounded-lg transition-all"
                                  title="Supprimer la commande"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Inspector Details Pane (Right 1 column) */}
            <div className="space-y-4">
              <div className="bg-[#0B1226]/80 border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Inspecteur de Devis</h4>
                  <p className="text-[10px] text-neutral-500 font-medium mt-1">Sélectionnez une commande à gauche pour examiner ou modifier son statut.</p>
                </div>

                {selectedOrder ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Header reference & type */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400">{selectedOrder.reference}</span>
                        <h5 className="text-sm font-black text-white">{selectedOrder.companyName}</h5>
                      </div>
                      <button 
                        onClick={() => regeneratePDF(selectedOrder)}
                        className="h-9 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                    </div>

                    {/* Quick status selector */}
                    <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 space-y-3">
                      <span className="text-neutral-400 text-[10px] font-black uppercase tracking-wider block">Piloter le Statut :</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['nouveau', 'en_preparation', 'bat_envoye', 'valide', 'livre'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(selectedOrder.id, st)}
                            className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all text-center ${
                              selectedOrder.status === st 
                                ? 'bg-blue-500 border-blue-600 text-white' 
                                : 'bg-white/5 border-transparent text-neutral-400 hover:bg-white/10'
                            }`}
                          >
                            {st === 'en_preparation' ? 'En couture' : st === 'bat_envoye' ? 'BAT' : st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customer contact details */}
                    <div className="space-y-3 text-xs bg-neutral-950 p-4 rounded-2xl border border-white/5">
                      <span className="text-neutral-400 text-[10px] font-black uppercase tracking-wider block">Contact Client :</span>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                          <span className="text-neutral-500 font-medium">Nom :</span>
                          <span className="font-bold text-neutral-200">{selectedOrder.clientName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                          <span className="text-neutral-500 font-medium">WhatsApp :</span>
                          <a 
                            href={`https://wa.me/${selectedOrder.whatsapp.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-bold text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>{selectedOrder.whatsapp}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-neutral-500 font-medium">Email :</span>
                          <a 
                            href={`mailto:${selectedOrder.email}`} 
                            className="font-bold text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[150px]"
                          >
                            <span>{selectedOrder.email}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Items detail summary list */}
                    <div className="space-y-3">
                      <span className="text-neutral-400 text-[10px] font-black uppercase tracking-wider block">Articles Commandés :</span>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="bg-neutral-950 p-3 rounded-xl border border-white/5 space-y-1 text-xs">
                            <div className="flex justify-between font-bold text-neutral-200">
                              <span>{item.name}</span>
                              <span className="text-blue-400 font-mono">{item.quantity} Pcs</span>
                            </div>
                            <span className="block text-[10px] text-neutral-500 font-medium">{item.options}</span>
                            {item.price && (
                              <div className="flex justify-between text-[10px] text-neutral-400 pt-1 border-t border-white/5">
                                <span>P.U. HT : {item.price} DH</span>
                                <span>Total HT : {item.totalPrice} DH</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing summary */}
                    {selectedOrder.totalAmount ? (
                      <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 text-xs flex justify-between items-center">
                        <span className="text-neutral-300 font-bold uppercase tracking-wider">Montant total (TTC)</span>
                        <span className="text-base font-black font-mono text-blue-400">{Math.round(selectedOrder.totalAmount).toLocaleString('fr-FR')} DH</span>
                      </div>
                    ) : (
                      <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 text-[10.5px] text-neutral-300 leading-normal">
                        ⚠️ Ce projet est un <strong>Bon de Commande autonome</strong> (couture personnalisée). Les conseillers valideront les coûts de confection après validation du BAT.
                      </div>
                    )}

                    {/* Special specifications */}
                    {selectedOrder.notes && (
                      <div className="bg-neutral-900/40 p-3 rounded-xl border border-white/5 text-[10.5px] text-neutral-400 space-y-1">
                        <span className="font-bold block text-neutral-300">Spécifications Jointes :</span>
                        <p className="leading-relaxed italic">"{selectedOrder.notes}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-neutral-500 text-xs">
                    Aucune commande sélectionnée. Cliquez sur une ligne de commande à gauche pour examiner les pièces jointes, les options de logo et lancer la fabrication.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
