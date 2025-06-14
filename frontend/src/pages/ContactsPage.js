import React from 'react';
import backgroundImage1 from '../assets/background_lp.jpg';
import iconLogo from '../assets/icone.png';

function ContactsPage() {
  return (
    <div
      className="contacts-container"
      style={{
        backgroundImage: `url(${backgroundImage1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="relative contact-card" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
      <img src={iconLogo} alt="A.FAGO Logo" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '200px', marginBottom: '1rem' }} />
        <p>Email: <a href="mailto:afagosolucoesbiotecnologicas@gmail.com">afagosolucoesbiotecnologicas@gmail.com</a></p>
        <p>WhatsApp: <a href="https://wa.me/5531986867740" target="_blank" rel="noopener noreferrer">(31) 9868-67740</a></p>
        <p>LinkedIn: Em breve</p>
      </div>
    </div>
  );
}

export default ContactsPage;
