import { useState } from 'react';

const Detail = ({ icon, isExpanded }) => {
  return (
    <div
      className={`${
        isExpanded ? '' : 'max-sm:hidden'
      } content-['{tune}'] absolute right-0 sm:right-3 bottom-[-15.5px] flex text-neutral-200 bg-white text-center sm:px-1 select-none`}
    >
      &#x7b;
      <span className="material-symbols-rounded text-lg text-[#B6B6B6] px-1 w-[1.625rem]">
        {icon}
      </span>
      &#x7d;
    </div>
  );
};

const ExpandIcon = ({ isPrimary, isExpanded, setIsExpanded }) => {
  return (
    <span
      onClick={() => setIsExpanded(!isExpanded)}
      className={`${
        isPrimary && 'hidden'
      } material-symbols-rounded lg:hidden font-light text-gray-500 text-4xl cursor-pointer select-none`}
    >
      {isExpanded ? 'expand_less' : 'expand_more'}
    </span>
  );
};

const BookmarkIcon = ({ bookmarkCallback, isBookmarked }) => {
  return (
    <span
      className={`material-symbols-rounded text-2xl w-[1.625rem] cursor-pointer select-none`}
      onClick={bookmarkCallback}
    >
      {isBookmarked ? 'bookmark_add' : 'bookmark_added'}
    </span>
  );
};

const ShareIcon = ({ shareCallback }) => {
  return (
    <span
      className="material-symbols-rounded text-2xl w-[1.625rem] cursor-pointer select-none"
      onClick={shareCallback}
    >
      share
    </span>
  );
};

export default function ToolPane({
  title = 'Section Title',
  children = <p>Place your content here.</p>,
  icon = 'pageless',
  isPrimary = false,
  hideBookmarkIcon = false,
  bookmarkCallback = () => {},
  isBookmarked = true,
  hideShareIcon = false,
  shareCallback = () => {},
  className = '',
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`pane relative border-b border-gray-200 pb-8 sm:rounded-r-lg sm:rounded-bl-lg sm:border sm:px-12 sm:pt-9 ${className}`}
    >
      <header className="flex items-center justify-between w-full">
        <h2 className="flex items-center gap-3 text-2xl sm:text-4xl">
          <span className="text-3xl material-symbols-rounded sm:text-4xl w-7 sm:w-9">
            {icon}
          </span>
          {title}
        </h2>
        <div className="flex gap-2 icons">
          {isPrimary && !hideBookmarkIcon && (
            <BookmarkIcon
              isBookmarked={isBookmarked}
              bookmarkCallback={bookmarkCallback}
            />
          )}
          {isPrimary && !hideShareIcon && (
            <ShareIcon shareCallback={shareCallback} />
          )}
          <ExpandIcon
            isPrimary={isPrimary}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </div>
      </header>
      <main className={`pt-4 ${isExpanded ? '' : 'max-lg:pt-0 max-lg:hidden'}`}>
        {children}
      </main>
      <Detail icon={icon} isExpanded={isExpanded} />
    </div>
  );
}
