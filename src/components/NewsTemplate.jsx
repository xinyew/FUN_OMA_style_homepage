export default function NewsTemplate({ data, top, index }) {
    // Random horizontal position for news blocks
    const boxLeft = 10 + (index % 3) * 20; // 10vw to 50vw

    return (
        <a href="#" className="news-box" style={{
            position: 'absolute',
            top: `${top}vw`,
            left: `${boxLeft}vw`,
            width: '35vw',
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '2.5rem',
            textDecoration: 'none',
            zIndex: 20,
            fontFamily: "'Inter', sans-serif",
            border: '1px solid #e0e0e0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
            <h3 style={{ fontSize: '1.2vw', marginBottom: '1rem', color: '#666', fontWeight: 500 }}>{data.date}</h3>
            <h2 style={{ fontSize: '2.5vw', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{data.title}</h2>
            <p style={{ fontSize: '1.2vw', lineHeight: '1.6', color: '#222' }}>{data.content}</p>
        </a>
    );
}
