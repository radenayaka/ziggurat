function showResult() {
    const chart = document.getElementById('bar-chart');
    chart.innerHTML = '';

    const names = Array.from(allNames).sort((a, b) => allVotes[b] - allVotes[a]);
    const totalVotes = Object.values(allVotes).reduce((a, b) => a + b, 0) || 1;

    const labelChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (names.length === 0) {
        chart.innerHTML = '<div style="color:#888;text-align:center;">Belum ada voting.</div>';
        return;
    }

    names.forEach((name, index) => {
        const count = allVotes[name] || 0;
        const percent = Math.round((count / totalVotes) * 100);
        const label = labelChar[index] || '?'; // Jika lebih dari 26 nama, fallback ke '?'

        // Membuat satu bar hasil voting
        const row = document.createElement('div');
        row.className = 'bar-row';

        row.innerHTML = `
            <div class="bar-label">
                <strong>${label}</strong> ${name}
            </div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: 0"></div>
            </div>
            <div class="bar-percent">${percent}%</div>
        `;

        chart.appendChild(row);

        // Animasikan progress bar setelah elemen dimasukkan ke DOM
        setTimeout(() => {
            row.querySelector('.bar-fill').style.width = percent + '%';
        }, 100);
    });
}
