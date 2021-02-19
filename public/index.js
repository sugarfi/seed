const findCookie = cookie => document.cookie.split(';').map(x => x.split('=')).filter(x => x[0].trim() == cookie)[0][1];

let avatar, username;

document.getElementById('avatar').src = 
    avatar =
    `https://cdn.discordapp.com/avatars/${findCookie('id')}/${findCookie('avatar')}.png`;
document.getElementById('username').textContent = username = decodeURI(findCookie('username'));

const refreshSeeds = () => {
    fetch('/seeds/get').then(r => r.json()).then(json => {
        const seeds = document.getElementById('seeds');

        while (seeds.firstChild) seeds.removeChild(seeds.firstChild);

        json.forEach(seed => {
            const li = document.createElement('li');

            const header = document.createElement('h4');
            header.textContent = seed.seed;

            const div = document.createElement('div');

            const avatar = document.createElement('img');
            avatar.src = seed.avatar;

            const username = document.createElement('span');
            username.textContent = seed.username;

            div.appendChild(avatar);
            div.appendChild(username);

            const desc = document.createElement('p');
            desc.textContent = seed.desc;

            li.appendChild(header);
            li.appendChild(div);
            li.appendChild(desc);

            seeds.appendChild(li);
        });
    });
};

document.getElementById('submit').onclick = () => {
    fetch('/seeds/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            avatar,
            seed: document.getElementById('seed').value,
            desc: document.getElementById('desc').value
        })
    }).then(r => r.json()).then(json => {
        document.getElementById('seed').value = '';
        document.getElementById('desc').value = '';
        refreshSeeds();
    });
};

refreshSeeds();
