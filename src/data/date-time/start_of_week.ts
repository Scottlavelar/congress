export function startOfWeek(locale) {
  let parts = locale.match(
    /^([a-z]{2,3})(?:-([a-z]{3})(?=$|-))?(?:-([a-z]{4})(?=$|-))?(?:-([a-z]{2}|\d{3})(?=$|-))?/i
  );

  let language = parts[1];
  let region = parts[4];

  let regionSat = 'AEAFBHDJDZEGIQIRJOKWLYOMQASDSY'.match(/../g)!;
  let regionSun = 'AGARASAUBDBRBSBTBWBZCACNCODMDOETGTGUHKHNIDILINJMJPKEKHKRLAMHMMMOMTMXMZNINPPAPEPHPKPRPTPYSASGSVTHTTTWUMUSVEVIWSYEZAZW'.match(
    /../g
  )!;
  let languageSat = ['ar', 'arq', 'arz', 'fa'];
  let languageSun = 'amasbndzengnguhehiidjajvkmknkolomhmlmrmtmyneomorpapssdsmsnsutatethtnurzhzu'.match(/../g)!;

  if (region) return regionSun.includes(region) ? 'sun' : regionSat.includes(region) ? 'sat' : 'mon';
  else return languageSun.includes(language) ? 'sun' : languageSat.includes(language) ? 'sat' : 'mon';
}
