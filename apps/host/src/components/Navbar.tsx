const Navbar = () => {
  return (
    <>
        <div className="flex justify-between py-[42px] items-center text-white
        ">
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
        <div className="py-4 px-8 ring-1 ring-white rounded-full">
            <p>Join as a partner</p>
        </div>
        </div>
    </>
  )
}

export default Navbar
