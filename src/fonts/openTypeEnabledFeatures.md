<!-- # openTypeEnabledFeatures -->
The example below uses **openTypeEnabledFeatures** to return a list of features available for the selected font.

Fonts available for selection below are served from embedded web fonts, to ensure full coverage of **openTypeEnabledFeatures**. For an example using locally installed fonts, see the [opening Example](#/Example) in this style guide.

*Change the font below to see available font settings.*

(See also [this MUI](https://github.com/RUN-Collaborations/translatable/blob/main/src/components/ToolbarFontFeatures.jsx) implementation. It detects and utilizes both locally installed versions of these fonts and embedded fonts, and also carries the last selected setting over react routes.)

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { renderToString } from 'react-dom/server';

import { useDetectDir, openTypeEnabledFeatures, useAssumeGraphite } from 'font-detect-rhl';

import FontFeatureSettings from "../hooks/helpers/FontFeatureSettings";

// These are included to showcase features. Locally installed versions of the same fonts can also be detected and utilized.
import openTypeEnabledWebFontsArray from '../embeddedWebFonts/OpenTypeEnabledWebFonts.json';
import '../embeddedWebFonts/WebFonts.css';

/*
  Key (corresponds with openTypeEnabledFeatures json):
    * Font name without version is {featureFont} and also {font.name}
    * Each category of font features is {category.name}
    * Each font feature name is `{set.name}` and its default value is `{set.default}`.
    * CSS syntax is: font-feature-settings: "name" value;
    * In ../hooks/helpers/FontFeatureSettings.jsx:
      + Each possible font feature name's value is `{option.value}`
      + Last selected value is `fontSettings[count].value.toString()`.
      + Label is `{set.label}`.
      + Tip is `{option.tip}`.
      + Title is `{set.title}`.
*/

const EXAMPLE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non curabitur gravida arcu ac tortor. Diam maecenas ultricies mi eget mauris pharetra et. Velit scelerisque in dictum non consectetur a. Pharetra massa massa ultricies mi quis hendrerit. Adipiscing bibendum est ultricies integer quis auctor elit sed vulputate. Tristique sollicitudin nibh sit amet commodo. Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. Turpis tincidunt id aliquet risus feugiat in ante metus dictum.";

function Component(){

  const [selectedFont, setSelectedFont] = useState('monospace');
  const [quoteOrNot, setQuoteOrNot] = React.useState("");
  const [selectedFontSize, setSelectedFontSize] = useState('1em');
  const [selectedLineHeight, setSelectedLineHeight] = useState('normal');
  const [example, setExample] = useState(EXAMPLE);
  const [fontSettingsCss, setFontSettingsCss] = useState("");

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

  // The embedded font naming convention used here is "name version", so we remove "version" to get just the name
  const featureFont = selectedFont.substring(0, selectedFont.lastIndexOf(" "));

  const isGraphiteAssumed = useAssumeGraphite({});

  /* Annapurna SIL 2.100 uses *some different* font features settings for rendering with OpenType vs. rendering with Graphite. Settings from openTypeEnabledFeatures should *not* be offered in Firefox for Annapurna SIL 2.100.
   * Abyssinica SIL 2.201 and Padauk 5.100 render in both OpenType and Graphite using the *same* font features settings. We will exclude OpenType settings in Firefox from these two fonts, consistent with the 'RenderingUnknown' test result of 'RenderingGraphite'. */
  const featureArray = isGraphiteAssumed ? openTypeEnabledFeatures.filter((name) => (name.name != 'Annapurna SIL' && name.name != 'Abyssinica SIL' && name.name != 'Padauk')) : openTypeEnabledFeatures;

  // Create an array of font setting names and default values
  const fontSettingsJsx = useMemo(() => featureArray.filter((name) => name.name === featureFont).map((font, fontIndex) => (
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
  )), [featureFont]);

  // Convert the jsx return of default values to a string and remove html tags and attributes (e.g., div's)
  const fontSettingsStr = renderToString(fontSettingsJsx).replace(/(<([^>]+)>)/ig, '');

  // Remove the last comma, change [] to {} and ~ to " and convert the string of default values to an array of objects
  const fontSettingsAdj = '[' + fontSettingsStr.substring(0, fontSettingsStr.length - 1).replace(/\[/gm, "{").replace(/\]/gm, "}").replace(/~/gm, '"') + ']';
  
  const fontFeatureDefaults = JSON.parse(fontSettingsAdj);

  const [fontSettings, setFontSettings] = useState(fontFeatureDefaults);

  // Get new defaults when the font name changes.
  useEffect (() => {
    setFontSettings(fontFeatureDefaults);
  },[featureFont])

  // This helps state management w.r.t fontSettings[count] in FontFeatureSettings.jsx
  if(fontFeatureDefaults.length > fontSettings.length) {
    setFontSettings(fontFeatureDefaults);
  }
  
  const handleChangeSize = (event) => {
    setSelectedFontSize(event.target.value);
  };
  
  const handleChangeLineHeight = (event) => {
    setSelectedLineHeight(event.target.value);
  };

  // OpenType-enabled web fonts use a different css id from the actual font name to avoid conflict with locally installed fonts (which could be a different version). We will also remove a few fonts from dropdown selection in Firefox where Graphite is assumed.
  const openTypeEnabledWebFonts =
    openTypeEnabledWebFontsArray.filter((name) => (isGraphiteAssumed ? (name.name != 'Annapurna SIL 2-100' && name.name != 'Abyssinica SIL 2-201' && name.name != 'Padauk 5-100') : name.name != '')).map((font, index) => (
      <option key={index} value={font.name} style={{ fontFamily: font.name }}>{font.name}</option>
    ));
  
  // Get all radio label text and use it to identify the most common text direction, for use in the font feature settings area.
  const labelJsxText = useMemo(() => featureArray.filter((name) => name.name === featureFont).map((font, fontIndex) => (
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
  )), [featureFont]);

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
    featureFont,
    quoteOrNot,
    selectedFont,
    fontSettings,
    handleChangeFeature,
    radioLabelRightMargin,
    radioLabelLeftMargin,
    featureArray,
  }

  const tagmukayNote = (<i>The <a href="https://software.sil.org/tagmukay/">Tagmukay font description</a> indicates both "Graphite and OpenType tables ...". In either case the OpenType font feature settings will still work.</i>)
  const renderingAssumed = (isGraphiteAssumed && selectedFont === 'Tagmukay 2-000') ? tagmukayNote : 'OpenType'

  return (
  <>
    <div style={{ display: "table-cell", }}>
      <div>
        <p align="left" style={{ marginTop: "0px" }}>
          <em>Change the font to load available font settings for the selected font.</em>
        </p>
      </div>
      <div>
        <div>
          <div style={{ display: "table-cell" }}>
            <label htmlFor="font"><b>Select Font:</b></label>
            <select
              name="font"
              id="font"
              defaultValue={selectedFont}
              onChange={handleChange}
            >
              <option value="monospace">default</option>
              <optgroup label="OpenType-Enabled Fonts:" />
                {openTypeEnabledWebFonts}
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
        </div>
        <div style={{display: "table-cell", paddingRight: "3px"}} >
          <p
            align="left"
            style={{ marginBottom: "0px" }}
          >
            Rendering Test Results: <span style={{fontFamily: quoteOrNot + selectedFont + quoteOrNot}}><b>RenderingUnknown</b></span>
            <br />
            Rendering Assumed: {renderingAssumed}
            <br />
            Direction: <b>{dir}</b>
            <br />
            <em>
              &nbsp;Enter <b>{notdir}</b> text, then click out of the editable text
              area to see a direction change applied:
            </em>
          </p>

          <textarea
            rows="10"
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
              display: "table-cell",
              color: "grey"
            }}
          >
            <div
              style={{
                display: "table-cell",
                width: "48%",
                float: "left",
                textAlign: "right",
              }}
            >
              <p style={{ fontSize: "0.9em", margin: "0px" }}>
                <b>Sample RTL Text:</b>
                <br />
                (for copy-paste)
                <br />
                {labelDir === 'rtl' && '...or copy label-text from ' + featureFont + ' selected font features!'}
              </p>
            </div>
            <div
              style={{
                display: "table-cell",
                width: "50%",
                direction: "RTL",
                border: "1px solid #969696",
                float: "right",
                textAlign: "right",
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
    </div>
    <div
      style= {{
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
    </div>
  </>);
};

<Component />
```
