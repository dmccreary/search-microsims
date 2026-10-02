# Findings to relay to Dan

## public-health (wave 1)
- Chapter spec text has factual slips the sims corrected (spec text itself NOT edited): "Nelson et al. 2020" HOLC-asthma study is Nardone et al. 2020; Geronimus weathering is 1992 not 2003; Gelsinger died 1999 not 2000; "1975 first studies on segregation and health" and "2023 heat island analysis" could not be identified and were left out; cost-per-QALY figures left out of upstream-downstream-river.
- Six new sims are in mkdocs nav but not in docs/sims/index.md gallery.

## automating-instructional-design (wave 1)
- corporate-learning-module (pre-existing) forces min canvas width 800px, so its new chapter-6 embed clips on the right at ~700px content width. Not fixed (pre-existing sim).
- mkdocs build fails locally: social_override plugin not installed.

## Skill/tool issues seen by agents
- microsim-generator SKILL.md points UTILS at ~/Documents/ws (gone).
- extract-sim-specs.py only parses "#### Diagram:"/"#### Drawing:" headings (misses "#### MicroSim:", "#### Timeline:").
- generate-sim-scaffold.py emits "High School Geometry" placeholders regardless of book; never writes completion_status; uses p5 1.11.10 while skill says 2.3.2.
- update-mkdocs-nav.py rewrites the entire MicroSims nav block (retitles/re-indents) -> agents add nav lines by hand.
- add-iframes-to-chapter.py derives sim id from heading -> wrong for sims whose dir name differs.

## us-geography (wave 1)
- CARTO basemap tiles (basemaps.cartocdn.com) now return an "API KEY REQUIRED" watermark on every tile. All pre-existing Leaflet sims in us-geography (26 files) use them and now render watermarked. Not fixed. Likely affects Leaflet sims in other repos too.
- us-rivers spec -> pointed chapter at existing `major-rivers` (lacks Hudson, no river-systems toggle, hand-typed 5-7 point polylines). eastern-regions spec -> pointed at existing `northeast-southeast` (2 colors not 3, omits Delaware and Maryland, no classify activity, no metadata.json, validator 45). Both only partly meet spec; candidates for rebuild.
- state-borders border-type labels / "why here" text and central-states farming groups are agent-curated, not source-checked.
- major-cities uses 2020 Census counts (verified vs Wikipedia census table); no landmark photos.
- Data generator scripts copied by coordinator to us-geography/src/microsim-data/ (they read Natural Earth downloads from the scratch dir; paths need adjusting to re-run).

## cybersecurity / computer-science / english-language-arts / algebra-1 (wave 1)
- algebra-1 `variable-types` (pre-existing) was broken: `stroke()` with no args threw every frame, so hover/click never worked. Agent fixed that line and tightened card spacing (unrequested edit to a pre-existing sim; revertable via git checkout docs/sims/variable-types/variable-types.js).
- cybersecurity access-control and container-isolation policy/rationale tables, and ELA discussion protocol attributes, are agent-authored content.
- cybersecurity chapters 8 and 10 have 10 other specs with sims but no iframes embedded (add-iframes tool wanted to insert them); left alone.
- computer-science and algebra-1 mkdocs build fails locally on uninstalled social_override plugin.
- test-iframe-heights.py loads over file:// so data.json-driven sims can't load their data in that test.
- update-mkdocs-nav.py appends two blank lines per run.

## search-microsims (wave 1)
- 6 sims built for chapter 5. docs/sims/index.md gallery not updated; microsims-data.json / embeddings not refreshed (new sims not yet searchable).
- Schema enum requires framework "vis-network.js" but validate-sims.py expects "vis-network" (flags the schema-valid value as non-standard).
- microsim-schema-map shows the chapter's teaching schema (only dublinCore required); real schema requires more. Three of four dependency edges are agent-derived.

## scratch / tracking-ai-course (wave 2)
- scratch: first 5 sims in repo; new docs/sims/, MicroSims nav section and gallery created. Spec's "Turn right 90 degrees" for the triangle roof corrected to 120 in house-decomposition-tree. Spec calls #9966FF "custom-block purple" (it is the Looks color in Scratch 3). White text on orange #FFAB19 is low-contrast but spec-mandated.
- tracking-ai-course: funnel already existed at docs/sims/shared/idea-funnel (shared-microsims submodule); only an iframe was added to genai-coe chapter. Existing sim clips long infobox text and its own index.md iframe is 660 vs 700 canvas. Not modified (submodule).

## circuits (wave 2)
- 6 built, time-frequency-domain reused existing `time-to-frequency` (lacks Step button, two-sine mode; 50-2000 Hz not 1-20 Hz; no index.md/nav/gallery; ch14 embeds it at 320px but needs ~590).
- `signal-parameters` (pre-existing, embedded nowhere) is now superseded by `sinusoid-anatomy`: retirement candidate. `decibel-scale` overlaps the calculator half of new `gain-db-converter`.
- Repo-wide sync-iframe-heights dry-run shows 37 stale iframe heights in older circuits sims (untouched).
- Removed a dangling `time-frequency-domain` nav line from mkdocs.yml.

## statistics-course (wave 2)
- 9 built (98/A each; canvas-drawn controls per repo CLAUDE.md cost 2 validator points).
- Chapter 8 Simpson's Paradox section contains leftover draft text ("Wait, that should say... Let me recalculate...") and two abandoned number sets before the final example. NOT fixed.
- Kidney-stone data in simpsons-paradox-explorer = Charig et al. 1986 (coordinator confirmed counts 81/87, 192/263, 234/270, 55/80).
- mkdocs build fails locally: social_override plugin not installed (same in several repos).

## context-graph (wave 2)
- 7 built for ch 19-20 (all vis-network, 100). Agent changed chapter `Status: not started` lines to `implemented` (7 lines).
- Specs' dark GitHub theme replaced with repo's light palette; several spec numbers corrected to match chapter text.
- PRE-EXISTING DATA BUG: 44 existing context-graph sims have metadata.json creator "Dementia Education Project" / subject "dementia" (scaffold template leak). See catalog-wide count below.
- CATALOG-WIDE: 423 records in docs/search/microsims-data.json carry creator "Dementia Education Project" and/or subject ["dementia"]; 403 of them are in 13 non-dementia repos (3d-printing-course 41, atam 17, context-graph 44, digital-citizenship 2, food-science 29, hydroponics 29, it-management-graph 56, learning-sciences 60, public-health 45, right-database 5, us-government 18, us-history 33, xapi-course 24). These are the same sims flagged completion_status "scaffold": a scaffold template leaked Dementia defaults. Pollutes Subject facet in search.

## organizational-analytics (wave 2)
- 8 built (3 vis-network, 5 p5.js; 100 each). No real organizations named in transparency-maturity / data-consent-framework (spec asked for real-world examples; agent could not confirm any, so scenarios are labelled illustrative).
- communication-network-model uses messages-per-week thresholds on a 40-message sample rather than chapter's 200/50/12.
- extract-sim-specs.py reported Bloom "Create" for every spec (tool bug).

## ibook-skills batch 1 (wave 2)
- 8 built (ch 01,02,03,07,08). docs/sims/TODO/*.json for them still say `specified` (no documented convention for clearing the queue).
- xapi-statement-builder: `hovered`/`clicked` verbs use example.org IRIs (no confirmed registered IRIs); completed/answered use ADL IRIs.
- tokenization-visualizer splitter and context-window sizes labelled illustrative.
- Tool bugs: scaffold gives Mermaid sims an "Edit in the p5.js Editor" link and v10 UMD template vs guide's v11; add-iframes --fix-heights reported "no changes" on stale heights; generate-sims-index.py would rewrite gallery in a different HTML format.

## context-graph batch 2 (wave 2) -> repo closed out (13 sims total, unpublished)
- context-graph-roi-model: all starting dollar figures are invented example inputs (bannered). Decision-quality formula is the sim's own assumption (chapter gives none).
- vector-search-architecture: chapter's "15 billion multiplications" figure could not be reproduced and was left out; spec's "Cross-Encoder Re-ranker" replaced by full-precision re-ranker per chapter text.
- mkdocs build reports missing-anchor notices in learning-graph/diagram-details.md and diagram-table.md for ch 21/22 headings (pre-existing).

## Session usage limit hit 2026-10-01 late evening: atam, chemistry, semiconductor batch-1 agents interrupted mid-run and resumed 2026-10-02.

## semiconductor-physics-course batch 1 (ch 7-10, 7 sims built)
- CHAPTER TEXT ERRORS found by agent (NOT edited):
  - Ch 7 §7.4: donor-ionization formula has exponent sign reversed.
  - Ch 7 §7.10 table: n_i at 500/600 K is 4x and >10x too high.
  - Ch 8 §8.4: mobility table disagrees with its own formula (900 vs 759 at 1e17).
  - Ch 9 §9.5: "holes accumulate on the +y face" is wrong; both carrier types deflect to the same face.
  - Ch 10 §10.6: L_p for 100 us is 346 um, not 1.1 mm. (coordinator confirmed: sqrt(12*1e-4)=0.0346 cm)
  - Ch 10 §10.2.1: "14,000x smaller" does not match quoted B values.
- GaN left out of recombination-lifetime-explorer (published radiative coefficients differ >100x). Doping sliders capped at 1e18 (non-degenerate model). GaAs/Ge velocity-field parameters approximate and labelled.
- Pre-existing: ch 6 has duplicated iframes for two sims.

## chemistry batch 1 (ch 2-5, 7 sims built)
- Chapter text issues (NOT edited): Ch 2 worked example prints m_C = 0.08154 g (correct rounding 0.08155); Ch 4.7 CO "Structure B" formal charges -2 and 0 do not sum to zero.
- em-spectrum-infographic: spec's full-width rainbow gradient is wrong physics; rainbow only for visible band. Visible band 400-700 nm per chapter.
- resonance-structures: added cyanate so "which contributes more" objective is answerable. 22.4 L/mol left out of mole triangle (chapter 2 doesn't cover molar volume).
- OpenStax/NASA reference URLs in index.md written from memory, not fetched.

## atam batch 1 (ch 11-15, 9 placeholders replaced)
- SPEC ERROR: security-architecture-layers spec says SQL injection is stopped at Transport/Auth; sim stops it at the Perimeter WAF. Chapter spec not edited.
- api-versioning-explorer: spec's scores make additive-only win everywhere, so agent added a change-type menu; context-fit ratings and score formula are agent-authored. "performance" priority replaced by "easy migration".
- All numbers labelled illustrative (430 ms trace baseline, 1,000 req/s per node, etc.).
- docs/sims/index.md gallery: 34 older atam sims are still missing from the gallery (pre-existing).

## signal-processing batch 1 (ch 2-5, 7 sims built)
- signal-processing `mkdocs build` fails locally: "exclude" plugin (mkdocs-exclude) not installed in mkdocs env (plus social plugin/hook). Deploy will need it.
- Every spec says 75 px of controls, which cannot hold the listed controls; sims are 560-630 px total.
- Pre-existing `docs/sims/convolution` uses min() not a product (not a true convolution); `nyquist-shannon-sampling` is single-slider. Both untouched, now overlapped by new convolution-visualizer / sampling-theorem-explorer.
- system-property-explorer uses continuous-time systems (chapter 3 is in x(t)).

## semiconductor-physics-course batch 2 (ch 11-17, 7 sims built)
- CHAPTER TEXT DISCREPANCIES found by agent (NOT edited):
  - §11.2: ln argument should be 1.07e13, not 1e17; V_bi = 0.776 V, not 0.76.
  - §11.4: in reverse bias the quasi-Fermi levels split with opposite sign; not "pressed closer".
  - §11.5 tip: "doubles every 10 C" contradicts its own 1 nA -> 1 uA -> 100 uA figures (n_i^2 doubles ~every 5 C).
  - §12.1: V_BD at 1e15 is 337 V by the chapter's own formula, not 190.
  - §12.4: formula with the 1/2 gives 19 nF, not 40.
  - §12.6.2: InAs/GaSb listed under both Type II and III; Type III definition reversed; QCLs are not Type II devices.
  - §12.6.1 vs §4: GaAs/Al0.3Ga0.7As offsets 0.25/0.12 in one, 0.23/0.15 in the other.
  - §14.4: V_CE,sat expression wrong (should be V_T ln[(1/aR + (IC/IB)/bR)/(1 - (IC/IB)/bF)]).
  - §14.7: exp(dEg/kT) scales the injection ratio, not gamma.
  - §15.1: JFET triode expression negative at V_GS=0; should be (I_DSS/V_P^2)[2(V_GS-V_P)V_DS - V_DS^2].
  - §16.1: lambda ~ sqrt(3 t_ox t_dep), not sqrt(t_ox t_dep/3); t_dep uses 2 eps phi_F where ch 13 uses 4 eps phi_F.
  - §16.5: "NMOS on (low V_GS...)" backwards.
  - §16.7: FinFET example gives 3.0 nm (not 2), nanowire 2.2 nm (not 1.5); process-node claims look wrong (agent from memory).
  - §17.2: "WPE" product is actually EQE; escape cone 0.26 sr and ~1/48, not 0.21 sr and 1/30.
  - §17.3: Stokes ratio written inverted. §17.4: stimulated emission is one photon in, two out.
- Left out: AlN and ZnO (electron affinities disagree >1 eV), VCSEL curve. Unverified: QW gain params, CdTe chi, journal citations written from memory.

## Second usage-limit interruption (~04:00 2026-10-02): ibook-skills b2, signal-processing b2, chemistry b2, atam b2 cut off; resumed.

## 2026-10-02 06:04-06:05: Dan (git author) bulk-committed and pushed "Update <repo> content and assets" in context-graph, ibook-skills, semiconductor-physics-course, atam, chemistry, signal-processing (incl. partial in-progress work). Not done by this session.

## ibook-skills batch 2 (last 8; repo closed out)
- token-waste-reinforcing-loop: spec's B "loop" was an open chain; agent closed it and added a "Pressure to Rush" node.
- pronounce-button-demo: spec had playback running ahead of the download (impossible); modelled correctly with a second comparison bar. No audio/API calls.
- hook-to-dashboard: index notes real tracker uses PreToolUse/PostToolUse, not a Stop hook.
- After Dan's 06:05 commit, 7 files uncommitted: microsim-library-routing-table height fix 500->535 (+ch 23 iframe) and a recaptured PNG.

## chemistry batch 2 (ch 6-10, 7 sims built)
- Dan's 06:04 commit 27e6b79 captured a half-written, non-rendering reaction-energy-diagram (name collision with p5 global buildGeometry). Fixed in working tree (uncommitted); not deployed.
- PRE-EXISTING BUGS (untouched): `titration-curve-explorer` and `energy-diagram-explorer` call `typeRadio.option(label, id)` with arguments reversed, so the radio is stuck on its first mode (strong/strong; endothermic). Ch 17 embeds titration-curve-explorer at 842px but canvas needs 942.
- Seven pre-existing sims have no chapter iframe: heating-curve-simulator, beer-lambert-calibration (ch7); reaction-type-classifier, limiting-reagent-percent-yield (ch8); titration-calculator (ch9); integrated-rate-law-grapher, arrhenius-equation-explorer (ch10).
- SPEC/CHAPTER ISSUES: redox spec's "MnO4-/Fe2+ in base" is not real chemistry (used Fe(OH)2 -> Fe(OH)3, MnO2); §9.5 back-titration formula n_analyte = n_added - n_excess omits the analyte mole ratio (worked numbers are right); phase-diagram spec's 200 atm axis cannot hold water's 218 atm critical point.

## atam batch 2 (ch 15-18, last 9; repo closed out)
- Dan's 06:04 commit 6b31e80 holds unfinished state of 3 sims (scaffold placeholder docs, untested responsible-ai-explorer.js); fixed in working tree, uncommitted. Not deployed.
- Chapter prose issues (NOT edited): ch 18 credits Kleppmann's critique as leading to kappa architecture (proposed by Jay Kreps, 2014); ch 15 "67 ms" Tokyo-Virginia floor uses vacuum light speed, not fibre.
- ml-pipeline-explorer: spec's heat map of stages "most commonly flagged in ATAM evaluations" has no data behind it; overlay labelled a qualitative judgment.
- distributed-trace-explorer retitled "Distributed Trace Latency What-If Explorer" (nav label renamed) to distinguish from ch 11 viewer.
- Reference citations written from memory.
