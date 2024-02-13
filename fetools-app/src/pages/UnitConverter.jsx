import "../index.css";
import GoDeeper from "../components/ToolsLayout/GoDeeper";
import ToolHeading from "../components/ToolsLayout/ToolHeading";
import ToolHeaderSection from "../components/ToolsLayout/ToolHeaderSection";
import TextField from "../components/TextField";
import CodeBlock from "../components/CodeBlock";
import TabSwitcher from "../components/TabSwitcher";
import EditableInput from "../components/EditableInput";
import PageSection from "../components/PageLayout/PageSection";

import React, { useState, useEffect, useRef } from "react";

// Function component UnitConverter for converting units between pixels, em/rem, and Tailwind utility classes

function UnitConverter() {
  // State hooks for managing component state
  const [basePixelSize, setBasePixelSize] = useState(16);
  const [pixels, setPixels] = useState(0);
  const [em, setEm] = useState(0);
  const [tailwindSize, setTailwindSize] = useState(0);
  const [cssSize, setCssSize] = useState("16px");

  // State to hold the content of the contentEditable div
  const [editableContent, setEditableContent] = useState("Aa");

  // Function to handle changes in the contentEditable div
  const editableRef = useRef(null);

  const handleContentChange = (e) => {
    const newText = editableRef.current.innerText;
    if (newText !== editableContent) {
      setEditableContent(newText);
    }
  };

  // Use useEffect to set the initial content of the contentEditable div
  useEffect(() => {
    const currentText = editableRef.current.innerText;
    if (editableContent !== currentText) {
      editableRef.current.innerText = editableContent;
    }
  }, [editableContent]);

  // State variable to track if the alert has been shown
  const [alertShown, setAlertShown] = useState(false);

  // Update CSS size whenever pixels, em, or Tailwind size changes
  const updateCssSize = (newSizeInPixels) => {
    let finalSize = newSizeInPixels;
    let displayNote = false;

    // Check if newSizeInPixels exceeds the maximum allowed size for the preview (1000)
    if (newSizeInPixels > 1000) {
      finalSize = 1000;
      displayNote = true;
    }

    // Check if newSizeInPixels is a number, if not, set CSS size to "0px"
    setCssSize(isNaN(finalSize) ? "0px" : `${finalSize}px`); // Update CSS size

    // Update the state to control the visibility of the inline notification
    setAlertShown(displayNote);
  };

  // State hook for the grid background style
  const [gridBackgroundStyle, setGridBackgroundStyle] = useState({});

  //Update the grid background style when cssSize changes using useEffect hook
  useEffect(() => {
    const size = parseInt(cssSize); // Parse only the numeric part of cssSize
    if (!isNaN(size) && size > 0) {
      const lineThickness = 0.5;
      const backgroundStyle = {
        backgroundImage: `
          linear-gradient(to right, #d8b8ff ${lineThickness}px, transparent ${lineThickness}px),
          linear-gradient(to bottom, #d8b8ff ${lineThickness}px, transparent ${lineThickness}px)`,
        backgroundSize: `${size}px ${size}px`,
      };
      setGridBackgroundStyle(backgroundStyle);
    } else {
      setGridBackgroundStyle({});
    }
  }, [cssSize]);

  // Tailwind Size Conversions
  const tailwindSizes = [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20,
    24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
  ];

  const tailwindCheck = (TailwindSize) => {
    if (isNaN(TailwindSize) || TailwindSize === "") {
      return "";
    }
    const nearestTailwindSize = tailwindSizes.find(
      (size) => size == TailwindSize
    );
    if (nearestTailwindSize !== undefined) {
      return nearestTailwindSize;
    }
    // Return rem value if no exact tailwind size is found
    return `[${(TailwindSize / 4).toFixed(3)}rem]`;
  };

  // Handler for base pixel size changes
  const handleBasePixelSizeChange = (e) => {
    const newBaseSize = parseFloat(e.target.value);
    setBasePixelSize(newBaseSize);
    const newEm = pixels / newBaseSize;
    setEm(newEm);
    setTailwindSize(tailwindCheck(newEm * 4));
  };

  // Handler for pixel value changes
  const handlePixelChange = (e) => {
    const newPixels = parseFloat(e.target.value);
    setPixels(newPixels);
    const newEm = newPixels / basePixelSize;
    setEm(newEm);
    setTailwindSize(tailwindCheck(newEm * 4));
    updateCssSize(newPixels);
  };

  // Handler for rem/em value changes
  const handleEmChange = (e) => {
    const newEm = parseFloat(e.target.value);
    setEm(newEm);
    const newPixels = newEm * basePixelSize;
    setPixels(newPixels);
    setTailwindSize(tailwindCheck(newEm * 4));
    updateCssSize(newPixels);
  };

  // Tailwind Size Character Validation
  const isValidCharacter = (char) => {
    const validChars = "[],pxrem.";
    return validChars.includes(char) || !isNaN(char);
  };

  // Tailwind Size Format Check
  const formatCheck = (input) => {
    // Check if input is in the allowed format [Xrem] or [Xpx], if so, return as is
    if (
      (input.startsWith("[") && input.endsWith("rem]")) ||
      (input.startsWith("[") && input.endsWith("px]"))
    ) {
      return input;
    }

    // Remove all non-numeric characters except for the decimal point
    return input.replace(/[^\d.]/g, "");
  };

  // Handler for Tailwind Size changes
  const handleTailwindChange = (e) => {
    const inputValue = e.target.value.toString();
    const lastChar = inputValue.slice(-1); // Get the last character

    // Validate the last character
    if (!isValidCharacter(lastChar)) {
      e.preventDefault();
      return; // Stop handling if the last character is not valid
    }

    // Validate format
    let formattedValue = formatCheck(inputValue);

    let newTailwindSize;
    let newEm;

    // Checks if the input value is in the format [X.XXXrem] and parses it correctly
    if (formattedValue.startsWith("[") && formattedValue.endsWith("rem]")) {
      // Extracts the numeric part and parses it as float
      const remValue = formattedValue.slice(1, -4);
      if (!isNaN(remValue)) {
        newEm = remValue;
        newTailwindSize = formattedValue;
      } else {
        newTailwindSize = 0;
        newEm = 0;
      }
    } else if (
      formattedValue.startsWith("[") &&
      formattedValue.endsWith("px]")
    ) {
      // Extracts the numeric part and parses it as float
      const pxValue = formattedValue.slice(1, -3);
      if (!isNaN(pxValue)) {
        let newPx = pxValue;
        newEm = newPx / basePixelSize;
        newTailwindSize = formattedValue;
      } else {
        newTailwindSize = 0;
        newEm = 0;
      }
    } else {
      newTailwindSize = formattedValue;
      newEm = parseFloat(newTailwindSize) / 4;
    }

    setTailwindSize(inputValue);
    setEm(newEm);
    const newPixels = newEm * basePixelSize;
    setPixels(newPixels);
    updateCssSize(newPixels);
  };

  //Tailwind Blur Function - handles entered tailwind sizes that don't exist
  const onTailwindBlur = () => {
    let newTailwindSize;

    if (tailwindSize.startsWith("[") && tailwindSize.endsWith("rem]")) {
      const remValue = tailwindSize.slice(1, -4);
      let newEm = remValue;
      newTailwindSize = newEm * 4;
    } else if (tailwindSize.startsWith("[") && tailwindSize.endsWith("px]")) {
      const pxValue = tailwindSize.slice(1, -3);
      let newPx = pxValue;
      let newEm = newPx / basePixelSize;
      newTailwindSize = newEm * 4;
    } else {
      newTailwindSize = tailwindSize;
    }
    setTailwindSize(tailwindCheck(formatCheck(newTailwindSize)));
  };

  //links for Go Deeper component
  const linksData = [
    {
      url: "https://www.w3schools.com/cssref/css_units.php",
      textValue: "Explore CSS units at W3Schools",
    },
    {
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      textValue: "Learn more about CSS values and units at MDN",
    },
    {
      url: "https://www.youtube.com/watch?v=N5wpD9Ov_To&ab_channel=KevinPowell",
      textValue: "Are you using the right CSS units? With Kevin Powell",
    },
  ];

  //All Code Samples
  const CodeSamples = {
    px: [
      { title: "Font Size", code: `font-size: ${pixels}px;` },
      { title: "Height", code: `height: ${pixels}px;` },
      { title: "Width", code: `width: ${pixels}px;` },
      { title: "Margin", code: `margin: ${pixels}px;` },
      { title: "Padding", code: `padding: ${pixels}px;` },
      { title: "Gap", code: `gap: ${pixels}px;` },
      { title: "Border Width", code: `border-width: ${pixels}px;` },
      {
        title: "Position",
        code: `top: ${pixels}px;\nright: ${pixels}px;\nbottom: ${pixels}px;\nleft: ${pixels}px;`,
      },
    ],
    rem: [
      { title: "Font Size", code: `font-size: ${em}rem;` },
      { title: "Height", code: `height: ${em}rem;` },
      { title: "Width", code: `width: ${em}rem;` },
      { title: "Margin", code: `margin: ${em}rem;` },
      { title: "Padding", code: `padding: ${em}rem;` },
      { title: "Gap", code: `gap: ${em}rem;` },
      { title: "Border Width", code: `border-width: ${em}rem;` },
      {
        title: "Position",
        code: `top: ${em}rem;\nright: ${em}rem;\nbottom: ${em}rem;\nleft: ${em}rem;`,
      },
    ],
    em: [
      { title: "Font Size", code: `font-size: ${em}em;` },
      { title: "Height", code: `height: ${em}em;` },
      { title: "Width", code: `width: ${em}em;` },
      { title: "Margin", code: `margin: ${em}em;` },
      { title: "Padding", code: `padding: ${em}em;` },
      { title: "Gap", code: `gap: ${em}em;` },
      { title: "Border Width", code: `border-width: ${em}em;` },
      {
        title: "Position",
        code: `top: ${em}rem;\nright: ${em}rem;\nbottom: ${em}em;\nleft: ${em}rem;`,
      },
    ],
    tailwind: [
      { title: "Font Size", code: `text-${tailwindSize}` },
      { title: "Height", code: `h-${tailwindSize}` },
      { title: "Width", code: `w-${tailwindSize}` },
      { title: "Margin", code: `m-${tailwindSize}` },
      { title: "Padding", code: `p-${tailwindSize}` },
      { title: "Gap", code: `gap-${tailwindSize}` },
      { title: "Border Width", code: `border-${tailwindSize}` },
      {
        title: "Position",
        code: `top-${tailwindSize}\nright-${tailwindSize}\nbottom-${tailwindSize}\nleft-${tailwindSize}`,
      },
    ],
    NaN: [
      { title: "Font Size", code: "font-size: --" },
      { title: "Height", code: "height: --" },
      { title: "Width", code: "width: --" },
      { title: "Margin", code: "margin: --" },
      { title: "Padding", code: "padding: --" },
      { title: "Gap", code: "gap: --" },
      { title: "Border Width", code: "border-width: --" },
      {
        title: "Position",
        code: `top: --\nright: --\nbottom: --\nleft: --`,
      },
    ],
    NaNtailwind: [
      { title: "Font Size", code: `text-` },
      { title: "Height", code: `h-` },
      { title: "Width", code: `w-` },
      { title: "Margin", code: `m-` },
      { title: "Padding", code: `p-` },
      { title: "Gap", code: `gap-` },
      { title: "Border Width", code: `border-` },
      {
        title: "Position",
        code: `top-\nright-\nbottom-\nleft-`,
      },
    ],
  };

  //TabSwitcher Content

  const tabButtons = ["Rem", "Em", "Px", "Tailwind"];

  const tabContents = [
    <div key="tab-rem" className="grid grid-cols-4 gap-4">
      {isNaN(pixels)
        ? CodeSamples["NaN"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
            />
          ))
        : CodeSamples["rem"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
            />
          ))}
    </div>,

    <div key="tab-em" className="grid grid-cols-4 gap-4">
      {isNaN(em)
        ? CodeSamples["NaN"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
            />
          ))
        : CodeSamples["em"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
            />
          ))}
    </div>,

    <div key="tab-px" className="grid grid-cols-4 gap-4">
      {isNaN(pixels)
        ? CodeSamples["NaN"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
            />
          ))
        : CodeSamples["px"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
            />
          ))}
    </div>,

    <div key="tab-tailwind" className="grid grid-cols-4 gap-4">
      {isNaN(pixels)
        ? CodeSamples["NaNtailwind"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
              lang="tailwind"
            />
          ))
        : CodeSamples["tailwind"].map((sample, index) => (
            <CodeBlock
              key={`${sample.title}-${index}`}
              title={sample.title}
              code={sample.code}
              lang="tailwind"
            />
          ))}
    </div>,
  ];

  // JSX for rendering the UI components.
  return (
    <>
      <main>
        <ToolHeaderSection>
          <ToolHeading
            title="Unit Converter"
            tagline="Calculate PX, REM/EM, and Tailwind utility classes with ease."
          />
        </ToolHeaderSection>

        <PageSection icon="Calculate" title="Calculator" className="w-full">
          <div className="flex gap-2 mt-2 flex-wrap">
            {/*Text Preview*/}

            <div className="flex flex-col w-1/2 gap-4 items-start">
              {/* Inline Notification about Preview Limit */}

              {alertShown && (
                <div className="text-center py-2 px-4 bg-yellow-100 text-yellow-800 rounded-md">
                  Preview is limited to 1000px. Conversion will still be
                  accurate above this value.
                </div>
              )}

              <div
                className="flex flex-row justify-center items-center p-3 h-full w-full overflow-auto"
                style={gridBackgroundStyle}
              >
                <div
                  contentEditable
                  ref={editableRef}
                  className="font-arial font-bold text-3xl break-words leading-none focus:outline-none"
                  style={{
                    fontSize: cssSize,
                  }}
                  onInput={handleContentChange} // Update state on input
                ></div>
              </div>
            </div>

            {/*Input Boxes*/}
            <div className="flex flex-col gap-10">
              <div className="flex gap-8">
                <TextField
                  title="REM/EM"
                  value={em}
                  unit="rem"
                  onValueChange={handleEmChange}
                />

                <TextField
                  title="Pixels"
                  value={pixels}
                  unit="px"
                  onValueChange={handlePixelChange}
                />

                <TextField
                  title="Tailwind Size"
                  value={tailwindSize}
                  onValueChange={handleTailwindChange}
                  inputType="text"
                  onBlur={onTailwindBlur}
                />
              </div>

              <div className="flex justify-center items-center">
                <EditableInput
                  label="Base Size"
                  value={basePixelSize}
                  unit="px"
                  type="number"
                  onChange={handleBasePixelSizeChange}
                />
              </div>
            </div>
          </div>
        </PageSection>

        {/* Section for code blocks */}

        <div>
          <PageSection
            icon="integration_instructions"
            title="Code Snippets"
            className="w-full "
          >
            <TabSwitcher
              buttons={tabButtons}
              children={tabContents}
            ></TabSwitcher>
          </PageSection>
        </div>

        <PageSection title="Go Deeper" icon="school">
          <GoDeeper linksData={linksData} />
        </PageSection>
      </main>
    </>
  );
}

export default UnitConverter;
