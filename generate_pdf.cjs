const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('public/privacy-policy.pdf'));

doc.fontSize(20).text('Privacy Policy', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text('Last Updated: June 2026');
doc.moveDown();
doc.text('Welcome to Sukrutha. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect information when you visit our website and use our fleet intelligence and vehicle analytics services.');
doc.moveDown();

doc.fontSize(16).text('1. Information We Collect');
doc.moveDown();
doc.fontSize(12).text('We may collect the following types of information:');
doc.moveDown();
doc.text('Personal Information', { underline: true });
doc.list([
  'Name',
  'Email address',
  'Phone number',
  'Company name',
  'Job title',
  'Billing information'
]);
doc.moveDown();
doc.text('Vehicle & Fleet Data', { underline: true });
doc.list([
  'Vehicle location and GPS data',
  'Vehicle speed and route history',
  'Driver behavior data',
  'Fuel consumption information',
  'Trip and journey records',
  'Vehicle health and diagnostic information',
  'Crash and incident data'
]);
doc.moveDown();
doc.text('Technical Information', { underline: true });
doc.list([
  'IP address',
  'Browser type and version',
  'Device information',
  'Website usage statistics',
  'Cookies and analytics data'
]);
doc.moveDown();

doc.fontSize(16).text('2. How We Use Your Information');
doc.moveDown();
doc.fontSize(12).text('We use collected information to:');
doc.moveDown();
doc.list([
  'Provide fleet monitoring and analytics services',
  'Improve platform performance and user experience',
  'Generate reports and insights',
  'Detect accidents, misuse, and security threats',
  'Communicate service updates and support information',
  'Process payments and subscriptions',
  'Comply with legal obligations'
]);
doc.moveDown();

doc.fontSize(16).text('3. Data Sharing');
doc.moveDown();
doc.fontSize(12).text('We do not sell personal information.\n\nWe may share information with:');
doc.moveDown();
doc.list([
  'Authorized employees and contractors',
  'Cloud hosting and infrastructure providers',
  'Payment processing providers',
  'Government or law enforcement agencies when legally required',
  'Business partners involved in service delivery'
]);
doc.moveDown();

doc.fontSize(16).text('4. Data Security');
doc.moveDown();
doc.fontSize(12).text('We implement industry-standard security measures including:');
doc.moveDown();
doc.list([
  'Data encryption',
  'Secure cloud storage',
  'Access controls and authentication',
  'Regular security monitoring',
  'Backup and disaster recovery procedures'
]);
doc.moveDown();
doc.text('However, no internet-based system can guarantee 100% security.');
doc.moveDown();

doc.fontSize(16).text('5. Data Retention');
doc.moveDown();
doc.fontSize(12).text('We retain data only for as long as necessary to:');
doc.moveDown();
doc.list([
  'Deliver our services',
  'Meet legal and regulatory requirements',
  'Resolve disputes',
  'Enforce agreements'
]);
doc.moveDown();
doc.text('Data may be securely deleted upon request, subject to legal obligations.');
doc.moveDown();

doc.fontSize(16).text('6. Cookies and Tracking Technologies');
doc.moveDown();
doc.fontSize(12).text('Our website may use cookies and similar technologies to:');
doc.moveDown();
doc.list([
  'Remember user preferences',
  'Analyze website traffic',
  'Improve functionality',
  'Enhance security'
]);
doc.moveDown();
doc.text('Users can manage cookie preferences through their browser settings.');
doc.moveDown();

doc.fontSize(16).text('7. User Rights');
doc.moveDown();
doc.fontSize(12).text('Depending on applicable laws, users may have the right to:');
doc.moveDown();
doc.list([
  'Access their personal data',
  'Correct inaccurate information',
  'Request deletion of data',
  'Restrict data processing',
  'Withdraw consent where applicable',
  'Request a copy of their data'
]);
doc.moveDown();
doc.text('To exercise these rights, contact us using the details below.');
doc.moveDown();

doc.fontSize(16).text('8. Third-Party Services');
doc.moveDown();
doc.fontSize(12).text('Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties.');
doc.moveDown();

doc.fontSize(16).text("9. Children's Privacy");
doc.moveDown();
doc.fontSize(12).text('Our services are intended for business and commercial use. We do not knowingly collect personal information from children under the age of 13.');
doc.moveDown();

doc.fontSize(16).text('10. International Data Transfers');
doc.moveDown();
doc.fontSize(12).text('Your information may be processed and stored in locations outside your country of residence. We take reasonable measures to protect transferred data.');
doc.moveDown();

doc.fontSize(16).text('11. Changes to This Privacy Policy');
doc.moveDown();
doc.fontSize(12).text('We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date.');
doc.moveDown();

doc.fontSize(16).text('12. Contact Us');
doc.moveDown();
doc.fontSize(12).text('For any privacy-related questions or requests, please contact:\n\nSukrutha\nEmail: privacy@sukrutha.com\nPhone: +91 6363390074\nAddress: sukurtha@gmail.com');
doc.moveDown();

doc.end();
