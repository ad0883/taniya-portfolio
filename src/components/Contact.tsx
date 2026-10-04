import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:taniyanautiyal0@gmail.com" data-cursor="disable">
                taniyanautiyal0@gmail.com
              </a>
            </p>
            <h4>Education</h4>
            <p>B.Tech in CSE — SRM-IST (CGPA: 7.76)</p>
          </div>
          <div className="contact-box">
            <h4>Phone</h4>
            <a
              href="tel:+918595998192"
              data-cursor="disable"
              className="contact-social"
            >
              +91 85959 98192 <MdArrowOutward />
            </a>
            <h4>Location</h4>
            <p>Delhi, India</p>
            <h4>Languages</h4>
            <p>English, Hindi</p>
          </div>
          <div className="contact-box">
            <h2>
              Developer & ML Enthusiast <br /> <span>Taniya Nautiyal</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
