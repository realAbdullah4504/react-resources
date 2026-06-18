import Marker from "./icons/Marker";
import CtaButton from "./ui/CtaButton";

export default function Hero() {
  return (
    <div className="h-[calc(100%-140px)]">
      <div className="flex flex-col gap-8 max-w-[1105px] h-full justify-center items-center mx-auto">
        <div className="text-center">
          <h1 className="text-[72px] font-bold ">
            Empowering <span className="text-[#FF6B6B] inline-block relative">Industries 
                <span className="absolute left-1/2 -translate-x-1/2 top-full"><Marker/></span>
            </span>
            <br />
            Redefining Possibilities
          </h1>
            
          <p className="text-[20px] font-bold">
            Revolutionizing businesses with tailored tech solutions for every
            industry
          </p>
        </div>
        <div className="flex gap-4">
          <CtaButton text="Join as a Partner" bg="#00A8E8" />
          <CtaButton text="Explore Our Services" />
        </div>
      </div>
    </div>
  );
}
