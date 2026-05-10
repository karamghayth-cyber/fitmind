import React, { useState, useRef, useEffect } from 'react'
import { Send, Plus, Trash2, Bot } from 'lucide-react'
import { Spinner } from '../../components/ui'
import { useChatStore } from '../../stores/chatStore'
import { useUserStore } from '../../stores/userStore'
import { useNutritionStore } from '../../stores/nutritionStore'
import { sendChatMessage } from '../../services/claude/claudeClient'
import { QUICK_CHAT_PROMPTS } from '../../constants'
import { cn } from '../../utils'
import type { ChatMessage } from '../../types'

const MessageBubble: React.FC<{ message: ChatMessage; isStreaming?: boolean; streamContent?: string }> = ({ message, isStreaming, streamContent }) => {
  const isUser = message.role === 'user'
  const content = isStreaming ? streamContent || '' : message.content

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full green-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed', isUser ? 'bg-green-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 card-shadow rounded-tl-sm')}>
        {content.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < content.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-green-500 ml-1 animate-pulse rounded" />}
      </div>
    </div>
  )
}

export const ChatPage: React.FC = () => {
  const { profile } = useUserStore()
  const { healthData } = useUserStore()
  const { todayNutrition } = useNutritionStore()
  const { sessions, activeSession, createSession, addMessage, setStreaming, appendChunk, finalizeStream, isStreaming, streamingContent, deleteSession } = useChatStore()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [showSessions, setShowSessions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeSession?.messages.length, streamingContent])

  const ensureSession = () => activeSession || createSession()

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return
    setError('')
    const session = ensureSession()

    addMessage({ role: 'user', content: text })
    setInput('')
    setStreaming(true)

    const allMessages = [...(activeSession?.messages || session.messages), { id: '', role: 'user' as const, content: text, timestamp: '' }]

    await sendChatMessage(
      allMessages,
      profile,
      healthData,
      todayNutrition,
      (chunk) => appendChunk(chunk),
      () => finalizeStream(),
      (err) => { setError(err); setStreaming(false) }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const currentMessages = activeSession?.messages || []
  const isEmpty = currentMessages.length === 0

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-8 pb-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full green-gradient flex items-center justify-center"><Bot size={14} className="text-white" /></span>
              AI Health Coach
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Powered by Claude · UAE nutrition specialist</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSessions(s => !s)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100">
              {sessions.length} chats
            </button>
            <button onClick={() => createSession()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Sessions panel */}
      {showSessions && sessions.length > 0 && (
        <div className="bg-white border-b border-gray-100 max-h-40 overflow-y-auto flex-shrink-0">
          <div className="max-w-2xl mx-auto px-5 py-2 space-y-1">
            {sessions.map(s => (
              <div key={s.id} className={cn('flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all', s.id === activeSession?.id ? 'bg-green-50' : 'hover:bg-gray-50')}>
                <button className="flex-1 text-left text-sm text-gray-700 truncate" onClick={() => { /* selectSession(s.id) */ setShowSessions(false) }}>
                  {s.title}
                </button>
                <button onClick={() => deleteSession(s.id)} className="text-gray-300 hover:text-red-400 ml-2 p-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-5">
          {isEmpty && (
            <div className="text-center py-8 mb-6">
              <div className="w-16 h-16 rounded-2xl green-gradient flex items-center justify-center mx-auto mb-4">
                <Bot size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Your AI Health Coach</h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                Ask me anything about nutrition, workouts, recipes, or your health goals. I'm tailored for the UAE market.
              </p>
            </div>
          )}

          {isEmpty && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {QUICK_CHAT_PROMPTS.map(prompt => (
                <button key={prompt} onClick={() => sendMessage(prompt)}
                  className="text-left px-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm text-gray-700 hover:border-green-400 hover:bg-green-50 transition-all font-medium card-shadow">
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {currentMessages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isStreaming && (
              <MessageBubble
                message={{ id: 'streaming', role: 'assistant', content: '', timestamp: '' }}
                isStreaming={true}
                streamContent={streamingContent}
              />
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
              {error.includes('API key') || error.includes('401')
                ? '⚠️ AI service needs an API key. Add VITE_CLAUDE_API_KEY to your .env file to enable the AI coach.'
                : `⚠️ ${error}`}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your nutrition, workouts, or health goals..."
              rows={1}
              className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all max-h-32"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
              disabled={isStreaming}
            />
            <button type="submit" disabled={!input.trim() || isStreaming}
              className="w-11 h-11 rounded-2xl bg-green-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-green-600 transition-colors flex-shrink-0">
              {isStreaming ? <Spinner size={18} color="white" /> : <Send size={18} />}
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-2">FitMind AI is not a medical service. Always consult a healthcare professional.</p>
        </div>
      </div>
    </div>
  )
}
