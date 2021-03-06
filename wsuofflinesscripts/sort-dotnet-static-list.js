'use strict';

let x = `http://download.microsoft.com/download/2/0/e/20e90413-712f-438c-988e-fdaa79a8ac3d/dotnetfx35.exe
http://download.microsoft.com/download/7/7/b/77b96978-c805-4674-a9b0-43351e86b41f/dotnetfx35langpack_x64zh-CHS.exe
http://download.microsoft.com/download/6/6/4/66488d18-e069-4b3e-a0b5-5be3af0702bd/dotnetfx35langpack_x64ar.exe
http://download.microsoft.com/download/6/3/2/632f43b6-fe1e-4dc6-9f17-00e37eea0463/dotnetfx35langpack_x64zh-cht.exe
http://download.microsoft.com/download/f/7/9/f79bfd15-64b4-45b0-a396-e30f12ea13d0/dotnetfx35langpack_x64cs.exe
http://download.microsoft.com/download/8/2/0/820f6ddc-71c0-4cce-ab81-5d92ff9810e1/dotnetfx35langpack_x64da.exe
http://download.microsoft.com/download/d/7/2/d728b7b9-454b-4b57-8270-45dac441b0ec/dotnetfx35langpack_x64de.exe
http://download.microsoft.com/download/C/3/A/C3A5200B-D33C-47E9-9D70-2F7C65DAAD94/NDP46-KB3045557-x86-x64-AllOS-ENU.exe
http://download.microsoft.com/download/B/4/B/B4BB144A-E89A-47F0-9321-106DDC18ACDE/NDP46-KB3045557-x86-x64-AllOS-CHS.exe
http://download.microsoft.com/download/5/4/C/54C214DA-370D-4CD8-8FA4-163603E02BA3/NDP46-KB3045557-x86-x64-AllOS-DEU.exe
http://download.microsoft.com/download/B/B/B/BBBA772C-8E15-4528-BD70-C490AD255B3D/NDP46-KB3045557-x86-x64-AllOS-ARA.exe
http://download.microsoft.com/download/C/E/3/CE369936-7F4C-45B4-A3BB-6F8DC78FB3F1/NDP46-KB3045557-x86-x64-AllOS-CHT.exe
http://download.microsoft.com/download/B/4/E/B4E1E995-F71D-4D04-B7AB-D1F01BF4DB11/NDP46-KB3045557-x86-x64-AllOS-CSY.exe
http://download.microsoft.com/download/3/5/5/3559702B-FAFB-42CF-9199-3EE86FCF5BA0/NDP46-KB3045557-x86-x64-AllOS-DAN.exe
http://download.microsoft.com/download/5/4/C/54C214DA-370D-4CD8-8FA4-163603E02BA3/NDP46-KB3045557-x86-x64-AllOS-DEU.exe
http://download.microsoft.com/download/a/7/3/a7382fbb-0167-445c-8a6b-b01b303d804f/dotnetfx35langpack_x64el.exe
http://download.microsoft.com/download/3/3/7/3372C503-6E20-49DA-9767-222D2D0CE113/NDP46-KB3045557-x86-x64-AllOS-ELL.exe
http://download.microsoft.com/download/4/a/2/4a2b42fc-f271-4cc8-9c15-bc10cdde1eb9/dotnetfx35langpack_x64es.exe
http://download.microsoft.com/download/C/7/A/C7AC414F-9768-48D4-A3DE-894331C47FCA/NDP46-KB3045557-x86-x64-AllOS-ESN.exe
http://download.microsoft.com/download/a/c/7/ac7ec2f2-38b3-4066-b0be-6475b55a113c/dotnetfx35langpack_x64fi.exe
http://download.microsoft.com/download/B/C/F/BCF148FA-90B4-4F1B-A47E-08E377E87BF4/NDP46-KB3045557-x86-x64-AllOS-FIN.exe
http://download.microsoft.com/download/e/6/1/e6168525-de7f-49ce-971b-62e6c8738c38/dotnetfx35langpack_x64fr.exe
http://download.microsoft.com/download/7/8/B/78B918FC-AA96-4E5B-8A7D-B516D4E34B54/NDP46-KB3045557-x86-x64-AllOS-FRA.exe
http://download.microsoft.com/download/d/7/2/d728b7b9-454b-4b57-8270-45dac441b0ec/dotnetfx35langpack_x64de.exe
http://download.microsoft.com/download/8/1/4/8143f1b9-e478-48ae-99da-b30a53bf5a92/dotnetfx35langpack_x64he.exe
http://download.microsoft.com/download/C/B/B/CBBF9C94-8F25-4D2E-B617-46221968D2BE/NDP46-KB3045557-x86-x64-AllOS-HEB.exe
http://download.microsoft.com/download/9/2/3/9233791d-a020-4320-b3c7-e1520397e80f/dotnetfx35langpack_x64hu.exe
http://download.microsoft.com/download/5/A/8/5A830BE6-552C-4D66-A647-12112D8521CA/NDP46-KB3045557-x86-x64-AllOS-HUN.exe
http://download.microsoft.com/download/e/4/2/e42d6933-74be-41eb-8799-0d256321a853/dotnetfx35langpack_x64it.exe
http://download.microsoft.com/download/7/1/1/71194370-0FB3-4BA1-80E5-255AA015E0A6/NDP46-KB3045557-x86-x64-AllOS-ITA.exe
http://download.microsoft.com/download/f/a/2/fa24f36b-cdcb-415c-8acf-11e33a21a358/dotnetfx35langpack_x64ja.exe
http://download.microsoft.com/download/5/A/0/5A055608-2D3C-40D3-B0A8-5AF98A83D2E0/NDP46-KB3045557-x86-x64-AllOS-JPN.exe
http://download.microsoft.com/download/5/f/5/5f5ab722-6045-4864-bcbc-6b5a7651dc40/dotnetfx35langpack_x64ko.exe
http://download.microsoft.com/download/2/4/6/246497D9-B00F-4353-8C3E-12B04A83E4A6/NDP46-KB3045557-x86-x64-AllOS-KOR.exe
http://download.microsoft.com/download/0/c/1/0c17b6ef-362b-47db-a0f8-b1828aed0746/dotnetfx35langpack_x64nl.exe
http://download.microsoft.com/download/B/A/4/BA4BF7E1-8A2D-48A5-B2F4-C118B16519C2/NDP46-KB3045557-x86-x64-AllOS-NLD.exe
http://download.microsoft.com/download/7/8/b/78bdff4f-c803-46e0-96e5-1758b715d43a/dotnetfx35langpack_x64no.exe
http://download.microsoft.com/download/5/D/E/5DE71FBF-4E49-48AC-A9E6-A3B6A5FAEF2C/NDP46-KB3045557-x86-x64-AllOS-NOR.exe
http://download.microsoft.com/download/b/6/d/b6da6a2b-dd2d-4f92-bcb6-5f3414dab7c1/dotnetfx35langpack_x64pl.exe
http://download.microsoft.com/download/6/7/8/67877F8B-CC3A-499E-9AE5-D0AB62F9C762/NDP46-KB3045557-x86-x64-AllOS-PLK.exe
http://download.microsoft.com/download/b/f/6/bf6b522f-cc65-4fc9-a387-c2457b77084f/dotnetfx35langpack_x64pt-BR.exe
http://download.microsoft.com/download/A/5/0/A500F7F4-01C0-4F6A-8204-1B086BB80580/NDP46-KB3045557-x86-x64-AllOS-PTB.exe
http://download.microsoft.com/download/e/b/1/eb1f55b6-45be-401f-8a64-8d0ff3e0ec45/dotnetfx35langpack_x64pt-PT.exe
http://download.microsoft.com/download/C/0/4/C04DCCFA-5D25-4B90-862B-2C687BDF3474/NDP46-KB3045557-x86-x64-AllOS-PTG.exe
http://download.microsoft.com/download/A/1/E/A1E99089-91E7-48E2-9FE5-BBD64CC6D51D/dotnetfx35langpack_x64ru.exe
http://download.microsoft.com/download/F/2/A/F2ADB2B0-C99C-432D-A98D-DB79369F6910/NDP46-KB3045557-x86-x64-AllOS-RUS.exe
http://download.microsoft.com/download/6/b/6/6b642aad-df93-47dc-8da0-eeaebcd0ce91/dotnetfx35langpack_x64sv.exe
http://download.microsoft.com/download/3/A/3/3A3F86E1-5863-481D-819A-78C558714A2B/NDP46-KB3045557-x86-x64-AllOS-SVE.exe
http://download.microsoft.com/download/c/5/a/c5a42835-09b8-4879-a530-f84e6baaed71/dotnetfx35langpack_x64tr.exe
http://download.microsoft.com/download/7/6/2/76287DB1-CC48-454F-AA52-2AB9FBF49CAC/NDP46-KB3045557-x86-x64-AllOS-TRK.exe
http://download.microsoft.com/download/6/6/4/66488d18-e069-4b3e-a0b5-5be3af0702bd/dotnetfx35langpack_x86ar.exe
http://download.microsoft.com/download/B/B/B/BBBA772C-8E15-4528-BD70-C490AD255B3D/NDP46-KB3045557-x86-x64-AllOS-ARA.exe
http://download.microsoft.com/download/7/7/b/77b96978-c805-4674-a9b0-43351e86b41f/dotnetfx35langpack_x86zh-CHS.exe
http://download.microsoft.com/download/B/4/B/B4BB144A-E89A-47F0-9321-106DDC18ACDE/NDP46-KB3045557-x86-x64-AllOS-CHS.exe
http://download.microsoft.com/download/6/3/2/632f43b6-fe1e-4dc6-9f17-00e37eea0463/dotnetfx35langpack_x86zh-cht.exe
http://download.microsoft.com/download/C/E/3/CE369936-7F4C-45B4-A3BB-6F8DC78FB3F1/NDP46-KB3045557-x86-x64-AllOS-CHT.exe
http://download.microsoft.com/download/f/7/9/f79bfd15-64b4-45b0-a396-e30f12ea13d0/dotnetfx35langpack_x86cs.exe
http://download.microsoft.com/download/B/4/E/B4E1E995-F71D-4D04-B7AB-D1F01BF4DB11/NDP46-KB3045557-x86-x64-AllOS-CSY.exe
http://download.microsoft.com/download/8/2/0/820f6ddc-71c0-4cce-ab81-5d92ff9810e1/dotnetfx35langpack_x86da.exe
http://download.microsoft.com/download/3/5/5/3559702B-FAFB-42CF-9199-3EE86FCF5BA0/NDP46-KB3045557-x86-x64-AllOS-DAN.exe
http://download.microsoft.com/download/d/7/2/d728b7b9-454b-4b57-8270-45dac441b0ec/dotnetfx35langpack_x86de.exe
http://download.microsoft.com/download/5/4/C/54C214DA-370D-4CD8-8FA4-163603E02BA3/NDP46-KB3045557-x86-x64-AllOS-DEU.exe
http://download.microsoft.com/download/a/7/3/a7382fbb-0167-445c-8a6b-b01b303d804f/dotnetfx35langpack_x86el.exe
http://download.microsoft.com/download/3/3/7/3372C503-6E20-49DA-9767-222D2D0CE113/NDP46-KB3045557-x86-x64-AllOS-ELL.exe
http://download.microsoft.com/download/4/a/2/4a2b42fc-f271-4cc8-9c15-bc10cdde1eb9/dotnetfx35langpack_x86es.exe
http://download.microsoft.com/download/C/7/A/C7AC414F-9768-48D4-A3DE-894331C47FCA/NDP46-KB3045557-x86-x64-AllOS-ESN.exe
http://download.microsoft.com/download/A/1/E/A1E99089-91E7-48E2-9FE5-BBD64CC6D51D/dotnetfx35langpack_x86ru.exe
http://download.microsoft.com/download/F/2/A/F2ADB2B0-C99C-432D-A98D-DB79369F6910/NDP46-KB3045557-x86-x64-AllOS-RUS.exe
http://download.microsoft.com/download/e/b/1/eb1f55b6-45be-401f-8a64-8d0ff3e0ec45/dotnetfx35langpack_x86pt-PT.exe
http://download.microsoft.com/download/C/0/4/C04DCCFA-5D25-4B90-862B-2C687BDF3474/NDP46-KB3045557-x86-x64-AllOS-PTG.exe
http://download.microsoft.com/download/b/f/6/bf6b522f-cc65-4fc9-a387-c2457b77084f/dotnetfx35langpack_x86pt-BR.exe
http://download.microsoft.com/download/A/5/0/A500F7F4-01C0-4F6A-8204-1B086BB80580/NDP46-KB3045557-x86-x64-AllOS-PTB.exe
http://download.microsoft.com/download/b/6/d/b6da6a2b-dd2d-4f92-bcb6-5f3414dab7c1/dotnetfx35langpack_x86pl.exe
http://download.microsoft.com/download/6/7/8/67877F8B-CC3A-499E-9AE5-D0AB62F9C762/NDP46-KB3045557-x86-x64-AllOS-PLK.exe
http://download.microsoft.com/download/7/8/b/78bdff4f-c803-46e0-96e5-1758b715d43a/dotnetfx35langpack_x86no.exe
http://download.microsoft.com/download/5/D/E/5DE71FBF-4E49-48AC-A9E6-A3B6A5FAEF2C/NDP46-KB3045557-x86-x64-AllOS-NOR.exe
http://download.microsoft.com/download/0/c/1/0c17b6ef-362b-47db-a0f8-b1828aed0746/dotnetfx35langpack_x86nl.exe
http://download.microsoft.com/download/B/A/4/BA4BF7E1-8A2D-48A5-B2F4-C118B16519C2/NDP46-KB3045557-x86-x64-AllOS-NLD.exe
http://download.microsoft.com/download/5/f/5/5f5ab722-6045-4864-bcbc-6b5a7651dc40/dotnetfx35langpack_x86ko.exe
http://download.microsoft.com/download/2/4/6/246497D9-B00F-4353-8C3E-12B04A83E4A6/NDP46-KB3045557-x86-x64-AllOS-KOR.exe
http://download.microsoft.com/download/f/a/2/fa24f36b-cdcb-415c-8acf-11e33a21a358/dotnetfx35langpack_x86ja.exe
http://download.microsoft.com/download/5/A/0/5A055608-2D3C-40D3-B0A8-5AF98A83D2E0/NDP46-KB3045557-x86-x64-AllOS-JPN.exe
http://download.microsoft.com/download/e/4/2/e42d6933-74be-41eb-8799-0d256321a853/dotnetfx35langpack_x86it.exe
http://download.microsoft.com/download/7/1/1/71194370-0FB3-4BA1-80E5-255AA015E0A6/NDP46-KB3045557-x86-x64-AllOS-ITA.exe
http://download.microsoft.com/download/9/2/3/9233791d-a020-4320-b3c7-e1520397e80f/dotnetfx35langpack_x86hu.exe
http://download.microsoft.com/download/5/A/8/5A830BE6-552C-4D66-A647-12112D8521CA/NDP46-KB3045557-x86-x64-AllOS-HUN.exe
http://download.microsoft.com/download/8/1/4/8143f1b9-e478-48ae-99da-b30a53bf5a92/dotnetfx35langpack_x86he.exe
http://download.microsoft.com/download/C/B/B/CBBF9C94-8F25-4D2E-B617-46221968D2BE/NDP46-KB3045557-x86-x64-AllOS-HEB.exe
http://download.microsoft.com/download/d/7/2/d728b7b9-454b-4b57-8270-45dac441b0ec/dotnetfx35langpack_x86de.exe
http://download.microsoft.com/download/e/6/1/e6168525-de7f-49ce-971b-62e6c8738c38/dotnetfx35langpack_x86fr.exe
http://download.microsoft.com/download/7/8/B/78B918FC-AA96-4E5B-8A7D-B516D4E34B54/NDP46-KB3045557-x86-x64-AllOS-FRA.exe
http://download.microsoft.com/download/a/c/7/ac7ec2f2-38b3-4066-b0be-6475b55a113c/dotnetfx35langpack_x86fi.exe
http://download.microsoft.com/download/B/C/F/BCF148FA-90B4-4F1B-A47E-08E377E87BF4/NDP46-KB3045557-x86-x64-AllOS-FIN.exe
http://download.microsoft.com/download/c/5/a/c5a42835-09b8-4879-a530-f84e6baaed71/dotnetfx35langpack_x86tr.exe
http://download.microsoft.com/download/7/6/2/76287DB1-CC48-454F-AA52-2AB9FBF49CAC/NDP46-KB3045557-x86-x64-AllOS-TRK.exe
http://download.microsoft.com/download/6/b/6/6b642aad-df93-47dc-8da0-eeaebcd0ce91/dotnetfx35langpack_x86sv.exe
http://download.microsoft.com/download/3/A/3/3A3F86E1-5863-481D-819A-78C558714A2B/NDP46-KB3045557-x86-x64-AllOS-SVE.exe`


let lastItem = (x) => {
  x = x.split('/')
  //console.log(x)
  return x[x.length -1];
}
console.log(x.split(/[\r\n]/gmi).sort((a,b)=>{
  return lastItem(a).localeCompare(lastItem(b));
}).join('\n'))