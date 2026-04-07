import './NewsTemplate.css';

function getFormattedDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  // Fallback to raw string if the date parser algorithm fails
  if (isNaN(d.getTime())) return dateString; 

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = months[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  
  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) suffix = 'st';
  else if (day % 10 === 2 && day !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day !== 13) suffix = 'rd';
  
  return `${month} ${day}${suffix} ${year}`;
}

export default function NewsTemplate({ data, top, index }) {
  // Random horizontal position for news blocks
  const boxLeft = 10 + (index % 3) * 20; // 10vw to 50vw
  
  return (
    <a href="#" className="news-template-box" style={{ top: `${top}vw`, left: `${boxLeft}vw` }}>
      <h3 className="news-template-date">{getFormattedDate(data.date)}</h3>
      <h2 className="news-template-title">{data.title}</h2>
    </a>
  );
}
