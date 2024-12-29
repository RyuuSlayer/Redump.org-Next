export const regions = {
  'A': 'Asia',
  'AU': 'Australia',
  'BR': 'Brazil',
  'C': 'China',
  'CA': 'Canada',
  'E': 'Europe',
  'F': 'France',
  'G': 'Germany',
  'GR': 'Greece',
  'HK': 'Hong Kong',
  'I': 'Italy',
  'J': 'Japan',
  'K': 'Korea',
  'NL': 'Netherlands',
  'NO': 'Norway',
  'PL': 'Poland',
  'PT': 'Portugal',
  'R': 'Russia',
  'S': 'Spain',
  'SW': 'Sweden',
  'U': 'USA',
  'UK': 'United Kingdom',
  'W': 'World',
}

export const discStatus = {
  0: 'Unknown',
  1: 'Pending',
  2: 'Verified',
  3: 'Unverified',
  4: 'Incomplete',
  5: 'Not found',
  6: 'Bad dump',
}

export const trackTypes = {
  0: 'Audio',
  1: 'Mode 1',
  2: 'Mode 2',
  3: 'Mode 2 Form 1',
  4: 'Mode 2 Form 2',
  5: 'Mode 2 Form Mix',
  6: 'Interactive',
  7: 'CDI',
  8: 'CDI Ready',
  9: 'CDI Application',
  10: 'XA',
  11: 'XA Form 1',
  12: 'XA Form 2',
  13: 'XA Mix',
  14: 'Unknown',
}

export function formatSectors(sectors: number): string {
  const m = Math.floor(sectors / (60 * 75))
  const s = Math.floor((sectors % (60 * 75)) / 75)
  const f = sectors % 75
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`
}

export function generateCueSheet(dump: any): string {
  let cue = `TITLE "${dump.title}"\n`
  
  dump.tracks.sort((a: any, b: any) => a.number - b.number)
  
  for (const track of dump.tracks) {
    cue += `\nTRACK ${track.number.toString().padStart(2, '0')} ${trackTypes[track.type]}\n`
    
    if (track.pregap > 0) {
      cue += `  PREGAP ${formatSectors(track.pregap)}\n`
    }
    
    cue += `  INDEX 01 ${formatSectors(track.offset || 0)}\n`
  }
  
  return cue
}

export function generateDatFile(dump: any): string {
  let dat = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE datafile PUBLIC "-//Logiqx//DTD ROM Management Datafile//EN" "http://www.logiqx.com/Dats/datafile.dtd">
<datafile>
  <header>
    <name>${dump.system.name}</name>
    <description>${dump.system.name} - Disc Images</description>
    <version>${new Date().toISOString().split('T')[0]}</version>
    <author>Redump</author>
    <homepage>http://redump.org/</homepage>
  </header>
  <game name="${dump.title}">
    <description>${dump.title}</description>
    <rom name="${dump.title}.cue" size="${dump.tracks.reduce((acc: number, track: any) => acc + track.size, 0)}" crc32="${dump.tracks[0]?.crc32 || ''}" md5="${dump.tracks[0]?.md5 || ''}" sha1="${dump.tracks[0]?.sha1 || ''}" />
  </game>
</datafile>`
  
  return dat
}

export function generateFilename(dump: any, track?: any): string {
  const parts = [
    dump.title.replace(/[^\w\s-]/g, '').trim(),
    dump.region,
    dump.discNumber ? `Disc ${dump.discNumber}` : null,
    dump.label || null,
  ].filter(Boolean)
  
  const base = parts.join(' - ')
  
  if (track) {
    return `${base} (Track ${track.number.toString().padStart(2, '0')}).bin`
  }
  
  return `${base}.cue`
}
