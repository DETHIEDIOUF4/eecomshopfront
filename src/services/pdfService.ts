import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from './orderService';

// Fonction pour formater les nombres sans espaces
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const generateOrderPDF = (order: Order) => {
    const doc = new jsPDF('p', 'mm', 'a4'); // Format A4 portrait
    
    // Fonction pour créer une facture
    const createInvoice = (startX: number, startY: number, width: number, height: number) => {
        // Ajouter le logo en haut à droite
        try {
            doc.addImage('/logo.png', 'PNG', startX + width - 25, startY + 2, 20, 10);
        } catch (error) {
            console.log('Logo non trouvé, utilisation du texte uniquement');
        }
        
        // Titre principal
        // doc.setFontSize(14);
        // doc.setFont('helvetica', 'bold');
        // doc.text('HELLOGASSY', startX + width/2, startY + 8, { align: 'center' });
        
        // Ticket de commande en haut
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Ticket de commande', startX + 3, startY + 15);
        
        // Informations de la commande
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`Commande #${order._id?.slice(-8)}`, startX + 3, startY + 22);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, startX + 3, startY + 28);
        doc.text(`Heure: ${new Date(order.createdAt).toLocaleTimeString('fr-FR')}`, startX + 3, startY + 34);
        
        // Détails client
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('Client:', startX + 3, startY + 42);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(`${order.personalInfo?.firstName} ${order.personalInfo.lastName}`, startX + 3, startY + 48);
        doc.text(`Tel: ${order.personalInfo.phone}`, startX + 3, startY + 54);
        
        // Note sur les lots de 25 pièces
        const hasLowPriceItems = order.orderItems.some(item => item.price <= 200);
        // if (hasLowPriceItems) {
        //     doc.setFont('helvetica', 'bold');
        //     doc.setFontSize(6);
        //     doc.setTextColor(220, 53, 69); // Rouge
        //     doc.text('Note: Les produits ≤ 200 FCFA se vendent par lots de 25 pièces', startX + 3, startY + 62);
        //     doc.setTextColor(0, 0, 0); // Remettre en noir
        // }
        
        // Mode de livraison et paiement
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text('Livraison:', startX + 3, startY + ( 62));
        doc.setFont('helvetica', 'normal');
        doc.text(order.shippingPrice === 0 ? 'Retrait' : 'Livraison', startX + 3, startY + ( 68));
        
        doc.setFont('helvetica', 'bold');
        doc.text('Paiement:', startX + 3, startY + (75));
        doc.setFont('helvetica', 'normal');
        doc.text(order.paymentMethod, startX + 3, startY + (81));
        
        // Tableau des produits
        const tableData = order.orderItems.map(item => {
            if (item.price <= 200) {
                // Pour les produits ≤ 200 FCFA, afficher les lots de 25 pièces
                return [
                    item.name,
                    `${item.quantity} lot${item.quantity > 1 ? 's' : ''} de 25`,
                    `${formatNumber(item.price)}`,
                    `${formatNumber(item.quantity * item.price * 25)}`
                ];
            } else {
                // Pour les produits > 200 FCFA, affichage normal
                return [
                    item.name,
                    item.quantity.toString(),
                    `${formatNumber(item.price)}`,
                    `${formatNumber(item.quantity * item.price)}`
                ];
            }
        });
        
        autoTable(doc, {
            startY: startY + (hasLowPriceItems ? 96 : 88),
            head: [['Produit', 'Qté', 'Prix', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [14, 165, 233], // Bleu tech
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 8
            },
            styles: {
                fontSize: 7,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: width * 0.4 - 6 }, // Produit
                1: { cellWidth: width * 0.15 - 3, halign: 'center' }, // Quantité
                2: { cellWidth: width * 0.2 - 3, halign: 'right' }, // Prix
                3: { cellWidth: width * 0.25 - 3, halign: 'right' } // Total
            },
            margin: { left: startX + 3, right: 3 }
        });
        
        // Calculer la position Y après le tableau
        const finalY = (doc as any).lastAutoTable.finalY + 3;
        
        // Résumé financier
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text('Total:', startX + 3, finalY);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(`${formatNumber(order.totalPrice)} FCFA`, startX + 3, finalY + 6);
        
        // Pied de page
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5);
        doc.text('Merci  et à bientôt !', startX + width/2, finalY + 12, { align: 'center' });
    };
    
    // Créer la première facture (haut)
    createInvoice(0, 0, 210, 148); // Moitié haute de A4 portrait
    
    // Ligne de coupe horizontale au milieu
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([5, 5], 0); // Ligne pointillée
    doc.line(0, 148, 210, 148); // Ligne horizontale au milieu
    
    // Créer la deuxième facture (bas)
    createInvoice(0, 148, 210, 148); // Moitié basse de A4 portrait
    
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
