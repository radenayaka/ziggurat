let passcode = "1234";
        let playerName = "";
        let allVotes = {};
        let allNames = new Set();

        const screens = {
            welcome: document.getElementById('screen-welcome'),
            passcode: document.getElementById('screen-passcode'),
            name: document.getElementById('screen-name'),
            vote: document.getElementById('screen-vote'),
            result: document.getElementById('screen-result')
        };

        function showScreen(name) {
            for (const key in screens) {
                screens[key].classList.toggle('hidden', key !== name);
            }

            setTimeout(() => {
                const inp = screens[name].querySelector('input');
                if (inp) inp.focus();
            }, 100);
        }

        document.getElementById('btn-start').onclick = () => showScreen('passcode');

        document.getElementById('btn-passcode').onclick = tryPasscode;
        document.getElementById('passcode-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') tryPasscode();
        });

        function tryPasscode() {
            const val = document.getElementById('passcode-input').value.trim();
            if (val.length === 4) {
                showScreen('name');
                document.getElementById('passcode-input').value = '';
            } else {
                document.getElementById('passcode-input').style.border = '1.5px solid #e74c3c';
                setTimeout(() => {
                    document.getElementById('passcode-input').style.border = '';
                }, 800);
            }
        }

        document.getElementById('btn-name').onclick = tryName;
        document.getElementById('name-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') tryName();
        });

        function tryName() {
            const val = document.getElementById('name-input').value.trim();
            if (val.length > 0) {
                playerName = val;
                showScreen('vote');
                document.getElementById('name-input').value = '';
            } else {
                document.getElementById('name-input').style.border = '1.5px solid #e74c3c';
                setTimeout(() => {
                    document.getElementById('name-input').style.border = '';
                }, 800);
            }
        }

        document.getElementById('vote-form').onsubmit = function(e) {
            e.preventDefault();
            const inputs = Array.from(this.querySelectorAll('input'));
            const names = inputs.map(inp => inp.value.trim()).filter(Boolean);
            if (names.length !== 5 || new Set(names).size !== 5) {
                inputs.forEach(inp => {
                    if (!inp.value.trim() || names.filter(n => n === inp.value.trim()).length > 1) {
                        inp.style.border = '1.5px solid #e74c3c';
                        setTimeout(() => inp.style.border = '', 800);
                    }
                });
                return;
            }

            names.forEach(n => {
                allVotes[n] = (allVotes[n] || 0) + 1;
                allNames.add(n);
            });

            showResult();
            showScreen('result');

            inputs.forEach(inp => inp.value = '');
        };

        function showResult() {
            const chart = document.getElementById('bar-chart');
            chart.innerHTML = '';

            const names = Array.from(allNames).sort((a, b) => allVotes[b] - allVotes[a]);
            const totalVotes = Object.values(allVotes).reduce((a, b) => a + b, 0) || 1;

            if (names.length === 0) {
                chart.innerHTML = '<div style="color:#888;text-align:center;">Belum ada voting.</div>';
                return;
            }

            names.forEach(name => {
                const count = allVotes[name] || 0;
                const percent = Math.round((count / totalVotes) * 100);
                const row = document.createElement('div');
                row.className = 'bar-row';
                row.innerHTML = `
                    <div class="bar-label">${name}</div>
                    <div class="bar-bg"><div class="bar-fill" style="width:0"></div></div>
                    <div class="bar-percent">${percent}%</div>
                `;
                chart.appendChild(row);
                setTimeout(() => {
                    row.querySelector('.bar-fill').style.width = percent + '%';
                }, 100);
            });
        }

        document.getElementById('btn-restart').onclick = function() {
            playerName = '';
            allVotes = {};
            allNames.clear();
            showScreen('welcome');
        };

        showScreen('welcome');
