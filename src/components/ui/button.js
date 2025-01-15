import React from 'react'
import { Button as MuiButton } from '@mui/material'

export function Button({ children, variant = 'contained', size = 'medium', className = '', ...props }) {
  return (
    <MuiButton
      variant={variant}
      size={size}
      className={`${className}`}
      {...props}
    >
      {children}
    </MuiButton>
  )
}
