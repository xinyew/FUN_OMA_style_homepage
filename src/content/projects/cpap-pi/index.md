---
title: Pressure-injury sensing mask for pediatric CPAP
label: Pressure-injury mask
summary: A sensor-integrated full-face CPAP mask to detect pressure injury early in children in neonatal and pediatric intensive care.
status: Completed
statusNote: Phase 1
started: 2026
topics: [Sensing, Health]
role: Multi-sensor BLE board and the bedside app (web and Android)
hardware: Mask board with temperature, humidity, pressure and PPG (red, infrared, green) at four sites · control board with Bluetooth Low Energy and microSD logging · 150 mAh LiPo
specs:
  - label: Power
    value: 26.8 mA average, 175 mA peak at 3.3 V (88 mW) · about 6 hours per charge
  - label: Heat
    value: About 88 mW dissipated; predicted skin-side rise of 2–5 °C, under the 43 °C contact limit of IEC 60601-1 · thermal shutdown on board · battery charged only when the mask is off
  - label: Weight
    value: +17.6 g on a 125 g extra-small full-face mask (+14.1%) · mask board 1.6 g, control board 12 g, battery 4 g
  - label: Storage
    value: Full-resolution raw data on microSD, about 7 months on 32 GB · keeps recording without a connection
partners:
  - W. Hong Yeo’s group, Georgia Tech
  - Children’s Healthcare of Atlanta
funding: Pediatric Technology Center, Pillar 3 (Sensors for Pressure Injury), Phase 1
cover: cover.jpg
coverAlt: The Phase 1 prototype on its headgear. The sensor board lines the mask cushion and a flat cable runs to the control board and battery at the back.
gallery:
  - src: control-board.jpg
    alt: The control board, Rev 2.0, with its Bluetooth module, microSD slot and battery connector.
    size: third
  - src: mask-board.jpg
    alt: The flexible mask board before sealing, shaped to follow the mask cushion.
    size: third
  - src: mask-board-sealed.jpg
    alt: The mask board sealed in black silicone.
    size: third
  - src: app-heatmap.png
    alt: "App heatmap view: temperature, humidity, pressure and PPG signal quality at the nasal bridge, both cheeks and the chin."
    size: full
  - src: boards-lit.jpg
    alt: An earlier control board connected to the mask board, with the PPG sensors lit.
    size: wide
  - src: layout-control.jpg
    alt: The control board layout.
    size: third
  - src: layout-mask.jpg
    alt: The mask board layout, with sensor sites spaced around the cushion outline.
    size: third
  - src: app-split.png
    alt: "App split view: pressure and the red, infrared and green PPG channels from every site on one screen."
    size: full
timeline:
  - date: 2026-03-01
    precision: month
    text: Phase 1 began
  - date: 2026-05-01
    precision: month
    text: Joined the project with W. Hong Yeo’s group
  - date: 2026-06-01
    precision: month
    text: Gen-2 prototype and the first bench-test dataset
order: 2
---
Infants and children on CPAP in the NICU and PICU wear a tight mask for long stretches, and the skin under it can break down. Phase 1 of this project, with W. Hong Yeo’s group and Children’s Healthcare of Atlanta, built a full-face mask with sensors in the cushion to catch pressure injury early. Its full title is *Multimodal Sensor-Integrated CPAP and BiPAP Interface for Early Detection and Prevention of Pressure Injuries in NICU and PICU Patients*.

A thin flexible board lines the cushion and reads temperature, humidity, pressure and PPG at the nasal bridge, both cheeks and the chin. A 15 cm cable runs to a control board and battery on the headgear, which keeps their heat away from the face. The control board streams the readings over Bluetooth Low Energy and logs full-resolution raw data to a microSD card. The bedside app, on the web and Android, shows every channel at once, lines up the pulse from different sites, and maps each signal onto the mask.

Xinye designed the multi-sensor BLE board and the app. In bench tests across four skin tones, the infrared PPG channel held steady while red and green faded on darker skin, so infrared is the primary channel on darker skin. The Gen-2 prototype was demoed at Children’s Healthcare of Atlanta in August 2026. Phase 1 closed with a plan for a smaller, sealed control board, a thinner mask board, manikin tests and then a patient study.
