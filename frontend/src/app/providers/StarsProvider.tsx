import { type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

type Props = {
  children: ReactNode
}

export const StarsProvider = ({ children }: Props) => {
  return (
    <>
      <Canvas
        style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true }}
        dpr={window.devicePixelRatio}
      >
        <color attach="background" args={['#000']} />

        <Stars
          radius={100}
          depth={50}
          count={10000}
          factor={3}
          saturation={0}
          fade
          speed={2}
        />
      </Canvas>
      {children}
    </>
  )
}
