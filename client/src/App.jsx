import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4242', {
  autoConnect: false,
});

const navItems = [
  'Home',
  'Listen Live',
  'Schedule',
  'Archive',
  'Prayer Wall',
  'Music Requests',
  'About',
  'Contact',
];

const streamUrl = 'https://stream.zeno.fm/0r0xa792kwzuv';

const ministryLeaders = [
  'Chief Apostle Sam Mosley',
  'Apostle Teresa Mosley',
  'Bishop Jermaine McDonald',
  'Pastor Chrisone McDonald',
];

const tickerItems = [
  'Welcome to GWM Radio Network — live Bible, preaching, prayer, and gospel music.',
  'Prayer wall open during live broadcasts.',
  'Archive calendar available for sermon and worship replays.',
  'Honor legacy broadcasts and special memorial moments.',
  'Music requests and listener dedications accepted live.',
];

const featuredBroadcasts = [
  { title: 'Morning Glory Prayer', time: 'Weekdays · 6:00 AM', text: 'Start the day with scripture, intercession, and declarations.', badge: 'Prayer' },
  { title: 'Bible Bread Live', time: 'Weekdays · 9:00 AM', text: 'Daily teaching focused on the Word, spiritual growth, and practical faith.', badge: 'Teaching' },
  { title: 'Revival Night Live', time: 'Fridays · 7:00 PM', text: 'Live worship, preaching, testimonies, and altar ministry.', badge: 'Live Service' },
];

const announcements = [
  'Submit ministry announcements, prayer events, and conference promos in the Contact tab.',
  'Replace placeholder donation link with your giving platform or church donation page.',
  'Use the archive replay section to organize sermon, prayer, and worship recordings by date.',
];

const programs = [
  { time: '6:00 AM', title: 'Morning Glory Prayer', host: 'Prayer Intercessors', type: 'Prayer' },
  { time: '9:00 AM', title: 'Bible Bread Live', host: 'Teaching Team', type: 'Bible Study' },
  { time: '12:00 PM', title: 'Midday Worship Flow', host: 'GWM Radio', type: 'Music' },
  { time: '3:00 PM', title: 'Word & Healing', host: 'Guest Ministers', type: 'Preaching' },
  { time: '7:00 PM', title: 'Evening Revival Live', host: 'Genesis Worship Ministry', type: 'Live Service' },
  { time: '10:00 PM', title: 'Quiet Time Scriptures', host: 'Scripture Reader', type: 'Meditation' },
];

const archiveDays = [
  {
    date: '2026-04-14',
    title: 'Tuesday Night Prayer',
    category: 'Prayer',
    summary: 'Corporate intercession, healing scriptures, and prayer for families.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    date: '2026-04-13',
    title: 'Noon Day Bible Study',
    category: 'Teaching',
    summary: 'Faith, obedience, and trusting God through transition.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    date: '2026-04-12',
    title: 'Sunday Worship Replay',
    category: 'Worship',
    summary: 'Live praise, exhortation, altar call, and benediction.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    date: '2026-04-10',
    title: 'Legacy Broadcast',
    category: 'Memorial',
    summary: 'A remembrance service honoring the Apostle’s impact and ministry labor.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
];

const initialMessages = [
  { name: 'Listener1', text: 'Blessings from Chicago. This station is a comfort today.' },
  { name: 'Sister Faith', text: 'Please pray for my family and strength in my home.' },
];

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [listenerCount, setListenerCount] = useState(247);
  const [messages, setMessages] = useState(initialMessages);
  const [chatName, setChatName] = useState('');
  const [chatText, setChatText] = useState('');
  const [requestForm, setRequestForm] = useState({ name: '', song: '', artist: '', dedication: '' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', prayer: false });
  const [selectedArchive, setSelectedArchive] = useState(archiveDays[0]);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('listeners:update', (payload) => {
      setListenerCount(payload.count);
    });

    socket.on('chat:message', (payload) => {
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      socket.off('listeners:update');
      socket.off('chat:message');
      socket.disconnect();
    };
  }, []);

  const currentProgram = useMemo(() => programs[4], []);

  const submitMessage = (event) => {
    event.preventDefault();
    if (!chatName.trim() || !chatText.trim()) return;

    const payload = { name: chatName.trim(), text: chatText.trim() };
    socket.emit('chat:message', payload);
    setChatText('');
  };

  const submitRequest = (event) => {
    event.preventDefault();
    alert(`Music request submitted for ${requestForm.song || 'your selection'}. Connect this form to your backend email or database next.`);
    setRequestForm({ name: '', song: '', artist: '', dedication: '' });
  };

  const submitContact = (event) => {
    event.preventDefault();
    alert(contactForm.prayer ? 'Prayer request submitted.' : 'Message submitted.');
    setContactForm({ name: '', email: '', message: '', prayer: false });
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <img src="/gwm-logo.png" alt="GWM Radio logo" />
          <div>
            <strong>GWM Radio Network</strong>
            <span>Genesis Worship Ministry</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item}
              className={currentPage === item ? 'active' : ''}
              onClick={() => setCurrentPage(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <div className="ticker-wrap broadcast-panel">
        <div className="ticker-label">Network ticker</div>
        <div className="ticker-track">
          <div className="ticker-content">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={idx}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <main>
        <section className="hero broadcast-panel tv-hero">
          <div className="hero-copy">
            <div className="live-pill">LIVE GOSPEL RADIO · WORD · WORSHIP · PRAYER</div>
            <h1>A full ministry network homepage for live faith broadcasting.</h1>
            <p>
              Welcome to the official live station for Genesis Worship Ministry — a place for listeners to hear the Bible,
              receive prayer, join live comments, view active programming, and return to archived recordings throughout the week.
            </p>
            <div className="hero-actions">
              <button onClick={() => setCurrentPage('Listen Live')}>Watch the Live Channel</button>
              <button className="secondary" onClick={() => setCurrentPage('Archive')}>Open Replay Center</button>
            </div>
            <div className="stats-row">
              <StatCard value={`${listenerCount}+`} label="Listening now" />
              <StatCard value="24/7" label="Broadcast schedule" />
              <StatCard value="Open" label="Prayer comments" />
            </div>
          </div>
          <div className="hero-side-stack">
            <div className="hero-card glass-panel live-tv-card">
              <div className="tv-headline">GWM Live Channel</div>
              <img src="/gwm-logo.png" alt="GWM Radio Station" className="hero-logo" />
              <div className="channel-meta">
                <span className="red-dot" /> On Air Now
              </div>
              <h3>{currentProgram.title}</h3>
              <p>{currentProgram.host}</p>
              <audio controls className="hero-audio" onCanPlay={() => setAudioReady(true)}>
                <source src={streamUrl} type="audio/mpeg" />
              </audio>
              <small>{audioReady ? 'Stream connected or ready when your provider responds.' : 'Load your live stream URL here.'}</small>
            </div>
            <div className="hero-mini-grid">
              <div className="mini-card glow-card">
                <h4>Featured tonight</h4>
                <p>Revival prayer, worship, preaching, and live listener encouragement.</p>
              </div>
              <div className="mini-card glow-card">
                <h4>Give / Support</h4>
                <p>Connect your giving link here for donations, media support, and outreach giving.</p>
                <button className="inline-action">Add donation link</button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid-three network-strip">
          {featuredBroadcasts.map((item) => (
            <div key={item.title} className="broadcast-tile broadcast-panel">
              <div className="tile-badge">{item.badge}</div>
              <h3>{item.title}</h3>
              <strong>{item.time}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </section>

        <section className="grid-two top-grid">
          <div className="broadcast-panel">
            <SectionTitle
              eyebrow="Ministry legacy"
              title="A station built to gather people into the presence of God."
              text="This platform is designed for Bible teaching, live prayer, worship, preaching, ministry announcements, and pastoral connection."
            />
            <div className="memorial-card">
              <h3>Honoring the Apostle</h3>
              <p>
                In loving memory, this site includes a legacy space to honor the Apostle whose earthly transition was on January 4, 2026,
                as you shared. His impact can continue through archived messages, live prayer, gospel broadcasting, and ministry remembrance broadcasts.
              </p>
            </div>
            <div className="leaders-grid">
              {ministryLeaders.map((leader) => (
                <div key={leader} className="leader-chip">{leader}</div>
              ))}
            </div>
          </div>

          <div className="broadcast-panel chat-panel">
            <SectionTitle
              eyebrow="Live community"
              title="Real-time listener comments"
              text="Open during the live station so listeners can testify, say amen, and request prayer."
            />
            <div className="chat-feed">
              {messages.map((msg, index) => (
                <div key={`${msg.name}-${index}`} className="chat-bubble">
                  <strong>{msg.name}</strong>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            <form className="chat-form" onSubmit={submitMessage}>
              <input value={chatName} onChange={(e) => setChatName(e.target.value)} placeholder="Your name" />
              <input value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Type a live comment" />
              <button type="submit">Send</button>
            </form>
          </div>
        </section>

        <section className="grid-two feature-lower">
          <div className="broadcast-panel">
            <SectionTitle
              eyebrow="Network center"
              title="Featured broadcasts and on-screen ministry blocks"
              text="Use these cards for weekly spotlight shows, campaigns, revivals, and conference weekends."
            />
            <div className="announcement-list">
              {announcements.map((item) => (
                <div key={item} className="announcement-item">{item}</div>
              ))}
            </div>
          </div>

          <div className="broadcast-panel donation-panel">
            <SectionTitle
              eyebrow="Support the broadcast"
              title="Add giving, partners, and ministry support"
              text="This area is ready for a secure giving button, cash app, Zelle, church giving page, or donor sponsor wall."
            />
            <div className="donation-box">
              <div>
                <strong>Broadcast partner giving</strong>
                <p>Replace this text with your real donation platform and ministry support instructions.</p>
              </div>
              <button className="hero-donate">Connect Giving</button>
            </div>
          </div>
        </section>

        <section className="content-sections">
          {(currentPage === 'Home' || currentPage === 'Listen Live') && (
            <section className="broadcast-panel">
              <SectionTitle
                eyebrow="Listen live"
                title="A premium church broadcast experience"
                text="Use this area for the active stream, current program, viewer count, live comments, scripture banner, and call-to-action buttons."
              />
              <div className="listen-layout">
                <div className="player-card glass-panel">
                  <div className="live-line">
                    <span className="dot" /> Live on air
                  </div>
                  <h3>{currentProgram.title}</h3>
                  <p>{currentProgram.type} · {currentProgram.host}</p>
                  <audio controls className="wide-audio">
                    <source src={streamUrl} type="audio/mpeg" />
                  </audio>
                  <div className="scripture-box">“Faith cometh by hearing, and hearing by the word of God.” Romans 10:17</div>
                </div>
                <div className="sidebar-stack">
                  <div className="mini-card">
                    <h4>Viewer count</h4>
                    <div className="big-number">{listenerCount}</div>
                  </div>
                  <div className="mini-card">
                    <h4>Open tabs to keep</h4>
                    <ul>
                      <li>Listen Live</li>
                      <li>Archive Calendar</li>
                      <li>Prayer Wall</li>
                      <li>Music Requests</li>
                      <li>Contact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {(currentPage === 'Home' || currentPage === 'Schedule') && (
            <section className="broadcast-panel">
              <SectionTitle
                eyebrow="Daily lineup"
                title="Programming schedule"
                text="Use this schedule block for daily prayer, teaching, worship segments, live services, and special broadcasts."
              />
              <div className="schedule-grid">
                {programs.map((program) => (
                  <div key={`${program.time}-${program.title}`} className="schedule-card">
                    <div className="time">{program.time}</div>
                    <h3>{program.title}</h3>
                    <p>{program.host}</p>
                    <span>{program.type}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(currentPage === 'Home' || currentPage === 'Archive') && (
            <section className="broadcast-panel">
              <SectionTitle
                eyebrow="Archive calendar"
                title="Let listeners return to older recordings"
                text="This replay center is designed so people can click a date and listen back to previous sermons, prayers, or worship sessions."
              />
              <div className="archive-layout">
                <div className="archive-list">
                  {archiveDays.map((item) => (
                    <button
                      key={item.date}
                      className={`archive-item ${selectedArchive.date === item.date ? 'selected' : ''}`}
                      onClick={() => setSelectedArchive(item)}
                    >
                      <strong>{item.date}</strong>
                      <span>{item.title}</span>
                      <small>{item.category}</small>
                    </button>
                  ))}
                </div>
                <div className="archive-player glass-panel">
                  <div className="calendar-box">
                    <div className="month-label">April 2026</div>
                    <div className="calendar-grid">
                      {['M','T','W','T','F','S','S',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((cell, idx) => (
                        <div key={idx} className={`calendar-cell ${typeof cell === 'number' && [10,12,13,14].includes(cell) ? 'has-archive' : ''}`}>
                          {cell}
                        </div>
                      ))}
                    </div>
                  </div>
                  <h3>{selectedArchive.title}</h3>
                  <p>{selectedArchive.summary}</p>
                  <audio controls className="wide-audio">
                    <source src={selectedArchive.audioUrl} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            </section>
          )}

          {(currentPage === 'Home' || currentPage === 'Prayer Wall' || currentPage === 'Music Requests' || currentPage === 'Contact') && (
            <section className="grid-three forms-grid">
              {(currentPage === 'Home' || currentPage === 'Prayer Wall' || currentPage === 'Contact') && (
                <div className="broadcast-panel">
                  <SectionTitle
                    eyebrow="Prayer wall"
                    title="Take prayer requests from listeners"
                    text="This form can be connected to email, Airtable, Firebase, or your Node backend."
                  />
                  <form className="stack-form" onSubmit={submitContact}>
                    <input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                    <input placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                    <textarea placeholder="Prayer request or message" rows="6" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                    <label className="checkbox-row">
                      <input type="checkbox" checked={contactForm.prayer} onChange={(e) => setContactForm({ ...contactForm, prayer: e.target.checked })} />
                      Mark as prayer request
                    </label>
                    <button type="submit">Submit</button>
                  </form>
                </div>
              )}

              {(currentPage === 'Home' || currentPage === 'Music Requests') && (
                <div className="broadcast-panel">
                  <SectionTitle
                    eyebrow="Music requests"
                    title="Receive song requests and dedications"
                    text="Perfect for live gospel programming, birthday dedications, or testimony songs."
                  />
                  <form className="stack-form" onSubmit={submitRequest}>
                    <input placeholder="Your name" value={requestForm.name} onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })} />
                    <input placeholder="Requested song" value={requestForm.song} onChange={(e) => setRequestForm({ ...requestForm, song: e.target.value })} />
                    <input placeholder="Artist" value={requestForm.artist} onChange={(e) => setRequestForm({ ...requestForm, artist: e.target.value })} />
                    <textarea placeholder="Dedication or short note" rows="6" value={requestForm.dedication} onChange={(e) => setRequestForm({ ...requestForm, dedication: e.target.value })} />
                    <button type="submit">Send Request</button>
                  </form>
                </div>
              )}

              {(currentPage === 'Home' || currentPage === 'Contact') && (
                <div className="broadcast-panel">
                  <SectionTitle
                    eyebrow="Contact"
                    title="Church and station contact"
                    text="Replace this placeholder information with your ministry phone, email, service location, and announcement inbox."
                  />
                  <div className="contact-box">
                    <p><strong>Church:</strong> Genesis Worship Ministry</p>
                    <p><strong>Station:</strong> GWM Radio Network</p>
                    <p><strong>Email:</strong> info@gwmradio.org</p>
                    <p><strong>Prayer line:</strong> (000) 000-0000</p>
                    <p><strong>Address:</strong> Morgan Park, Illinois</p>
                    <p><strong>Announcement inbox:</strong> announcements@gwmradio.org</p>
                    <p><strong>Hours:</strong> Live comments open during active broadcasts.</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {currentPage === 'About' && (
            <section className="broadcast-panel about-section">
              <SectionTitle
                eyebrow="About Genesis Worship Ministry"
                title="A ministry-centered network homepage"
                text="Use this section for your founding story, leadership, legacy, and spiritual mission."
              />
              <div className="about-columns">
                <div>
                  <p>
                    Genesis Worship Ministry was formed and organized under the leadership of Pastor Sam Mosley and eight faithful congregants.
                    The ministry story speaks of being led into a new place of worship and later journeying into Morgan Park, Illinois.
                  </p>
                  <p>
                    The site can keep that story alive through radio, archived teaching, worship recordings, memorial broadcasts, and community interaction.
                  </p>
                </div>
                <div>
                  <p>
                    The ministry leaders shown on the public About page include Chief Apostle Sam and Apostle Teresa Mosley, with Bishop Jermaine and Pastor Chrisone McDonald.
                  </p>
                  <p>
                    A remodeled 11,000 square foot sanctuary is also described on the ministry site, which can be reflected visually in your branding and welcome text.
                  </p>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
