---
title: "SafeWear: a wearable for situational awareness in urban low-SES communities"
label: SafeWear
summary: A clip-on wearable that recognizes and localizes warning sounds and alerts the wearer’s phone, designed and studied with members of urban low-income communities.
status: Ongoing
statusNote: paper in preparation
topics: [Sensing, Safety]
hardware: Two Arduino Nano BLE Sense Rev2 boards (nRF52840) on a custom connection PCB · three ICS-40180 microphones for direction, a digital microphone for sound classification, a BMI270 IMU for orientation · 200 mAh Li-ion · 3D-printed clip-on case, 60 × 38 × 20 mm
specs:
  - label: Sounds
    value: Footsteps, someone running up, jingling keys, an approaching car · 91.4% classification accuracy on a lab dataset
  - label: Direction
    value: Left or right, from the loudest of three microphones · 87% accuracy
  - label: Cost
    value: About $15 in parts, no subscription
  - label: Runtime
    value: About 47 minutes per charge (prototype)
  - label: Study
    value: Wizard-of-Oz study and interviews with 12 participants from a low-SES community, compared with Invisawear
cover: cover.jpg
coverGround: light
coverAlt: SafeWear clipped to a jeans pocket and to a bag strap.
gallery:
  - src: inside.png
    alt: "Inside SafeWear: microphones 1 to 3 for sound localization, microphone 4 for sound classification, an IMU for orientation, and the processors that handle the signals and talk to the phone over Bluetooth."
    size: full
  - src: system-design.png
    alt: "Exploded view: two Arduino boards on a connection PCB, three localization microphones, the battery and power jumper, and the 3D-printed case with its clip, 60 × 38 × 20 mm."
    size: full
  - src: app.png
    alt: "The phone app: a map with the wearer's pin, sound filters, connection status, and an alert that names the sound and its side, with options to share location, call for help or ignore it."
    size: full
  - src: study-setup.png
    alt: "The Wizard-of-Oz study room: four speakers in the corners, two cameras, and a figure-eight path the participant walks while a researcher plays sounds."
    size: full
  - src: comparison.png
    alt: SafeWear next to six commercial safety wearables, comparing features, device price and subscription cost. SafeWear's parts cost about $15, with no subscription.
    size: full
order: 7
labelLeft: 3     # keep the home label off the captions in the photo
labelTop: 41
---
Safety is a daily concern in many urban low-income neighborhoods. Rather than a panic button, SafeWear listens: it recognizes footsteps, someone running up, jingling keys and an approaching car, works out whether the sound is on the left or the right, and alerts the wearer’s phone with options to share their location or call for help.

It is built from cheap, widely available maker parts in a matte-black clip-on case meant to go unnoticed. In a Wizard-of-Oz study, 11 of 12 participants said it would be useful in real-world settings. They said it added a sense of caution, picked up sounds they missed, and helped confirm what they thought they saw.
