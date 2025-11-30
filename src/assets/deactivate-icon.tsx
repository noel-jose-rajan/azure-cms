import { FC } from "react";

interface Props {
  color?: string;
  style?: React.CSSProperties;
}

const DeActivateLogo: FC<Props> = ({
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
            d="M1858 4896 c-108 -39 -124 -68 -197 -363 -34 -133 -61 -257 -61 -275
1 -82 8 -90 853 -936 447 -447 830 -824 852 -837 78 -45 164 -40 233 12 44 33
480 578 499 623 10 22 14 56 11 96 -4 71 -34 123 -95 164 -36 25 -37 25 -339
30 l-302 5 261 610 c197 461 262 622 265 660 6 72 -36 149 -103 190 l-48 30
-896 2 c-731 2 -903 0 -933 -11z"
          />
          <path
            d="M637 4478 l-146 -153 435 -435 435 -436 -146 -534 c-127 -464 -146
-543 -143 -593 5 -71 44 -131 108 -167 l45 -25 433 -3 c374 -2 432 -5 432 -18
0 -8 -63 -392 -140 -854 -160 -958 -155 -896 -70 -980 74 -75 164 -87 256 -34
46 26 24 -7 614 897 l365 557 608 -607 608 -608 149 155 149 155 -1917 1918
c-1054 1054 -1920 1917 -1923 1917 -4 0 -72 -69 -152 -152z"
          />
        </g>
      </svg>
    </div>
  );
};

export default DeActivateLogo;
