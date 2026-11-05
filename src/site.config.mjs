/* Everything site-wide in one place. */
export const site = {
  name: 'Xinye',
  role: 'PhD student, School of Interactive Computing, Georgia Tech',
  description: 'Xinye is a PhD student at Georgia Tech building hardware for HCI: low-power sensing boards, firmware and the apps around them.',
  bio: "Xinye is a PhD student in Computer Science at Georgia Tech’s School of Interactive Computing, advised by Josiah Hester and Alexander T. Adams. The work is hardware for HCI, from low-power sensing boards and firmware to the apps around them; the current focus is behavior change.",
  /* The four nav words. The first is home: hollow, and it shows its hover word. */
  nav: [
    { key: 'home', label: 'Xinye', hover: 'aNERD', href: '' },
    { key: 'work', label: 'Work', href: 'work/' },
    { key: 'papers', label: 'Papers', href: 'papers/' },
    { key: 'about', label: 'About', href: 'about/' }
  ],
  /* Change the seed to reshuffle the home collage; the same seed gives the same layout. */
  seed: 'xinye',
  /* Shown in the footer and on About when filled in. Put a CV at public/cv.pdf to show its link. */
  email: '',
  github: 'xinyew'
};
