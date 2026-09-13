import React from 'react';

export default function Controles({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  misLibros,
  url,
  setUrl,
  subiendo,
  handleUpload,
  handleEliminar
}) {
  
  // Estilos visuales del menú adaptables al tema claro/oscuro
  const uiStyles = {
    header: { 
      background: theme === 'dark' ? '#121212' : '#f5f5f7', 
      color: theme === 'dark' ? '#ffffff' : '#000000', 
      padding: '10px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px', 
      borderBottom: '1px solid #555' 
    },
    row: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      gap: '5px' 
    },
    btn: { 
      background: theme === 'dark' ? '#2c2c2e' : '#e5e5ea', 
      color: theme === 'dark' ? '#ffffff' : '#000000', 
      border: 'none', 
      padding: '6px 12px', 
      borderRadius: '6px', 
      fontSize: '0.85rem', 
      cursor: 'pointer' 
    },
    select: { 
      background: theme === 'dark' ? '#2c2c2e' : '#ffffff', 
      color: theme === 'dark' ? '#ffffff' : '#000000', 
      border: '1px solid #555', 
      padding: '5px', 
      borderRadius: '6px', 
      fontSize: '0.85rem' 
    }
  };

  return (
    <header style={uiStyles.header}>
      {/* FILA 1: Título, Selector de libros y Botón de borrar */}
      <div style={uiStyles.row}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>📚 Mi Biblioteca Pro</span>
        
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <select style={{ ...uiStyles.select, maxWidth: '150px' }} onChange={(e) => setUrl(e.target.value)} value={url}>
            {misLibros.map((libro) => (
              <option key={libro.id} value={libro.url}>{libro.titulo}</option>
            ))}
          </select>
          
          {misLibros.length > 0 && url && (
            <button 
              style={{ ...uiStyles.btn, background: '#ff453a', color: '#fff' }} 
              onClick={() => {
                const libroActual = misLibros.find(l => l.url === url);
                if (libroActual) handleEliminar(libroActual.id, libroActual.url);
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* FILA 2: Botón de subir, Tamaño de letra y Modo Oscuro/Claro */}
      <div style={uiStyles.row}>
        <label style={{ ...uiStyles.btn, background: '#34c759', color: '#fff', textAlign: 'center', cursor: 'pointer' }}>
          {subiendo ? 'Cargando...' : '➕ Subir .epub'}
          <input type="file" accept=".epub" onChange={handleUpload} style={{ display: 'none' }} disabled={subiendo} />
        </label>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button style={uiStyles.btn} onClick={() => setFontSize(Math.max(60, fontSize - 10))}>A-</button>
          <span style={{ fontSize: '0.8rem', alignSelf: 'center', color: uiStyles.header.color }}>{fontSize}%</span>
          <button style={uiStyles.btn} onClick={() => setFontSize(Math.min(200, fontSize + 10))}>A+</button>
        </div>

        <button style={uiStyles.btn} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </div>
    </header>
  );
}
