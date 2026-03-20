export function parseMarkdown(rawText) {
    // Regex extracting Frontmatter and Body
    const match = rawText.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    // Fallback if no frontmatter
    if (!match) return { content: rawText, type: 'article' };

    const yaml = match[1];
    const content = match[2].trim();

    const properties = {};
    yaml.split('\n').forEach(line => {
        const splitIndex = line.indexOf(':');
        if (splitIndex > -1) {
            const key = line.slice(0, splitIndex).trim();
            let value = line.slice(splitIndex + 1).trim();
            // Remove surrounding quotes
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            properties[key] = value;
        }
    });

    return { ...properties, content };
}
