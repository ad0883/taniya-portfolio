import {
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";

import HoverLinks from "./HoverLinks";

import Magnetic from "./Magnetic";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <Magnetic>
          <span>
            <a
              href="mailto:taniyanautiyal0@gmail.com"
              aria-label="Email Taniya Nautiyal"
            >
              <FaEnvelope />
            </a>
          </span>
        </Magnetic>
        <Magnetic>
          <span>
            <a
              href="tel:+918595998192"
              aria-label="Call Taniya Nautiyal"
            >
              <FaPhone />
            </a>
          </span>
        </Magnetic>
      </div>

      <Magnetic>
        <a
          className="resume-button"
          href="/taniya_nautiyal_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Taniya Nautiyal's resume (PDF)"
        >
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      </Magnetic>
    </div>
  );
};

export default SocialIcons;
