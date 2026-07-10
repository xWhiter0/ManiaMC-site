document.addEventListener("DOMContentLoaded", () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            initSite(data);
        })
        .catch(error => console.error("Veri yüklenirken hata oluştu:", error));

    initNavigation();
});

function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuItems = document.querySelectorAll('.menu-item');
    const pageSections = document.querySelectorAll('.page-section');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-target');
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            pageSections.forEach(section => {
                if (section.id === targetPage) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    });
}

function initSite(data) {
    document.getElementById('server-name').innerText = data.serverInfo.name;
    document.getElementById('server-motd').innerText = data.serverInfo.motd;
    document.getElementById('server-ip').innerText = data.serverInfo.ip;

    if (data.about) {
        document.getElementById('about-title').innerText = data.about.title;
        document.getElementById('about-text').innerText = data.about.text;
    }

    // 1. Ana Sayfa Küçük Güncellemeler Listesi
    const updatesList = document.getElementById('updates-list');
    if (data.updates && updatesList) {
        data.updates.forEach(up => {
            const card = document.createElement('div');
            card.className = 'update-card';
            card.innerHTML = `<div class="update-header"><span class="update-title">${up.title}</span><span class="update-date">${up.date}</span></div><p class="update-text">${up.text}</p>`;
            updatesList.appendChild(card);
        });
    }

    // 2. YENİ BÖLÜM: Resimli Güncellemeler Sayfası
    const richUpdatesList = document.getElementById('rich-updates-list');
    if (data.updates && richUpdatesList) {
        data.updates.forEach(up => {
            const richCard = document.createElement('div');
            richCard.className = 'update-rich-card';
            
            // Eğer JSON dosyasında resim tanımlanmışsa img etiketini oluşturur
            const imageHtml = up.image ? `<img src="${up.image}" alt="${up.title}" class="update-rich-img">` : '';

            richCard.innerHTML = `
                ${imageHtml}
                <div class="update-rich-body">
                    <div class="update-header">
                        <span class="update-title">${up.title}</span>
                        <span class="update-date">${up.date}</span>
                    </div>
                    <p class="update-text" style="margin-top: 12px;">${up.text}</p>
                </div>
            `;
            richUpdatesList.appendChild(richCard);
        });
    }

    const socialsContainer = document.getElementById('top-socials');
    data.socials.forEach(social => {
        const aTag = document.createElement('a');
        aTag.href = social.url; aTag.target = '_blank';
        aTag.innerHTML = `<i class="${social.icon}"></i>`;
        socialsContainer.appendChild(aTag);
    });

    const mediaTeamList = document.getElementById('media-team-list');
    if (data.mediaTeam) {
        data.mediaTeam.forEach(member => {
            const memberCard = document.createElement('a');
            memberCard.className = 'media-member-card'; memberCard.href = member.link; memberCard.target = '_blank';
            memberCard.innerHTML = `<span class="media-name">${member.name}</span><span class="media-badge" style="background-color: ${member.tagColor}">${member.platform}</span>`;
            mediaTeamList.appendChild(memberCard);
        });
    }

    const staffTeamList = document.getElementById('staff-team-list');
    if (data.staffTeam) {
        data.staffTeam.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'staff-member-card'; memberCard.style.borderTopColor = member.color;
            memberCard.innerHTML = `<div class="staff-avatar"><i class="fa-solid fa-user-shield"></i></div><span class="staff-name">${member.name}</span><span class="staff-role" style="background-color: ${member.color}22; color: ${member.color}; border: 1px solid ${member.color}">${member.role}</span>`;
            staffTeamList.appendChild(memberCard);
        });
    }

    const kitTabsContainer = document.getElementById('kit-tabs');
    const kitNames = Object.keys(data.tierList);
    kitNames.forEach((kitName, index) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.innerText = kitName === 'Overall' ? '🏆 OVERALL' : kitName;
        if (index === 0) { btn.classList.add('active'); renderPlayerList(data.tierList[kitName]); }
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); renderPlayerList(data.tierList[kitName]);
        });
        kitTabsContainer.appendChild(btn);
    });
}

function renderPlayerList(playersData) {
    const container = document.getElementById('tierlist-container');
    container.innerHTML = ''; 
    if (!playersData || playersData.length === 0) {
        container.innerHTML = '<div class="no-data">Kayıtlı oyuncu bulunamadı.</div>'; return;
    }
    playersData.forEach((player, index) => {
        const row = document.createElement('div');
        row.className = 'player-row'; row.style.borderLeftColor = player.color;
        row.innerHTML = `<div class="player-info"><span class="player-number">${index + 1}.</span><span class="player-name">${player.name}</span></div><span class="tier-badge" style="background-color: ${player.color}">${player.tier}</span>`;
        container.appendChild(row);
    });
}

function copyIP() {
    const ipText = document.getElementById('server-ip').innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        const toast = document.getElementById("copy-toast");
        toast.className = "toast show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    });
}
// ... Üst kısımdaki DOMContentLoaded ve initNavigation fonksiyonları tamamen aynı kalıyor ...

function initSite(data) {
    // LOGO GÜNCELLEMESİ: Düz yazı yerine logo resminin alternatif metnini doldurur
    const serverLogo = document.getElementById('server-logo');
    if (serverLogo) {
        serverLogo.alt = data.serverInfo.name;
    }
    
    document.getElementById('server-motd').innerText = data.serverInfo.motd;
    document.getElementById('server-ip').innerText = data.serverInfo.ip;

    if (data.about) {
        document.getElementById('about-title').innerText = data.about.title;
        document.getElementById('about-text').innerText = data.about.text;
    }

    // 1. Ana Sayfa Küçük Güncellemeler Listesi
    const updatesList = document.getElementById('updates-list');
    if (data.updates && updatesList) {
        data.updates.forEach(up => {
            const card = document.createElement('div');
            card.className = 'update-card';
            card.innerHTML = `<div class="update-header"><span class="update-title">${up.title}</span><span class="update-date">${up.date}</span></div><p class="update-text">${up.text}</p>`;
            updatesList.appendChild(card);
        });
    }

    // 2. Resimli Güncellemeler Sayfası
    const richUpdatesList = document.getElementById('rich-updates-list');
    if (data.updates && richUpdatesList) {
        data.updates.forEach(up => {
            const richCard = document.createElement('div');
            richCard.className = 'update-rich-card';
            
            const imageHtml = up.image ? `<img src="${up.image}" alt="${up.title}" class="update-rich-img">` : '';

            richCard.innerHTML = `
                ${imageHtml}
                <div class="update-rich-body">
                    <div class="update-header">
                        <span class="update-title">${up.title}</span>
                        <span class="update-date">${up.date}</span>
                    </div>
                    <p class="update-text" style="margin-top: 12px;">${up.text}</p>
                </div>
            `;
            richUpdatesList.appendChild(richCard);
        });
    }

    const socialsContainer = document.getElementById('top-socials');
    data.socials.forEach(social => {
        const aTag = document.createElement('a');
        aTag.href = social.url; aTag.target = '_blank';
        aTag.innerHTML = `<i class="${social.icon}"></i>`;
        socialsContainer.appendChild(aTag);
    });

    const mediaTeamList = document.getElementById('media-team-list');
    if (data.mediaTeam) {
        data.mediaTeam.forEach(member => {
            const memberCard = document.createElement('a');
            memberCard.className = 'media-member-card'; memberCard.href = member.link; memberCard.target = '_blank';
            memberCard.innerHTML = `<span class="media-name">${member.name}</span><span class="media-badge" style="background-color: ${member.tagColor}">${member.platform}</span>`;
            mediaTeamList.appendChild(memberCard);
        });
    }

    const staffTeamList = document.getElementById('staff-team-list');
    if (data.staffTeam) {
        data.staffTeam.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'staff-member-card'; memberCard.style.borderTopColor = member.color;
            memberCard.innerHTML = `<div class="staff-avatar"><i class="fa-solid fa-user-shield"></i></div><span class="staff-name">${member.name}</span><span class="staff-role" style="background-color: ${member.color}22; color: ${member.color}; border: 1px solid ${member.color}">${member.role}</span>`;
            staffTeamList.appendChild(memberCard);
        });
    }

    const kitTabsContainer = document.getElementById('kit-tabs');
    const kitNames = Object.keys(data.tierList);
    kitNames.forEach((kitName, index) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.innerText = kitName === 'Overall' ? '🏆 OVERALL' : kitName;
        if (index === 0) { btn.classList.add('active'); renderPlayerList(data.tierList[kitName]); }
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); renderPlayerList(data.tierList[kitName]);
        });
        kitTabsContainer.appendChild(btn);
    });
}

// ... Alt kısımdaki renderPlayerList ve copyIP fonksiyonları tamamen aynı kalıyor ...