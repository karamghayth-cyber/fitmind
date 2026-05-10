import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, ChatSession, ChatContext } from '../types'
import { generateId } from '../utils'

interface ChatState {
  sessions: ChatSession[]
  activeSession: ChatSession | null
  isStreaming: boolean
  streamingContent: string
  error: string | null

  createSession: (context?: ChatContext) => ChatSession
  selectSession: (id: string) => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setStreaming: (v: boolean) => void
  appendChunk: (chunk: string) => void
  finalizeStream: () => void
  clearError: () => void
  deleteSession: (id: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      isStreaming: false,
      streamingContent: '',
      error: null,

      createSession: (context = 'general') => {
        const session: ChatSession = {
          id: generateId(),
          userId: 'current',
          title: 'New conversation',
          messages: [],
          context,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(s => ({ sessions: [session, ...s.sessions], activeSession: session }))
        return session
      },

      selectSession: (id) => {
        const session = get().sessions.find(s => s.id === id) || null
        set({ activeSession: session })
      },

      addMessage: (msg) => {
        const message: ChatMessage = { ...msg, id: generateId(), timestamp: new Date().toISOString() }
        set(s => {
          if (!s.activeSession) return s
          const updated = { ...s.activeSession, messages: [...s.activeSession.messages, message], updatedAt: new Date().toISOString() }
          return {
            activeSession: updated,
            sessions: s.sessions.map(sess => sess.id === updated.id ? updated : sess),
          }
        })
      },

      setStreaming: (v) => set({ isStreaming: v, streamingContent: v ? '' : get().streamingContent }),

      appendChunk: (chunk) => set(s => ({ streamingContent: s.streamingContent + chunk })),

      finalizeStream: () => {
        const content = get().streamingContent
        if (!content) return
        const message: ChatMessage = { id: generateId(), role: 'assistant', content, timestamp: new Date().toISOString() }
        set(s => {
          if (!s.activeSession) return { isStreaming: false, streamingContent: '' }
          const updated = { ...s.activeSession, messages: [...s.activeSession.messages, message], updatedAt: new Date().toISOString() }
          if (updated.messages.length === 2) {
            updated.title = updated.messages[0].content.slice(0, 40) + (updated.messages[0].content.length > 40 ? '…' : '')
          }
          return {
            isStreaming: false,
            streamingContent: '',
            activeSession: updated,
            sessions: s.sessions.map(sess => sess.id === updated.id ? updated : sess),
          }
        })
      },

      clearError: () => set({ error: null }),

      deleteSession: (id) => set(s => ({
        sessions: s.sessions.filter(sess => sess.id !== id),
        activeSession: s.activeSession?.id === id ? null : s.activeSession,
      })),
    }),
    { name: 'fitmind-chat', partialize: (s) => ({ sessions: s.sessions.slice(0, 20) }) }
  )
)
