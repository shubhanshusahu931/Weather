
    // API (using your provided endpoint pattern)
    const API_KEY = 'd65446347aa2420a885111404252308';
    const API_BASE = 'https://api.weatherapi.com/v1/current.json';

    const $ = (id)=>document.getElementById(id);

    function setRaining(id, on){
      const box = $(id); box.innerHTML = ''; if(!on) return;
      const n = 22; for(let i=0;i<n;i++){ const d=document.createElement('div'); d.className='drop'; d.style.left=(Math.random()*90)+'px'; d.style.animationDelay=(Math.random()*1.1)+'s'; box.appendChild(d); }
    }

    function fillCommon(d){
      const lt = d.location.localtime; // "YYYY-MM-DD HH:MM"
      const time = lt.split(' ')[1];
      const weekday = new Date(lt.replace(' ','T')).toLocaleDateString(undefined,{ weekday:'long'});
      ['1','2','3'].forEach(i=>{ $(`time${i}`).textContent = time; $(`day${i}`).textContent = weekday; });
    }

    function render(d){
      const c = d.current; fillCommon(d);
      const cond = c.condition.text;
      const isRain = /rain|drizzle|storm|shower/i.test(cond);
      setRaining('rain1', isRain); setRaining('rain2', isRain); setRaining('rain3', isRain);

      // Card 1 — Current
      $('t1').textContent = Math.round(c.temp_c) + '°C';
      $('cond1').textContent = `${cond} · ${d.location.name}`;

      // Card 2 — Feels like
      $('t2').textContent = Math.round(c.feelslike_c) + '°C';
      $('cond2').textContent = `Cloud: ${c.cloud}% · Vis: ${c.vis_km} km`;

      // Card 3 — Stats + temp echo
      $('p1').textContent = `Wind ${c.wind_kph} kph ${c.wind_dir}`;
      $('p2').textContent = `Humidity ${c.humidity}%`;
      $('p3').textContent = `UV ${c.uv}`;
      $('t3').textContent = Math.round(c.temp_c) + '°C';
    }

    async function fetchWeather(q){
      try{
        const url = `${API_BASE}?key=${API_KEY}&q=${encodeURIComponent(q)}&aqi=yes`;
        const res = await fetch(url);
        if(!res.ok) throw new Error('Network');
        const data = await res.json();
        render(data);
      }catch(e){
        console.error(e);
        ['cond1','cond2'].forEach(id=> $(id).textContent = 'Could not load. Try again.');
      }
    }

    // Search
    $('go').addEventListener('click', ()=>{
      const q = $('q').value.trim() || 'London';
      fetchWeather(q);
    });
    $('q').addEventListener('keydown', (e)=>{ if(e.key==='Enter') $('go').click(); });

    // Subtle tilt
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('mousemove', (e)=>{
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left; const y = e.clientY - r.top;
        const rx = (y/r.height - .5)*-10; const ry = (x/r.width - .5)*10;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', ()=> card.style.transform = 'rotateX(0) rotateY(0)');
    });

    // Initial
    fetchWeather('London');
