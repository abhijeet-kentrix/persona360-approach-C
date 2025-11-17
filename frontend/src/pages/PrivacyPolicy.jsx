import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      lineHeight: '1.6',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      color: '#333'
    }}>
      <h1 style={{
        color: '#143550',
        borderBottom: '2px solid #143550',
        paddingBottom: '10px'
      }}>
        Privacy Policy
      </h1>
      <p style={{
        color: '#666',
        fontStyle: 'italic'
      }}>
        Effective Date: January 17, 2025
      </p>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        Introduction
      </h2>
      <p>
        Know Your India ("we," "our," or "us") is committed to protecting your privacy.
        This Privacy Policy explains how we handle information when you use our mobile application.
      </p>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        Information We Do NOT Collect
      </h2>
      <p>
        Know Your India does not collect, store, or transmit any personal information or user data.
        Specifically, we do not:
      </p>
      <ul style={{
        margin: '10px 0',
        paddingLeft: '25px'
      }}>
        <li>Collect personal identifiable information</li>
        <li>Track your location</li>
        <li>Access your photos or camera</li>
        <li>Use analytics or tracking tools</li>
        <li>Require account creation or login</li>
        <li>Store any data on our servers</li>
        <li>Share any information with third parties</li>
      </ul>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        How the App Works
      </h2>
      <p>
        Know Your India provides visualizations of demographic and market data for various Indian states.
        All data displayed in the app is:
      </p>
      <ul style={{
        margin: '10px 0',
        paddingLeft: '25px'
      }}>
        <li>Pre-loaded within the application</li>
        <li>Publicly available statistical information</li>
        <li>Stored locally on your device only</li>
      </ul>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        Permissions
      </h2>
      <p>The app does not request or require any device permissions to function.</p>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        Third-Party Services
      </h2>
      <p>Know Your India does not integrate with any third-party services or SDKs that collect user data.</p>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        Children's Privacy
      </h2>
      <p>Our app does not collect any information from anyone, including children under the age of 13.</p>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        Changes to This Privacy Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be reflected with an updated
        effective date. We encourage you to review this Privacy Policy periodically.
      </p>

      <h2 style={{
        color: '#143550',
        marginTop: '30px'
      }}>
        Contact Us
      </h2>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '30px'
      }}>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>
          <strong>Kentrix</strong><br />
          Email: <a href="mailto:info@kentrix.in">info@kentrix.in</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
