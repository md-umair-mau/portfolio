// Multiple palette theme toggle
    const paletteThemes = ['','theme-orange','theme-green','theme-pink'];
    let paletteIndex = 0;
    document.getElementById('theme-toggle').addEventListener('click', function() {
        paletteThemes.forEach(cls => cls && document.body.classList.remove(cls));
        paletteIndex = (paletteIndex + 1) % paletteThemes.length;
        if (paletteThemes[paletteIndex]) {
            document.body.classList.add(paletteThemes[paletteIndex]);
        }
    });
    // Night mode toggle button
    document.getElementById('night-toggle').addEventListener('click', function() {
        document.body.classList.toggle('night-mode');
    });

    // Live local time logic (for nav bar)
    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const navTime = document.getElementById('local-time');
        if (navTime) navTime.textContent = timeStr;
        // Footer time
        const footerTime = document.getElementById('footer-time');
        if (footerTime) footerTime.textContent = 'Current Time: ' + timeStr + ' 🕒';
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Country flag logic
    function setCountryFlag(lang) {
        let flag = 'in';
        if (lang === 'ar') flag = 'sa';
        else if (lang === 'hi') flag = 'in';
        else if (lang === 'es') flag = 'es';
        else flag = 'in';
        document.getElementById('country-flag').src = `https://flagcdn.com/24x18/${flag}.png`;
        document.getElementById('country-flag').alt = flag.toUpperCase();
    }
    setCountryFlag('en');

    // Get IP address for footer
    fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => {
        document.getElementById('footer-ip').textContent = 'Your IP: ' + data.ip + ' 🌐';
    });

    // Free translation API logic (LibreTranslate)
    async function translateContent(lang) {
        if (lang === 'en') {
            location.reload(); // reload to restore original
            return;
        }
        function getTextNodes(node) {
            let textNodes = [];
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                textNodes.push(node);
            } else {
                node.childNodes.forEach(child => {
                    textNodes = textNodes.concat(getTextNodes(child));
                });
            }
            return textNodes;
        }
        const nodes = getTextNodes(document.body);
        for (const n of nodes) {
            const original = n.textContent.trim();
            if (original.length > 0 && /[a-zA-Z]/.test(original)) {
                try {
                    const res = await fetch('https://libretranslate.de/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ q: original, source: 'en', target: lang, format: 'text' })
                    });
                    const data = await res.json();
                    if (data.translatedText) n.textContent = data.translatedText;
                } catch(e) { /* ignore errors */ }
            }
        }
    }
    document.getElementById('language-select').addEventListener('change', function(e) {
        const lang = e.target.value;
        setCountryFlag(lang);
        translateContent(lang);
    });

    // Resume download logic with date suffix
    document.getElementById('download-resume').addEventListener('click', function(e) {
        e.preventDefault();
        // Simulate resume download with date suffix
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, '0');
        const mon = date.toLocaleString('default', { month: 'short' });
        const yyyy = date.getFullYear();
        const filename = `Resume_Mohammad_Umair_DnA_${dd}-${mon}-${yyyy}.pdf`;
        // Resume file path
        const resumeUrl = 'assets/Resume_Mohammad_Umair_DnA.pdf';
        const a = document.createElement('a');
        a.href = resumeUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });