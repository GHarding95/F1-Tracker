import React from 'react';
import './footer.css';

type FooterProps = {
  variant?: 'default' | 'splash';
};

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => (
  <footer
    className={
      variant === 'splash' ? 'app-footer app-footer--splash' : 'app-footer'
    }
  >
    <p className="app-footer__text Titillium">
      © {new Date().getFullYear()} Glen Harding
    </p>
  </footer>
);

export default Footer;
