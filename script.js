document.addEventListener('DOMContentLoaded', () => {
    // Move audio declaration to top
    const audio = new Audio('Stephen Sanchez, Em Beihold - Until I Found You (Lyrics).mp3');
    audio.loop = true;
    audio.volume = 0.4; // Set volume to 40%
    
    const btnOpen = document.querySelector('.btn-open');
    const sections = document.querySelectorAll('section:not(.cover), footer');
    
    // Handle opening animation
    btnOpen.addEventListener('click', () => {
        document.querySelector('.cover').style.display = 'none';
        sections.forEach(section => {
            section.style.display = 'flex';
            section.classList.add('fade-in');
        });
        
        // Try to play audio
        try {
            audio.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        } catch (error) {
            console.log('Audio error:', error);
        }
    });

    const btnMusic = document.querySelector('.btn-music');
    let isPlaying = false;

    btnMusic.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            btnMusic.classList.remove('playing');
        } else {
            audio.play();
            btnMusic.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // Auto-pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            audio.pause();
            isPlaying = false;
            btnMusic.classList.remove('playing');
        }
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.event-card, .couple-wrapper, .venue-details, .family-wrapper').forEach((el) => {
        observer.observe(el);
    });

    // Add Media Session API support
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Until I Found You',
            artist: 'Stephen Sanchez, Em Beihold',
            album: 'Wedding of Rama & Sinta',
            artwork: [
                {
                    src: 'apisession.png',
                    sizes: '96x96',
                    type: 'image/png'
                },
                {
                    src: 'apisession.png',
                    sizes: '128x128',
                    type: 'image/png'
                },
                {
                    src: 'apisession.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'apisession.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        });

        // Add media session action handlers
        navigator.mediaSession.setActionHandler('play', () => {
            audio.play();
            isPlaying = true;
            btnMusic.classList.add('playing');
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            audio.pause();
            isPlaying = false;
            btnMusic.classList.remove('playing');
        });
    }

    // Update media session state when audio plays/pauses
    audio.addEventListener('play', () => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
        }
    });

    audio.addEventListener('pause', () => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    });
});
