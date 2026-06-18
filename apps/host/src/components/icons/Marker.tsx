const Marker = () => {
  return (
    <svg
      width="332"
      height="29"
      viewBox="0 0 332 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        style={{
          transformOrigin: 'left center',
          animation: 'drawArrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}
      >
        <path
          d="M328.728 28.3179C332.843 27.4599 333.966 12.4004 318.724 6.31282C263.353 -12.5861 6.48095 16.8871 0.990562 17.7672C-3.12389 18.6252 6.56094 21.6357 12.0647 21.547C16.1924 21.4805 221.059 9.47026 328.728 28.3179Z"
          fill="#FF6B6B"
        />
      </g>
      <style>{`
        @keyframes drawArrow {
          0% { transform: scaleX(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </svg>
  );
};

export default Marker;
