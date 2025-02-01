import React, { useMemo } from "react";
import DOMPurify from 'dompurify';

// Separating this component keeps React state management in sync for fontSettings.
export default function FontFeatureSettings(fontFeatureSettingsProps) {
  const {
    featureFont,
    quoteOrNot,
    selectedFont,
    fontSettings,
    handleChangeFeature,
    radioLabelRightMargin,
    radioLabelLeftMargin,
    diffStyle,
    featureArray,
    isGraphiteAssumed,
  } = fontFeatureSettingsProps;


  const fieldsetLabelStyle = useMemo(() => ({
    fontStyle: 'italic',
  }),[]);

  const fieldsetLabelMarkStyle = useMemo(() => ({
    backgroundColor: 'lightgreen',
    color: 'Blue',
    padding: '0.11em .21em',
    borderStyle: 'solid solid none solid',
    borderWidth: '2px',
  }),[]);

  const fieldsetStyle = useMemo(() => ({
    borderWidth: '2px',
    borderStyle: 'inset',
    borderColor: 'blue black black blue'
  }),[]);

  const setLabelDivStyle = useMemo(() => ({
    marginRight: radioLabelRightMargin,
    marginLeft: radioLabelLeftMargin,
  }),[radioLabelLeftMargin, radioLabelRightMargin]);

  let count = -1;
  const featureSettings = useMemo(() => featureArray.filter((name) => name.name === featureFont).map((font, fontIndex) => (
    <div key={fontIndex}>
      {font.categories.map((categories, categoriesIndex) => {
        return (<div key={categoriesIndex}>
          {font.categories[categoriesIndex].category.filter(item => isGraphiteAssumed ? item.opentype_render_required !== true : item.graphite_render_required !== true).map((category, categoryIndex) => {
            return (<div key={categoryIndex}>
              <h1 style={{textAlign: 'center'}}>{font.name}: {category.name}</h1>
              {category.sets.map((sets, setsIndex) => {
                return (<div key={setsIndex}>
                  {category.sets[setsIndex].set.filter(item => isGraphiteAssumed ? item.opentype_render_required !== true : item.graphite_render_required !== true).map((set, setIndex) => {
                    return (<div key={setIndex} id={++count}>
                      <label id={set.id}><div style={fieldsetLabelStyle}><mark style={fieldsetLabelMarkStyle}>{set.title}</mark></div></label>
                      <fieldset id={set.name}
                        name={set.name}
                        style={fieldsetStyle}
                      >
                        {set.options.map((option, optionIndex) => {
                          return (<div key={optionIndex}>
                            <label
                              htmlFor={set.name+option.value}
                              style={{ 
                                fontFamily:  quoteOrNot + selectedFont + quoteOrNot,
                                fontFeatureSettings: '"' + set.name + '" ' + option.value,
                                MozFontFeatureSettings: '"' + set.name + '" ' + option.value,
                                WebkitFontFeatureSettings: '"' + set.name + '" ' + option.value
                              }}
                            >
                              <input
                                type="radio"
                                name={set.name}
                                id={set.name+option.value}
                                data-test-id={set.name+option.value}
                                value={option.value}
                                onClick={handleChangeFeature}
                                checked={fontSettings[count].value.toString() === option.value}
                                readOnly
                              />
                              {option.tip}
                              <div
                                style={setLabelDivStyle}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(set.label).replaceAll('{diffStyle}', diffStyle) }}
                              />
                            </label>
                          </div>)
                        })}
                      </fieldset>
                    </div>)
                  })}
                </div>)
              })}
            </div>)
          })}
        </div>)
      })}
    </div>
  )), [featureArray, featureFont, count, fieldsetLabelStyle, fieldsetLabelMarkStyle, fieldsetStyle, quoteOrNot, selectedFont, handleChangeFeature, fontSettings, setLabelDivStyle, diffStyle, isGraphiteAssumed]);

  return featureSettings;
}