import React, { useState } from "react";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Send,
  MapPin,
  CodeXml,
  ChefHat,
} from "lucide-react";
import "./index.css";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     setSubmitStatus("success");
  //     setFormData({ name: "", email: "", subject: "", message: "" });
  //     setTimeout(() => setSubmitStatus(null), 5000);
  //   }, 1500);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    const whatsappMessage = encodeURIComponent(
      `Hello Daniyal,\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
    );

    const phoneNumber = "917319717843"; // Your number without +
    const whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="contact-section">
      {/* Background decorative blobs */}
      <div className="background-elements">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="background-blob"
            style={{
              width: `${Math.random() * 15 + 5}rem`,
              height: `${Math.random() * 15 + 5}rem`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              transform: `scale(${Math.random() * 1.5 + 0.5})`,
            }}
          />
        ))}
      </div>
      {/* Section header */}
      <div className="section-header">
        <h2>Get In Touch</h2>
        <div className="section-underline" />
      </div>
      {/* Main container */}
      <div className="contact-columns">
        {/* Left column */}
        <div className="contact-info">
          <div className="frosted-card">
            <h3>Contact Information</h3>
            <div className="info-items">
              <div className="info-item">
                <div className="icon-wrapper">
                  <Mail size={18} color="#4c83ff" />
                </div>
                <div>
                  <p>Email</p>
                  <a href="mailto:daniyal.anwar863@gmail.com">
                    daniyal.anwar863@gmail.com
                  </a>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-wrapper">
                  <Phone size={18} color="#4c83ff" />
                </div>
                <div>
                  <p>Phone</p>
                  <a href="tel:+917319717843">(+91)731-971-7843</a>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-wrapper">
                  <MapPin size={18} color="#4c83ff" />
                </div>
                <div>
                  <p>Location</p>
                  <span>Bengaluru Karnataka, India</span>
                </div>
              </div>
            </div>
          </div>
          <div className="frosted-card">
            <h3>Connect With Me</h3>
            <div className="social-links">
              <a
                href="https://github.com/Dnanwar"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} color="#333" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/daniyal-anwar-14b8301b0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} color="#0077B5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://leetcode.com/u/r4ptr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CodeXml size={18} color="#FFA116" />
                <span>Leetcode</span>
              </a>
              <a
                href="https://www.codechef.com/users/beitdaniyal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChefHat size={18} color="#5B4638" />
                <span>CodeChef</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right column - Now properly separated */}
        <div className="contact-form-container">
          <div className="frosted-card">
            <h3>Send Me A Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                />
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
              {submitStatus === "success" && (
                <div className="success-message">
                  Your message has been sent successfully! I'll get back to you
                  soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* Footer
      <div className="footer">
        <p>© {new Date().getFullYear()} Daniyal Anwar. All rights reserved.</p>
      </div> */}
    </div>
  );
};

export default Contacts;
