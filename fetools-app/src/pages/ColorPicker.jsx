import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ToolHeading from '../components/ToolsLayout/ToolHeading';
import ColorPickerTool from '../components/ColorPicker/ColorPickerTool';
import ColorPickerInterface from '../components/ColorPicker/ColorPickerInterface';

import { createColorObj } from '../components/ColorPicker/ColorPickerUtils';
import RelatedColors from '../components/ColorPicker/RelatedColors';
import useExpander from '../hooks/useExpander';
import ToolMain from '../components/ToolsLayout/ToolMain';
import {
  ToolPane,
  ToolSection,
  ToolSectionColumns,
} from '../components/ToolsLayout/Sections';

import GoDeeper from '../components/ToolsLayout/GoDeeper';
import Toast from '../components/Toast';
import useToastState from '../hooks/useToastState';

export default function ColorPicker() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputOnFocus, setInputOnFocus] = useState(false);
  const [colorData, setColorData] = useState(
    createColorObj(searchParams.get('color')) || createColorObj()
  );

  const toastState = useToastState();

  const [isExpanded, toggleIsExpanded] = useExpander();

  return (
    <ToolMain>
      <ToolHeading
        title="Color Picker"
        tagline="Get colors, tints, and shades, with CSS and Tailwind code you can copy and paste into your project."
        icon="colorize"
      ></ToolHeading>

      <ToolSectionColumns isExpanded={isExpanded} reverse={false}>
        <ColorPickerTool
          colorData={colorData}
          handleQuery={handleQuery}
          setColorData={setColorData}
          inputOnFocus={inputOnFocus}
          setInputOnFocus={setInputOnFocus}
          isExpanded={isExpanded}
          toggleIsExpanded={toggleIsExpanded}
        />

        <ToolPane
          title="Color Codes"
          icon="integration_instructions"
          isPrimary={true}
          bookmarkCallback={() => {}}
          shareCallback={() => {}}
        >
          <ColorPickerInterface
            colorData={colorData}
            setColorData={setColorData}
            inputOnFocus={inputOnFocus}
            setInputOnFocus={setInputOnFocus}
          />
        </ToolPane>
      </ToolSectionColumns>

      <ToolSection title="Related Colors" icon="palette">
        <RelatedColors
          colorData={colorData}
          toastState={toastState}
          setColorData={setColorData}
        />
      </ToolSection>

      <GoDeeper linksData={[]}></GoDeeper>
      <Toast toastState={toastState} />
    </ToolMain>
  );

  function handleQuery(color) {
    color = color.slice(1);
    setSearchParams({ color });
  }
}
