import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRSection({ url }) {
  const [dataUrl, setDataUrl] = useState('');
  const target = url || `${import.meta.env.VITE_API_URL || 'https://speakpublic.vercel.app'}/app`;

  useEffect(() => {
    let mounted = true;
    QRCode.toDataURL(target, { margin: 1, width: 160, color: { dark: '#3C3489', light: '#FFFFFF' } })
      .then((d) => { if (mounted) setDataUrl(d); })
      .catch(() => setDataUrl(''));
    return () => { mounted = false; };
  }, [target]);

  return (
    <section style={{ padding: '3rem 1rem', textAlign: 'center', background: '#EEEDFE' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '500', color: '#3C3489', marginBottom: '8px' }}>Use SpeakPublic on any device</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>Scan to open on your phone — no app download needed</p>
      <div style={{ display: 'inline-block', background: 'white', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
        {dataUrl ? <img src={dataUrl} alt="SpeakPublic QR" width={160} height={160} /> : <div style={{ width:160, height:160 }} />}
      </div>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>{target.replace('https://','')}</p>
    </section>
  )
}
