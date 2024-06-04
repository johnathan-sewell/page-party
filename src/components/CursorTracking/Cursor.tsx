export function Cursor({
  cursor,
  windowDimensions,
}: {
  cursor: {
    name: string;
    x: number;
    y: number;
  };
  windowDimensions: { width: number; height: number };
}) {
  const offset = 10;
  // calculate the position of the cursor
  // for example if the cursor is at 0.5, 0.5
  // and the window is 1000x1000
  // the cursor should be at 500, 500
  const left = cursor.x * windowDimensions.width - offset;
  const top = cursor.y * windowDimensions.height - offset;

  return (
    <div style={{ position: "absolute", left: left, top: top }}>
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fillRule="evenodd" transform="translate(10 7)">
          <path
            d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z"
            fill="#fff"
          />
          <path
            d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z"
            fill={"#000"}
          />
        </g>
      </svg>
      <span>{cursor.name} </span>
    </div>
  );
}
