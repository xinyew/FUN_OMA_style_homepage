export default function ProjectTemplate({ data, top, index }) {
    // Deterministically random box placement based on array index
    const boxTop = 15 + (index % 3) * 12; // Range 15vw to 39vw
    const boxLeft = 5 + (index % 4) * 15; // Range 5vw to 50vw

    return (
        <div className="project-container" style={{ position: 'absolute', top: `${top}vw`, left: 0, width: '100vw' }}>
            <img src={data.image} alt={data.title} style={{ width: '100%', display: 'block' }} />

            <a href="#" className="project-title-box" style={{
                position: 'absolute',
                top: `${boxTop}vw`,
                left: `${boxLeft}vw`,
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '1rem 2rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '2vw',
                fontFamily: "'Inter', sans-serif",
                zIndex: 10,
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                {data.title}
            </a>
        </div>
    );
}
