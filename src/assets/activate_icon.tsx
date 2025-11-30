import { FC } from "react";

interface Props {
  color?: string;
  style?: React.CSSProperties;
}

const ActivateIcon: FC<Props> = ({
  color = "#000",
  style = {
    width: "100px",
    height: "auto",
    display: "inline-block",
    borderRadius: "8px",
  },
}) => {
  return (
    <div style={style}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="auto"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={color}
          stroke="none"
        >
          <path
            d="M1610 4969 c-65 -29 -106 -64 -134 -112 -14 -24 -178 -556 -376
-1217 -339 -1133 -352 -1177 -347 -1242 7 -106 69 -193 172 -240 l50 -23 694
-3 693 -3 -7 -27 c-3 -15 -108 -380 -232 -812 -199 -690 -226 -793 -226 -855
0 -265 318 -402 515 -223 48 44 1896 2580 1933 2653 27 54 28 194 2 243 -31
56 -90 114 -142 138 l-50 24 -607 0 c-474 0 -608 3 -608 12 0 7 101 317 225
688 250 751 248 744 201 847 -29 60 -86 121 -141 148 -39 19 -67 20 -805 22
-751 3 -766 2 -810 -18z"
          />
        </g>
      </svg>
    </div>
  );
};

export default ActivateIcon;
