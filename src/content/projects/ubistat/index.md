---
title: UbiStat
label: UbiStat
summary: A coin-sized, sealed, wireless platform for electrochemical sensing that fits 221 of 250 sensor types and works far from the lab.
status: Ongoing
statusNote: paper in preparation
started: 2025
topics: [Sensing, Health]
role: First author
hardware: 9.8 × 8 × 8 mm, sealed · AD5940 analog front end · Bluetooth Low Energy · SR626 watch battery (28 mAh) · about $50 in parts
specs:
  - label: Range
    value: 50 pA to 3 mA, up to 2.2 V · fits 221 of 250 sensor types from the literature
  - label: Noise
    value: About 0.11 nA, a ten-billionth of an amp
  - label: Accuracy
    value: Within 1% on known resistors (0.25% with the high-speed amplifier)
  - label: Battery
    value: 40+ days on one watch battery, measuring 4 electrodes every hour
  - label: Radio
    value: 1.5 m through 1.5 cm of beef, at the lowest power
funding: ARPA-H THOR, 2025–2026
team: Xinye and [co-authors]
teamMore:
  - "Advisors: Josiah Hester, Alexander T. Adams"
paper: In preparation
cover: cover.png
coverAlt: Two miniature sensing boards photographed on a coin and on a key, for scale.
gallery:
  - src: fig-coverage.png
    alt: Sensor types from the literature plotted by the voltage they need and the current they produce. 221 of 250 fall inside UbiStat's range.
    size: full
  - src: fig-noise.png
    alt: Noise against amplifier gain. UbiStat's noise levels off at about 0.11 nA, more than 100 times smaller than a coated sensor's peak.
    size: full
  - src: fig-coated.png
    alt: "A coated sensor before and after the fixes: the glitch at each voltage step shrinks from 80 mV to 25 mV, and the square-wave scans go from noisy and drifting to the same shape as a benchtop instrument."
    size: full
  - src: fig-untethered.png
    alt: Through 1.5 cm of beef the signal still carries 1.5 m at the lowest power, and one watch battery lasts 40+ days measuring four electrodes every hour.
    size: full
  - src: fig-webapp.png
    alt: "The web app: choose the amplifier and the schedule on the settings page, then watch each scan arrive."
    size: full
timeline:
  - date: 2026-03-01
    precision: month
    text: Reframed as a general platform for electrochemical sensing
order: 1
---
Electrochemical sensors can measure sugars, metals, hormones and gases, but each usually comes with its own reader, and general-purpose readers stay on the lab bench. UbiStat is one coin-sized, sealed platform that reads most of them where they are needed, without a cable, for weeks on a watch battery.

It tunes its circuit to each sensor, so even coated sensors read cleanly, with the same curve as a benchtop instrument. A new sensor needs an adapter and a preset rather than a new circuit, and the web app sets it up and shows the data without code.
