import "./styles/Education.css";

const Education = () => {
  const courses = [
    "Operating Systems",
    "Data Structures",
    "Analysis Of Algorithms",
    "Artificial Intelligence",
    "Machine Learning",
    "Python",
    "Computer Networking",
    "Database Management System",
    "Data Science",
    "Natural Language Processing",
    "Object Oriented Design and Programming",
    "Computer Graphics and Animation",
  ];

  return (
    <div className="education-section" id="education">
      <div className="education-container">
        <h2>
          Education <span>&</span>
          <br /> Coursework
        </h2>

        <div className="education-grid">
          <div className="education-card">
            <div className="education-card-header">
              <div>
                <h3>Bachelor of Technology</h3>
                <h4>Computer Science and Engineering</h4>
              </div>
              <div className="education-year">Aug 2023 — Aug 2027 (Expected)</div>
            </div>
            <h5>SRM-IST, Delhi-NCR</h5>
            
            <div className="education-gpa">
              <span>CGPA</span>
              <span>7.76</span>
            </div>

            <div className="education-courses">
              <h5>Relevant Coursework</h5>
              <div className="education-tags">
                {courses.map((course, index) => (
                  <span key={index} className="education-tag">
                    {course}
                  </span>
                ))}
              </div>
            </div>
            <div className="education-courses">
              <h5>Additional Tools</h5>
              <div className="education-tags">
                <span className="education-tag">C++</span>
                <span className="education-tag">Unreal Engine</span>
                <span className="education-tag">MS-PowerPoint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
