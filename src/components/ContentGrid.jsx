import { useMemo } from 'react';
import { parseMarkdown } from '../utils/parser';
import ProjectTemplate from './ProjectTemplate';
import NewsTemplate from './NewsTemplate';

export default function ContentGrid() {
    const contentConfig = useMemo(() => {
        // Import all markdown files synchronously as raw strings via Vite
        const files = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true });

        let parsedFiles = [];
        for (const path in files) {
            const rawText = files[path];
            parsedFiles.push(parseMarkdown(rawText));
        }

        // Sort descending (newest first based on the 'date' frontmatter)
        parsedFiles.sort((a, b) => new Date(b.date) - new Date(a.date));

        return parsedFiles;
    }, []);

    let currentTop = 0; // Set to absolutely 0 so first item sits perfectly at the top edge of screen, bleeding under the header

    return (
        <div className="content-grid" style={{ position: 'relative', width: '100vw', minHeight: '100vh', marginTop: 0 }}>
            {contentConfig.map((item, index) => {
                if (item.type === 'project') {
                    const topPosition = currentTop;
                    currentTop += 65; // Reduced from 80vw. Images are ~56vw tall, so this leaves a tight 9vw aesthetic gap
                    return <ProjectTemplate key={index} data={item} top={topPosition} index={index} />;
                } else if (item.type === 'news') {
                    // News typically intersects, overlapping slightly over the bottom of a project 
                    const topPosition = currentTop - 8;
                    currentTop += 18; // Reduced block chunk from 30vw to 18vw
                    return <NewsTemplate key={index} data={item} top={topPosition} index={index} />;
                }
                return null;
            })}

            {/* Invisible spacer calculates full absolute height, forcing native browser scaling */}
            <div style={{ position: 'absolute', top: `${currentTop + 10}vw`, height: '10px', width: '100%' }}></div>
        </div>
    );
}
