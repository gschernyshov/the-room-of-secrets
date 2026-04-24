import { useRef, useState, useEffect } from 'react'
import { Button, Popup } from '@gravity-ui/uikit'
import { RoomCard } from './RoomCard'
import { type Room } from '@/entities/room/model/types'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'

type Props = {
  room: Room
}

export const UserRoom = ({ room }: Props) => {
  const userRoomRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  useOnClickOutside(userRoomRef, () => {
    if (popupOpen) {
      timeoutRef.current = setTimeout(() => {
        setPopupOpen(false)
      }, 50)
    }
  })

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div ref={userRoomRef}>
      <Button ref={triggerRef} onClick={() => setPopupOpen(!popupOpen)}>
        {room.name}
      </Button>
      <Popup anchorRef={triggerRef} open={popupOpen} placement="auto-end">
        <RoomCard room={room} />
      </Popup>
    </div>
  )
}
