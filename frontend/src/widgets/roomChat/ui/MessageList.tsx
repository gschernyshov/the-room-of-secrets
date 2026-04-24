import clsx from 'clsx'
import { useRef, useEffect } from 'react'
import { formatTime } from '../lib/formatTime'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useMessagesStore } from '@/entities/message/model/messagesStore'
import styles from './MessageList.module.scss'

export const MessageList = () => {
  const user = useSessionStore(state => state.user)
  const messages = useMessagesStore(state => state.messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={styles['message-list']}>
      <div className={styles['message-list__container']}>
        {messages.length === 0 ? (
          <div className={styles['message-list__empty']}>
            <p className={styles['message-list__empty-title']}>
              Сообщений пока нет. Начните диалог первым...
            </p>
          </div>
        ) : (
          messages.map(message => {
            const isActive = message.senderId === user?.id

            return (
              <div
                key={message.id}
                className={clsx(
                  styles['message-list__item'],
                  isActive && styles['message-list__item--current']
                )}
              >
                <span className={styles['message-list__author']}>
                  {isActive ? 'Вы' : `Пользователь ${message.senderId}`}
                </span>
                <p className={styles['message-list__content']}>
                  {message.content}
                </p>
                <span className={styles['message-list__time']}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
