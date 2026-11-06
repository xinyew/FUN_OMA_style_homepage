---
title: Energy-aware scheduling and input buffer overflow prevention for energy-harvesting systems
label: Quetzal
summary: Quetzal keeps battery-free sensing devices from missing events when their small input buffer fills, by scheduling with energy in mind and degrading work only when an overflow is coming.
status: Completed
statusNote: ASPLOS ’25
topics: [Systems, Sensing]
role: Second author
team: Harsh Desai, Xinye Wang and Brandon Lucia, Carnegie Mellon University
hardware: Ambiq Apollo 4 MCU · ultra-low-power camera · LoRa radio · BQ25504 energy harvester with a 33 mF supercapacitor · person detection at one frame per second
specs:
  - label: Result
    value: Up to 4.2× fewer events missed to buffer overflows than prior approaches in simulation · 6.4× and 5.0× fewer interesting inputs discarded than a non-adaptive system on real hardware
  - label: Circuit
    value: Two diodes, a multiplexer and an 8-bit ADC measure power so the scheduler needs shifts instead of divisions · overhead on an MSP430 drops from 6.2% to 0.4%
paper: ASPLOS ’25, Rotterdam
cover: cover.jpg
coverAlt: The end-to-end hardware setup on a bench, with the camera, primary and secondary microcontrollers, energy-harvesting circuit, radio and supercapacitor labeled.
gallery:
  - src: fig-pipeline.png
    alt: "An energy-harvesting camera pipeline: periodic capture, a cheap discard step, the memory buffer Quetzal protects, then ML filtering, compression and radio. If inputs arrive faster than they are processed, the buffer overflows."
    size: full
  - src: fig-flow.png
    alt: "Quetzal's execution flow: the energy-aware shortest-job-first scheduler picks the next job, checks whether it would overflow the input buffer, and degrades a task if it would."
    size: full
  - src: fig-circuit.png
    alt: The Quetzal hardware module between the harvester and the device's regulator, two diodes, a multiplexer and an 8-bit ADC.
    size: full
  - src: fig-simulation.png
    alt: Simulation against prior approaches. Quetzal discards 4.2 times fewer interesting inputs and transmits more high-quality ones.
    size: full
  - src: fig-hardware-results.png
    alt: On real hardware in two sensing environments, Quetzal discards 6.4 and 5.0 times fewer interesting inputs than the non-adaptive system.
    size: full
timeline:
  - date: 2025-03-30
    precision: month
    text: Published at ASPLOS ’25 in Rotterdam
order: 8
---
Energy-harvesting devices capture data at a fixed rate but process it at a rate that swings with the power they harvest and with how much is happening around them. When processing falls behind, their small input buffer fills, and new, possibly interesting inputs are dropped.

Quetzal schedules the job with the shortest end-to-end time, counting the time spent recharging, predicts an overflow before it happens with Little’s Law, and degrades a task, such as running a smaller ML model or sending a one-byte radio message, only as much as needed to avoid it. A small power-measurement circuit keeps that math cheap enough for the simplest microcontrollers.
