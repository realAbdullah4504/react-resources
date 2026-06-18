const CtaButton = ({ text, bg }: { text: string; bg?: string }) => {
  return (
    <div
      className="py-4 px-8 ring-1 ring-white rounded-full"
      style={{ backgroundColor: bg }}
    >
      <p>{text}</p>
    </div>
  );
};

export default CtaButton;