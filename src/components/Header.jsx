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

    useEffect(() => {
        const handleScroll = () => {
            // Find all items we want to translate
            const items = document.querySelectorAll('.scroll-up-item');
            if (items.length === 0) return;

            const scrollY = window.scrollY;

            // Calculate the physical height of the text directly from the first element
            const textHeight = items[0].offsetHeight;

            // Calculate the maximum allowed translation (80% of text height)
            const maxTranslate = textHeight * 0.85;

            // Cap the translation so they perfectly stick when only 20% is visible
            const translateY = Math.min(scrollY, maxTranslate);

            items.forEach(item => {
                // Move them physically upwards, simulating them being attached to the scroll grid
                item.style.transform = `translateY(-${translateY}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Run immediately on load just in case page starts scrolled down
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="premium-header">
            <nav className="header-container" ref={containerRef}>
                <a href="/" className="nav-item logo-hollow">aNERD</a>
                <a href="#" className="nav-item scroll-up-item">WORK</a>
                <a href="#" className="nav-item scroll-up-item">PAPERS</a>
                <a href="#" className="nav-item scroll-up-item">ABOUT</a>
            </nav>
        </header>
    );
}
