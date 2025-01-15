import React from 'react'
import { Card as MuiCard, CardContent as MuiCardContent, Typography } from '@mui/material'

export function Card({ children, className = '', ...props }) {
  return (
    <MuiCard className={`${className}`} {...props}>
      {children}
    </MuiCard>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <MuiCardContent className={`${className}`} {...props}>
      {children}
    </MuiCardContent>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <Typography variant="h5" component="h2" className={`${className}`} {...props}>
      {children}
    </Typography>
  )
}
