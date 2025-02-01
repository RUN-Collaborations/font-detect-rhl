<!-- # useDetectFonts -->
* Applies **useDetectFonts** to **fontList** and returns detected fonts in a dropdown list.
* Applies **openTypeEnabledFeatures** where fonts included are locally installed.
* Utilizes **useAssumeGraphite** to determine whether or not to also apply **useDetectFonts** to **graphiteEnabledFontList** and subsequently **graphiteEnabledFeatures** where applicable.
* Shows font size, line height controls, and Graphite-enabled font features where applicable.
* Text can be typed or pasted into the text area, with RTL and LTR text auto-detected by **useDetectDir**.
```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { renderToString } from 'react-dom/server';

import {
  useDetectFonts,
  useAssumeGraphite,
  useDetectDir,
  fontList as fontsArray,
  openTypeEnabledFeatures,
  graphiteEnabledFeatures,
  graphiteEnabledFontList as graphiteEnabledFontsArray
} from 'font-detect-rhl';

import FontFeatureSettings from "../hooks/helpers/FontFeatureSettings";

const EXAMPLE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non curabitur gravida arcu ac tortor. Diam maecenas ultricies mi eget mauris pharetra et. Velit scelerisque in dictum non consectetur a. Pharetra massa massa ultricies mi quis hendrerit. Adipiscing bibendum est ultricies integer quis auctor elit sed vulputate. Tristique sollicitudin nibh sit amet commodo. Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. Turpis tincidunt id aliquet risus feugiat in ante metus dictum.";

function Component(){

  const [selectedFont, setSelectedFont] = useState('monospace');
  const [quoteOrNot, setQuoteOrNot] = React.useState("");
  const [selectedFontSize, setSelectedFontSize] = useState('1em');
  const [selectedLineHeight, setSelectedLineHeight] = useState('normal');
  const [example, setExample] = useState(EXAMPLE);

  const dir = useDetectDir({ text: example });

  const notdir = useMemo(() => {
    const _notdir = (dir === 'ltr') ? 'rtl' : 'ltr';
    return _notdir
  }, [dir]);

  const handleChange = (event) => {
    setSelectedFont(event.target.value);
    // useDetectFonts uses quotes when detecting fonts. However, a generic font family (no quotes) is used as the default font in this example.
    setQuoteOrNot(event.target.value === "monospace" ? "" : "'");
  };
  
  const handleChangeSize = (event) => {
    setSelectedFontSize(event.target.value);
  };
  
  const handleChangeLineHeight = (event) => {
    setSelectedLineHeight(event.target.value);
  };

  // Should Graphite-enabled fonts be detected?
  const isGraphiteAssumed = useAssumeGraphite({});

  // Detecting Graphite-enabled fonts
  const detectedGEFonts = useDetectFonts({ fonts: (isGraphiteAssumed ? graphiteEnabledFontsArray : []) });

  const detectedGEFontsComponents = isGraphiteAssumed && detectedGEFonts.map((font, index) => (
    <option key={index} value={font.name} style={{ fontFamily: font.name }}>{font.name}</option>
  ));

  // Heading for Graphite-enabled fonts
  const headingGraphiteEnableFonts = isGraphiteAssumed ? <optgroup label="Graphite-Enabled Fonts:" /> : "";

  // Response when no Graphite-enabled fonts are installed
  const noneDetectedGEMsg = 'none detected';
  const ifNoGEFonts = isGraphiteAssumed ? (detectedGEFontsComponents.length === 0 && <option value="none" disabled>{noneDetectedGEMsg}</option>) : "";

  /* Annapurna SIL 2.100 uses *some different* font features settings for rendering with OpenType vs. rendering with Graphite. 
   *  In Firefox use settings from graphiteEnabledFeatures instead of openTypeEnabledFeatures for Annapurna SIL 2.100.
   * Abyssinica SIL 2.201 and Padauk 5.100 render in both OpenType and Graphite using the *same* font features settings.
   *  In Firefox this is using graphiteEnabledFeatures, consistent with the 'RenderingUnknown' test result of 'RenderingGraphite'. */
  const enabledFeatures = ([...graphiteEnabledFeatures, ...openTypeEnabledFeatures.filter((name) => (name.name !=='Annapurna SIL' && name.name !=='Abyssinica SIL' && name.name !=='Padauk'))]);

  const featureArray = (isGraphiteAssumed ? enabledFeatures : openTypeEnabledFeatures)

  //Detecting regular fonts:
  const adjFontsArray = fontsArray.filter((name) => 
    (isGraphiteAssumed ? (name.name !=='Annapurna SIL' && name.name !=='Abyssinica SIL' && name.name !=='Padauk') : name.name !==''));
  const detectedFonts = useDetectFonts({ fonts: adjFontsArray });

  const detectedFontsComponents = detectedFonts.map((font, index) => (
    <option key={index} value={font.name} style={{ fontFamily: font.name }}>{font.name}</option>
  ));

  // Response if no regular fonts are detected
  const noneDetectedMsg = 'none detected';
  const ifNoFonts = detectedFontsComponents.length === 0 ? <option value="none" disabled>{noneDetectedMsg}</option> : "";
  
  // Identify when we have font features for the selected font
  const fontIfListed = useMemo(() => featureArray.filter((name) => name.name === selectedFont).map(({ name }) => name),[selectedFont]);
	
  const [enabledSettings, setEnabledSettings] = useState(false);

  useEffect(() => {
    if (fontIfListed.length > 0) {
      setEnabledSettings(true);
    } else {
      setEnabledSettings(false);
    }
  }, [fontIfListed.length]);

  // Create an array of font setting names and default values
  const fontSettingsJsx = useMemo(() => featureArray.filter((name) => name.name === selectedFont).map((font, fontIndex) => (
    <div key={fontIndex}>
      {font.categories.map((categories, categoriesIndex) => {
        return (<div key={categoriesIndex}>
          {font.categories[categoriesIndex].category.map((category, categoryIndex) => {
            return (<div key={categoryIndex}>
              {category.sets.map((sets, setsIndex) => {
                return (<div key={setsIndex}>
                  {category.sets[setsIndex].set.map((set, setIndex) => {
                    return (<div key={setIndex}>
                      [~name~: ~{set.name}~, ~value~: {set.default}],
                    </div>)
                  })}
                </div>)
              })}
            </div>)
          })}
        </div>)
      })}
    </div>
  )), [selectedFont]);

  // Convert the jsx return of default values to a string and remove html tags and attributes (e.g., div's)
  const fontSettingsStr = renderToString(fontSettingsJsx).replace(/(<([^>]+)>)/ig, '');

  // Remove the last comma, change [] to {} and ~ to " and convert the string of default values to an array of objects
  const fontSettingsAdj = '[' + fontSettingsStr.substring(0, fontSettingsStr.length - 1).replace(/\[/gm, "{").replace(/\]/gm, "}").replace(/~/gm, '"') + ']';
  
  const fontFeatureDefaults = JSON.parse(fontSettingsAdj);

  const [fontSettings, setFontSettings] = useState(fontFeatureDefaults);

  // Get new defaults when the font name changes.
  useEffect (() => {
    setFontSettings(fontFeatureDefaults);
  },[selectedFont])

  // This helps state management w.r.t fontSettings[count] in FontFeatureSettings.jsx
  if(fontFeatureDefaults.length > fontSettings.length) {
    setFontSettings(fontFeatureDefaults);
  }

  // Get all radio label text and use it to identify the most common text direction, for use in the font feature settings area.
  const labelJsxText = useMemo(() => featureArray.filter((name) => name.name === selectedFont).map((font, fontIndex) => (
    <div key={fontIndex}>
      {font.categories.map((categories, categoriesIndex) => {
        return (<div key={categoriesIndex}>
          {font.categories[categoriesIndex].category.map((category, categoryIndex) => {
            return (<div key={categoryIndex}>
              {category.sets.map((sets, setsIndex) => {
                return (<div key={setsIndex}>
                  {category.sets[setsIndex].set.map((set, setIndex) => {
                      return (<div key={setIndex}>
                        {/** replace quote and apostrophe html special entities, and remove html tags and attributes */}
                        {set.label.replace(/&quot;/ig, '"').replace(/&apos;/ig, "'").replace(/(<([^>]+)>)/ig, '')}
                      </div>)
                    })}
                </div>)
              })}
            </div>)
          })}
      </div>)
      })}
    </div>
  )), [selectedFont]);

  // Convert label text jsx return to string, replace quote and apostrophe html special entities, and remove html tags and attributes
  const labelStr = useMemo(() => renderToString(labelJsxText).replace(/&quot;/ig, '"').replace(/&#x27;/ig, "'").replace(/(<([^>]+)>)/ig, ''),[labelJsxText]);

  // Identify the most common text direction, for use in the font feature settings area.
  const labelDir = useDetectDir({ text: labelStr, isMarkup: false, ratioThreshold: .51 });
  
  const [placementDir, setPlacementDir] = useState('left');
  const [radioLabelRightMargin, setRadioLabelRightMargin] = useState('16px');
  const [radioLabelLeftMargin, setRadioLabelLeftMargin] = useState('-11px');

  useEffect(() => {
    if (labelDir === 'rtl') {
      setPlacementDir('right')
      setRadioLabelRightMargin('25px')
      setRadioLabelLeftMargin('2px')
    } else if (labelDir === 'ltr') {
      setPlacementDir('left')
      setRadioLabelLeftMargin('25px')
      setRadioLabelRightMargin('2px')
    }
  }, [labelDir]);

  // The diffStyle constant is for emphasis in Awami Nastliq labels.
  // eslint-disable-next-line no-unused-vars
  const diffStyle = "color: limegreen;";

  // Apply the selected value to the selected name
  const handleChangeFeature = useMemo(() => (event) => {
    // console.log(event.target.name + ": " + event.target.value)
    const newState = fontSettings.map(obj => {
      if (obj.name === event.target.name) {
        return {...obj, value: +event.target.value};
      }
      return obj;
    });
    setFontSettings(newState);
  },[fontSettings]);

  const [fontSettingsCss, setFontSettingsCss] = useState("");

  // Css Font Feature Settings
  useEffect(() => {
    const fontSettingsJsx = fontSettings.map((obj, index) => (
      <div key={index}> ~{obj.name}~ {obj.value},</div>
    ));
    // convert jsx return to string and remove html tags and attributes (e.g., div's)
    const fontSettingsStr = renderToString(fontSettingsJsx).replace(/(<([^>]+)>)/ig, '').replace(/~/gm, '"');
    // remove the last comma, change ~ to "
    setFontSettingsCss(fontSettingsStr.substring(0, fontSettingsStr.length - 1).replace(/~/gm, '"'));
  },[fontSettings])

  const fontFeatureSettingsProps = {
    featureFont: selectedFont,
    quoteOrNot,
    selectedFont,
    fontSettings,
    handleChangeFeature,
    radioLabelRightMargin,
    radioLabelLeftMargin,
    diffStyle,
    featureArray,
  }

  const fontFeatures = 
    enabledSettings
    ?
      (<div style= {{
          fontFamily: quoteOrNot + selectedFont + quoteOrNot,
          fontSize: selectedFontSize,
          lineHeight: selectedLineHeight,
          direction: labelDir,
          textAlign: placementDir,
          fontFeatureSettings: fontSettingsCss,
          MozFontFeatureSettings: fontSettingsCss,
          WebkitFontFeatureSettings: fontSettingsCss,
          display: "table-cell",
          width: "50%",
          paddingLeft: "10px"
        }}
      >
        <FontFeatureSettings {...fontFeatureSettingsProps} />
      </div>)
    :
      <></>

  return (
    <>  
      <div style={{ display: "table-cell", }}>
        <div>
          <p align="left" style={{ marginTop: "0px" }}>
            <em>Change dropdowns to see selected settings applied to the editable
            text area.</em>
          </p>
          <div style={{ display: "table-cell" }}>
            <label htmlFor="font"><b>Select Font:</b></label>
            <select
              name="font"
              id="font"
              defaultValue={selectedFont}
              onChange={handleChange}
            >
              <option value="" disabled hidden>Select Font</option>
              <option value="monospace">default</option>
              {headingGraphiteEnableFonts}
                {ifNoGEFonts}
                {isGraphiteAssumed && detectedGEFontsComponents}
              <optgroup label="Detected Fonts:" />
                {ifNoFonts}
                {detectedFontsComponents}
            </select>
          </div>
          <div style={{ display: "table-cell" }}>
            &nbsp;<label htmlFor="font-size"><b>Set Font Size:</b></label>
            <select
              name="font-size"
              id="font-size"
              value={selectedFontSize}
              onChange={handleChangeSize}
            >            
              <option value="" disabled hidden>Set Font Size</option>
              <option key={1} value={'0.75em'}>75%</option>
              <option key={2} value={'1em'}>100% (default)</option>
              <option key={3} value={'1.25em'}>125%</option>
              <option key={4} value={'1.5em'}>150%</option>
              <option key={5} value={'1.75em'}>175%</option>
              <option key={6} value={'2em'}>200%</option>
              <option key={7} value={'2.25em'}>225%</option>
              <option key={8} value={'2.5em'}>250%</option>
              <option key={9} value={'2.75em'}>275%</option>
              <option key={10} value={'3em'}>300%</option>
            </select>
          </div>
          <div style={{ display: "table-cell" }}>
            &nbsp;<label htmlFor="line-height"><b>Set Line Height:</b></label>
            <select
              name="line-height"
              id="line-height"
              value={selectedLineHeight}
              onChange={handleChangeLineHeight}
            >
              <option value="" disabled hidden>Set Line Height</option>
              <option key={1} value={'150%'}>150%</option>
              <option key={2} value={'200%'}>200%</option>
              <option key={3} value={'250%'}>250%</option>
              <option key={4} value={'300%'}>300%</option>
              <option key={5} value={'normal'}>default</option>
            </select>
          </div>
          <p
            align="left"
            style={{ marginBottom: "0px" }}
          >
            Direction: <b>{dir}</b>
            <br />
            <em>
              &nbsp;Enter <b>{notdir}</b> text, then click out of the editable text
              area to see a direction change applied:
            </em>
          </p>

          <textarea
            rows="5"
            name="example"
            onBlur={(event) => {
              const _example = event.target.value;
              setExample(_example);
            }}
            style= {{
              fontFamily: quoteOrNot + selectedFont + quoteOrNot,
              fontSize: selectedFontSize,
              lineHeight: selectedLineHeight,
              width: '100%',
              borderColor: "blue",
              direction: dir,
              fontFeatureSettings: fontSettingsCss,
              MozFontFeatureSettings: fontSettingsCss,
              WebkitFontFeatureSettings: fontSettingsCss,
              }}
            defaultValue={example}
            >
          </textarea>

          <p></p>
          <hr />
          <div
            style={{
              display: "flex",
              color: "grey"
            }}
          >
            <div
              style={{
                width: "48%",
                float: "left",
                textAlign: "right"
              }}
            >
              <p style={{ fontSize: "0.9em", margin: "0px" }}>
                <b>Sample RTL Text:</b>
                <br />
                (for copy-paste)
                <br />
                {enabledSettings && labelDir === 'rtl' && '...or copy label-text from ' + selectedFont + ' selected font features!'}
              </p>
            </div>
            <div
              style={{
                width: "50%",
                direction: "RTL",
                border: "1px solid #969696",
                float: "right",
                textAlign: "right"
              }}
            >
              فِي ٱلْبَدْءِ كَانَ ٱلْكَلِمَةُ، وَٱلْكَلِمَةُ كَانَ عِنْدَ ٱللهِ،
              وَكَانَ ٱلْكَلِمَةُ ٱللهَ. هَذَا كَانَ فِي ٱلْبَدْءِ عِنْدَ ٱللهِ.
              كُلُّ شَيْءٍ بِهِ كَانَ، وَبِغَيْرِهِ لَمْ يَكُنْ شَيْءٌ مِمَّا كَانَ.
              فِيهِ كَانَتِ ٱلْحَيَاةُ، وَٱلْحَيَاةُ كَانَتْ نُورَ ٱلنَّاسِ،
              وَٱلنُّورُ يُضِيءُ فِي ٱلظُّلْمَةِ، وَٱلظُّلْمَةُ لَمْ تُدْرِكْهُ.
            </div>
          </div>
        </div>
      </div>
      {fontFeatures}
    </>
  );
};

<Component />
```
