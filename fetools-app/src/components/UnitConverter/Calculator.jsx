import TextField from "../TextField";
import EditableInput from "../EditableInput";
import { ToolPane } from "../ToolsLayout/Sections/";

export default function Calculator({
  em,
  handleEmChange,
  pixels,
  handlePixelChange,
  tailwindSize,
  handleTailwindChange,
  onTailwindBlur,
  basePixelSize,
  handleBasePixelSizeChange,
  toastState,
}) {
  return (
    <ToolPane title="Calculator" icon="calculate">
      {/*Input Boxes*/}
      <div className="flex flex-col gap-10 items-center">
        <div className="flex gap-4 items-center">
          <TextField
            title="REM/EM"
            value={em}
            unit="rem"
            onValueChange={handleEmChange}
            toastState={toastState}
          />

          <span className="material-symbols-rounded">autorenew</span>

          <TextField
            title="Pixels"
            value={pixels}
            unit="px"
            onValueChange={handlePixelChange}
            toastState={toastState}
          />

          <span className="material-symbols-rounded">autorenew</span>

          <TextField
            title="Tailwind Size"
            value={tailwindSize}
            onValueChange={handleTailwindChange}
            inputType="text"
            onBlur={onTailwindBlur}
            toastState={toastState}
          />
        </div>

        <div className="flex items-center justify-center">
          <EditableInput
            label="Base Size"
            value={basePixelSize}
            unit="px"
            type="number"
            onChange={handleBasePixelSizeChange}
          />
        </div>
      </div>
    </ToolPane>
  );
}
