import { useEffect, useRef } from 'react';
import './Header.css';

export default function Header() {
    const containerRef = useRef(null);

    useEffect(() => {
        const adjustFontSize = () => {
            const el = containerRef.current;
            if (!el) return;

            // Temporarily set font size massive so the browser renders precise high-fidelity widths
            el.style.fontSize = '100px';

            // Because it's inline-flex, it snaps exactly to the width of the text + responsive `1em` gaps!
            const rawWidthAt100px = el.getBoundingClientRect().width;

            // Get exact device viewport minus scrollbars
            const windowWidth = document.documentElement.clientWidth;

            // Knowing text scales geometrically: if 100px gives X width, what gives windowWidth?
            const perfectFontSize = windowWidth / (rawWidthAt100px / 100);

            // Apply the flawless mathematical font size to stretch exactly edge-to-edge
            el.style.fontSize = `${perfectFontSize}px`;
        };

        // Calculate instantly on mount
        adjustFontSize();

        // Automatically recalculate if the user rotates their phone or resizes browser!
        window.addEventListener('resize', adjustFontSize);

        // Critical Fix: Custom web fonts (OMACustom) take a few milliseconds to download.
        // The browser initially calculates widths using the fallback font. We must mathematically
        // recalculate instantly once the custom brutalist font physically loads on the screen!
        if (document.fonts) {
            document.fonts.ready.then(() => {
                adjustFontSize();
            });
        }

        return () => window.removeEventListener('resize', adjustFontSize);
    }, []);

    return (
        <header className="premium-header">
            <nav className="header-container" ref={containerRef}>
                <a href="/" className="nav-item logo-hollow">aNERD</a>
                <a href="#" className="nav-item">WORK</a>
                <a href="#" className="nav-item">PAPERS</a>
                <a href="#" className="nav-item">ABOUT</a>
            </nav>
        </header>
    );
}
