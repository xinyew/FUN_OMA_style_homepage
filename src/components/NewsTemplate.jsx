import './NewsTemplate.css';

export default function NewsTemplate({ data, top, index }) {
    // Random horizontal position for news blocks
    const boxLeft = 10 + (index % 3) * 20; // 10vw to 50vw

    return (
        <a href="#" className="news-template-box" style={{ top: `${top}vw`, left: `${boxLeft}vw` }}>
            <h3 className="news-template-date">{data.date}</h3>
            <h2 className="news-template-title">{data.title}</h2>
            <p className="news-template-content">{data.content}</p>
        </a>
    );
}
