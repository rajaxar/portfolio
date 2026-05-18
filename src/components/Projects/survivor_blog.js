import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { Scrollama, Step } from 'react-scrollama';

// ─── Design tokens ────────────────────────────────────────────────────────
const T = {
  bg:    '#2a1a10',
  bg2:   '#1c110a',
  ink:   '#f1e6d3',
  ink2:  '#D6CAB6',
  ink3:  '#BBAE9A',
  ink4:  '#A1927D',
  rule:  '#867661',
  rule2: '#6B5A44',
  bm: '#0F8B7E',  // emerald-teal
  bf: '#6B3FA0',  // amethyst
  wf: '#BE2A3A',  // ruby
  wm: '#C77518',  // topaz / amber
  nb: '#7BAE8A',  // sage — non-binary contestants
  warm: '#E07A3C', // deviation: above-zero (over-targeted)
  cool: '#3FA2B5', // deviation: below-zero (under-targeted)
};

const SEASON_NAMES = [
  'Borneo','Australian Outback','Africa','Marquesas','Thailand','Amazon',
  'Pearl Islands','All-Stars','Vanuatu','Palau','Guatemala','Panama',
  'Cook Islands','Fiji','China','Micronesia','Gabon','Tocantins',
  'Samoa','Heroes vs. Villains','Nicaragua','Redemption Island',
  'South Pacific','One World','Philippines','Caramoan','Blood vs. Water',
  'Cagayan','San Juan del Sur','Worlds Apart','Cambodia','Kaôh Rōng',
  'Millennials vs. Gen X','Game Changers','HHH','Ghost Island',
  'David vs. Goliath','Edge of Extinction','Island of the Idols',
  'Winners at War','41','42','43','44','45','46','47','48','49',
];

const GROUP_COLOR = {
  'BIPOC women': T.bf,
  'BIPOC men':   T.bm,
  'White women': T.wf,
  'White men':   T.wm,
  'Non-Binary':  T.nb,
};
const GROUP_ORDER = ['BIPOC women', 'BIPOC men', 'White women', 'White men'];

// ─── Mobile breakpoint hook ───────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(() => window.innerWidth < 700);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 700);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mob;
}

// ─── ResizeObserver hook ──────────────────────────────────────────────────
function useChartWidth(ref) {
  const [width, setWidth] = useState(320);
  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth || 320);
    let timer;
    const ro = new ResizeObserver(entries => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (entries[0]) setWidth(Math.floor(entries[0].contentRect.width));
      }, 80);
    });
    ro.observe(ref.current);
    return () => { ro.disconnect(); clearTimeout(timer); };
  }, [ref]);
  return width;
}

// ─── Tooltip helpers ──────────────────────────────────────────────────────
function makeTip(wrapper) {
  let tip = wrapper.querySelector('.sv-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'sv-tip';
    Object.assign(tip.style, {
      position: 'absolute', pointerEvents: 'none', display: 'none',
      background: T.bg2, border: `1px solid ${T.rule}`, borderLeft: `3px solid ${T.bf}`,
      color: T.ink2, fontFamily: '"Graphik", sans-serif', fontSize: '11px',
      lineHeight: '1.5', padding: '7px 11px', zIndex: '20', maxWidth: '200px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.55)',
    });
    wrapper.appendChild(tip);
  }
  return tip;
}

function tipPos(tip, wrapper, event) {
  const rect = wrapper.getBoundingClientRect();
  const ex = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
  const ey = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;
  const tw = tip.offsetWidth || 160;
  const th = tip.offsetHeight || 80;
  const tx = (ex + 14 + tw > wrapper.clientWidth) ? Math.max(0, ex - tw - 14) : ex + 14;
  tip.style.left = Math.max(0, Math.min(tx, wrapper.clientWidth - tw - 4)) + 'px';
  tip.style.top = Math.max(4, Math.min(ey - 50, wrapper.clientHeight - th - 4)) + 'px';
}

// ─── Inline footnote ─────────────────────────────────────────────────────
function FnText({ children, note }) {
  const [open, setOpen] = useState(false);
  const isMob = window.innerWidth < 700;
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline',
        background: `linear-gradient(transparent 55%, ${T.bf}35 55%)`,
        cursor: isMob ? 'pointer' : 'help',
      }}
      onMouseEnter={() => { if (!isMob) setOpen(true); }}
      onMouseLeave={() => { if (!isMob) setOpen(false); }}
      onClick={() => setOpen(o => !o)}
    >
      {children}
      {open && (
        <span style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1c110a',
          border: '1px solid #8b6343',
          color: '#d4b896',
          fontSize: 12,
          padding: '8px 12px',
          borderRadius: 6,
          width: 240,
          zIndex: 50,
          lineHeight: 1.5,
          pointerEvents: 'none',
        }}>{note}</span>
      )}
    </span>
  );
}

function Hl({ children }) {
  return (
    <em style={{
      fontStyle: 'normal',
      background: `linear-gradient(transparent 55%, ${T.bf}35 55%)`,
      color: T.ink,
    }}>
      {children}
    </em>
  );
}

function Legend() {
  const items = [
    { label: 'BIPOC Female', color: T.bf, shape: 'triangle' },
    { label: 'BIPOC Male',   color: T.bm, shape: 'square' },
    { label: 'White Female', color: T.wf, shape: 'triangle' },
    { label: 'White Male',   color: T.wm, shape: 'square' },
    { label: 'Non-Binary',   color: T.nb, shape: 'diamond' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px', marginTop: 10, paddingRight: 60 }}>
      {items.map(it => (
        <span key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"Graphik", sans-serif', fontSize: 12, color: T.ink4 }}>
          <svg width={10} height={10} style={{ flexShrink: 0 }}>
            {it.shape === 'triangle'
              ? <polygon points="4.5,0.5 0.5,8.5 8.5,8.5" fill={it.color} />
              : it.shape === 'diamond'
                ? <polygon points="4.5,0.5 8.5,4.5 4.5,8.5 0.5,4.5" fill={it.color} />
                : <rect x={0.5} y={0.5} width={8} height={8} fill={it.color} />}
          </svg>
          {it.label}
        </span>
      ))}
    </div>
  );
}


function Fig({ num, title, sub, note, children }) {
  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.ink4, marginBottom: 3 }}>Fig. {num}</div>
      <div style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 22, fontWeight: 800, color: T.ink, marginBottom: 2, textTransform: 'uppercase', lineHeight: 1.05 }}>{title}</div>
      {sub && <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 10, color: T.ink4, marginBottom: 14 }}>{sub}</div>}
      <div style={{ border: `0.5px solid ${T.rule}`, backgroundColor: T.bg2, padding: '16px 16px 12px' }}>
        {children}
      </div>
      {note && <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 9, color: T.ink4, marginTop: 8, lineHeight: 1.6 }}>{note}</div>}
    </div>
  );
}

function ChartLoading() {
  return (
    <div style={{ height: 200, display: 'grid', placeItems: 'center', fontFamily: '"Graphik", sans-serif', fontSize: 10, color: T.ink4 }}>
      loading…
    </div>
  );
}

// ─── FunnelChart ──────────────────────────────────────────────────────────
const FunnelChart = React.memo(function FunnelChart({ contestants, glowPhase = null, given_style = null, isMobile = false, countXOverride = false }) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const width   = useChartWidth(wrapRef);

  useEffect(() => {
    if (!contestants || contestants.length === 0 || !svgRef.current) return;
    const wrapper = wrapRef.current;
    wrapper.style.position = 'relative';
    const tip = makeTip(wrapper);

    const W = width;
    const N = contestants.length;
    const STAGES = [
      { label: 'Day 1',  count: N, active: () => true },
      { label: 'Merge',  count: contestants.filter(c => c.stage !== 'Voted out pre-merge').length, active: c => c.stage !== 'Voted out pre-merge' },
      { label: 'Finale', count: contestants.filter(c => c.finalist || c.winner).length, active: c => c.finalist || c.winner },
      { label: 'Winner', count: contestants.filter(c => c.winner).length, active: c => c.winner },
    ];
    const COLS = Math.min(N, 9);
    const R    = Math.min(8, Math.floor((W - 16) / (COLS * 2.8)));
    const STEP = R * 2 + 4;
    const PAD_T = 26, ARR_H = 22, GAP_B = 6;
    const rowsNeeded = Math.ceil(N / COLS);
    const stageH = PAD_T + rowsNeeded * STEP + GAP_B;
    const totalH  = stageH * STAGES.length + ARR_H * (STAGES.length - 1) + 8;

    const svg = d3.select(svgRef.current).attr('width', W).attr('height', totalH);
    svg.selectAll('*').remove();

    let yOff = 6;
    STAGES.forEach((stage, si) => {
      const activeSet = new Set(contestants.filter(stage.active).map(c => c.id));
      const g = svg.append('g').attr('transform', `translate(0,${yOff})`);

      g.append('text').attr('x', 0).attr('y', 14)
        .style('font-family', '"Graphik", sans-serif').style('font-size', '12px')
        .style('letter-spacing', '0.1em').style('text-transform', 'uppercase')
        .style('fill', T.ink4).text(stage.label);
 
      const countX = countXOverride ? W : isMobile ? W : (2 * W) / 3
      g.append('text').attr('x', countX).attr('y', 14).attr('text-anchor', 'end')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '12px').style('fill', T.ink)
        .text(stage.count + (stage.count === 1 ? ' player' : ' players'));

      contestants.forEach((c, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const cx  = col * STEP + R;
        const cy  = PAD_T + row * STEP;
        const inStage = activeSet.has(c.id);
        const fill  = c.color;
        const op    = inStage ? 0.9 : 0.1;

        const groupLabel = c.group
          ? c.group.charAt(0).toUpperCase() + c.group.slice(1)
          : (c.bipoc ? 'BIPOC' : 'White') + ' ' + (c.gender === 'Male' || c.gender === 'M' ? 'Male' : 'Female');
        const stageLabel = c.winner ? 'Winner' : c.finalist ? 'Finalist' : c.stage === 'Voted out pre-merge' ? 'Pre-merge' : 'Post-merge';
        const tipHtml = `<strong style="color:${T.ink}">${c.name || 'Contestant'}</strong><br/><span style="color:${fill}">${groupLabel}</span><br/>${stageLabel}`;

        let el;
        const isMale = c.gender === 'Male' || c.gender === 'M';
        const isFemale = c.gender === 'Female' || c.gender === 'F';
        if (!isMale && !isFemale) {
          // diamond for non-binary contestants
          const dm = R * 1.75;
          const pts = `${cx},${cy - dm / 2} ${cx + dm / 2},${cy} ${cx},${cy + dm / 2} ${cx - dm / 2},${cy}`;
          el = g.append('polygon').attr('points', pts).attr('fill', fill).attr('opacity', op)
            .style('cursor', inStage ? 'pointer' : 'default');
        } else if (!isMale) {
          const tr = R * 1.9;
          const pts = `${cx},${cy - tr / 2} ${cx - tr / 2},${cy + tr / 2} ${cx + tr / 2},${cy + tr / 2}`;
          el = g.append('polygon').attr('points', pts).attr('fill', fill).attr('opacity', op)
            .style('cursor', inStage ? 'pointer' : 'default');
        } else {
          const sq = R * 1.55;
          el = g.append('rect').attr('x', cx - sq / 2).attr('y', cy - sq / 2)
            .attr('width', sq).attr('height', sq).attr('fill', fill).attr('opacity', op)
            .style('cursor', inStage ? 'pointer' : 'default');
        }

        el.attr('class', 'fdot').attr('data-stage', si).attr('data-fill', fill).attr('data-active', inStage ? '1' : '0');

        el.on('mouseover touchstart', function(event) {
          if (event.cancelable) event.preventDefault();
          tip.innerHTML = tipHtml;
          tip.style.display = 'block';
          tipPos(tip, wrapper, event);
        })
        .on('mousemove', function(event) { tipPos(tip, wrapper, event); })
        .on('mouseout touchend', function() { tip.style.display = 'none'; });

      });

      yOff += stageH;
      if (si < STAGES.length - 1) {
        svg.append('text').attr('x', 5).attr('y', yOff + ARR_H / 2 + 5)
          .style('font-size', '14px').style('fill', T.ink4).text('↓');
        yOff += ARR_H;
      }
    });
  }, [contestants, width, isMobile]);

  useEffect(() => {
    if (!svgRef.current) return;
    const stageMap = { day1: 0, merge: 1, finale: 2, winner: 3 };
    const activeIdx = glowPhase != null ? stageMap[glowPhase] : null;
    d3.select(svgRef.current).selectAll('.fdot')
      .transition().duration(400).ease(d3.easeCubicOut)
      .attr('opacity', function() {
        const el = d3.select(this);
        const si = +el.attr('data-stage');
        const active = el.attr('data-active') === '1';
        if (activeIdx === null) return active ? 0.9 : 0.1;
        if (si !== activeIdx) return 0.06;
        return active ? 0.98 : 0.05;
      })
      .style('filter', function() {
        const el = d3.select(this);
        const si = +el.attr('data-stage');
        const active = el.attr('data-active') === '1';
        if (activeIdx === null || si !== activeIdx || !active) return null;
        const fill = el.attr('data-fill');
        return `drop-shadow(0 0 6px ${fill})`;
      });
  }, [glowPhase]);

  let final_style = { width: '100%', display: 'block', overflow: 'visible' }
  if (given_style) {
    final_style = {...given_style, ...final_style}
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative'}}>
      <svg ref={svgRef} style={final_style} />
    </div>
  );
});

// ─── MorphChart: dot grid → stacked bar ───────────────────────────────────
// chartState: 'grid' | 'bar'
const MorphChart = React.memo(function MorphChart({ allDots, repData, chartState }) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const width   = useChartWidth(wrapRef);
  const prevRef = useRef({ width: 0, state: null });

  const H      = 360;
  const R      = 3;
  const DSTEP  = R * 2 + 2.5;

  useEffect(() => {
    if (!allDots.length || !svgRef.current || width < 50) return;

    const W    = width;
    const prev = prevRef.current;
    const isInit = prev.state === null;
    const widthChanged = prev.width !== W && !isInit;
    const stateChanged = prev.state !== chartState && !isInit;

    prevRef.current = { width: W, state: chartState };

    // ── Compute grid positions ─────────────────────────────────────────
    const COLS = Math.max(1, Math.floor((W - 8) / DSTEP));
    const gridPos = {};
    allDots.forEach((d, i) => {
      gridPos[d.id] = {
        x: (i % COLS) * DSTEP + R + 4,
        y: Math.floor(i / COLS) * DSTEP + R + 8,
      };
    });
    const gridH = Math.ceil(allDots.length / COLS) * DSTEP + 24;

    // ── Compute bar positions (Beginning column = dots, others = rects) ─
    const m = { t: 36, r: 10, b: 28, l: 10 };
    const chartW = W - m.l - m.r;
    const chartH = H - m.t - m.b;
    const colW   = (chartW - 40) / 3;
    const colGap = 20;
    const colX   = [m.l, m.l + colW + colGap, m.l + 2 * (colW + colGap)];
    const stages = ['Beginning', 'Merge', 'Finalist'];

    const dotPos = {};   // bar positions for Beginning column
    const barRects = []; // aggregate rects for Merge + Finalist

    stages.forEach((stage, si) => {
      const x0 = colX[si];
      let yAcc = 0;
      GROUP_ORDER.forEach(group => {
        const row  = repData.find(d => d.stage === stage && d.race_gender_group === group);
        const frac = row ? +row.pct_of_stage / 100 : 0;
        const gH   = frac * chartH;

        if (stage === 'Beginning') {
          const groupDots = allDots.filter(d => d.group === group);
          const dpr = Math.max(1, Math.floor(colW / DSTEP));
          groupDots.forEach((dot, i) => {
            dotPos[dot.id] = {
              x: x0 + (i % dpr) * DSTEP + R,
              y: m.t + yAcc + Math.floor(i / dpr) * DSTEP + R,
            };
          });
        } else if (gH > 0.5) {
          barRects.push({ stage, si, group, color: GROUP_COLOR[group], x: x0, y: m.t + yAcc, w: colW, h: gH });
        }
        yAcc += gH;
      });
    });

    const svg = d3.select(svgRef.current);

    // ── First render ───────────────────────────────────────────────────
    if (isInit) {
      svg.attr('width', W).attr('height', chartState === 'grid' ? gridH : H);
      svg.selectAll('*').remove();

      svg.selectAll('circle.mdot')
        .data(allDots, d => d.id)
        .join(enter => enter.append('circle').attr('class', 'mdot')
          .attr('r', R)
          .attr('fill', d => d.color)
          .attr('opacity', 0.78)
          .attr('cx', d => chartState === 'grid' ? (gridPos[d.id]?.x ?? 0) : (dotPos[d.id]?.x ?? 0))
          .attr('cy', d => chartState === 'grid' ? (gridPos[d.id]?.y ?? 0) : (dotPos[d.id]?.y ?? 0))
        );

      if (chartState === 'bar') {
        // Draw bar rects + labels immediately
        svg.selectAll('.mrect')
          .data(barRects, d => `${d.stage}_${d.group}`)
          .join(enter => enter.append('rect').attr('class', 'mrect'))
          .attr('x', d => d.x).attr('y', d => d.y)
          .attr('width', d => d.w).attr('height', d => d.h)
          .attr('fill', d => d.color).attr('opacity', 0.88);

        stages.forEach((s, i) => {
          svg.append('text').attr('class', 'mstage-label')
            .attr('x', colX[i] + colW / 2).attr('y', H - 8)
            .attr('text-anchor', 'middle')
            .style('font-family', '"Graphik", sans-serif').style('font-size', '9px')
            .style('fill', T.ink4).style('text-transform', 'uppercase')
            .text(s);
        });
      }
      return;
    }

    // ── Resize snap ────────────────────────────────────────────────────
    if (widthChanged && !stateChanged) {
      svg.attr('width', W).attr('height', chartState === 'grid' ? gridH : H);
      svg.selectAll('circle.mdot')
        .attr('cx', d => chartState === 'grid' ? (gridPos[d.id]?.x ?? 0) : (dotPos[d.id]?.x ?? 0))
        .attr('cy', d => chartState === 'grid' ? (gridPos[d.id]?.y ?? 0) : (dotPos[d.id]?.y ?? 0));

      if (chartState === 'bar') {
        svg.selectAll('.mrect').attr('x', d => d.x).attr('y', d => d.y).attr('width', d => d.w).attr('height', d => d.h);
        svg.selectAll('.mstage-label').attr('x', (d, i) => colX[i] + colW / 2).attr('y', H - 8);
      }
      return;
    }

    // ── State transition ────────────────────────────────────────────────
    if (chartState === 'grid') {
      svg.attr('height', gridH);
      svg.selectAll('circle.mdot')
        .transition().duration(700).ease(d3.easeCubicInOut)
        .attr('cx', d => gridPos[d.id]?.x ?? 0)
        .attr('cy', d => gridPos[d.id]?.y ?? 0)
        .attr('opacity', 0.78);
      svg.selectAll('.mrect,.mstage-label').remove();

    } else if (chartState === 'bar') {
      svg.attr('height', H);

      svg.selectAll('circle.mdot')
        .transition().duration(900).ease(d3.easeCubicInOut)
        .attr('cx', d => dotPos[d.id]?.x ?? gridPos[d.id]?.x ?? 0)
        .attr('cy', d => dotPos[d.id]?.y ?? gridPos[d.id]?.y ?? 0)
        .attr('opacity', 0.82)
        .end()
        .then(() => {
        if (prevRef.current.state !== 'bar') return;
        svg.selectAll('.mrect')
          .data(barRects, d => `${d.stage}_${d.group}`)
          .join(enter => enter.append('rect').attr('class', 'mrect')
            .attr('x', d => d.x).attr('y', d => d.y + d.h)
            .attr('width', d => d.w).attr('height', 0)
            .attr('fill', d => d.color).attr('opacity', 0.88)
          )
          .transition().duration(600).ease(d3.easeCubicOut)
          .attr('y', d => d.y).attr('height', d => d.h);

        svg.selectAll('.mstage-label').remove();
        stages.forEach((s, i) => {
          svg.append('text').attr('class', 'mstage-label')
            .attr('x', colX[i] + colW / 2).attr('y', H - 8)
            .attr('text-anchor', 'middle')
            .style('font-family', '"Graphik", sans-serif').style('font-size', '9px')
            .style('fill', T.ink4).style('text-transform', 'uppercase')
            .attr('opacity', 0).text(s)
            .transition().duration(400).attr('opacity', 1);
        });
      }).catch(() => {});
    }
  }, [chartState, allDots, repData, width]); // eslint-disable-line

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', display: 'block', overflow: 'visible' }} />
    </div>
  );
});

// ─── StackedBarChart ───────────────────────────────────────────────────────
const StackedBarChart = React.memo(function StackedBarChart({ data, dataPrior = null, showNewEra = false }) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const width   = useChartWidth(wrapRef);

  // Helper: sanitize stage/group strings to a valid class suffix.
  const sanitize = s => String(s).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

  // Helper: compute per-(stage,group) cumulative-stack geometry for a given dataset.
  // Returns map keyed by `${stage}__${group}` → { y0, y1, h, frac }.
  const computeGeometry = (ds, stages, yScale) => {
    const out = {};
    if (!ds) return out;
    stages.forEach(stage => {
      const rows = ds.filter(d => d.stage === stage);
      let yacc = 0;
      GROUP_ORDER.forEach(group => {
        const row  = rows.find(d => d.race_gender_group === group);
        const frac = row ? +row.pct_of_stage / 100 : 0;
        const y0 = yScale(yacc), y1 = yScale(yacc + frac);
        out[`${stage}__${group}`] = { y0, y1, h: Math.max(0, y0 - y1), frac };
        yacc += frac;
      });
    });
    return out;
  };

  // Effect A — scaffolding: axes/gridlines/scales/labels + rects + text per stage×group.
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    const wrapper = wrapRef.current;
    wrapper.style.position = 'relative';
    const tip = makeTip(wrapper);

    const W = width;
    const m = { t: 18, r: 16, b: 32, l: 38 };
    const H = 240, w = W - m.l - m.r, h = H - m.t - m.b;

    const svg = d3.select(svgRef.current).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

    const stages = ['Beginning', 'Merge', 'Finalist'];
    const x = d3.scaleBand().domain(stages).range([0, w]).padding(0.35);
    const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

    [0, 0.25, 0.5, 0.75, 1].forEach(v => {
      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', y(v)).attr('y2', y(v)).attr('stroke', T.rule2);
      g.append('text').attr('x', -5).attr('y', y(v) + 3.5).attr('text-anchor', 'end')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.ink4)
        .text((v * 100).toFixed(0) + '%');
    });

    // Pick initial dataset: when dataPrior is provided and we are NOT in new-era state,
    // render with dataPrior; otherwise render with data.
    const initialDs = (dataPrior != null && !showNewEra) ? dataPrior : data;
    const initialGeom = computeGeometry(initialDs, stages, y);
    // Also compute primary-data geometry (used only for tooltip frac & label text in single-dataset mode).
    const dataGeom = computeGeometry(data, stages, y);

    stages.forEach(stage => {
      GROUP_ORDER.forEach(group => {
        const key = `${stage}__${group}`;
        const init = initialGeom[key] || { y0: y(0), y1: y(0), h: 0, frac: 0 };
        const color = GROUP_COLOR[group];

        const label = group.charAt(0).toUpperCase() + group.slice(1);
        // Tooltip reflects the currently-rendered dataset's frac.
        const fracForTip = init.frac;
        const tipHtml = `<strong style="color:${T.ink}">${stage}</strong><br/><span style="color:${color}">${label}</span><br/>${(fracForTip * 100).toFixed(1)}% of cast`;

        const barClass = `sb-bar-${sanitize(stage)}-${sanitize(group)}`;
        const txtClass = `sb-txt-${sanitize(stage)}-${sanitize(group)}`;

        const rect = g.append('rect')
          .attr('class', barClass)
          .attr('x', x(stage))
          .attr('width', x.bandwidth())
          .attr('fill', color).attr('opacity', 0.92)
          .style('cursor', 'pointer')
          .on('mouseover touchstart', function(event) {
            if (event.cancelable) event.preventDefault();
            tip.innerHTML = tipHtml;
            tip.style.display = 'block';
            tipPos(tip, wrapper, event);
          })
          .on('mousemove', function(event) { tipPos(tip, wrapper, event); })
          .on('mouseout touchend', function() { tip.style.display = 'none'; });

        if (dataPrior == null) {
          // Preserve original single-dataset behavior: animate height up from 0.
          rect.attr('y', init.y1).attr('height', 0)
            .transition().duration(600).ease(d3.easeCubicOut)
            .attr('height', init.h);
        } else {
          // Two-dataset mode: paint at the initial dataset's geometry directly;
          // Effect B handles transitions when showNewEra toggles.
          rect.attr('y', init.y1).attr('height', init.h);
        }

        // Percentage label (always created so Effect B can toggle opacity).
        const txt = g.append('text')
          .attr('class', txtClass)
          .attr('x', x(stage) + x.bandwidth() / 2)
          .attr('y', (init.y0 + init.y1) / 2 + 3)
          .attr('text-anchor', 'middle')
          .style('font-family', '"Graphik", sans-serif').style('font-size', '9px')
          .style('fill', '#000').style('font-weight', '500')
          .style('pointer-events', 'none')
          .text((init.frac * 100).toFixed(0) + '%');

        if (dataPrior == null) {
          // Original behavior: fade in only when frac > 0.05.
          if (init.frac > 0.05) {
            txt.attr('opacity', 0)
              .transition().delay(400).duration(300).attr('opacity', 1);
          } else {
            txt.attr('opacity', 0);
          }
        } else {
          txt.attr('opacity', init.frac > 0.05 ? 1 : 0);
        }

        // Suppress unused-var lint for dataGeom in single-dataset mode.
        void dataGeom;
      });
      g.append('text').attr('x', x(stage) + x.bandwidth() / 2).attr('y', h + 14)
        .attr('text-anchor', 'middle')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '10px').style('fill', T.ink)
        .text(stage);
    });
  }, [data, dataPrior, width]); // eslint-disable-line

  // Effect B — toggle: animate bar y/height + label opacity/position between
  // dataPrior and data geometry whenever showNewEra changes.
  useEffect(() => {
    if (dataPrior == null || !svgRef.current || !data || data.length === 0) return;

    const W = width;
    const m = { t: 18, r: 16, b: 32, l: 38 };
    const H = 240, h = H - m.t - m.b;
    void W;

    const stages = ['Beginning', 'Merge', 'Finalist'];
    const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

    const geomPrior = computeGeometry(dataPrior, stages, y);
    const geomNew   = computeGeometry(data, stages, y);

    const svg = d3.select(svgRef.current);

    stages.forEach(stage => {
      GROUP_ORDER.forEach(group => {
        const key = `${stage}__${group}`;
        const gp = geomPrior[key] || { y0: y(0), y1: y(0), h: 0, frac: 0 };
        const gn = geomNew[key]   || { y0: y(0), y1: y(0), h: 0, frac: 0 };
        const target = showNewEra ? gn : gp;

        const barSel = svg.select(`.sb-bar-${sanitize(stage)}-${sanitize(group)}`);
        if (!barSel.empty()) {
          barSel.transition().duration(600).ease(d3.easeCubicOut)
            .attr('y', target.y1)
            .attr('height', target.h);
        }

        const txtSel = svg.select(`.sb-txt-${sanitize(stage)}-${sanitize(group)}`);
        if (!txtSel.empty()) {
          txtSel.text((target.frac * 100).toFixed(0) + '%');
          txtSel.transition().duration(600).ease(d3.easeCubicOut)
            .attr('y', (target.y0 + target.y1) / 2 + 3)
            .attr('opacity', target.frac > 0.05 ? 1 : 0);
        }
      });
    });
  }, [showNewEra]); // eslint-disable-line

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
    </div>
  );
});

// ─── DeviationChart ────────────────────────────────────────────────────────
const DeviationChart = React.memo(function DeviationChart({ data, highlight, showNewEra, continuation = false }) {
  const wrapRef  = useRef(null);
  const svgRef   = useRef(null);
  const width    = useChartWidth(wrapRef);
  const dataRef  = useRef(data);
  const widthRef = useRef(width);

  // Full rebuild on data or width change
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    dataRef.current  = data;
    widthRef.current = width;
    const wrapper = wrapRef.current;
    wrapper.style.position = 'relative';
    const tip = makeTip(wrapper);

    const W = width;
    const m = { t: 32, r: 16, b: 56, l: 56 };
    const H = 380, w = W - m.l - m.r, h = H - m.t - m.b;

    const svg = d3.select(svgRef.current).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

    const labels = data.map(d => d.era);
    const x = d3.scaleBand().domain(labels).range([0, w]).padding(0.34);
    const y = d3.scaleLinear().domain([-32, 32]).range([h, 0]);

    [-20, -10, 0, 10, 20].forEach(v => {
      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', v === 0 ? T.ink : T.rule2)
        .attr('stroke-dasharray', v === 0 ? '6,4' : null)
        .attr('stroke-width', v === 0 ? 1.8 : 1);
      g.append('text').attr('x', -6).attr('y', y(v) + 3.5).attr('text-anchor', 'end')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '11px')
        .style('fill', v === 0 ? T.ink2 : T.ink3)
        .text((v > 0 ? '+' : '') + v + '%');
    });


    data.forEach(d => {
      const mean = +d.mean_deviation_pp;
      const ciLo = +d.ci_low_pp;
      const ciHi = +d.ci_high_pp;
      const isNew    = d.era === 'S41-S49';
      const isHighlight = highlight && highlight.includes(d.era);
      const fill = mean >= 0 ? T.warm : T.cool;
      const anyHighlight = highlight && highlight.length > 0;
      const baseOp = anyHighlight ? (isHighlight ? 0.95 : 0.25) : 0.78;
      const op = continuation
        ? (isNew ? 0.85 : 0.40)
        : (isNew ? (anyHighlight ? 0.22 : 0.42) : baseOp);
      const whiskerStroke = isNew ? 1.8 : 1;
      const whiskerOpacity = isNew ? 0.9 : (continuation ? 0.35 : 0.55);
      const whiskerCap = isNew ? 7 : 4;

      const bx = x(d.era), bw = x.bandwidth();
      const zero = y(0), top = y(mean);

      const sign = mean >= 0 ? '+' : '';
      const tipHtml = `<strong style="color:${T.ink}">${d.era}</strong><br/>Deviation: <span style="color:${fill}">${sign}${mean.toFixed(1)}%</span><br/><span style="color:${T.ink4};font-size:10px">CI [${ciLo.toFixed(1)}%, ${ciHi.toFixed(1)}%]</span>`;

      // Wrap all per-era elements in a group so showNewEra can animate them
      const eraKey = d.era.replace(/[^a-z0-9]/gi, '');
      const eraGroup = g.append('g')
        .attr('class', `era-group-${eraKey}`)
        .attr('opacity', isNew ? (continuation ? 1 : (showNewEra ? 1 : 0)) : 1);

      const rect = eraGroup.append('rect').attr('x', bx)
        .attr('y', Math.min(zero, top))
        .attr('width', bw).attr('height', Math.abs(zero - top))
        .attr('fill', fill).attr('opacity', op)
        .attr('stroke', isNew ? fill : 'none')
        .attr('stroke-width', isNew ? 1.5 : 0)
        .attr('stroke-dasharray', isNew ? '4,3' : null)
        .attr('class', `dev-bar era-${eraKey}${isNew ? ' dev-bar-new' : ''}`)
        .style('cursor', 'pointer')
        .on('mouseover touchstart', function(event) {
          if (event.cancelable) event.preventDefault();
          tip.innerHTML = tipHtml;
          tip.style.display = 'block';
          tipPos(tip, wrapper, event);
        })
        .on('mousemove', function(event) { tipPos(tip, wrapper, event); })
        .on('mouseout touchend', function() { tip.style.display = 'none'; });

      const w1 = y(Math.max(-32, ciLo)), w2 = y(Math.min(32, ciHi));
      eraGroup.append('line').attr('x1', bx + bw / 2).attr('x2', bx + bw / 2)
        .attr('y1', w1).attr('y2', w2).attr('stroke', T.ink2)
        .attr('stroke-width', whiskerStroke).attr('opacity', whiskerOpacity)
        .style('pointer-events', 'none');
      [w1, w2].forEach(wy => {
        eraGroup.append('line').attr('x1', bx + bw / 2 - whiskerCap).attr('x2', bx + bw / 2 + whiskerCap)
          .attr('y1', wy).attr('y2', wy).attr('stroke', T.ink2)
          .attr('stroke-width', whiskerStroke).attr('opacity', whiskerOpacity)
          .style('pointer-events', 'none');
      });

      const lblY = mean >= 0 ? top - 7 : top + 13;
      eraGroup.append('text').attr('x', bx + bw / 2).attr('y', lblY).attr('text-anchor', 'middle')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '11px')
        .style('font-weight', '500').style('fill', fill).style('pointer-events', 'none')
        .text((mean >= 0 ? '+' : '') + mean.toFixed(1) + '%');

      eraGroup.append('text').attr('x', bx + bw / 2).attr('y', h + 14).attr('text-anchor', 'middle')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.ink4)
        .text(d.era);

      if (isNew) {
        eraGroup.append('text').attr('x', bx + bw / 2).attr('y', h + 26).attr('text-anchor', 'middle')
          .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.cool)
          .text('post-mandate');
      } else if (isHighlight) {
        eraGroup.append('text').attr('x', bx + bw / 2).attr('y', h + 26).attr('text-anchor', 'middle')
          .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('font-weight', '600').style('fill', T.warm)
          .text('Peak Targeting');
      }

      // S41-S49 callout: focal annotation in continuation mode
      if (isNew && continuation) {
        const cx = bx + bw / 2;
        const cTopY = mean >= 0 ? top - 14 : top + 14;
        const boxW = Math.min(220, w - 24);
        const boxX = Math.max(8, Math.min(w - boxW - 4, cx - boxW / 2));
        const boxY = mean >= 0 ? Math.max(8, cTopY - 56) : Math.min(h - 56, cTopY + 8);
        const callout = eraGroup.append('g').attr('class', 'dev-callout-S4149').attr('opacity', 0);
        callout.append('line').attr('x1', cx).attr('x2', cx)
          .attr('y1', mean >= 0 ? cTopY : cTopY)
          .attr('y2', mean >= 0 ? boxY + 40 : boxY)
          .attr('stroke', T.cool).attr('stroke-width', 1.2);
        callout.append('rect').attr('x', boxX).attr('y', boxY).attr('width', boxW).attr('height', 40)
          .attr('fill', T.bg2).attr('stroke', T.cool).attr('stroke-width', 1);
        const txt = callout.append('text').attr('x', boxX + 10).attr('y', boxY + 16)
          .style('font-family', '"Graphik", sans-serif').style('font-size', '10px').style('fill', T.ink)
          .style('font-weight', '600');
        txt.append('tspan').attr('x', boxX + 10).attr('dy', 0).text('BIPOC under-targeted post-mandate');
        txt.append('tspan').attr('x', boxX + 10).attr('dy', 14).style('font-weight', '400').style('fill', T.ink3).text(`CI [${ciLo.toFixed(1)}%, ${ciHi.toFixed(1)}%]`);
      }

      // Callout annotation pre-drawn for S21-S30, hidden by default. Highlight effect toggles opacity.
      if (!continuation && d.era === 'S21-S30' && mean >= 0) {
        const cx = bx + bw / 2;
        const cTopY = top - 14;
        const boxW = Math.min(240, w - 24);
        const boxX = Math.max(8, Math.min(w - boxW - 4, cx - boxW / 2));
        const boxY = Math.max(8, cTopY - 56);
        const callout = eraGroup.append('g').attr('class', 'dev-callout-S21S30').attr('opacity', 0);
        callout.append('line').attr('x1', cx).attr('x2', cx).attr('y1', cTopY).attr('y2', boxY + 40)
          .attr('stroke', T.warm).attr('stroke-width', 1.2);
        callout.append('rect').attr('x', boxX).attr('y', boxY).attr('width', boxW).attr('height', 40)
          .attr('fill', T.bg2).attr('stroke', T.warm).attr('stroke-width', 1);
        const txt = callout.append('text').attr('x', boxX + 10).attr('y', boxY + 16)
          .style('font-family', '"Graphik", sans-serif').style('font-size', '11px').style('fill', T.ink)
          .style('font-weight', '600');
        txt.append('tspan').attr('x', boxX + 10).attr('dy', 0).text('BIPOC players targeted ~16% more');
        txt.append('tspan').attr('x', boxX + 10).attr('dy', 14).text('than their pool share predicts.');
      }
    });

    g.append('text').attr('transform', `translate(${-42},${h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .style('font-family', '"Graphik", sans-serif').style('font-size', '12px').style('fill', T.ink3)
      .text('Percent Deviation in Expected vs Actual Targeting');

  }, [data, width]); // eslint-disable-line


  // Animate S41-S49 era group in/out on showNewEra change (or callout in continuation mode)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    if (continuation) {
      // S41-S49 bar always visible in continuation mode; toggle only the focal callout
      svg.select('.dev-callout-S4149')
        .transition().duration(500).ease(d3.easeCubicOut)
        .attr('opacity', showNewEra ? 1 : 0);
    } else {
      svg.select('.era-group-S4149')
        .transition().duration(700).ease(d3.easeCubicOut)
        .attr('opacity', showNewEra ? 1 : 0);
    }
  }, [showNewEra]); // eslint-disable-line

  // Targeted highlight update — no rebuild
  useEffect(() => {
    if (!svgRef.current || !dataRef.current.length) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll('.dev-bar')
      .transition().duration(350)
      .attr('opacity', function() {
        const isNew = this.classList.contains('dev-bar-new');
        const cls = Array.from(this.classList).find(c => c.startsWith('era-') && c !== 'era-group');
        if (!cls) return continuation ? (isNew ? 0.85 : 0.40) : (isNew ? 0.42 : 0.78);
        const era = dataRef.current.find(d => `era-${d.era.replace(/[^a-z0-9]/gi, '')}` === cls);
        if (!era) return continuation ? (isNew ? 0.85 : 0.40) : (isNew ? 0.42 : 0.78);
        const isHigh = highlight && highlight.includes(era.era);
        const anyHi  = highlight && highlight.length > 0;
        if (continuation) return isNew ? 0.85 : 0.40;
        if (isNew) return anyHi ? 0.22 : 0.42;
        return anyHi ? (isHigh ? 0.95 : 0.25) : 0.78;
      });

    // Toggle callout for S21-S30
    const showCallout = highlight && highlight.includes('S21-S30');
    svg.selectAll('.dev-callout-S21S30')
      .transition().duration(350)
      .attr('opacity', showCallout ? 1 : 0);
  }, [highlight]); // eslint-disable-line

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
    </div>
  );
});

// ─── RidgePlot ────────────────────────────────────────────────────────────
const RidgePlot = React.memo(function RidgePlot({ data, showNewEra = false, winners = [] }) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const width   = useChartWidth(wrapRef);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    const wrapper = wrapRef.current;
    wrapper.style.position = 'relative';
    const tip = makeTip(wrapper);

    const W  = width;
    const ERA_ORDER = ['S1-S10', 'S11-S20', 'S21-S30', 'S31-S40', 'S41-S49'];
    const m  = { t: 14, r: 14, b: 32, l: 68 };
    const H  = ERA_ORDER.length * 58 + m.t + m.b;
    const w  = W - m.l - m.r, h = H - m.t - m.b;

    const svg = d3.select(svgRef.current).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

    const ageMin = 17, ageMax = 68;
    const x = d3.scaleLinear().domain([ageMin, ageMax]).range([0, w]);
    const rowH = h / ERA_ORDER.length;

    [20, 30, 40, 50, 60].forEach(v => {
      g.append('line').attr('x1', x(v)).attr('x2', x(v)).attr('y1', 0).attr('y2', h)
        .attr('stroke', T.rule2).attr('stroke-dasharray', '2,3');
      g.append('text').attr('x', x(v)).attr('y', h + 14).attr('text-anchor', 'middle')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.ink4)
        .text(v);
    });
    g.append('text').attr('x', w / 2).attr('y', h + 26).attr('text-anchor', 'middle')
      .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.ink4)
      .text('age (years)');

    const GRID_N = 120;
    const gridAges = d3.range(GRID_N).map(s => ageMin + (ageMax - ageMin) * s / (GRID_N - 1));
    const eraInfos = ERA_ORDER.map((era, i) => {
      const ages = data.filter(d => d.era === era).map(d => +d.age).filter(a => !isNaN(a) && a > 0);
      if (ages.length === 0) return null;
      const mu = d3.mean(ages);
      const sd = Math.max(1, d3.deviation(ages));
      const n = ages.length;
      const bw = Math.max(0.5, 0.35 * Math.pow(n, -1 / 5) * sd);
      const norm = 1 / (n * bw * Math.sqrt(2 * Math.PI));
      const densities = gridAges.map(a => {
        let s = 0;
        for (let k = 0; k < n; k++) {
          const z = (a - ages[k]) / bw;
          s += Math.exp(-0.5 * z * z);
        }
        return s * norm;
      });
      return { era, i, ages, mu, sd, n, bw, densities };
    });
    const globalMaxDensity = d3.max(eraInfos.filter(Boolean), e => d3.max(e.densities)) || 1;

    eraInfos.forEach(info => {
      if (!info) return;
      const { era, i, ages, mu, densities } = info;
      const isNewEraRow = era === 'S41-S49';
      const yBase = (i + 1) * rowH;
      const peakH = rowH * 0.88;
      const pts = densities.map((dens, s) => [x(gridAges[s]), yBase - (dens / globalMaxDensity) * peakH]);

      const fill = era === 'S41-S49' ? T.bf : T.ink;
      const op   = era === 'S41-S49' ? 0.85 : 0.5;

      // For S41-S49 row, wrap everything in a <g> so Effect B can toggle a single opacity
      const rowG = isNewEraRow
        ? g.append('g').attr('class', 'ridge-row-s4149').attr('opacity', showNewEra ? 1 : 0)
        : g;

      const area = d3.area().x(d => d[0]).y0(yBase).y1(d => d[1]).curve(d3.curveMonotoneX);
      const areaPath = rowG.append('path')
        .attr('d', area(pts)).attr('fill', fill).attr('opacity', op * 0.18);
      const linePath = rowG.append('path')
        .attr('d', d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveMonotoneX)(pts))
        .attr('stroke', fill).attr('stroke-width', 1.2).attr('fill', 'none').attr('opacity', op);

      const sorted = [...ages].sort((a, b) => a - b);
      const q25 = sorted[Math.floor(sorted.length * 0.25)] ?? mu;
      const q75 = sorted[Math.floor(sorted.length * 0.75)] ?? mu;
      const tipHtml = `<strong style="color:${T.ink}">${era}</strong><br/>Mean age: <span style="color:${fill}">${mu.toFixed(1)}</span><br/><span style="color:${T.ink4};font-size:10px">${q25.toFixed(0)}–${q75.toFixed(0)} yr range</span>`;
      // hover rect appended to g (not rowG) so it stays interactive regardless of row opacity
      g.append('rect')
        .attr('x', 0).attr('y', yBase - rowH).attr('width', w).attr('height', rowH)
        .attr('fill', 'transparent').style('cursor', 'pointer')
        .on('mouseover touchstart', function(event) {
          if (event.cancelable) event.preventDefault();
          areaPath.attr('opacity', op * 0.35);
          linePath.attr('stroke-width', 2.2);
          tip.innerHTML = tipHtml;
          tip.style.display = 'block';
          tipPos(tip, wrapper, event);
        })
        .on('mousemove', function(event) { tipPos(tip, wrapper, event); })
        .on('mouseout touchend', function() {
          areaPath.attr('opacity', op * 0.18);
          linePath.attr('stroke-width', 1.2);
          tip.style.display = 'none';
        });

      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', yBase).attr('y2', yBase)
        .attr('stroke', T.rule).attr('stroke-width', 0.5).style('pointer-events', 'none');

      rowG.append('text').attr('x', -8).attr('y', yBase - 4).attr('text-anchor', 'end')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '10px').style('fill', T.ink)
        .text(era);

      const mx = x(mu);
      rowG.append('line').attr('x1', mx).attr('x2', mx).attr('y1', yBase).attr('y2', yBase - rowH * 0.5)
        .attr('stroke', fill).attr('stroke-dasharray', '2,2').attr('opacity', 0.7)
        .style('pointer-events', 'none');
      rowG.append('text').attr('x', mx + 3).attr('y', yBase - rowH * 0.5 - 2)
        .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', fill)
        .style('pointer-events', 'none')
        .text('Average Age: ' + mu.toFixed(0));

      if (isNewEraRow && winners && winners.length > 0) {
        const HIGHLIGHTS = [
          { season: 43, slug: 'gabler' },
          { season: 44, slug: 'yamyam' },
        ];
        HIGHLIGHTS.forEach(({ season, slug }) => {
          const wnr = winners.find(w => w.season === season);
          if (!wnr || wnr.age == null || isNaN(wnr.age)) return;
          const xPos = x(+wnr.age);
          const k = gridAges.findIndex(a => a >= +wnr.age);
          const dens = k >= 0 ? densities[k] : densities[densities.length - 1];
          const yTop = yBase - (dens / globalMaxDensity) * peakH;
          const wTip = `<strong style="color:${T.ink}">${wnr.name}</strong><br/><span style="color:${T.ink4};font-size:10px">S${wnr.season} winner · age ${Math.round(+wnr.age)}</span>`;

          const line = rowG.append('line')
            .attr('class', `ridge-winner-${slug}`)
            .attr('x1', xPos).attr('x2', xPos)
            .attr('y1', yBase).attr('y2', yTop)
            .attr('stroke', T.bf).attr('stroke-width', 1.5)
            .attr('opacity', 0).style('cursor', 'pointer');

          const setGlow = (on) => {
            if (on) {
              line.attr('stroke-width', 2.6).attr('opacity', 1)
                .attr('opacity', 1)
                .style('filter', `drop-shadow(0 0 5px ${T.bf})`);
            } else {
              line.attr('stroke-width', 1.5).attr('opacity', 0).style('filter', null);
            }
          };
          line.node().__setGlow = setGlow;

          const hitRect = rowG.append('rect')
            .attr('x', xPos - 6).attr('y', yTop - 6)
            .attr('width', 12).attr('height', yBase - yTop + 12)
            .attr('fill', 'transparent').style('cursor', 'pointer');
          hitRect
            .on('mouseover touchstart', function(event) {
              if (event.cancelable) event.preventDefault();
              setGlow(true);
              tip.innerHTML = wTip;
              tip.style.display = 'block';
              tipPos(tip, wrapper, event);
            })
            .on('mousemove', function(event) { tipPos(tip, wrapper, event); })
            .on('mouseout touchend', function() {
              setGlow(false);
              tip.style.display = 'none';
            });
        });
      }
    });
  }, [data, width, winners]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect B: animate S41-S49 row group opacity when showNewEra changes
  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll('.ridge-row-s4149')
      .transition().duration(700).ease(d3.easeCubicOut)
      .attr('opacity', showNewEra ? 1 : 0);
  }, [showNewEra]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
    </div>
  );
});

// ─── WageChart ────────────────────────────────────────────────────────────
const WageChart = React.memo(function WageChart({ data, step = 2 }) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const width   = useChartWidth(wrapRef);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    const wrapper = wrapRef.current;
    wrapper.style.position = 'relative';
    const tip = makeTip(wrapper);

    const W = width;
    const m = { t: 22, r: 18, b: 34, l: 52 };
    const H = 240, w = W - m.l - m.r, h = H - m.t - m.b;

    const svg = d3.select(svgRef.current).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();
    const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

    const x    = d3.scaleLinear().domain([1, 49]).range([0, w]);
    const yMax = d3.max(data, d => +d.ci_high) * 1.08;
    const y    = d3.scaleLinear().domain([20000, yMax]).range([h, 0]).nice();

    y.ticks(5).forEach(v => {
      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', y(v)).attr('y2', y(v)).attr('stroke', T.rule2);
      g.append('text').attr('x', -6).attr('y', y(v) + 3.5).attr('text-anchor', 'end')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.ink4)
        .text('$' + (v / 1000).toFixed(0) + 'k');
    });
    [1, 10, 20, 30, 40, 49].forEach(s => {
      g.append('line').attr('x1', x(s)).attr('x2', x(s)).attr('y1', h).attr('y2', h + 4).attr('stroke', T.rule);
      g.append('text').attr('x', x(s)).attr('y', h + 14).attr('text-anchor', 'middle')
        .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.ink4)
        .text('S' + s);
    });

    const preData  = data.filter(d => +d.season <= 40);
    const s40Row   = data.find(d => +d.season === 40);
    const postData = data.filter(d => +d.season >= 41);
    const bridgeData = s40Row ? [s40Row, ...postData] : postData;
    const lineGen  = d3.line().x(d => x(+d.season)).y(d => y(+d.mean_wage)).curve(d3.curveMonotoneX);

    if (step >= 2) {
      const ciArea = d3.area()
        .x(d => x(+d.season))
        .y0(d => y(Math.max(20000, +d.ci_low)))
        .y1(d => y(+d.ci_high))
        .curve(d3.curveMonotoneX);
      const ciPath = g.append('path').attr('d', ciArea(data)).attr('fill', T.ink).attr('opacity', 0)
        .style('pointer-events', 'none');
      ciPath.transition().duration(500).attr('opacity', 0.07);
    }

    g.append('path').attr('d', lineGen(preData)).attr('fill', 'none').attr('stroke', T.ink3).attr('stroke-width', 1.4)
      .attr('opacity', 0.7).style('pointer-events', 'none');

    if (step >= 1) {
      const mandateLine = g.append('line').attr('x1', x(40.5)).attr('x2', x(40.5)).attr('y1', -2).attr('y2', h)
        .attr('stroke', T.bf).attr('stroke-dasharray', '3,3').attr('opacity', 0)
        .style('pointer-events', 'none');
      const mandateLabel = g.append('text').attr('x', x(40.5) + 4).attr('y', 8)
        .style('font-family', '"Graphik", sans-serif').style('font-size', '8px').style('fill', T.bf)
        .attr('opacity', 0)
        .text('S41 · mandate');
      mandateLine.transition().duration(400).attr('opacity', 0.6);
      mandateLabel.transition().duration(400).attr('opacity', 1);

      const postPath = g.append('path').attr('d', lineGen(bridgeData)).attr('fill', 'none').attr('stroke', T.bf).attr('stroke-width', 1.6)
        .style('pointer-events', 'none');
      const totalLen = postPath.node().getTotalLength();
      postPath.attr('stroke-dasharray', `${totalLen} ${totalLen}`).attr('stroke-dashoffset', totalLen)
        .transition().duration(1200).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);
    }

    const drawDots = (rows, color, animate) => {
      rows.forEach(d => {
        const sNum = +d.season;
        const sName = SEASON_NAMES[sNum - 1] || `S${sNum}`;
        const wage = +d.mean_wage;
        const tipHtml = `<strong style="color:${T.ink}">S${sNum}: ${sName}</strong><br/>Est. income: <span style="color:${color}">$${(wage / 1000).toFixed(1)}k</span><br/><span style="color:${T.ink4};font-size:10px">CI [$${(+d.ci_low / 1000).toFixed(1)}k–$${(+d.ci_high / 1000).toFixed(1)}k]</span>`;

        g.append('circle').attr('cx', x(sNum)).attr('cy', y(wage)).attr('r', 7)
          .attr('fill', 'transparent').style('cursor', 'pointer')
          .on('mouseover touchstart', function(event) {
            if (event.cancelable) event.preventDefault();
            tip.innerHTML = tipHtml;
            tip.style.display = 'block';
            tipPos(tip, wrapper, event);
          })
          .on('mousemove', function(event) { tipPos(tip, wrapper, event); })
          .on('mouseout touchend', function() { tip.style.display = 'none'; });

        const dot = g.append('circle').attr('cx', x(sNum)).attr('cy', y(wage)).attr('r', 2.2)
          .attr('fill', color).attr('opacity', animate ? 0 : 0.85).style('pointer-events', 'none');
        if (animate) dot.transition().delay(600).duration(500).attr('opacity', 0.85);
      });
    };

    drawDots(preData, T.ink3, false);
    if (step >= 1) drawDots(postData, T.bf, true);

    g.append('text').attr('transform', `translate(${-40},${h / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .style('font-family', '"Graphik", sans-serif').style('font-size', '9px').style('fill', T.ink4)
      .text('estimated annual income');
  }, [data, width, step]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
    </div>
  );
});

// ─── ScrollyScene: one sticky chart + its own Scrollama steps ────────────
// Tuning props (all in vh). Override per-scene to fine-tune scroll feel:
//   stepPadVh         — scroll distance above each step's text (default 50)
//   stepPadBottomVh   — scroll distance below each step's text (default = stepPadVh)
//   stepGapVh         — scroll gap BETWEEN consecutive step boxes (default 60)
//   leadPadVh         — empty space before the first step appears (default 8)
//   stickyTopVhMobile — sticky chart top offset, mobile (default 12)
//   stickyHeightVhMobile — sticky chart container height, mobile (default 72)
//   stickyTopVhDesktop / stickyHeightVhDesktop — same for desktop (defaults 12 / 76)
function ScrollyScene({
  chart, steps, isMobile, pageEl, onStepEnter, onStepProgress, trailingContent = null,
  stepPadVh = 20,
  stepPadBottomVh,
  stepGapVh = 60,
  stepPadVhDesktop = 5,
  stepGapVhDesktop = 6,
  leadPadVh = 8,
  leadPadVhDesktop = 30,
  stickyTopVhMobile = 12,
  stickyHeightVhMobile = 72,
  stickyTopVhDesktop = 12,
  stickyHeightVhDesktop = 76,
  chartBottomPadVhMobile = 8,
  tailPadVhMobile = 6,
  offsetMobile = 0.85,
  offsetDesktop = 0.55,
  chartAlignMobile = 'center',
}) {
  const padBottom = stepPadBottomVh ?? stepPadVh;
  return (
    <>
      <div style={isMobile ? {
        maxWidth: 1080, margin: '0 auto', padding: '0 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      } : {
        maxWidth: 2160, margin: '0 auto', padding: '0 36px 0 100px',
        display: 'flex', gap: 24, alignItems: 'flex-start',
      }}>
        <div style={isMobile ? {
          position: 'sticky', top: `${stickyTopVhMobile}svh`, width: '100%', height: `${stickyHeightVhMobile}dvh`,
          display: 'flex', flexDirection: 'column', justifyContent: chartAlignMobile,
          paddingBottom: `${chartBottomPadVhMobile}vh`,
          boxSizing: 'border-box',
          zIndex: 100,
        } : {
          flex: '0 0 50%', position: 'sticky', top: `${stickyTopVhDesktop}svh`,
          height: `${stickyHeightVhDesktop}dvh`, alignSelf: 'flex-start',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          zIndex: 100
        }}>
          {chart}
        </div>
        <div style={isMobile ? { width: '100%', position: 'relative', zIndex: 101 } : { flex: '0 0 32%', paddingRight: 40, position: 'relative', zIndex: 101 }}>
          <div style={{ paddingTop: `${isMobile ? leadPadVh : leadPadVhDesktop}vh` }} />
          <Scrollama onStepEnter={onStepEnter} onStepProgress={onStepProgress} progress={!!onStepProgress} offset={isMobile ? offsetMobile : offsetDesktop} root={pageEl}>
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              const isFirst = i === 0;
              const halfChartVh = stickyHeightVhDesktop / 2.5;
              return (
                <Step data={i} key={i}>
                  <div style={isMobile ? {
                    // last step zeroes bottom padding/margin so the sticky chart unsticks with the text
                    padding: isLast ? `${stepPadVh}vh 0 0` : `${stepPadVh}vh 0 ${padBottom}vh`,
                    minHeight: 200,
                    marginBottom: isLast ? 0 : `${stepGapVh}vh`,
                    marginTop: isLast && isMobile ? `${stickyHeightVhMobile}vh` : 0
                  } : {
                    padding: isFirst
                      ? `0 0 ${stepPadVhDesktop}vh`
                      : isLast
                        ? `${stepPadVhDesktop}vh 0 ${halfChartVh}vh`
                        : `${stepPadVhDesktop}vh 0 ${stepPadVhDesktop}vh`,
                    minHeight: 200,
                    marginBottom: isLast ? 0 : `${stepGapVhDesktop}vh`,
                  }}>
                    {isMobile ? (
                      <div style={{ background: 'rgba(28,17,10,0.88)', padding: '16px', borderRadius: 8 }}>
                        {step}
                      </div>
                    ) : isFirst ? (
                      <div style={{ transform: 'translateY(-50%)' }}>{step}</div>
                    ) : step}
                  </div>
                </Step>
              );
            })}
          </Scrollama>
        </div>
      </div>
      {trailingContent && isMobile && (
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 28px' }}>
          {trailingContent}
        </div>
      )}
      {isMobile && <div style={{ height: `${tailPadVhMobile}dvh` }} />}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
function SurvivorBlog() {
  const [csvData,      setCsvData]      = useState(null);
  const [sliderVal,    setSliderVal]    = useState(18);
  const [activeSeason, setActiveSeason] = useState(18);
  const [newEraSliderVal,    setNewEraSliderVal]    = useState(45);
  const [newEraActiveSeason, setNewEraActiveSeason] = useState(45);
  const [tocantinsGlowPhase, setTocantinsGlowPhase] = useState(null);
  const [devHighlight, setDevHighlight] = useState([]);
  const [showDevS49,   setShowDevS49]   = useState(false);
  const [showRepS49NewEra, setShowRepS49NewEra] = useState(false);
  const [showRidgeNewEra,  setShowRidgeNewEra]  = useState(false);
  const [wageStep,         setWageStep]         = useState(0);
  const isMobile = useIsMobile();
  const debounceRef = useRef(null);
  const newEraDebounceRef = useRef(null);
  const [pageEl, setPageEl] = useState(null);
  const pageRefCb = useCallback(node => { if (node) setPageEl(node); }, []);

  useEffect(() => {
    const fn = e => {
      if (!e.target.closest('.sv-tip')) {
        document.querySelectorAll('.sv-tip').forEach(t => { t.style.display = 'none'; });
      }
    };
    document.addEventListener('touchstart', fn, { passive: true });
    return () => document.removeEventListener('touchstart', fn);
  }, []);

  useEffect(() => {
    const base = process.env.PUBLIC_URL + '/data/';
    Promise.all([
      d3.csv(base + 'funnel_stages.csv'),
      d3.csv(base + 'representation_stages.csv'),
      d3.csv(base + 'premerge_deviation_by_era.csv'),
      d3.csv(base + 'age_by_contestant.csv'),
      d3.csv(base + 'season_wage.csv'),
    ]).then(([funnel, representation, deviation, age, wage]) => {
      setCsvData({ funnel, representation, deviation, age, wage });
    }).catch(err => console.error('CSV load error', err));
  }, []);

  const handleSlider = val => {
    setSliderVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setActiveSeason(val), 120);
  };

  const handleNewEraSlider = val => {
    setNewEraSliderVal(val);
    clearTimeout(newEraDebounceRef.current);
    newEraDebounceRef.current = setTimeout(() => setNewEraActiveSeason(val), 120);
  };

  useEffect(() => () => {
    if (newEraDebounceRef.current) clearTimeout(newEraDebounceRef.current);
  }, []);

  const parsedFunnel = useMemo(() => {
    if (!csvData) return [];
    return csvData.funnel.map(d => {
      const isBinary = d.gender === 'Male' || d.gender === 'Female';
      const group = d.race_gender_group || (isBinary ? null : 'Non-Binary');
      return ({
      id:       d.castaway_id,
      name:     d.castaway,
      season:   +d.season,
      gender:   d.gender,
      bipoc:    d.bipoc === 'True',
      group,
      color:    GROUP_COLOR[group] || T.ink3,
      order:    +d.order,
      stage:    d.stage_reached,
      finalist: d.finalist === 'True',
      winner:   d.winner === 'True',
      });
    });
  }, [csvData]);

  const s18Contestants = useMemo(() =>
    parsedFunnel.filter(c => c.season === 18).sort((a, b) => a.order - b.order),
  [parsedFunnel]);

  const activeFunnelContestants = useMemo(() =>
    parsedFunnel.filter(c => c.season === activeSeason).sort((a, b) => a.order - b.order),
  [parsedFunnel, activeSeason]);

  const newEraActiveFunnelContestants = useMemo(() =>
    parsedFunnel.filter(c => c.season === newEraActiveSeason).sort((a, b) => a.order - b.order),
  [parsedFunnel, newEraActiveSeason]);

  // eslint-disable-next-line no-unused-vars
  const allDotsS49 = useMemo(() =>
    parsedFunnel.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group)),
  [parsedFunnel]);

  const repS40 = useMemo(() => csvData ? csvData.representation.filter(d => d.window === 'S1-S40') : [], [csvData]);
  // S41-S49 derived: subtract S1-S40 counts from S1-S49 counts per stage×group, recompute pct_of_stage
  const repS4149 = useMemo(() => {
    if (!csvData) return [];
    const s40 = csvData.representation.filter(d => d.window === 'S1-S40');
    const s49 = csvData.representation.filter(d => d.window === 'S1-S49');
    const key = d => `${d.stage}__${d.race_gender_group}`;
    const m40 = new Map(s40.map(d => [key(d), +d.count]));
    const totals = {};
    const rows = s49.map(d => {
      const c = +d.count - (m40.get(key(d)) || 0);
      totals[d.stage] = (totals[d.stage] || 0) + c;
      return { window: 'S41-S49', stage: d.stage, race_gender_group: d.race_gender_group, count: c };
    });
    return rows.map(r => ({ ...r, pct_of_stage: totals[r.stage] > 0 ? (r.count / totals[r.stage]) * 100 : 0 }));
  }, [csvData]);
  const devS49 = useMemo(() => csvData ? csvData.deviation.filter(d => d.window === 'S1-S49') : [], [csvData]);
  const ageData  = useMemo(() => csvData ? csvData.age : [], [csvData]);
  const wageData = useMemo(() => csvData ? csvData.wage : [], [csvData]);
  const s4149Winners = useMemo(() => {
    if (!csvData) return [];
    const ageById = new Map(csvData.age.map(a => [a.castaway_id, +a.age]));
    return parsedFunnel
      .filter(c => c.winner && c.season >= 41 && c.season <= 49)
      .map(c => ({ id: c.id, name: c.name, season: c.season, age: ageById.get(c.id) }))
      .filter(w => w.age != null && !isNaN(w.age));
  }, [csvData, parsedFunnel]);

  const activeSeasonName = SEASON_NAMES[activeSeason - 1] || '';

  // ─── Style helpers ──────────────────────────────────────────────────────
  const wrap   = { maxWidth: isMobile ? 620 : 700, margin: '0 auto', padding: isMobile ? '0 32px' : '0 24px' };
  const pStyle = { color: T.ink2, marginBottom: '1.1em', fontSize: isMobile ? 18 : 20, lineHeight: 1.72 };
  const S      = { color: T.ink, fontWeight: 600 };


  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div ref={pageRefCb} style={{
      backgroundColor: '#23160e', color: T.ink,
      fontFamily: '"Century Old Style Std", Georgia, serif',
      fontSize: 16.5, lineHeight: 1.65,
      height: '100%', overflowY: 'auto', overflowX: 'hidden', maxWidth: '100vw', position: 'relative',
      fontWeight: 550
    }}>
      {/* Parkay floor — slightly blurred so hard SVG edges soften */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundColor: '#23160e',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%2340281b' fill-opacity='0.66' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }} />

      {/* Lighting — warm torch glow + corner vignette */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: [
          'radial-gradient(ellipse 90% 55% at 50% -8%, rgba(240,110,74,0.20), transparent 62%)',
          'radial-gradient(ellipse 40% 65% at -4% 45%, rgba(200,85,35,0.10), transparent 52%)',
          'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 22%, rgba(4,1,0,0.68) 100%)',
        ].join(', '),
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ ...wrap, paddingTop: 72 }}>
          <div style={{ paddingTop: 24, paddingBottom: 32 }}>
            <img
                src={process.env.PUBLIC_URL + "/survivor_title_raw.png"}
                alt="Did Survivor Fix the Diversity Problem?"
                style={{
                  marginTop: '10rem',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '100%',
                }}
            />
          </div>
        </section>

        {/* ══ PART ONE — static, centered ══ */}
        <section style={wrap}>
          <p style={{ fontSize: 20, lineHeight: 1.58, color: T.ink, marginBottom: '1.1em', fontWeight: 500 }}>
            Survivor is a reality TV game where contestants compete through a series of vote-outs until one is crowned the Sole Survivor.
          </p>
          <p style={pStyle}>It's pretty straightforward — players need to:</p>
        </section>

        <section style={wrap}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            border: `0.5px solid ${T.rule}`, margin: '0 0 24px',
          }}>
            {[
              { verb: 'Outplay', text: 'Play games to win immunity.' },
              { verb: 'Outwit',  text: 'Use strategy to convince players to not vote them out.' },
              { verb: 'Outlast', text: "Don't get voted out — and make it to the end." },
            ].map((item, i, arr) => (
              <div key={item.verb} style={{ padding: 16, borderRight: i < arr.length - 1 ? `0.5px solid ${T.rule}` : 'none' }}>
                <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.wm, marginBottom: 8, fontWeight: 600 }}>{item.verb}</div>
                <p style={{ fontSize: 16, color: T.ink2, lineHeight: 1.5, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={wrap}>
          <p style={{...pStyle, marginTop: isMobile ? '4rem' : '4rem', marginBottom: isMobile ? '-6rem': '-6rem'}}>
            Take <strong style={S}>Season 18: Tocantins</strong> for example.
          </p>
        </section>

        <ScrollyScene
          isMobile={isMobile}
          pageEl={pageEl}
          stepPadVh={isMobile ? 0 : 20}
          stickyTopVhMobile={8}
          stickyHeightVhMobile={96}
          chart={
            <div>
              <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.ink4, marginBottom: 3 }}>Fig. 1</div>
              <div style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 20, fontWeight: 800, color: T.ink, marginBottom: 12, textTransform: 'uppercase', lineHeight: 1.05}}>Season 18: Tocantins · Cast Progression</div>
              {s18Contestants.length > 0
                ? <FunnelChart contestants={s18Contestants} glowPhase={tocantinsGlowPhase} isMobile={isMobile}/>
                : <ChartLoading />}
              <Legend />
            </div>
          }
          onStepEnter={({ data }) => {
            const phases = ['day1', 'merge', 'finale', 'winner'];
            setTocantinsGlowPhase(phases[data] ?? null);
          }}
          steps={[
            <div>
              <p style={pStyle}>We start with <strong style={S}>16 players</strong> on Day 1.</p>
            </div>,
            <div>
              <p style={pStyle}>After 6 tribe-based voteouts, 10 make it to the next stage of the game, called<strong style={S}> the Merge</strong>.</p>
            </div>,
            <div>
              <p style={pStyle}>Our finale has <strong style={S}>2 players remaining</strong>. J.T. Thomas and Stephen Fishbach face the jury.</p>
            </div>,
            <div>
              <p style={pStyle}>Leading to J.T. pulling off an impressive{' '}
                <FnText note="A sweep means J.T. received every jury vote — a unanimous win. Only a handful of players have ever pulled this off.">sweep</FnText>.
              </p>
            </div>,
          ]}
          trailingContent={
            <video
              src={process.env.PUBLIC_URL + '/jt_win.mp4'}
              autoPlay muted loop playsInline
              style={{ width: '100%', display: 'block', borderRadius: 16 }}
            />
          }
        />

        {!isMobile && (
          <section style={wrap}>
            <video
              src={process.env.PUBLIC_URL + '/jt_win.mp4'}
              autoPlay muted loop playsInline
              style={{ width: '100%', display: 'block', borderRadius: 16, marginBottom: 28 }}
            />
          </section>
        )}

        <section style={{...wrap, maxWidth: 500}}>
          <p style={pStyle}>We can visualize any season of Survivor this way.<br />Give it a shot:</p>

          {/* Season Picker */}
          <div style={{ margin: '4px 0 0', border: `0.5px solid ${T.rule}`, backgroundColor: T.bg2, padding: '14px 16px' }}>
            <span style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.wm, display: 'block', marginBottom: 2, fontWeight: 800 }}>
              Select a Season
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <input type="range" min={1} max={40} value={sliderVal}
                onChange={e => handleSlider(+e.target.value)}
                aria-label="Select a Survivor season"
                style={{ flex: 1, minWidth: 100, accentColor: T.wf, cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ border: `0.5px solid ${T.rule}`, borderTop: 'none', backgroundColor: T.bg2, padding: 18, marginBottom: 28 }}>
            <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.ink4, marginBottom: 3 }}>Fig. 2</div>
            <div style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 22, fontWeight: 800, color: T.ink, marginBottom: 14, textTransform: 'uppercase', lineHeight: 1.05 }}>
              Season {activeSeason}: {activeSeasonName}
            </div>
            {activeFunnelContestants.length > 0 ? <FunnelChart contestants={activeFunnelContestants} isMobile={isMobile} countXOverride={true}/> : <ChartLoading />}
            <Legend />
          </div>
        </section>

        {/* Part 2 opener — copy lead-in for combined scrolly */}
        <section style={wrap}>
          <p style={pStyle}>
            You may have noticed something — <em style={{ fontStyle: 'normal', color: T.ink }}>there aren't many people of color in these seasons.</em> This isn't just an issue with casting - let's look at how biases can manifest in player behavior during the game.
          </p>
          <p style={pStyle}>
            For each season, we can look at how players are targeted in the{' '}
            <FnText note="We limit to pre-merge because players loosely tend to have different strategies between pre and post merge — before the merge, players are actively working on collaborative and alliance-based strategies, as opposed to individual strategy.">pre-merge</FnText>.
          </p>
        </section>

        {/* Scene 2: DeviationChart — targeting history (uses devS49 with S41-S49 hidden, keeps axes identical to Scene 4) */}
        <ScrollyScene
          isMobile={isMobile}
          pageEl={pageEl}
          stepPadVh={isMobile ? 0 : 20}
          stickyTopVhMobile={4}
          stickyHeightVhMobile={96}
          chart={devS49.length > 0
            ? <DeviationChart data={devS49} highlight={devHighlight} showNewEra={false} />
            : <ChartLoading />}
          onStepEnter={({ data }) => {
            if (data === 0) setDevHighlight([]);
            if (data === 1) setDevHighlight(['S21-S30']);
          }}
          steps={[
            <div>
              <p style={pStyle}>
                <FnText note="Before each tribal council, we count who's actually eligible to be voted out that night. Then we ask what share of those people were BIPOC. That's the baseline: if there's no bias and the vote were random, that's roughly how often a BIPOC contestant should end up as the boot. We recalculate this every tribal because the pool changes">The bars show the difference between BIPOC share of votes received vs. BIPOC share of the eligible pool</FnText>. If the bar is positive, that means people of color were <FnText note="The error bars are 95% confidence intervals. Seasons 21-30 is the only era that definitively shows over-targeting."> over-targeted </FnText>.
              </p>
            </div>,
            <div>
              <p style={pStyle}>
                <FnText note="Seasons 31-40 also shows over-targeting (see Season 33: Millennials vs. Gen X), but with more variance.">For seasons 21–30, players of color were especially targeted</FnText> at rates above what we'd expect.
              </p>
            </div>,
          ]}
        />

        {/* Part 3 opener — copy lead-in for combined scrolly */}
        <section style={wrap}>
          <p style={pStyle}>
            Casting choices and voting patterns weren't going unnoticed.
          </p>
        </section>


        {/* ══ PART THREE — The Fix ══ */}
        {/* Scene 3: StackedBarChart — mandate result (pre→post animation) */}
        <ScrollyScene
          stepPadVh={isMobile ? 0 : 20}
          stickyTopVhMobile={4}
          stickyHeightVhMobile={96}
          offsetMobile={0.5}
          isMobile={isMobile}
          pageEl={pageEl}
          chart={
            <div>
              <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.ink4, marginBottom: 3 }}>Fig. 3</div>
              <div style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 20, fontWeight: 800, color: T.ink, marginBottom: 14, textTransform: 'uppercase', lineHeight: 1.05 }}>
                Cast composition: {showRepS49NewEra ? 'post-mandate' : 'pre-mandate'}
              </div>
              {repS4149.length > 0
                ? <StackedBarChart data={repS4149} dataPrior={repS40} showNewEra={showRepS49NewEra} />
                : <ChartLoading />}
              <Legend />
            </div>
          }
          onStepEnter={({ data }) => {
            if (data === 0) setShowRepS49NewEra(false);
            if (data === 1) setShowRepS49NewEra(true);
          }}
          onStepProgress={isMobile ? ({ data, progress }) => {
            if (data === 0) setShowRepS49NewEra(progress >= 0.5);
          } : undefined}
          steps={[
            <div>
              <p style={pStyle}>
                There was pressure from fans and alumni to make changes to the game.
              </p>
              <div style={{
                padding: '16px 18px', marginBottom: 18,
                border: `0.5px solid ${T.rule}`, borderLeft: `3px solid ${T.bf}`,
                backgroundColor: T.bg2, fontSize: 16, lineHeight: 1.6, color: T.ink2, fontStyle: 'italic',
              }}>
                Beginning with Season 41, CBS announced that{' '}
                <strong style={{ color: T.ink, fontStyle: 'normal' }}>at least half of every Survivor cast would be people of color.</strong>
              </div>
            </div>,
            <div>
              <p style={pStyle}>
                There are more people of color participating in the later seasons — at every stage of the game.
              </p>
            </div>,
          ]}
        />

        {/* Demoted slider — secondary exploration affordance */}
        <section style={{...wrap, maxWidth: 460}}>
          <div style={{ margin: '4px 0 0', border: `0.5px solid ${T.rule2}`, backgroundColor: T.bg2, padding: '12px 14px' }}>
            <span style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 17, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.ink2, display: 'block', marginBottom: 2, fontWeight: 700 }}>
              Explore the new era
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <input type="range" min={41} max={49} step={1} value={newEraSliderVal}
                onChange={e => handleNewEraSlider(+e.target.value)}
                aria-label="Select a Survivor season"
                style={{ flex: 1, minWidth: 100, accentColor: T.wf, cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ border: `0.5px solid ${T.rule2}`, borderTop: 'none', backgroundColor: T.bg2, padding: 16, marginBottom: 28 }}>
            <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.ink4, marginBottom: 3 }}>Fig. 4</div>
            <div style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 20, fontWeight: 700, color: T.ink, marginBottom: 12, textTransform: 'uppercase', lineHeight: 1.05 }}>
              Season {newEraActiveSeason}
            </div>
            {newEraActiveFunnelContestants.length > 0 ? <FunnelChart contestants={newEraActiveFunnelContestants} isMobile={isMobile} countXOverride={true}/> : <ChartLoading />}
            <Legend />
            {newEraActiveSeason === 47 && (
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: `0.5px solid ${T.rule2}`, fontFamily: '"Graphik", sans-serif', fontSize: 10, color: T.ink3, lineHeight: 1.5 }}>
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}>
                  <svg width={10} height={10}><polygon points="5,0.5 9.5,5 5,9.5 0.5,5" fill={T.nb} /></svg>
                </span>
                Teeny is a man but competed as the first openly non-binary contestant at time of filming, so we want to respect both their identity and also how it affects our analysis.
              </div>
            )}
          </div>
        </section>

        {/* Scene 4: DeviationChart in continuation mode — S41-S49 focal, history dimmed */}
        <ScrollyScene
          isMobile={isMobile}
          pageEl={pageEl}
          chartBottomPadVhMobile={18}
          chart={
            <div>
              <div style={{ fontFamily: '"Graphik", sans-serif', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.ink4, marginBottom: 3 }}>The new era — S41 onward</div>
              <div style={{ fontFamily: '"Futura Condensed", sans-serif', fontSize: 20, fontWeight: 800, color: T.ink, marginBottom: 14, textTransform: 'uppercase', lineHeight: 1.05 }}>
                Pre-merge targeting: the new era
              </div>
              {devS49.length > 0
                ? <DeviationChart data={devS49} highlight={[]} showNewEra={showDevS49} continuation={true} />
                : <ChartLoading />}
            </div>
          }
          onStepEnter={({ data }) => {
            if (data === 0) setShowDevS49(false);
            if (data === 1) setShowDevS49(true);
          }}
          steps={[
            <div>
              <p style={pStyle}>
                But the bigger question —{' '}
                <strong style={S}>did casting more players of color actually change the game?</strong>
              </p>
            </div>,
            <div>
              <p style={pStyle}>
                In the newest seasons, <em style={{ fontStyle: 'normal', color: T.ink }}>the pattern was undone</em> — players of color were no longer over-targeted in pre-merge votes. But with only 9 seasons of post-mandate data, the picture is{' '}
                <FnText note="The S41–S49 era shows a mean deviation of −8.1 percentage points (BIPOC players were under-targeted relative to their pool share), but with low certainty. A conditional logistic regression controlling for tribal-council composition finds a statistically significant reduction in the BIPOC targeting penalty — though this result is sensitive to two seasons: S33 (Millennials vs. Gen X) and S48.">still uncertain</FnText>.
              </p>
            </div>,
          ]}
        />

        {/* ══ PART FOUR — The New Cast ══ */}
        {/* Scene 5: RidgePlot — age */}
        <ScrollyScene
          isMobile={isMobile}
          pageEl={pageEl}
          chartBottomPadVhMobile={18}
          chart={ageData.length > 0
            ? <RidgePlot data={ageData} showNewEra={showRidgeNewEra} winners={s4149Winners} />
            : <ChartLoading />}
          onStepEnter={({ data }) => {
            if (data === 0) setShowRidgeNewEra(false);
            if (data === 1) setShowRidgeNewEra(true);
          }}
          steps={[
            <div>
              <p style={pStyle}>
                The diversity mandate reshaped Survivor's cast almost overnight. But when talking about diversity, it's important to look at <em style={{ fontStyle: 'normal', color: T.ink }}>more than just race.</em> Let's take a closer look at who gets cast in the new era.
              </p>
            </div>,
            <div>
              <p style={pStyle}>
                Players in recent seasons fall into a <em style={{ fontStyle: 'normal', color: T.ink }}>narrower age band</em> than in earlier eras — winners cluster tightly between{' '}
                <strong style={S}>20–35</strong>, with{' '}
                <strong
                  style={{ ...S, cursor: 'pointer' }}
                  onMouseEnter={() => { const n = document.querySelector('.ridge-winner-yamyam'); if (n && n.__setGlow) n.__setGlow(true); }}
                  onMouseLeave={() => { const n = document.querySelector('.ridge-winner-yamyam'); if (n && n.__setGlow) n.__setGlow(false); }}
                >Yam Yam (36)</strong> and{' '}
                <strong
                  style={{ ...S, cursor: 'pointer' }}
                  onMouseEnter={() => { const n = document.querySelector('.ridge-winner-gabler'); if (n && n.__setGlow) n.__setGlow(true); }}
                  onMouseLeave={() => { const n = document.querySelector('.ridge-winner-gabler'); if (n && n.__setGlow) n.__setGlow(false); }}
                >Gabler (52)</strong> as the outlying exceptions.
              </p>
            </div>,
          ]}
        />

        {/* Scene 6 intro — centered lead-in for wage section */}
        <div style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: '16px 24px 8px',
          textAlign: 'center',
        }}>
          <p style={{ ...pStyle, textAlign: 'center', marginBottom: 0 }}>
            We can also look at diversity of income — using listed occupations and hometowns, we can estimate players' wages using{' '}
            <FnText note="Bureau of Labor Statistics, which has publicly accessible data related to mean wages based on title and region.">BLS</FnText>{' '}
            data.
          </p>
        </div>

        {/* Scene 6: WageChart — setup + reveal */}
        <ScrollyScene
          isMobile={isMobile}
          pageEl={pageEl}
          chartBottomPadVhMobile={18}
          chart={wageData.length > 0
            ? <WageChart data={wageData} step={wageStep} />
            : <ChartLoading />}
          onStepEnter={({ data }) => {
            setWageStep(data === 0 ? 0 : 2);
          }}
          steps={[
            <div>
              <p style={pStyle}>
                Let's look at how{' '}
                <FnText note="Survivor job titles are matched to BLS by using vector embeddings to match jobs. If a proper region can't be used, we use the US based estimate instead. Some candidates (like Canadians) were not matched, and are excluded from analysis.">estimated incomes</FnText>{' '}
                have shifted across seasons.
              </p>
            </div>,
            <div>
              <p style={pStyle}>
                Even when we account for inflation, the rise in income is still noticeable.
              </p>
            </div>,
            <div>
              <p style={pStyle}>
                The new Survivor cast may be more racially diverse, but the players also have occupations that tend to have higher incomes compared to older seasons.
              </p>
            </div>,
          ]}
        />

        {/* ══ CLOSING THESIS — standalone section ══ */}
        <div style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '0px 24px 200px',
        }}>
          <div style={{
            textAlign: 'center',
            fontFamily: '"Graphik", sans-serif',
            fontSize: 14,
            color: T.ink4,
            letterSpacing: '0.4em',
            marginBottom: 56,
          }}>· · ·</div>
          <p style={{ ...pStyle, fontSize: isMobile ? 16 : 20, lineHeight: 1.72, marginBottom: '1.3em' }}>
            So — did Survivor fix the diversity problem?
          </p>
          <p style={{ ...pStyle, fontSize: isMobile ? 16 : 20, lineHeight: 1.72, marginBottom: '1.3em' }}>
            Survivor's diversity problem was never just about casting. For decades, players of color were voted out at rates that exceeded what their numbers alone would predict. When CBS mandated 50% representation, the racial makeup of the cast changed — but the players who filled those spots increasingly came from a narrower demographic slice:{' '}
            <strong style={S}>younger, wealthier, more alike in background if not in race.</strong>
          </p>
          <p style={{ ...pStyle, fontSize: isMobile ? 16 : 20, lineHeight: 1.72, marginBottom: 0 }}>
            The best thing about Survivor is that it's willing to change and grow. Hopefully as more fans talk about how homogenous some of the players feel, producers will complement racial diversity with diversity in background and experience. Because as Jeff Probst has said — this show is the ultimate study of human behavior.
          </p>
        </div>

      </div>
    </div>
  );
}

export default SurvivorBlog;
