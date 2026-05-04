import React from 'react';

const Footer = () => {
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © Designed &amp; Developed by{' '}
          <a href="https://github.com/nmorab28/planify-monorepo" target="_blank" rel="noreferrer">
            Planify
          </a>{' '}
          {d.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
