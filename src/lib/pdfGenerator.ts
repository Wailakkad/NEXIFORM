import { jsPDF } from 'jspdf';

type RGB = [number, number, number];

export const COLORS = {
  primary: [15, 23, 42] as RGB,
  accent: [59, 130, 246] as RGB,
  text: [51, 65, 85] as RGB,
  textMuted: [100, 116, 139] as RGB,
  textLight: [148, 163, 184] as RGB,
  lightBg: [248, 250, 252] as RGB,
  border: [226, 232, 240] as RGB,
  white: [255, 255, 255] as RGB,
  success: [16, 185, 129] as RGB,
  darkCard: [241, 245, 249] as RGB,
};

export function formatPrice(val: number): string {
  return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatPriceFull(val: number): string {
  return `${formatPrice(val)} DH`;
}

export function createDocument(): jsPDF {
  return new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
}

const MARGIN = 20;
const PAGE_WIDTH = 190;
const CENTER = 105;

export function addBrandHeader(
  doc: jsPDF,
  title: string,
  ref: string,
  date: string,
  status?: string
): number {
  let y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);

  const brandText = 'NEXIFORM';
  const brandWidth = doc.getTextWidth(brandText);
  doc.text(brandText, MARGIN, y);

  const tWidth = doc.getTextWidth('I');
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text('I', MARGIN + doc.getTextWidth('NEX') + tWidth * 0.15, y);

  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('CONFECTION TEXTILE PROFESSIONNELLE DE PRESTIGE — MAROC', MARGIN, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(title, PAGE_WIDTH - MARGIN, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.textMuted[0], COLORS.textMuted[1], COLORS.textMuted[2]);

  let lineH = y + 5;
  doc.text(`Réf : ${ref}`, PAGE_WIDTH - MARGIN, lineH, { align: 'right' });
  lineH += 4.2;
  doc.text(`Date : ${date}`, PAGE_WIDTH - MARGIN, lineH, { align: 'right' });
  if (status) {
    lineH += 4.2;
    doc.text(`Statut : ${status}`, PAGE_WIDTH - MARGIN, lineH, { align: 'right' });
  }

  lineH = y + 9;
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, lineH, PAGE_WIDTH - MARGIN, lineH);

  return lineH + 6;
}

export interface ClientInfo {
  clientName: string;
  companyName: string;
  whatsapp?: string;
  email?: string;
  industry?: string;
  origin?: string;
  territory?: string;
  notes?: string;
}

export function addClientCard(doc: jsPDF, client: ClientInfo, y: number): number {
  const cardH = client.notes ? 50 : 40;
  const radius = 3;

  doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
  doc.roundedRect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, cardH, radius, radius, 'F');

  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, cardH, radius, radius, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text('INFORMATIONS CLIENT', MARGIN + 5, y + 6);

  doc.setFontSize(8.5);
  const col1X = MARGIN + 5;
  const col2X = PAGE_WIDTH / 2 + 3;
  const rowGap = 5;
  let rowY = y + 12;

  const field = (label: string, value: string, x: number, ry: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(label, x, ry);
    const lw = doc.getTextWidth(label);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.textMuted[0], COLORS.textMuted[1], COLORS.textMuted[2]);
    doc.text(value || '—', x + lw + 1.5, ry);
  };

  field('Client :', client.clientName, col1X, rowY);
  field('WhatsApp :', client.whatsapp || '—', col2X, rowY);
  rowY += rowGap;
  field('Société :', client.companyName, col1X, rowY);
  field('E-mail :', client.email || '—', col2X, rowY);
  rowY += rowGap;

  const industryLabel = client.industry ? 'Secteur :' : 'Origine :';
  const industryValue = client.industry || client.origin || '—';
  field(industryLabel, industryValue, col1X, rowY);
  field('Territoire :', client.territory || 'Maroc', col2X, rowY);

  if (client.notes) {
    rowY += rowGap;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text('Notes :', col1X, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.textMuted[0], COLORS.textMuted[1], COLORS.textMuted[2]);
    const truncated = client.notes.length > 65 ? client.notes.substring(0, 62) + '...' : client.notes;
    doc.text(truncated, col1X + 9, rowY);
  }

  return y + cardH + 8;
}

export function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.textMuted[0], COLORS.textMuted[1], COLORS.textMuted[2]);
  doc.text(title.toUpperCase(), MARGIN, y);

  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.15);
  doc.line(MARGIN, y + 1.5, PAGE_WIDTH - MARGIN, y + 1.5);

  return y + 6;
}

export interface ColumnDef {
  label: string;
  x: number;
  align?: 'left' | 'center' | 'right';
  width?: number;
}

export function addTableHeader(doc: jsPDF, columns: ColumnDef[], y: number): number {
  const headerH = 7;

  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, headerH, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);

  columns.forEach((col) => {
    const xPos = col.align === 'right' ? col.x : col.x;
    doc.text(col.label, xPos, y + 4.5, col.align ? { align: col.align } : undefined);
  });

  return y + headerH;
}

export function addTableRow(
  doc: jsPDF,
  cells: { text: string; x: number; align?: 'left' | 'center' | 'right'; bold?: boolean; fontSize?: number; color?: RGB }[],
  y: number,
  isLast?: boolean
): number {
  const rowH = 7.5;

  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.15);
  if (!isLast) doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  cells.forEach((cell) => {
    doc.setFont('helvetica', cell.bold ? 'bold' : 'normal');
    doc.setFontSize(cell.fontSize ?? 7.5);
    doc.setTextColor(
      cell.color ? cell.color[0] : COLORS.text[0],
      cell.color ? cell.color[1] : COLORS.text[1],
      cell.color ? cell.color[2] : COLORS.text[2]
    );
    doc.text(cell.text, cell.x, y + 4.5, cell.align ? { align: cell.align } : undefined);
  });

  return y + rowH;
}

export function addTotalsPanel(
  doc: jsPDF,
  htAmount: number,
  tvaAmount: number,
  ttcAmount: number,
  y: number,
  discountNote?: string
): number {
  const panelX = PAGE_WIDTH - MARGIN - 90;
  const panelW = 90;
  const panelR = 4;
  const pad = 6;
  let cy = y;

  doc.setFillColor(COLORS.darkCard[0], COLORS.darkCard[1], COLORS.darkCard[2]);
  doc.roundedRect(panelX, cy, panelW, 48, panelR, panelR, 'F');

  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(panelX, cy, panelW, 48, panelR, panelR, 'S');

  cy += pad;

  const rightX = panelX + panelW - pad;
  const labelX = panelX + pad;
  const fontSizeNormal = 8;
  const fontSizeLarge = 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSizeNormal);
  doc.setTextColor(COLORS.textMuted[0], COLORS.textMuted[1], COLORS.textMuted[2]);
  doc.text('Total HT', labelX, cy);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPriceFull(htAmount), rightX, cy, { align: 'right' });

  cy += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSizeNormal);
  doc.setTextColor(COLORS.textMuted[0], COLORS.textMuted[1], COLORS.textMuted[2]);
  doc.text('TVA (20%)', labelX, cy);
  doc.setFont('helvetica', 'bold');
  doc.text(formatPriceFull(tvaAmount), rightX, cy, { align: 'right' });

  cy += 7;

  doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.setLineWidth(0.6);
  doc.line(labelX, cy, rightX, cy);

  cy += 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSizeLarge);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text('Net à payer TTC', labelX, cy);
  doc.setFont('helvetica', 'black');
  doc.setFontSize(fontSizeLarge + 2);
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text(formatPriceFull(ttcAmount), rightX, cy, { align: 'right' });

  cy += 10;

  if (discountNote) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(COLORS.success[0], COLORS.success[1], COLORS.success[2]);
    doc.text(discountNote, panelX + panelW / 2, cy, { align: 'center' });
    cy += 4;
  }

  return cy + 4;
}

export function addSignatureBlock(doc: jsPDF, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);

  doc.text('Le client (Pour accord)', MARGIN + 10, y);
  doc.text('Ateliers NEXIFORM Maroc', PAGE_WIDTH - MARGIN - 10, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
  doc.text('(Signature & cachet)', MARGIN + 10, y + 4.5);
  doc.text('(Document certifié conforme)', PAGE_WIDTH - MARGIN - 10, y + 4.5, { align: 'right' });

  return y + 10;
}

export function addFooter(doc: jsPDF): void {
  const y = 275;

  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
  doc.text('NEXIFORM Maroc S.A.R.L — Ateliers de Confection Moderne, Boulevard d\'Anfa, Casablanca.', CENTER, y + 4.5, { align: 'center' });
  doc.text('E-mail: contact@nexiform.ma | WhatsApp: +212 6 61 00 00 00 | Document certifié conforme.', CENTER, y + 8.5, { align: 'center' });
}

export function addProcessSteps(doc: jsPDF, y: number): number {
  const steps = [
    'Prise de contact : Un conseiller Nexiform valide les dimensions et options de marquage.',
    'Envoi du BAT : Notre infographiste conçoit et vous envoie un Bon à Tirer visuel gratuit.',
    'Devis certifié : Après accord BAT, nous certifions la facturation finale et lançons la confection.',
    'Livraison : Vos articles sur-mesure livrés avec suivi logistique partout au Maroc.',
  ];

  const boxH = 28;
  doc.setFillColor(251, 253, 255);
  doc.roundedRect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, boxH, 3, 3, 'F');

  doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.setLineWidth(0.4);
  doc.line(MARGIN + 2, y + 2, MARGIN + 2, y + boxH - 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text('PROCESSUS DE PRODUCTION', MARGIN + 6, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(COLORS.textMuted[0], COLORS.textMuted[1], COLORS.textMuted[2]);

  steps.forEach((step, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const sx = col === 0 ? MARGIN + 6 : MARGIN + 6 + (PAGE_WIDTH - MARGIN * 2 - 12) / 2;
    const sy = y + 10 + row * 7.5;
    doc.text(`${i + 1}. ${step}`, sx, sy);
  });

  return y + boxH + 6;
}
