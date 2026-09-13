import React, { useState, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import { supabase } from './supabaseClient';
import Controles from './Controles'; // Importamos el nuevo componente de botones

function App() {
  const [misLibros, setMisLibros] = useState([]);
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState(null);
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState('dark');
  const [rendition, setRendition] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const cargarLibros = async () => {
    const { data, error } = await supabase.from('lista_libros').select('*').order('id', { ascending: false });
    if (!error && data && data.length > 0) {
      setMisLibros(data);
      if (!url || !data.some(l => l.url === url)) {
        setUrl(data[0].url);
      }
    } else {
      setMisLibros([]);
      setUrl('');
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);

    const nombreLimpio = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    const { error: storageError } = await supabase.storage
      .from('libros')
      .upload(nombreLimpio, file);

    if (storageError) {
      alert("Error al subir archivo: " + storageError.message);
      setSubiendo(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('libros').getPublicUrl(nombreLimpio);
    const urlPublica = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from('lista_libros')
      .insert([{ titulo: file.name.replace('.epub', ''), url: urlPublica }]);

    if (dbError) {
      alert("Error al registrar en la lista: " + dbError.message);
    } else {
      await cargarLibros();
    }
    setSubiendo(false);
  };

  const handleEliminar = async (id, urlLibro) => {
    if (!window.confirm("¿Seguro que querés borrar este libro de tu nube?")) return;

    const nombreArchivo = urlLibro.split('/libros/').pop();
    if (nombreArchivo) {
      await supabase.storage.from('libros').remove([nombreArchivo]);
    }

    const { error } = await supabase.from('lista_libros').delete().eq('id', id);
    
    if (!error) {
      setUrl('');
      await cargarLibros();
    } else {
      alert("Error al eliminar: " + error.message);
    }
  };

  useEffect(() => {
    if (rendition) {
      rendition.themes.fontSize(`${fontSize}%`);
      if (theme === 'dark') {
        rendition.themes.register('custom-dark', {
          body: { background: '#1c1c1e !important', color: '#e5e5ea !important' },
          p: { color: '#e5e5ea !important' }
        });
        rendition.themes.select('custom-dark');
      } else {
        rendition.themes.register('custom-light', {
          body: { background: '#ffffff !important', color: '#000000 !important' },
          p: { color: '#000000 !important' }
        });
        rendition.themes.select('custom-light');
      }
    }
  }, [rendition, fontSize, theme, url]);

  return (
    <div style={{ margin: 0, padding: 0, height: '100vh', display: 'flex', flexDirection: 'column', background: theme === 'dark' ? '#1c1c1e' : '#ffffff' }}>
      
      {/* Llamamos a la barra de controles pasándole las funciones */}
      <Controles 
        theme={theme} setTheme={setTheme}
        fontSize={fontSize} setFontSize={setFontSize}
        misLibros={misLibros} url={url} setUrl={setUrl}
        subiendo={subiendo} handleUpload={handleUpload} handleEliminar={handleEliminar}
      />

      {/* ÁREA DEL LECTOR */}
      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        {url ? (
          <ReactReader
            url={url}
            location={location}
            locationChanged={(epubcifi) => setLocation(epubcifi)}
            getRendition={(val) => setRendition(val)}
          />
        ) : (
          <div style={{ color: '#888', textAlign: 'center', marginTop: '60px', padding: '20px', fontFamily: 'sans-serif' }}>
            Tu biblioteca está vacía.<br/><br/>Tocá el botón verde <b>"Subir .epub"</b> para agregar tu primer libro desde tu compu o celu.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
