import { BookmarkCollection, BookmarkHoverActions } from "../Bookmarks/index";
import EyeDropButton from "../buttons/EyeDropButton";
import CopyButton from "../CopyButton";
import { ToolSection } from "../ToolsLayout/Sections";

export default function ColorGradientBookmarks({
    bookmarks,
    removeBookmark,
    currentGradientObj,
    toastState,
}) {
    return (
        <ToolSection title="Your Collection" icon="bookmarks">
            <BookmarkCollection
                bookmarks={bookmarks}
                removeBookmark={removeBookmark}
                formatBookmarkCardStyle={(item) => {
                    console.log("item", item);
                    return {
                        background: `
                            ${item.type}-gradient(
                            ${item.type==="radial"?"":`${item.rotation}deg,`} 
                            ${item.gradientColors
                            .map((color) => color.colorStr)
                            .join(", ")})`,
                        padding: "1rem",
                    };
                }}
                formatHoverActions={(item) => {
                    const newGradientCode = `
                    ${item.type}-gradient(
                    ${item.type==="radial"?"":`${item.rotation}deg,`} 
                    ${item.gradientColors
                    .map((color) => color.colorStr)
                    .join(", ")})`;
                    const EyeDropAction = (
                        <EyeDropButton
                            key="EyeDropButton"
                            title={"New Gradient Set"}
                            setState={() => {
                                currentGradientObj(item);
                            }}
                            newValue={newGradientCode}
                            toastState={toastState}
                        />
                    );
                    const CopyAction = (
                        <CopyButton
                            key="CopyButton"
                            onCopy={() => newGradientCode}
                            toastState={toastState}
                        />
                    );
                    return (
                        <BookmarkHoverActions
                            actions={[EyeDropAction, CopyAction]}
                        ></BookmarkHoverActions>
                    );
                }}
            />
        </ToolSection>
    );
}
