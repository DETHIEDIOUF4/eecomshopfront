import React, { useState } from 'react';

const WHATSAPP_URL = "https://wa.me/221788797628"; // Remplace par ton numéro

const WhatsAppButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <a
        onClick={e => { e.preventDefault(); setOpen(true); }}
        href={WHATSAPP_URL}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: '#25D366',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}
        aria-label="Contactez-nous sur WhatsApp"
      >
        <img
          src="/icons/whatsapp.png"
          alt="WhatsApp"
          style={{ width: 36, height: 36 }}
        />
      </a>

      {/* Popup WhatsApp */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            zIndex: 1100,
            width: 320,
            maxWidth: '90vw',
            background: '#222',
            borderRadius: 24,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            color: '#fff',
            overflow: 'hidden',
            fontFamily: 'inherit'
          }}
        >
          {/* Header */}
          <div style={{
            background: '#25D366',
            color: '#fff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center' }}>
              <img src="/icons/whatsapp.png" alt="WhatsApp" style={{ width: 24, height: 24, marginRight: 8 }} />
              WhatsApp
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: 22,
                cursor: 'pointer',
                lineHeight: 1
              }}
              aria-label="Fermer"
            >×</button>
          </div>
          {/* Message */}
          <div style={{
            padding: '24px 16px 16px 16px',
            background: '#222'
          }}>
            <div style={{
              background: '#444',
              color: '#fff',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 16,
              fontSize: 16,
              maxWidth: 260
            }}>
              Salut 👋<br />
              Besoin d'aide ?
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#25D366',
                color: '#fff',
                borderRadius: 32,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: 18,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'background 0.2s'
              }}
            >
              Ouvrir la discussion&nbsp;
              <span style={{ fontSize: 22, verticalAlign: 'middle' }}>➤</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton; 