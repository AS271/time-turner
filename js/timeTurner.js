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

        const promises = [];
        for (let h = 0; h < hours; h++) {
            for (let m = 0; m < minutes; m++) {
                const hourStr = h.toString().padStart(2, '0');
                const minuteStr = m.toString().padStart(2, '0');
                const filename = `bcnet-totals-${hourStr}-${minuteStr}.png`;
                const url = baseUrl + filename + '?t=' + new Date().getTime();

                const img = document.createElement('img');
                img.src = url;
                img.hidden = true;

                const p = new Promise((resolve) => {
                    img.onload = () => {
                        img.setAttribute('data-stamp', `${hourStr}:${minuteStr}`);
                        loaded++;
                        const percent = Math.round((loaded / totalFrames) * 100);
                        loaderBar.style.width = `${percent}%`;
                        loaderText.textContent = `Loading timelapse: ${percent}%`;
                        resolve();
                    };
                    img.onerror = () => {
                        loaded++;
                        loaderBar.style.width = `${Math.round((loaded / totalFrames) * 100)}%`;
                        resolve();
                    };
                });
                mTimeLapseDiv.appendChild(img);
                promises.push(p);
            }
        }
        await Promise.all(promises);
        loader.style.display = 'none';
        mTimeLapseDiv.style.display = 'block';

        initializeTimeLapse();
    });
})();
