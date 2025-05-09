(function() {
    window.addEventListener('DOMContentLoaded', async () => {

        const loadingDiv = document.getElementById('loading');
        const baseUrl = 'https://as271.github.io/weathermaps/';
        const hours = 24;
        const minutes = 60;
        const totalFrames = 1440;
        const mTimeLapseDiv = document.getElementById('mTimeLapse');
        const loader = document.getElementById('loader');
        const loaderBar = document.getElementById('loader-bar');
        const loaderText = document.getElementById('loader-text');
        let loaded = 0;

        for (let h = 0; h < hours; h++) {
            for (let m = 0; m < minutes; m++) {
                const hourStr = h.toString().padStart(2, '0');
                const minuteStr = m.toString().padStart(2, '0');
                const filename = `bcnet-totals-${hourStr}-${minuteStr}.png`;
                const url = baseUrl + filename;

                const img = document.createElement('img');
                img.src = url;

                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        img.setAttribute('data-stamp', `${hourStr}:${minuteStr}`);
                        mTimeLapseDiv.appendChild(img);
                        loaded++;
                        img.hidden = true;
                        const percent = Math.round((loaded / totalFrames) * 100);
                        loaderBar.style.width = `${percent}%`;
                        loaderText.textContent = `Loading timelapse: ${percent}%`;
                        setTimeout(resolve, 25);
                    };
                    img.onerror = () => {
                        console.warn('Missing:', url);
                        loaded++;
                        loaderBar.style.width = `${Math.round((loaded / totalFrames) * 100)}%`;
                        setTimeout(resolve, 25);
                    };
                });
            }
        }
        loader.style.display = 'none';
        loadingDiv.style.display = 'none';
        mTimeLapseDiv.style.display = 'block';

        initializeTimeLapse();
    });
})();
