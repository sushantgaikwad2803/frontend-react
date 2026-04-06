import React from "react";


function TermsConditions() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto", lineHeight: "1.7" }}>
      <h1>Terms & Conditions</h1>

      <p>
        Welcome to <strong>Annual Report Platform</strong>. By accessing and using this website,
        you agree to comply with and be bound by the following terms and conditions.
        If you do not agree with any part of these terms, please do not use our services.
      </p>

      <h2>1. Content Disclaimer</h2>
      <p>
        This platform provides financial and company-related information for general
        informational purposes only. The content available on this website is not intended
        to be financial or investment advice.
      </p>
      <p>
        We do not guarantee the accuracy, completeness, or timeliness of the information
        provided. Users should independently verify any data before making financial or
        investment decisions.
      </p>

      <h2>2. No Investment Advice</h2>
      <p>
        The information provided on this platform should not be considered as a recommendation
        to buy, sell, or hold any securities. We do not endorse any specific investment strategy
        or financial decision.
      </p>

      <h2>3. Third-Party Links</h2>
      <p>
        Our website may contain links to third-party websites for additional information.
        We do not control or take responsibility for the content, accuracy, or practices
        of these external websites.
      </p>
      <p>
        Accessing third-party sites is at your own risk.
      </p>

      <h2>4. Disclaimer of Warranties</h2>
      <p>
        All content and services on this platform are provided on an “as is” and “as available”
        basis without any warranties of any kind, either express or implied.
      </p>
      <p>
        We do not guarantee that:
      </p>
      <ul>
        <li>The website will be error-free or uninterrupted</li>
        <li>Defects will be corrected</li>
        <li>The server is free of viruses or harmful components</li>
        <li>The information is always accurate or up-to-date</li>
      </ul>

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall we be liable for any direct, indirect, incidental, or consequential
        damages arising from the use or inability to use this website or its services.
      </p>
      <p>
        This includes damages related to loss of data, profits, or business opportunities.
      </p>

      <h2>6. User Responsibility</h2>
      <p>
        Users are responsible for verifying the accuracy of the information and for maintaining
        appropriate security measures while using this platform.
      </p>

      <h2>7. Changes to Terms</h2>
      <p>
        We reserve the right to update or modify these Terms & Conditions at any time without
        prior notice. Continued use of the website constitutes acceptance of the updated terms.
      </p>

      <h2>8. Contact</h2>
      <p>
        If you have any questions regarding these Terms & Conditions, please contact us through
        the website.
      </p>

      <p style={{ marginTop: "30px", fontSize: "14px", color: "gray" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}

export default TermsConditions;