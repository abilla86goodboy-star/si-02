import { useEffect, useRef, useState } from 'react'
import abillaPhoto from './assets/WhatsApp Image 2026-09-16 at 00.09.29.jpeg'
import creepAudio from './assets/lagu/Radiohead - Creep.mp3'
import abdadPhoto from './assets/abdad.jpeg'
import sencyAudio from './assets/lagu/Dia & Tenxi “Sency” (Thailand Edit) prod.0landrys!.mp3'
import farelPhoto from './assets/Farel-Juliansyah.jpeg'
import fahryPhoto from './assets/Fahry-Fanshuri.jpg'
import azkaPhoto from './assets/azka.jpeg'
import rizkiPhoto from './assets/rizki.jpg'
import shevaPhoto from './assets/Sheva.jpg' 
import khiarPhoto from './assets/Khiar.jpg'
import champagneAudio from './assets/lagu/Oasis - Champagne Supernova (Official Video).mp3'
import kitaLewatiAudio from './assets/lagu/Overnight - Kita Lewati Berdua (Official Lyric Video).mp3'
import aboutYouAudio from './assets/lagu/The 1975 - About You (Official).mp3'
import bodyPataAudio from './assets/lagu/body pata pata, thailand edit (0landrys).mp3'
import sambaladoAudio from './assets/lagu/Ayu Ting Ting - Sambalado [Lirik Lyrics] [FTjXSaL7GlM].mp3'
import ryoPhoto from './assets/ryo.webp'
import stayingAudio from './assets/lagu/Lizzy McAlpine - Staying (Official Audio).mp3'
import fabianPhoto from './assets/fabian.jpg'
import bopAudio from './assets/lagu/DaBaby - BOP (Lyrics).mp3'
import fahryArmyPhoto from './assets/fahryarmy.heic'
import whateverAudio from './assets/lagu/Whatever (Remastered).mp3'
import ahmadFauzanPhoto from './assets/AhmadFauzan.jpg'
import taritoAudio from './assets/lagu/TARITO (OFFICIAL MUSIC VIDEO) OSEN HUTASOIT.mp3'

const people = [
  { name: 'Abilla Muhammad Eljalali', role: 'Love 404 Not Found', song: 'Creep', artist: 'Radiohead', initials: 'AE', about: 'Love 404 Not Found — sebuah ruang kecil untuk cerita yang belum menemukan jawabannya.', photo: abillaPhoto, audio: creepAudio, artistUrl: 'https://www.radiohead.com/', photoClass: 'abilla-photo' },
  { name: 'Abdad Ayatullah Bumi Shadiq', role: 'insta:@abdadsh_', song: 'Sency', artist: 'Dia & Tenxi', initials: 'AB', about: 'Tenang di luar, penuh cerita di dalam. Selalu ada ruang untuk musik, teman, dan ide yang belum selesai.', photo: abdadPhoto, audio: sencyAudio, photoClass: 'abdad-photo' },
  { name: 'Farel Juliansyah', role: 'No Retreat, No Surrender.', song: 'Champagne Supernova', artist: 'Oasis', initials: 'FJ', about: 'No retreat, no surrender. Tetap jalan meski ritmenya tidak selalu mudah.', photo: farelPhoto, audio: champagneAudio },
  { name: 'Aliando Fahry', role: '@fhryfans', song: 'Kita Lewati Berdua', artist: 'Overnight', initials: 'AF', about: 'Jangan jadi cowo banci, jadilah gentleman. Owyeahh.', photo: fahryPhoto, audio: kitaLewatiAudio },
  { name: 'Azka Marta Viqar', role: 'Four letters, infinite lives.', song: 'About You', artist: 'The 1975', initials: 'AM', about: 'Ketika struktur DNA akhirnya dipahami, manusia sadar bahwa seluruh kehidupan tersusun dari empat huruf sederhana yang terus berulang. Lucunya, dari begitu banyak kemungkinan susunan yang pernah tercipta, semesta tetap memilih menghadirkan seseorang seindah dirimu.', photo: azkaPhoto, audio: aboutYouAudio },
  { name: 'Muhammad Rizki Pratomo', role: '@mhmmadrizkii_19', song: 'Body Pata Pata', artist: 'Thailand Edit', initials: 'MR', about: 'Menyimpan ritme sendiri, lalu membawanya ke mana pun langkah pergi.', photo: rizkiPhoto, audio: bodyPataAudio },
  { name: 'Muhammad Sheva Saviola', role: 'One step better.', initials: 'MS', about: 'Tidak harus hebat hari ini, cukup lebih baik dari kemarin.', photo: shevaPhoto },
  { name: 'Khiar Fadya Purnama', role: 'Diam bukan berarti lemah.', song: 'Sambalado', artist: 'Ayu Ting Ting', initials: 'KF', about: 'Diam bukan berarti lemah, tapi lapar.', photo: khiarPhoto, audio: sambaladoAudio },
  { name: 'Ryo Febri Berlian', role: 'Fokus pada progres, bukan validasi.', song: 'Staying', artist: 'Lizzy McAlpine', initials: 'RF', about: 'Fokus pada progres, bukan validasi. Pelan tidak apa-apa, selama tetap bertumbuh.', photo: ryoPhoto, audio: stayingAudio, photoClass: 'ryo-photo', profileClass: 'ryo-profile' },
  { name: 'Fabian Ayodya', role: 'Jika tidak ingin ada masalah, maka matilah.', song: 'BOP', artist: 'DaBaby', initials: 'FA', about: 'Jika tidak ingin ada masalah, maka matilah.', photo: fabianPhoto, audio: bopAudio },
  { name: 'Fahry Army', role: '@otakuhiker', song: 'Whatever', artist: 'Oasis', initials: 'FA', about: '@otakuhiker — tetap jalan dengan cara sendiri, simpan cerita di setiap perjalanan.', photo: fahryArmyPhoto, audio: whateverAudio, photoClass: 'fahry-army-photo' },
  { name: 'Ahmad Fauzan', role: 'DANG ADONG TARPATUPA NI DEBATA', song: 'TARITO', artist: 'Osen Hutasoit', initials: 'AF', about: 'DANG ADONG TARPATUPA NI DEBATA.', photo: ahmadFauzanPhoto, audio: taritoAudio },
]

function DemoPlayer({ active, setActive, source, playerRef, onTrackStart }) {
  const context = useRef(null); const timer = useRef(null)
  const localAudio = useRef(null); const audio = playerRef || localAudio
  useEffect(() => () => { clearInterval(timer.current); context.current?.close() }, [])
  const toggle = () => {
    if (source) { const player = audio.current || document.querySelector('main.archive > audio'); if (!player) return; if (active) { player.pause(); setActive(false) } else { player.src = source; player.play().then(() => { onTrackStart?.(); setActive(true) }).catch(() => setActive(false)) }; return }
    if (active) { clearInterval(timer.current); setActive(false); return }
    const Audio = window.AudioContext || window.webkitAudioContext; context.current ||= new Audio()
    const notes = [196, 247, 294, 392]; let index = 0
    const play = () => { const osc = context.current.createOscillator(); const gain = context.current.createGain(); osc.frequency.value = notes[index++ % notes.length]; gain.gain.setValueAtTime(.035, context.current.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.current.currentTime + .16); osc.connect(gain).connect(context.current.destination); osc.start(); osc.stop(context.current.currentTime + .17) }
    context.current.resume(); play(); timer.current = setInterval(play, 230); setActive(true)
  }
  return <button className={active ? 'play is-playing' : 'play'} aria-label={active ? 'Jeda lagu' : 'Putar lagu'} aria-pressed={active} onClick={toggle}><span>{active ? 'Ⅱ' : '▶'}</span><i /><i /><i /><i /></button>
}

function Boot({ onDone }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => { const timer = setInterval(() => setProgress((value) => value >= 100 ? (clearInterval(timer), 100) : value + 4), 45); const done = setTimeout(onDone, 1850); return () => { clearInterval(timer); clearTimeout(done) } }, [onDone])
  return <section className="boot"><aside className="boot-grid" aria-hidden="true" /><aside className="boot-beacon" aria-hidden="true"><i /><i /><i /></aside><aside className="boot-packets" aria-hidden="true"><i /><i /><i /><i /></aside><aside className="boot-log" aria-hidden="true"><i>&gt; INIT ARCHIVE</i><i>&gt; SYNC STUDENTS</i><i>&gt; LOAD STORIES</i></aside><aside className="boot-axis" aria-hidden="true"><small>SI_02 / BOOT</small><i /><i /><i /><b>ONLINE</b></aside><aside className="boot-ticker" aria-hidden="true"><i>PEOPLE · DATA · STORIES · SYSTEMS · </i></aside><p>LOADING SYSTEM INFORMATION TWO</p><div><i style={{ width: `${progress}%` }} /></div><b>{String(progress).padStart(3, '0')}</b><span>ARCHIVE / 02</span></section>
}

function Landing({ onEnter }) { return <section className="landing"><div className="landing-noise" /><div className="street-layer" aria-hidden="true"><i /><i /><i /><b /><b /><b /></div><div className="background-flow" aria-hidden="true"><i /><i /><i /><i /><i /></div><div className="terminal-log" aria-hidden="true"><span>&gt; archive: ready</span><span>&gt; students: 02</span><span>&gt; music: linked</span><span>&gt; interface: active</span><span>&gt; system: online</span><span>&gt; archive: ready</span></div><header><span>SIT / 02</span><span>CLASS ARCHIVE</span><span>2026</span></header><div className="system-version">SYSTEM ARCHIVE<br /><b>VERSION 02.0</b></div><div className="landing-title"><p>WELCOME TO THE SYSTEM</p><h1>System<br /><i>Information</i><br />Two.</h1><div className="landing-words"><span>ANALYSIS</span><span>DATABASE</span><span>UI / UX</span></div><button onClick={onEnter}>START THE EXPERIENCE <b>↘</b></button></div><div className="data-console" aria-hidden="true"><div className="console-head"><span>SI_02 / LIVE</span><b>● ONLINE</b></div><div className="console-hero"><strong>INFORMATION<br />SYSTEMS</strong><small>001 — 010 — 101</small></div><div className="signal-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="flow-labels"><span>ANALYSIS</span><b>→</b><span>DATABASE</span><b>→</b><span>UI / UX</span></div><div className="console-lines"><i /><i /><i /><i /></div></div><p className="landing-note">PEOPLE · DATA · STORIES · SYSTEMS</p><div className="marquee"><span>SYSTEM INFORMATION TWO · DESIGNING HUMAN SYSTEMS · SYSTEM INFORMATION TWO · DESIGNING HUMAN SYSTEMS · </span></div></section> }

function trackRadar(event) {
  if (window.matchMedia('(pointer: coarse)').matches) return
  const target = event.currentTarget
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--radar-x', `${Math.round((event.clientX - rect.left) / rect.width * 100)}%`)
  target.style.setProperty('--radar-y', `${Math.round((event.clientY - rect.top) / rect.height * 100)}%`)
  target.classList.add('is-radar-active')
}

function trackStudentField(event) {
  if (window.matchMedia('(pointer: coarse)').matches) return
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--cursor-x', `${Math.round((event.clientX - rect.left) / rect.width * 100)}%`)
  event.currentTarget.style.setProperty('--cursor-y', `${Math.round((event.clientY - rect.top) / rect.height * 100)}%`)
}

export default function Home() {
  const [booted, setBooted] = useState(false); const [entered, setEntered] = useState(false); const [selected, setSelected] = useState(null); const [playing, setPlaying] = useState(false); const [nowPlaying, setNowPlaying] = useState(null); const [search, setSearch] = useState(''); const [photoOpen, setPhotoOpen] = useState(false); const [closing, setClosing] = useState(false); const [photoClosing, setPhotoClosing] = useState(false); const [scrollProgress, setScrollProgress] = useState(0); const playerAudio = useRef(null)
  const closePhoto = () => { if (photoClosing) return; setPhotoClosing(true); window.setTimeout(() => { setPhotoOpen(false); setPhotoClosing(false) }, 220) }
  const close = () => { if (closing) return; setClosing(true); window.setTimeout(() => { setPhotoOpen(false); setPhotoClosing(false); setSelected(null); setClosing(false) }, 280) }
  useEffect(() => { const key = (event) => { if (event.key !== 'Escape') return; if (photoOpen) closePhoto(); else close() }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [photoOpen, closing, photoClosing])
  useEffect(() => { document.body.style.overflow = selected ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [selected])
  useEffect(() => { if (playing && selected?.audio) setNowPlaying(selected) }, [playing, selected])
  useEffect(() => { if (!entered || window.matchMedia('(pointer: coarse)').matches) return undefined; let frame = 0; const updateProgress = () => { if (frame) return; frame = requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - window.innerHeight; setScrollProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0); frame = 0 }) }; updateProgress(); window.addEventListener('scroll', updateProgress, { passive: true }); return () => { window.removeEventListener('scroll', updateProgress); if (frame) cancelAnimationFrame(frame) } }, [entered])
  useEffect(() => {
    if (!entered) return undefined
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .06, rootMargin: '0px 0px 12% 0px' })
    document.querySelectorAll('.scroll-reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [entered, search])
  if (!booted) return <Boot onDone={() => setBooted(true)} />
  if (!entered) return <Landing onEnter={() => setEntered(true)} />
  const visiblePeople = people.filter((person) => `${person.name} ${person.song || ''} ${person.artist || ''}`.toLowerCase().includes(search.toLowerCase().trim()))
  const stopActiveTrack = () => { playerAudio.current?.pause(); setPlaying(false) }
  const openProfile = (person) => { stopActiveTrack(); setPhotoOpen(false); setClosing(false); setSelected(person) }
  const toggleNowPlaying = () => { if (!playerAudio.current) return; if (playing) playerAudio.current.pause(); else playerAudio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) }
  return <main className="archive">
    <audio ref={playerAudio} onEnded={() => setPlaying(false)} onPause={() => setPlaying(false)} />
    <aside className="scroll-index" aria-hidden="true"><b>{String(Math.min(people.length, Math.max(1, Math.ceil(scrollProgress * people.length)))).padStart(2, '0')}</b><i><span style={{ height: `${scrollProgress * 100}%` }} /></i><small>SCROLL / {String(people.length).padStart(2, '0')}</small></aside>
    <div className="archive-ticker" aria-hidden="true"><div><span>PEOPLE / DATA / STORIES / SYSTEMS / ARCHIVE IN MOTION / PEOPLE / DATA / STORIES / SYSTEMS / </span><span>PEOPLE / DATA / STORIES / SYSTEMS / ARCHIVE IN MOTION / PEOPLE / DATA / STORIES / SYSTEMS / </span><span>PEOPLE / DATA / STORIES / SYSTEMS / ARCHIVE IN MOTION / PEOPLE / DATA / STORIES / SYSTEMS / </span><span>PEOPLE / DATA / STORIES / SYSTEMS / ARCHIVE IN MOTION / PEOPLE / DATA / STORIES / SYSTEMS / </span></div></div>
    {nowPlaying?.audio && <button className={`mini-player ${playing ? 'is-playing' : ''}`} onClick={toggleNowPlaying} aria-label={playing ? 'Jeda lagu' : 'Putar lagu'}><span>{playing ? 'Ⅱ' : '▶'}</span><p><small>{playing ? 'NOW PLAYING' : 'LAST PLAYED'}</small><strong>{nowPlaying.song} — {nowPlaying.artist}</strong></p><i /><i /><i /></button>}
    <nav aria-label="Navigasi utama"><a href="#home" className="logo">SIT<span>02</span></a><p>System Information Two</p><a href="#students">The Class <b>↓</b></a></nav>
    <section className="intro radar-zone" id="home" onPointerMove={trackRadar} onPointerLeave={(event) => event.currentTarget.classList.remove('is-radar-active')}><div className="top-radar" aria-hidden="true"><i /><i /><b>SCAN / 02</b></div><div className="intro-traces scroll-reveal" aria-hidden="true"><i /><i /><i /></div><div className="intro-stickers" aria-hidden="true"><b>FIRST DRAFT</b><b>PEOPLE FIRST</b><b>STILL BUILDING</b></div><div className="intro-counter" aria-hidden="true"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span><span>09</span><span>10</span></div><div className="intro-vertical" aria-hidden="true">HUMAN → DATA → SYSTEM → EXPERIENCE</div><p className="kicker scroll-reveal intro-kicker">2026 / SYSTEM INFORMATION TWO</p><h1 className="scroll-reveal intro-title"><span>People build</span><i>better systems.</i></h1><p className="intro-copy scroll-reveal">Sistem Informasi bukan hanya kode dan data. Ini tentang manusia, cerita, dan ide yang diubah menjadi pengalaman digital.</p><div className="system-tags scroll-reveal"><span>ANALYSIS</span><span>DATABASE</span><span>INTERFACE</span></div><a className="discover scroll-reveal" href="#students">MEET THE CLASS <span>↓</span></a><div className="number-mark scroll-reveal">02</div><div className="intro-status scroll-reveal" aria-hidden="true"><span>HUMAN</span><i /><span>DATA</span><i /><span>SYSTEM</span><b>CONNECTED</b></div></section>
    <section className="students" id="students" onPointerMove={trackStudentField}>
      <div className="student-radar" aria-hidden="true"><i /><i /><i /></div>
      <div className="student-motion" aria-hidden="true"><i /><i /><i /><span>SELECT / VIEW / ARCHIVE /</span><span>01 02 03 04 05 06 07 08 09 10</span></div>
      <div className="campus-note">FIRST DRAFT / BEST PEOPLE</div>
      <div className="section-head"><p className="kicker">{String(visiblePeople.length).padStart(2, '0')} STUDENTS / SELECT A PROFILE</p><div><label className="student-search"><span>SEARCH</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nama atau lagu..." aria-label="Cari mahasiswa atau lagu" /></label><p>Tekan kartu untuk membuka cerita dan lagu.</p><button className="shuffle-profile" onClick={() => { const list = visiblePeople.length ? visiblePeople : people; openProfile(list[Math.floor(Math.random() * list.length)]) }}>SHUFFLE PROFILE ↗</button></div></div>
      <div className="class-rail scroll-reveal" aria-hidden="true"><strong>{String(people.length).padStart(2, '0')} PROFILES</strong><div><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><span>SCROLL TO EXPLORE ↓</span></div>
      <div className="person-grid one-card">{visiblePeople.map((person, index) => <button className="person scroll-reveal" key={person.name} aria-label={`Buka profil ${person.name}`} onClick={() => openProfile(person)} style={{ '--delay': `${(index % 2) * .12}s` }}><div className={`portrait has-photo photo-radar ${person.photoClass || ''}`} onPointerMove={trackRadar} onPointerLeave={(event) => event.currentTarget.classList.remove('is-radar-active')}><img src={person.photo} alt={`Foto ${person.name}`} /><span>SI 2</span><i /><i /><i /><b className="card-mark">{String(index + 1).padStart(2, '0')}</b><b className="photo-scan" /><em className="card-scribble">VIEW ↗</em><b className="photo-radar-dot" aria-hidden="true"><i /><i /></b></div><div className="person-info"><small>STUDENT / {String(index + 1).padStart(2, '0')}</small><h2>{person.name}</h2><p>{person.role}</p><div className="feature-copy"><span>{person.song ? 'TRACK OF THE MOMENT' : 'NO TRACK ADDED'}</span><strong>{person.song ? `${person.song}${person.artist ? ` — ${person.artist}` : ''}` : 'No soundtrack yet'}</strong><em>{person.audio ? 'Tap to open profile, story, and song.' : 'Tap to open the profile and story.'}</em></div><b>OPEN PROFILE ↗</b></div></button>)}{!visiblePeople.length && <p className="no-results">PROFILE NOT FOUND — coba nama atau judul lagu lain.</p>}</div>
    </section>
    <footer><div><p>System Information Two</p><p>Built with sound, stories, and systems.</p></div><div className="yearbook-close"><span>END OF ARCHIVE</span><strong>SEE YOU IN THE<br />NEXT SYSTEM.</strong><i>CLASS OF 2026 / SIT 02</i></div><span>© 2026</span></footer>
    {selected && <div className={`modal-backdrop ${closing ? 'is-closing' : ''}`} onMouseDown={close}><section className={`profile-modal ${selected.profileClass || ''} ${playing ? 'is-playing' : ''} ${closing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-label={`Profil ${selected.name}`} onMouseDown={(event) => event.stopPropagation()}><button className="close" aria-label="Tutup profil" onClick={close}>Close ×</button><div className={`modal-portrait photo-radar ${selected.photoClass || ''}`} role="button" tabIndex="0" aria-label={`Lihat foto ${selected.name} layar penuh`} onPointerMove={trackRadar} onPointerLeave={(event) => event.currentTarget.classList.remove('is-radar-active')} onClick={() => setPhotoOpen(true)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPhotoOpen(true) } }}>{selected.photo && <img src={selected.photo} alt={`Foto ${selected.name}`} />}<span>SI 2</span><b className="expand-photo">VIEW FULL PHOTO ↗</b><b className="photo-radar-dot" aria-hidden="true"><i /><i /></b></div><div className="profile-copy"><p className="kicker">STUDENT PROFILE / 2026</p><h2>{selected.name}</h2><p className="role">{selected.role}</p><p className="about-text">{selected.about}</p><div className={`${selected.audio ? 'song' : 'song no-audio'} ${playing ? 'is-active' : ''}`}><p><small>{selected.audio ? 'NOW PLAYING' : 'SOUNDTRACK'}</small>{selected.song ? `${selected.song}${selected.artist ? ` — ${selected.artist}` : ''}` : 'No track added'}<em>{selected.audio ? 'Audio dari koleksi lokal' : 'Profil ini tidak memakai lagu.'}</em></p>{selected.audio && <DemoPlayer active={playing} setActive={setPlaying} source={selected.audio} playerRef={playerAudio} onTrackStart={() => setNowPlaying(selected)} />}</div></div><div className="lyrics"><p className="kicker">{selected.song ? 'LYRICS' : 'PROFILE NOTE'}</p><strong>{selected.song ? 'Lyrics are not stored in this archive.' : 'No track added.'}</strong><span>{selected.song ? 'Gunakan tombol atau sumber resmi untuk membaca lirik lengkap.' : 'Profil ini fokus pada cerita, tanpa pemutar musik.'}</span>{selected.artistUrl && <a href={selected.artistUrl} target="_blank" rel="noreferrer">OPEN OFFICIAL ARTIST PAGE ↗</a>}</div></section></div>}
    {photoOpen && selected && <div className={`photo-lightbox ${photoClosing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-label={`Foto penuh ${selected.name}`} onMouseDown={closePhoto}><button aria-label="Tutup foto penuh" onClick={closePhoto}>Close ×</button><img className={selected.photoClass || ''} src={selected.photo} alt={`Foto penuh ${selected.name}`} /><p>PHOTO / {selected.name}</p></div>}
  </main>
}
