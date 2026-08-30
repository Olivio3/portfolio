document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playBtn');
    const iconPlay = playBtn.querySelector('.icon-play');
    const iconPause = playBtn.querySelector('.icon-pause');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const albumArt = document.getElementById('albumArt');
    const commentText = document.getElementById('commentText');
    const ytIframe = document.getElementById('ytIframe');
    const playOverlay = document.getElementById('playOverlay');
    const controlsGroup = document.getElementById('controlsGroup');
    const controlsSpacer = document.getElementById('controlsSpacer');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let isPlaying = false;
    let progress = 0;
    let currentTrackIndex = 0;
    
    const playlist = [
        {
            title: "Fantasmas - HUMBE",
            artist: "Olivio",
            iframeSrc: "https://www.youtube.com/embed/WkjqvPDmvRU?si=03HCK4zRrGsdEk60",
            coverSrc: "olivio.png",
            commentText: "Uma música que me causa saudade"
        },
        {
            title: "Super - Jão",
            artist: "Olivio",
            iframeSrc: "https://www.youtube.com/embed/POHe-f_bfuY?si=1_p0XiQv76Ee70_Z",
            coverSrc: "ed2.jpeg",
            commentText: "Essa aqui me define completamente"
        },
        {
            title: "Travie McCoy: Billionaire ft. Bruno Mars",
            artist: "Olivio",
            iframeSrc: "https://www.youtube.com/embed/8aRor905cCw?si=VL5MRicHNd36qSKJ",
            coverSrc: "ed.jpeg",
            commentText: "Para escutar sonhando alto"
        }
    ];
    
    const audio = new Audio();
    audio.preload = 'metadata';

    function loadTrack(index) {
        const track = playlist[index];
        
        if (track.iframeSrc) {
            ytIframe.src = track.iframeSrc;
            ytIframe.style.display = 'block';
            if (albumArt) albumArt.style.display = 'none';
            if (progressBar) progressBar.style.display = 'none';
            if (playOverlay) playOverlay.style.display = 'none';
            if (controlsGroup) {
                controlsGroup.style.display = 'flex';
                controlsGroup.style.justifyContent = 'space-between';
                controlsGroup.style.padding = '0 10px';
            }
            if (controlsSpacer) controlsSpacer.style.display = 'none';
            if (playBtn) playBtn.style.display = 'none';
            audio.pause();
            isPlaying = false;
        } else {
            ytIframe.src = '';
            ytIframe.style.display = 'none';
            if (albumArt) albumArt.style.display = 'block';
            if (progressBar) progressBar.style.display = 'block';
            if (playOverlay) {
                playOverlay.style.display = 'flex';
                playOverlay.style.background = 'rgba(0,0,0,0.1)';
            }
            if (controlsGroup) {
                controlsGroup.style.display = 'flex';
                controlsGroup.style.justifyContent = 'center';
                controlsGroup.style.padding = '0';
            }
            if (controlsSpacer) controlsSpacer.style.display = 'block';
            if (playBtn) playBtn.style.display = 'flex';
            
            if (!audio.src.includes(track.audioSrc)) {
                audio.src = track.audioSrc;
                audio.load();
            }
        }
        
        if (albumArt) albumArt.src = track.coverSrc;
        if (trackTitle) trackTitle.textContent = track.title;
        if (trackArtist) trackArtist.textContent = track.artist;
        if (commentText && track.commentText) commentText.textContent = track.commentText;
        
        progress = 0;
        updateProgressUI();
        
        if (isPlaying && !track.iframeSrc) {
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log('Playback prevented:', error));
            }
        }
    }
    
    function updateProgressUI() {
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    function togglePlay(e) {
        if (e && e.target.closest('.yt-control-btn')) return;
        if (playlist[currentTrackIndex].iframeSrc) return;

        isPlaying = !isPlaying;
        
        if (isPlaying) {
            if (iconPlay) iconPlay.style.display = 'none';
            if (iconPause) iconPause.style.display = 'block';
            
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log('Playback prevented:', error));
            }
            if (playOverlay) playOverlay.style.background = 'transparent';
        } else {
            if (iconPlay) iconPlay.style.display = 'block';
            if (iconPause) iconPause.style.display = 'none';
            audio.pause();
            if (playOverlay) playOverlay.style.background = 'rgba(0,0,0,0.1)';
        }
    }
    
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progress = (audio.currentTime / audio.duration) * 100;
            updateProgressUI();
        }
    });

    function playNext() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (!isPlaying) togglePlay(); 
    }

    function playPrev() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (!isPlaying) togglePlay();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playNext();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playPrev();
        });
    }

    audio.addEventListener('ended', () => {
        playNext();
    });

    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (playOverlay) {
        playOverlay.addEventListener('click', (e) => {
            if (!e.target.closest('.yt-control-btn') && !e.target.closest('#playBtn')) {
                togglePlay(e);
            }
        });
    }

    // Click on progress bar to seek
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            progress = (clickX / rect.width) * 100;
            
            if (audio.duration) {
                audio.currentTime = (progress / 100) * audio.duration;
            }
            
            updateProgressUI();
        });
    }

    // Init
    loadTrack(0);


    // Services Data
    const services = [
        {
            title: "Estratégia de Produto",
            description: "Alinhamento entre visão de negócios e necessidades reais do usuário para criar produtos viáveis."
        },
        {
            title: "Posicionamento Digital",
            description: "Fortaleça sua presença online através de Google Meu Negócio, Landing Pages de alta conversão e Instagram."
        },
        {
            title: "Landing Page",
            description: "Criação de páginas modernas e de alta conversão, pensadas estrategicamente para transformar visitantes em clientes."
        },
        {
            title: "UX/UI Design",
            description: "Criação de interfaces intuitivas e esteticamente agradáveis, focadas na melhor experiência do usuário."
        }
    ];

    function renderServices() {
        const container = document.getElementById('cardsContainer');
        if (!container) return;

        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="/carta.webp" alt="Carta Misteriosa">
                    </div>
                    <div class="card-back">
                        <h4>${service.title}</h4>
                        <p>${service.description}</p>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                card.classList.toggle('is-flipped');
            });

            container.appendChild(card);
        });
    }

    renderServices();

    // Project Details Modal Data & Handlers
    const projectsData = {
        gmn: {
            category: "Posicionamento Digital",
            title: "Google Meu Negócio & SEO Local — Barbearia Boss Cut",
            fullDesc: "Estratégia completa de posicionamento no Google Meu Negócio e Google Maps desenvolvida para a Barbearia Boss Cut, localizada em Suzano/SP. O projeto estruturou o perfil profissional com fotos de alta qualidade, otimização de categorias, palavras-chave locais de alta intenção, informações completas de localização e canais diretos para agendamento via WhatsApp e ligações.",
            highlights: [
                "98 interações diretas realizadas no Perfil da Empresa (solicitações de rotas, ligações e agendamentos)",
                "+250 visualizações orgânicas no Perfil da Empresa conquistadas na região",
                "65% dos acessos originados diretamente de smartphones (Pesquisa Google e Google Maps)"
            ],
            tags: ["Google Maps", "SEO Local", "Barbearia Boss Cut", "Conversão", "Suzano SP"],
            images: [
                { src: "google/bosscut.jpeg", caption: "Perfil verificado e otimizado da Barbearia Boss Cut no Google Maps" },
                { src: "google/dadosboss.jpeg", caption: "Métricas de alcance: visualizações e distribuição por dispositivos" }
            ]
        },
        lp: {
            category: "Landing Page & Conversão",
            title: "Landing Page de Alta Conversão — Workshop de Geoprocessamento & Perícia",
            fullDesc: "Desenvolvimento de Landing Page de alta conversão para a Ambiental Pro, com foco nas matrículas para o Workshop de Geoprocessamento e Perícia Ambiental (com aplicação prática em QGIS). A página combina narrativa persuasiva de alto impacto, formulários de captura com validação internacional de telefone, modais inteligentes, cronograma completo de aulas, prova social e rastreamento avançado de conversões via Meta Pixel e Google Tag Manager.",
            highlights: [
                "Arquitetura focada em autoridade técnica, clareza da oferta e máxima conversão",
                "Formulário inteligente com validação internacional de telefone (intl-tel-input)",
                "Integração analítica completa com Meta Pixel (Event ID), Google Analytics 4 e GTM",
                "Design moderno em dark mode com micro-interações, acordeões interativos e alta performance"
            ],
            tags: ["Landing Page", "Ambiental Pro", "UI/UX Design", "Copywriting", "Alta Conversão", "QGIS & Perícia"],
            previewUrl: "ambientalpro/index.html",
            previewDisplayUrl: "https://workshopgeopericia.ambientalpro.com.br",
            liveUrl: "ambientalpro/index.html",
            liveUrlText: "Acessar Landing Page Completa ↗"
        },
        discovery: {
            category: "Estratégia de Produto",
            title: "Discovery & Validação de Soluções Digitais",
            fullDesc: "Condução de discovery estratégico para estruturação e validação de produtos digitais. O processo engloba mapeamento da jornada do usuário, identificação de gargalos operacionais, priorização de funcionalidades essenciais (MVP) e alinhamento das metas de negócio com a experiência do cliente.",
            highlights: [
                "Mapeamento detalhado de dores e oportunidades com foco no usuário",
                "Definição de escopo enxuto para rápido lançamento e validação",
                "Estruturação de métricas de sucesso e usabilidade"
            ],
            tags: ["Product Strategy", "Mapeamento UX", "Métricas", "Discovery", "Validação"],
            images: [
                { src: "fundo.webp", caption: "Exploração e descoberta de novas oportunidades" },
                { src: "fundo2.webp", caption: "Processo criativo e refinamento contínuo" }
            ]
        },
        uxui: {
            category: "UX/UI Design",
            title: "Design de Interface & Experiência do Usuário",
            fullDesc: "Criação completa da interface do usuário combinando elegância visual, usabilidade refinada e prototipagem interativa. Foi desenvolvido um Design System escalável com biblioteca de componentes reutilizáveis, garantindo consistência e agilidade na evolução contínua da aplicação.",
            highlights: [
                "Interfaces intuitivas com alto contraste e acessibilidade",
                "Design System escalável para manter a consistência do produto",
                "Prototipagem interativa de alta fidelidade para validação"
            ],
            tags: ["Figma", "Prototipagem", "Design System", "User Interface", "Acessibilidade"],
            images: [
                { src: "carta.webp", caption: "Direção visual e identidade de interface" },
                { src: "fundo.webp", caption: "Consistência de componentes e telas" }
            ]
        }
    };

    const projectModal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalPreview = document.getElementById('modalPreview');
    const modalGallery = document.getElementById('modalGallery');
    const modalFullDesc = document.getElementById('modalFullDesc');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalTags = document.getElementById('modalTags');

    function openProjectModal(projectId) {
        const data = projectsData[projectId];
        if (!data || !projectModal) return;

        modalCategory.textContent = data.category;
        modalTitle.textContent = data.title;
        modalFullDesc.textContent = data.fullDesc;

        // Highlights
        modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

        // Tags
        modalTags.innerHTML = data.tags.map(t => `<span class="project-modal-tag">${t}</span>`).join('');

        // Live Site Preview (Browser Mockup with Desktop Scaling)
        if (modalPreview) {
            if (data.previewUrl) {
                modalPreview.innerHTML = `
                    <div class="browser-mockup">
                        <div class="browser-mockup-header">
                            <div class="browser-mockup-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div class="browser-mockup-url">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <span>${data.previewDisplayUrl || data.previewUrl}</span>
                            </div>
                            <div class="browser-mockup-actions">
                                <a href="${data.previewUrl}" target="_blank" rel="noopener noreferrer" class="browser-mockup-btn" title="Abrir em tela cheia">
                                    <span>Abrir</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div class="browser-mockup-body" id="mockupBody">
                            <div class="browser-mockup-scaler" id="mockupScaler">
                                <iframe src="${data.previewUrl}" title="Prévia do Site" loading="lazy"></iframe>
                            </div>
                        </div>
                    </div>
                `;
                modalPreview.style.display = 'block';

                const updateScale = () => {
                    const body = document.getElementById('mockupBody');
                    const scaler = document.getElementById('mockupScaler');
                    if (body && scaler) {
                        const width = body.clientWidth;
                        if (width > 0) {
                            const scale = width / 1280;
                            scaler.style.transform = `scale(${scale})`;
                            body.style.height = `${Math.round(820 * scale)}px`;
                        }
                    }
                };

                requestAnimationFrame(() => {
                    updateScale();
                    setTimeout(updateScale, 80);
                    setTimeout(updateScale, 250);
                });

                window.removeEventListener('resize', updateScale);
                window.addEventListener('resize', updateScale);
            } else {
                modalPreview.innerHTML = '';
                modalPreview.style.display = 'none';
            }
        }

        // Gallery (for projects without live preview)
        if (data.images && data.images.length > 0) {
            modalGallery.innerHTML = data.images.map(img => `
                <div class="project-modal-image-item">
                    <img src="${img.src}" alt="${data.title}">
                    ${img.caption ? `<span class="project-modal-caption">${img.caption}</span>` : ''}
                </div>
            `).join('');
            modalGallery.style.display = 'grid';
        } else {
            modalGallery.style.display = 'none';
        }

        projectModal.classList.add('is-active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('is-active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (modalPreview) {
            modalPreview.innerHTML = '';
            modalPreview.style.display = 'none';
        }
    }

    document.querySelectorAll('.project-card').forEach(card => {
        const id = card.dataset.projectId;
        card.addEventListener('click', () => {
            openProjectModal(id);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(id);
            }
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) {
            closeProjectModal();
        }
    });
});
