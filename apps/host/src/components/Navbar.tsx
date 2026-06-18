import CtaButton from "./ui/CtaButton"

const Navbar = () => {
  return (
    <>
        <div className="flex justify-between py-[42px] items-center sticky top-0 z-10">
        <img src="src/assets/icons/UNIQUID.svg" alt="UNIQUID" />
        <div className="flex gap-6 text-[14px] font-bold ">
            <a>Home</a>
            <a>Services</a>
            <a>Work</a>
            <a>Process</a>
            <a>Industries</a>
            <a>About Us</a>
            <a>Referral Program</a>
            <a>Contact Us</a>
        </div>
        <CtaButton text="Join as a partner" />
        </div>
    </>
  )
}

export default Navbar
