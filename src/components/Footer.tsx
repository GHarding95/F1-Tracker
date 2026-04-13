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
      <span className="app-footer__copy">©</span>
      <span className="app-footer__line">
        {new Date().getFullYear()} Glen Harding
      </span>
    </p>
  </footer>
);

export default Footer;
