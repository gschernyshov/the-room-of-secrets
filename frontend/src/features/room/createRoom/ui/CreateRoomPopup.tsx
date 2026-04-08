import { useRef, useState, type ReactNode } from 'react'
import { Popup } from '@gravity-ui/uikit'
import { CreateRoomForm } from './CreateRoomForm'
import styles from './CreateRoomPopup.module.scss'

type Props = {
  content: ReactNode
}

export const CreateRoomPopup = ({ content }: Props) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setPopupOpen(!popupOpen)}
        className={styles['create-room-popup__trigger']}
      >
        {content}
      </div>
      <Popup
        anchorRef={triggerRef}
        open={popupOpen}
        onOpenChange={setPopupOpen}
        placement="right-start"
        className={styles['create-room-popup__popup']}
      >
        <CreateRoomForm onPopupOpen={setPopupOpen} />
      </Popup>
    </>
  )
}
