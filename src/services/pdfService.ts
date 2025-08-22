import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAllOrders, deliverOrder, Order } from './orderService';

// Fonction pour formater les nombres sans espaces
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const generateOrderPDF = (order: Order) => {
    const doc = new jsPDF();
    
    // Titre principal
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('HELLOGASSY', 105, 20, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Ticket de commande', 105, 30, { align: 'center' });
    
    // Informations de la commande
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Commande #${order._id?.slice(-8)}`, 20, 45);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 20, 55);
    doc.text(`Heure: ${new Date(order.createdAt).toLocaleTimeString('fr-FR')}`, 20, 62);
    
    // Détails client
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Détails Client:', 20, 80);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nom: ${order.personalInfo?.firstName} ${order.personalInfo.lastName}`, 20, 90);
    doc.text(`Téléphone: ${order.personalInfo.phone}`, 20, 100);
    doc.text(`Email: ${order.personalInfo.email}`, 20, 110);
    
    // Mode de livraison et paiement
    doc.setFont('helvetica', 'bold');
    doc.text('Mode de livraison:', 20, 125);
    doc.setFont('helvetica', 'normal');
    doc.text(order.shippingPrice === 0 ? 'Retrait Magasin' : 'Livraison', 20, 135);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Mode de paiement:', 20, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(order.paymentMethod, 20, 160);
    
    // Tableau des produits
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Produits commandés:', 20, 180);
    
    const tableData = order.orderItems.map(item => [
        item.name,
        item.quantity.toString(),
        `${formatNumber(item.price)} FCFA`,
        `${formatNumber(item.quantity * item.price)} FCFA`
    ]);
    
    autoTable(doc, {
        startY: 175,
        head: [['Produit', 'Qté', 'Prix unit.', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
        },
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        columnStyles: {
            0: { cellWidth: 60 }, // Produit - plus étroit
            1: { cellWidth: 20, halign: 'center' }, // Quantité - plus étroit
            2: { cellWidth: 40, halign: 'right' }, // Prix unitaire - plus large
            3: { cellWidth: 45, halign: 'right' } // Total - plus large
        },
        margin: { left: 20, right: 20 }
    });
    
    // Calculer la position Y après le tableau
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Résumé financier
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Résumé:', 20, finalY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Sous-total: ${formatNumber(order.itemsPrice)} FCFA`, 20, finalY + 10);
    doc.text(`Livraison: ${formatNumber(order.shippingPrice)} FCFA`, 20, finalY + 17);
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, finalY + 22, 190, finalY + 22);
    
    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total: ${formatNumber(order.totalPrice)} FCFA`, 20, finalY + 32);
    
    // Pied de page
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Merci pour votre commande !', 105, finalY + 50, { align: 'center' });
    doc.text('HELLOGASSY - Votre satisfaction est notre priorité', 105, finalY + 57, { align: 'center' });
    
    // Générer le PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Ouvrir dans un nouvel onglet
    const newWindow = window.open(pdfUrl, '_blank');
    if (newWindow) {
        newWindow.focus();
    }
    
    // Nettoyer l'URL
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    
    return pdfBlob;
};
