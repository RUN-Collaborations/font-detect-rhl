<!-- # useDetectRender -->
**useDetectRender** with **useDetectFonts** returns an array of detected fonts with one of the following three detected attributes: 'RenderingUnknown', 'RenderingOpenType', or 'RenderingGraphite'.

For example:
- Abyssinica SIL 2.201, Padauk 5.001, or Padauk 5.100 will return either 'RenderingGraphite' or 'RenderingOpenType, indicating how it has rendered as viewed.
- Alkalami 3.000, Harmattan 4.300, Lateef 4.300, Ruwudu 3.000, or Scheherazade New 4.300 will return "RenderingOpenType".
- Annapurana SIL 2.100 will return "RenderingUnknown".
- Awami Nastliq 3.300 will return either 'RenderingGraphite' or 'RenderingUnknown.
    - Awami Nastliq does not display properly without Graphite.
    - *If it is known for certain that Awami Nastliq 3.300 is available (e.g., a webfont), then this can be used as a test to identify whether or not rendering is being handled by Graphite in cases other than Firefox, or could be used to identify if Graphite is disabled in Firefox config.*


A line through a font means that the font was not detected, in which case the rendering test result of the fallback font is shown.

```jsx
import { useDetectFonts, useDetectRender } from 'font-detect-rhl';

// These are included to showcase features, in addition to detection results of locally installed fonts.
import '../../embeddedWebFonts/WebFonts.css';

function Component(){

  // Web fonts are using a different css id from the actual font name to avoid conflict with locally installed fonts, which could be a different version.
  const fonts = [
    { source: 'Web', name: 'Awami Nastaliq 3-300', id: 'awami-nastaliq-3-300' },
    { source: 'Local', name: 'Awami Nastaliq', id: 'awami-nastaliq' },
    { source: 'Web', name: 'Abyssinica SIL 2-201', id: 'abyssinica-sil-2-201' },
    { source: 'Local', name: 'Abyssinica SIL', id: 'abyssinica-sil' },
    { source: 'Web', name: 'Annapurna SIL 2-100', id: 'annapurna-sil-2-100' },
    { source: 'Local', name: 'Annapurna SIL', id: 'annapurna-sil' },
    { source: 'Web', name: 'Padauk 5-100', id: 'padauk-5-100' },
    { source: 'Local', name: 'Padauk', id: 'padauk' },
    { source: 'Web', name: 'Alkalami 3-000', id: 'alkalami-3-000' },
    { source: 'Local', name: 'Alkalami', id: 'alkalami' },
    { source: 'Web', name: 'Harmattan 4-300', id: 'harmattan-4-300' },
    { source: 'Local', name: 'Harmattan', id: 'harmattan' },
    { source: 'Web', name: 'Lateef 4-300', id: 'lateef-4-300' },
    { source: 'Local', name: 'Lateef', id: 'lateef' },
    { source: 'Web', name: 'Ruwudu 3-000', id: 'ruwudu-3-000' },
    { source: 'Local', name: 'Ruwudu', id: 'ruwudu' },
    { source: 'Web', name: 'Scheherazade New 4-300', id: 'scheherazade-new-4-300' },
    { source: 'Local', name: 'Scheherazade New', id: 'scheherazade-new' },
  ];

  const detectedFonts = useDetectFonts({ fonts, showAll: true });

  const detectedFontsRendering = useDetectRender({ fonts: detectedFonts, fallbackFont: 'monospace' });

  const detectedFontsComponents = detectedFontsRendering.map((font, index) => (
    <div style={ font.detected ? {fontFamily: "'" + font.name + "'"} : { textDecoration: 'line-through' }} key={index}>{font.name}: <b>{font.detectedRender.toString()}</b> ({font.source} font)</div>
  ));

  const noneDetectedMsg = 'none detected';

  return (
      <div style = {{ border: 'solid 2px blue'}}>
        {detectedFontsComponents.length !== 0 ? detectedFontsComponents : noneDetectedMsg}
      </div>
  );
};

<Component />
```
