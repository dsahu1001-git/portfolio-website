import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#020617',
          color: '#f8fafc',
          display: 'flex',
          fontSize: 56,
          height: '100%',
          justifyContent: 'center',
          padding: 80,
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#0EA5E9', fontSize: 28, marginBottom: 24 }}>
            Deepak Kumar Sahu
          </div>
          Platform engineering, DevOps leadership, and reliable cloud systems.
        </div>
      </div>
    ),
    size,
  );
}
