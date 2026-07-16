import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Trishul StayEase"
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', color: 'var(--primary)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)' }}>Effective Date: July 16, 2026</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem', lineHeight: '1.6' }}>
          <section>
            <h2>1. Introduction</h2>
            <p>Welcome to Trishul StayEase. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and share information when you use our eco-homestay booking platform.</p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We collect information you provide directly to us, including your name, email address, phone number, and any other details you provide when registering as a guest or a host.</p>
          </section>

          <section>
            <h2>3. Google OAuth Information</h2>
            <p>Trishul StayEase allows you to log in using Google OAuth. If you choose this authentication method, we access your basic Google profile information (such as your name, email address, and profile picture). We use this information solely to create and manage your Trishul StayEase account and do not share it with any third parties.</p>
          </section>

          <section>
            <h2>4. Authentication (JWT)</h2>
            <p>We use JSON Web Tokens (JWT) for secure authentication. When you log in, a token is generated and stored locally on your device to maintain your session.</p>
          </section>

          <section>
            <h2>5. MongoDB Atlas Data Storage</h2>
            <p>All user profiles, booking information, and property listings are securely stored in MongoDB Atlas, a highly secure and compliant cloud database provider.</p>
          </section>

          <section>
            <h2>6. Cookies and Local Storage</h2>
            <p>We use local storage and cookies to improve your user experience, such as keeping you logged in and remembering your theme preferences (e.g., dark mode). You can clear this data through your browser settings.</p>
          </section>

          <section>
            <h2>7. Third-Party Services</h2>
            <p>Our platform is deployed and hosted on Render (Backend) and Vercel (Frontend). These services may collect basic analytics and logs required for system performance and security monitoring.</p>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active or as needed to provide you with our services, comply with legal obligations, and resolve disputes.</p>
          </section>

          <section>
            <h2>9. Account Deletion & User Rights</h2>
            <p>You have the right to request the deletion of your account and associated personal data at any time. To do so, please contact our support team. We will process your request within 30 days.</p>
          </section>

          <section>
            <h2>10. Children's Privacy</h2>
            <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2>11. Contact Information</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us via our Contact Page or email us at support@trishulstayease.com.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
