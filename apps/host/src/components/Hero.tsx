import Marker from "./icons/Marker";
import CtaButton from "./ui/CtaButton";
import Dribble from "../assets/icons/dribbble.svg";
import XPENG from "../assets/icons/xpeng.svg";
import Verox from "../assets/icons/veroxfloor.svg";
import Behance from "../assets/icons/Vector.svg";
import SurveyMonkey from "../assets/icons/Group-35.svg";
import Separator from "../assets/icons/Separator.png";

export default function Hero() {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-6 md:gap-8 flex-1 justify-center items-center mx-auto px-4">
        <div className="text-center">
          <h1 className="text-[40px] md:text-[72px] font-bold leading-tight">
            Empowering 
            <span className="text-[#FF6B6B] inline-block relative">Industries 
                <span className="absolute left-1/2 -translate-x-1/2 top-[60px] md:top-[80px]"><Marker/></span>
            </span>
            <br />
            Redefining Possibilities
          </h1>
            
          <p className="text-[16px] md:text-[20px] font-bold max-w-2xl mx-auto">
            Revolutionizing businesses with tailored tech solutions for every
            industry
          </p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <CtaButton text="Join as a Partner" bg="#00A8E8" />
          <CtaButton text="Explore Our Services" />
        </div>
      </div>
      <div className="flex gap-4 justify-between py-6 md:py-8 items-center flex-wrap px-4">
        <img src={Dribble} alt="dribbble" className="h-[14px] md:h-[18px]" />
        <img src={Separator} alt="separator" className="h-4 md:h-6" />
        <img src={XPENG} alt="xpeng" className="h-[14px] md:h-[18px]" />
        <img src={Separator} alt="separator" className="h-4 md:h-6" />
        <img src={Verox} alt="verox" className="h-[14px] md:h-[18px]" />
        <img src={Separator} alt="separator" className="h-4 md:h-6" />
        <img src={Behance} alt="behance" className="h-[14px] md:h-[18px]" />
        <img src={Separator} alt="separator" className="h-4 md:h-6" />
        <img src={SurveyMonkey} alt="surveymonkey" className="h-[14px] md:h-[18px]" />
      </div>
    </div>
  );
}
