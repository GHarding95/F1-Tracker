import React from 'react';

type AppFooterProps = {
  variant?: 'default' | 'splash';
};

const AppFooter: React.FC<AppFooterProps> = ({ variant = 'default' }) => (
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

export default AppFooter;
