import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

export default function RealtimeChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const bottomRef = useRef(null)

  // Fetch existing messages
  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  useEffect(() => {
    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    await supabase.from('messages').insert({
      content: newMsg,
      user_id: user.id,
      username: user.email.split('@')[0]
    })
    setNewMsg('')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px' }}>
      <h2>⚡ Realtime Chat</h2>

      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '12px', marginBottom: '12px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '8px' }}>
            <strong>{msg.username}: </strong>{msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}