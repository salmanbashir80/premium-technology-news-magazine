const pexels = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const images = {
  heroAi: pexels(1148820, 1800),
  chipFoundry: pexels(34924856, 1800),
  newsroom: pexels(5324892, 1600),
  startupPitch: pexels(7653569, 1600),
  cyberOps: pexels(5380582, 1600),
  warehouse: pexels(4483610, 1600),
  serverRack: pexels(5480781),
  labWoman: pexels(8851447),
  chatgpt: pexels(16027824),
  collab: pexels(7653569),
  briefing: pexels(5324892),
  cyber1: pexels(5380582),
  cyber2: pexels(5380586),
  packing: pexels(7857532),
  boardroom: pexels(6949494),
  meeting: pexels(7433840),
  ev: pexels(35736774),
  coding: pexels(34803994),
  darkCode: pexels(1933900),
  phone: pexels(5243203),
  london: pexels(8461520),
  sf: pexels(39528966),
} as const;

export const portraits = {
  maya: pexels(9304685, 800),
  james: pexels(6283217, 800),
  priya: pexels(30479371, 800),
  oliver: pexels(30496625, 800),
  helen: pexels(7468194, 800),
} as const;
