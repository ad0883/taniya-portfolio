import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Magnetic from "./Magnetic";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 4,
      speed: 1.2,
      effects: true,
      smoothTouch: 0.5,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        e.preventDefault();
        const link = e.currentTarget as HTMLAnchorElement;
        const section = link.getAttribute("data-href");
        // Use the same scroll container on touch devices so focusing a project
        // control does not reset a native anchor scroll and move the button.
        smoother.scrollTo(
          section,
          true,
          window.innerWidth < 500 ? "top 120px" : "top top"
        );
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <Magnetic>
          <a href="/#" className="navbar-title" data-cursor="disable">
            TN
          </a>
        </Magnetic>
        <a
          href="mailto:taniyanautiyal0@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          taniyanautiyal0@gmail.com
        </a>
        <ul>
          <Magnetic>
            <li>
              <a data-href="#about" href="#about">
                <HoverLinks text="ABOUT" />
              </a>
            </li>
          </Magnetic>
          <Magnetic>
            <li>
              <a data-href="#education" href="#education">
                <HoverLinks text="EDUCATION" />
              </a>
            </li>
          </Magnetic>
          <Magnetic>
            <li>
              <a data-href="#work" href="#work">
                <HoverLinks text="WORK" />
              </a>
            </li>
          </Magnetic>
          <Magnetic>
            <li>
              <a data-href="#contact" href="#contact">
                <HoverLinks text="CONTACT" />
              </a>
            </li>
          </Magnetic>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
