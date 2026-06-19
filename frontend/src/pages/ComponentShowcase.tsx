import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Spinner, PageLoader } from '../components/ui/Loader'
import { useToast } from '../components/ui/Toast'

/** Section wrapper with heading */
function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h2>
        {description && (
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{description}</p>
        )}
        <div className="h-0.5 mt-3 rounded-full"
             style={{ background: 'linear-gradient(to right, #2E7D32, transparent)' }} />
      </div>
      {children}
    </section>
  )
}

/** Labelled demo card */
function DemoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{label}</span>
    </div>
  )
}

export default function ComponentShowcase() {
  const [modalOpen,      setModalOpen]      = useState(false)
  const [confirmOpen,    setConfirmOpen]    = useState(false)
  const [showPageLoader, setShowPageLoader] = useState(false)
  const [inputValue,     setInputValue]     = useState('')
  const [loadingBtn,     setLoadingBtn]     = useState(false)
  const { showToast } = useToast()

  const simulateLoading = () => {
    setLoadingBtn(true)
    setTimeout(() => setLoadingBtn(false), 2000)
  }

  const simulatePageLoader = () => {
    setShowPageLoader(true)
    setTimeout(() => setShowPageLoader(false), 2500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950"
         style={{ transition: 'background-color 0.3s ease' }}>
      <Navbar />

      <main className="pt-24 pb-20">

        {/* ── Page hero ── */}
        <div
          className="py-16 mb-12"
          style={{
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span
              className="inline-block text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border"
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderColor: 'rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              🧩 Week 3 Deliverable
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              UI Component Library
            </h1>
            <p className="text-green-100 text-lg max-w-xl mx-auto leading-relaxed">
              Reusable, accessible, TypeScript-typed components built with Tailwind CSS.
              Full dark mode support included.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-green-100">
              {['TypeScript', 'Tailwind CSS', 'Dark Mode', 'Accessible', 'React 19'].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-5xl mx-auto px-6">

          {/* ─── BUTTONS ─── */}
          <ShowcaseSection
            title="Button"
            description="Four variants × three sizes — with loading and disabled states."
          >
            {/* Variants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <DemoCard label="variant=primary">
                <Button variant="primary">Book Now</Button>
              </DemoCard>
              <DemoCard label="variant=secondary">
                <Button variant="secondary">Learn More</Button>
              </DemoCard>
              <DemoCard label="variant=outline">
                <Button variant="outline">Explore</Button>
              </DemoCard>
              <DemoCard label="variant=danger">
                <Button variant="danger">Cancel Stay</Button>
              </DemoCard>
            </div>

            {/* Sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <DemoCard label="size=sm">
                <Button size="sm">Small</Button>
              </DemoCard>
              <DemoCard label="size=md (default)">
                <Button size="md">Medium</Button>
              </DemoCard>
              <DemoCard label="size=lg">
                <Button size="lg">Large</Button>
              </DemoCard>
            </div>

            {/* States */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <DemoCard label="loading=true">
                <Button loading={loadingBtn} onClick={simulateLoading}>
                  {loadingBtn ? 'Saving…' : 'Click to Load'}
                </Button>
              </DemoCard>
              <DemoCard label="disabled=true">
                <Button disabled>Disabled</Button>
              </DemoCard>
              <DemoCard label="fullWidth=true">
                <Button fullWidth>Full Width</Button>
              </DemoCard>
            </div>
          </ShowcaseSection>

          {/* ─── INPUTS ─── */}
          <ShowcaseSection
            title="Input"
            description="Label, helper text, error state, and left/right icon slot support."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Input
                label="Destination"
                placeholder="Munsiyari, Uttarakhand"
                helperText="Type a city or region name"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                leftIcon={<span>📍</span>}
              />
              <Input
                label="Check-in Date"
                type="date"
                leftIcon={<span>📅</span>}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error="Please enter a valid email address"
                leftIcon={<span>✉️</span>}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 characters"
                helperText="Use uppercase, numbers and symbols"
                leftIcon={<span>🔒</span>}
              />
              <Input
                label="Disabled Input"
                placeholder="Cannot edit"
                disabled
                leftIcon={<span>🚫</span>}
              />
              <Input
                label="Search Stays"
                placeholder="Forest, Mountain, Riverside…"
                rightIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                }
              />
            </div>
          </ShowcaseSection>

          {/* ─── MODAL ─── */}
          <ShowcaseSection
            title="Modal"
            description="Portal-rendered with ESC key, outside-click close, and smooth animation."
          >
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Open Info Modal
              </Button>
              <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                Open Confirm Modal
              </Button>
            </div>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="🌿 Booking Information"
            >
              <div className="space-y-3">
                <p>
                  Your stay at <strong>Mountain Retreat, Munsiyari</strong> is ready to confirm.
                  Summary:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Check-in: 20 July 2025</li>
                  <li>Check-out: 23 July 2025</li>
                  <li>Guests: 2 adults</li>
                  <li>Total: ₹9,600</li>
                </ul>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Free cancellation until 48 hours before check-in.
                </p>
              </div>
            </Modal>

            <Modal
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              title="⚠️ Confirm Cancellation"
              size="sm"
              footer={
                <>
                  <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(false)}>
                    Keep Booking
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setConfirmOpen(false)
                      showToast('Booking cancelled successfully', 'success')
                    }}
                  >
                    Yes, Cancel
                  </Button>
                </>
              }
            >
              <p>Are you sure you want to cancel? This action cannot be undone.</p>
            </Modal>
          </ShowcaseSection>

          {/* ─── TOAST ─── */}
          <ShowcaseSection
            title="Toast"
            description="Four types — auto-dismiss after 3 seconds. Click any button to trigger."
          >
            <div className="flex flex-wrap gap-3">
              <Button variant="primary"
                onClick={() => showToast('Booking confirmed! 🎉', 'success')}>
                ✅ Success Toast
              </Button>
              <Button variant="danger"
                onClick={() => showToast('Payment failed. Please retry.', 'error')}>
                ❌ Error Toast
              </Button>
              <Button variant="secondary"
                onClick={() => showToast('Only 2 rooms left for this date.', 'warning')}>
                ⚠️ Warning Toast
              </Button>
              <Button variant="outline"
                onClick={() => showToast('New eco-stays added in Kerala!', 'info')}>
                ℹ️ Info Toast
              </Button>
            </div>
          </ShowcaseSection>

          {/* ─── LOADER ─── */}
          <ShowcaseSection
            title="Loader"
            description="Spinner (inline) and PageLoader (fullscreen overlay). Four size variants."
          >
            <div className="mb-8">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Spinner sizes
              </p>
              <div className="flex items-end gap-8 flex-wrap">
                {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                  <DemoCard key={s} label={`size=${s}`}>
                    <Spinner size={s} />
                  </DemoCard>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                PageLoader (fullscreen)
              </p>
              <Button variant="outline" onClick={simulatePageLoader}>
                🌀 Trigger PageLoader (2.5s)
              </Button>
            </div>
          </ShowcaseSection>

        </div>
      </main>

      {/* PageLoader is only mounted when showPageLoader is true — never permanently visible */}
      {showPageLoader && <PageLoader fullscreen message="Loading eco-stays…" />}

      <Footer />
    </div>
  )
}
