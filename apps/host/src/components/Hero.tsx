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
    <div className="h-[calc(100%-140px)] flex flex-col">
      <div className="flex flex-col gap-8 max-w-[1105px] flex-1 justify-center items-center mx-auto">
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
      <div className="flex gap-4 justify-between py-8 items-center">
        <img src={Dribble} alt="dribbble" className="h-[18px]" />
        <img src={Separator} alt="separator" />
        <img src={XPENG} alt="xpeng" className="h-[18px]" />
        <img src={Separator} alt="separator" />
        <img src={Verox} alt="verox" className="h-[18px]" />
        <img src={Separator} alt="separator" />
        <img src={Behance} alt="behance" className="h-[18px]" />
        <img src={Separator} alt="separator" />
        <img src={SurveyMonkey} alt="surveymonkey" className="h-[18px]" />
      </div>
    </div>
  );
}
