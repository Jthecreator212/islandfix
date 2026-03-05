'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  booking_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: { full_name: string }
}

interface Props {
  bookingId: string
  currentUserId: string
  initialMessages: Message[]
}

export default function BookingMessages({ bookingId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
        async (payload) => {
          // Fetch the full message with sender info
          const { data } = await supabase
            .from('messages')
            .select('*, sender:profiles!sender_id(full_name)')
            .eq('id', payload.new.id)
            .single()
          if (data) {
            setMessages(prev => [...prev, data])
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [bookingId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    const supabase = createClient()
    await supabase.from('messages').insert({
      booking_id: bookingId,
      sender_id: currentUserId,
      content: newMessage.trim(),
    })
    setNewMessage('')
    setSending(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#c8d1dc] overflow-hidden">
      {/* Messages list */}
      <div className="h-80 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-[#4a5568] text-sm py-10">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                isMe ? 'bg-[#4fc3f7] text-white rounded-br-sm' : 'bg-[#f0f4f8] text-[#1a1a2e] rounded-bl-sm'
              }`}>
                {!isMe && (
                  <p className="text-xs font-medium mb-1 opacity-70">{msg.sender?.full_name || 'Unknown'}</p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-[#4a5568]'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="border-t border-[#c8d1dc] p-4 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#f0f4f8] border border-[#c8d1dc] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#4fc3f7]"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="bg-[#4fc3f7] text-white p-2.5 rounded-xl hover:bg-[#81d4fa] transition-colors disabled:opacity-50"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  )
}
