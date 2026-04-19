import { useRef, useState } from 'react'
import { Button, Popup } from '@gravity-ui/uikit'
import { RoomCard } from './RoomCard'
import { type Room } from '@/entities/room/types'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'

type Props = {
  room: Room
}

export const UserRoom = ({ room }: Props) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const userRoomRef = useRef<HTMLDivElement>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  useOnClickOutside(userRoomRef, () => {
    if (popupOpen) setPopupOpen(false)
  })

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
