import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | Trishul StayEase"
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-main container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', color: 'var(--primary)' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)' }}>Effective Date: July 16, 2026</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem', lineHeight: '1.6' }}>
          <section>
            <h2>1. Introduction</h2>
            <p>Welcome to Trishul StayEase. By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
          </section>

          <section>
            <h2>2. Eligibility</h2>
            <p>You must be at least 18 years old to create an account and use the Trishul StayEase booking platform.</p>
          </section>

          <section>
            <h2>3. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials (including Google OAuth linked accounts) and for all activities that occur under your account.</p>
          </section>

          <section>
            <h2>4. Guest Responsibilities</h2>
            <p>Guests agree to respect the properties, follow the house rules set by hosts, and leave the property in the condition it was found. Any damages caused during the stay are the financial responsibility of the guest.</p>
          </section>

          <section>
            <h2>5. Host Responsibilities</h2>
            <p>Hosts must accurately describe their properties, maintain a clean and safe environment, and honor accepted bookings. Hosts must adhere to all local laws and regulations regarding short-term rentals and homestays.</p>
          </section>

          <section>
            <h2>6. Booking Policies</h2>
            <p>All bookings are subject to availability and host approval. A booking is only confirmed once accepted by the host and payment terms are met.</p>
          </section>

          <section>
            <h2>7. Cancellation and Refund Policy</h2>
            <p>Cancellations are subject to the specific policy selected by the host at the time of booking. Platform service fees may be non-refundable.</p>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>All content on the platform, including the Trishul StayEase logo, design, text, and graphics, are the intellectual property of Trishul StayEase. You may not copy, modify, or distribute our content without written permission.</p>
          </section>

          <section>
            <h2>9. Acceptable Use</h2>
            <p>You agree not to use the platform for any unlawful purpose, to upload malicious code, to attempt to bypass our security (including JWT validation), or to scrape data from the website.</p>
          </section>

          <section>
            <h2>10. Account Suspension/Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these Terms, receive consistent negative feedback, or engage in fraudulent activities, without prior notice.</p>
          </section>

          <section>
            <h2>11. Limitation of Liability</h2>
            <p>Trishul StayEase acts merely as a platform connecting guests and hosts. We are not liable for any personal injury, property damage, or other damages arising from your use of the properties booked through our service.</p>
          </section>

          <section>
            <h2>12. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
