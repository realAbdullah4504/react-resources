import React from 'react'
import { Link } from 'react-router-dom'

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  margin: '12px',
  borderRadius: '12px',
  background: '#f5f6fa',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  textDecoration: 'none',
  color: '#222',
  minWidth: '160px',
  transition: 'box-shadow 0.2s',
}

const cardHoverStyle = {
  boxShadow: '0 4px 16px rgba(0,0,0,0.13)',
}

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '16px',
  marginTop: '32px',
}

const heroStyle = {
  textAlign: 'center',
  padding: '48px 0 24px 0',
  background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
  color: '#fff',
  borderRadius: '0 0 24px 24px',
}

const Home = () => {
  const [hovered, setHovered] = React.useState(null)
  const links = [
    { to: '/about', label: 'About' },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Signup' },
    { to: '/protected-page', label: 'Protected Page' },
    { to: '/protected-page/settings', label: 'Settings' },
  ]

  return (
    <div>
      <div style={heroStyle}>
        <h1>Welcome to the MERN Boilerplate</h1>
        <p style={{ fontSize: '1.2rem', marginTop: 12 }}>A modern starter for your full-stack projects</p>
      </div>
      <div style={gridStyle}>
        {links.map((link, idx) => (
          <Link
            key={link.to}
            to={link.to}
            style={hovered === idx ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
