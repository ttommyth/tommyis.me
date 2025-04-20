export const Loading = () => {
  return (
    <div className="bg-highlight-glass  w-full h-full z-[999]">
      <div className="bg-dotted-glass w-full h-full z-[999]">
        <span className="left-1/2 top-1/2 absolute -translate-x-1/2 -translate-y-1/2">
          Loading...
        </span>
      </div>
    </div>
  );
};
