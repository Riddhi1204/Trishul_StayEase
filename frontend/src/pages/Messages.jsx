import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { fetchInbox, fetchConversation, sendMessage } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Messages.css'

export default function Messages() {
  const [inbox, setInbox] = useState([])
  const [activeBookingId, setActiveBookingId] = useState(null)
  const [conversation, setConversation] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadInbox()
  }, [])

  useEffect(() => {
    if (activeBookingId) {
      loadConversation(activeBookingId)
      // Optionally set up polling here
      const interval = setInterval(() => loadConversation(activeBookingId), 5000)
      return () => clearInterval(interval)
    }
  }, [activeBookingId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const loadInbox = async () => {
    try {
      const data = await fetchInbox()
      setInbox(data)
      if (data.length > 0 && !activeBookingId) {
        setActiveBookingId(data[0].booking_id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async (bookingId) => {
    try {
      const msgs = await fetchConversation(bookingId)
      setConversation(msgs)
      // Update unread count in inbox locally
      setInbox(prev => prev.map(item => 
        item.booking_id === bookingId ? { ...item, unread_count: 0 } : item
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeBookingId) return

    try {
      const msg = await sendMessage({
        booking_id: activeBookingId,
        message: newMessage
      })
      setConversation(prev => [...prev, msg])
      setNewMessage('')
      
      // Update inbox latest message locally
      setInbox(prev => prev.map(item => 
        item.booking_id === activeBookingId 
          ? { ...item, latest_message: { message: msg.message, created_at: msg.created_at, sender_id: msg.sender_id } } 
          : item
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const activeInboxItem = inbox.find(item => item.booking_id === activeBookingId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: 'var(--bg)' }}>
        
        {/* Inbox Sidebar */}
        <div style={{ width: '350px', borderRight: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ margin: 0 }}>Messages</h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading...</p>
            ) : inbox.length === 0 ? (
              <p style={{ padding: '1rem', color: 'var(--text-muted)' }}>No messages yet.</p>
            ) : (
              inbox.map(item => (
                <div 
                  key={item.booking_id}
                  onClick={() => setActiveBookingId(item.booking_id)}
                  style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: activeBookingId === item.booking_id ? 'rgba(46, 125, 50, 0.1)' : 'transparent',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={item.property?.images?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&q=80'} 
                    alt={item.property?.title}
                    style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.property?.title || 'Unknown Property'}
                      </strong>
                      {item.unread_count > 0 && (
                        <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '10px' }}>
                          {item.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.latest_message ? item.latest_message.message : 'No messages yet'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
          {activeBookingId && activeInboxItem ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src={activeInboxItem.property?.images?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&q=80'} 
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  alt=""
                />
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>{activeInboxItem.property?.title || 'Unknown'}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Booking ID: {activeInboxItem.booking_id.substring(0, 8)}...
                  </p>
                </div>
              </div>
              
              {/* Messages Container */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {conversation.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Send a message to start the conversation.</p>
                ) : (
                  conversation.map(msg => {
                    const isMine = msg.sender_id === user.id
                    return (
                      <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                        <div style={{ 
                          background: isMine ? 'var(--primary)' : 'var(--card-bg)', 
                          color: isMine ? '#fff' : 'var(--text)',
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px',
                          border: isMine ? 'none' : '1px solid var(--border)',
                          borderBottomRightRadius: isMine ? '2px' : '12px',
                          borderBottomLeftRadius: !isMine ? '2px' : '12px'
                        }}>
                          {msg.message}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isMine ? 'right' : 'left' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMine && msg.read && <span style={{ marginLeft: '4px', color: '#3b82f6' }}>✓✓</span>}
                          {isMine && !msg.read && <span style={{ marginLeft: '4px' }}>✓</span>}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div style={{ padding: '1rem 1.5rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg)' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '20px', padding: '0 1.5rem' }} disabled={!newMessage.trim()}>
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
