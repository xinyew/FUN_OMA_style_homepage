import './ProjectTemplate.css';

export default function ProjectTemplate({ data, top, index }) {
    // Deterministically random box placement based on array index
    const boxTop = 15 + (index % 3) * 12; // Range 15vw to 39vw
    const boxLeft = 5 + (index % 4) * 15; // Range 5vw to 50vw

    return (
        <div className="project-template-container" style={{ top: `${top}vw` }}>
            <img src={data.image} alt={data.title} className="project-template-img" />

            <a href="#" className="project-template-box" style={{ top: `${boxTop}vw`, left: `${boxLeft}vw` }}>
                {data.title}
            </a>
        </div>
    );
}
