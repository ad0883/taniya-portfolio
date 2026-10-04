import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Intern</h4>
                <h5>DRDO</h5>
              </div>
              <h3>2026<span className="career-months">Jan — Mar</span></h3>
            </div>
            <p>
              Co-developed a brain tumor classification web application at the
              Defence Research and Development Organisation. Fine-tuned ResNet-50
              on 50,000+ MRI scans, achieving 95%+ weighted precision and a 0.951
              weighted F1-score. Integrated Flask, PyTorch, and Docker for
              inference, with encrypted connections and no persistent image storage.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Intern</h4>
                <h5>Krafton India Private Limited</h5>
              </div>
              <h3>2025<span className="career-months">Jun — Jul</span></h3>
            </div>
            <p>
              Designed Mystic Labyrinth, an accessible adventure-puzzle concept
              centered on calm exploration. Created game mechanics and level
              concepts with no fail states, gentle guidance, and flexible pacing.
              Planned mobile, tablet, and PC experiences with multiple input modes
              to support diverse cognitive, physical, and sensory needs.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>PR & Marketing Volunteer</h4>
                <h5>Hackhound</h5>
              </div>
            </div>
            <p>
              Helped conduct an in-person technical hackathon as part of the PR
              and Marketing Team, bringing together more than 250 participants
              from across India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
