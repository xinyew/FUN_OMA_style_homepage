import './ProjectTemplate.css';

export default function ProjectTemplate({ data, top, index }) {
    // Use explicit markdown coordinates if provided, otherwise fallback to deterministic random placement
    const boxTop = data.titleTop !== undefined ? Number(data.titleTop) : 15 + (index % 3) * 12; 
    const boxLeft = data.titleLeft !== undefined ? Number(data.titleLeft) : 5 + (index % 4) * 15; 

    return (
        <div className="project-template-container" style={{ top: `${top}vw` }}>
            <img src={data.image} alt={data.title} className="project-template-img" />

            <a href="#" className="project-template-box" style={{ top: `${boxTop}vw`, left: `${boxLeft}vw` }}>
                {data.title}
            </a>
        </div>
    );
}
