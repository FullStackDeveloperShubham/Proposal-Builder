"use client"

import { useState, useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import "./Home.css"

const Home = () => {
  const [data, setData] = useState({
    proposalCreaterName: "",
    proposoleTitle: "",
    message: "",
    budget: 0,
    startingDate: "",
    endDate: "",
    senderName: "",
    reciverName: "",
    contactEmail: "",
    contactPhone: "",
    toolsUsed: "",
    description: "",
    milestones: "",
    paymentTerms: "",
    clientRequirements: "",
  })

  // handle image input
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const contentRef = useRef()

  // Function to break long words and lines
  const breakLongText = (text) => {
    if (!text) return ""
    // Break very long words (more than 40 characters) and long lines
    return text.replace(/(\S{40,})/g, (match) => {
      return match.replace(/(.{40})/g, "$1\n")
    })
  }

  // download pdf 
  const handleDownloadPDF = () => {
    const input = contentRef.current

    // Hide elements that shouldn't appear in the PDF
    const toHide = document.querySelectorAll(".no-print")
    toHide.forEach((el) => (el.style.display = "none"))

    // Force a specific width for consistent PDF generation
    const originalWidth = input.style.width
    input.style.width = "794px" // A4 width in pixels at 96 DPI

    // Add PDF mode class to apply additional spacing
    input.classList.add("pdf-mode")

    html2canvas(input, {
      scale: 1.5,
      useCORS: true,
      scrollY: -window.scrollY,
      width: 794, // Fixed A4 width
      allowTaint: true,
      backgroundColor: "#ffffff",
      windowWidth: 794,
      windowHeight: input.scrollHeight,
      logging: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width

      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      // Add more pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      pdf.save("proposal.pdf")

      // Restore original width and UI elements
      input.style.width = originalWidth
      input.classList.remove("pdf-mode")
      toHide.forEach((el) => (el.style.display = ""))
    })
  }

  // cancle 
  // reset the data 
   const resetData = () =>{
    // reset the form data 
    setData({
      proposalCreaterName: "",
      proposoleTitle: "",
      message: "",
      budget: 0,
      startingDate: "",
      endDate: "",
      senderName: "",
      reciverName: "",
      contactEmail: "",
      contactPhone: "",
      toolsUsed: "",
      description: "",
      milestones: "",
      paymentTerms: "",
      clientRequirements: "",
    })
   }

  return (
    <div ref={contentRef} className="pdf-container">
      <div className="pdf-content">
        <div className="header-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="no-print"
          />
          <img
            src={imageSrc || "profile.jpeg"}
            alt="Profile"
            className="profile-image"
          />
          <div className="date-text">{new Date().toLocaleDateString()}</div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label className="label">Your Name</label>
            <div className="display-field">{breakLongText(data.proposalCreaterName) || "Enter your name"}</div>
            <input
              type="text"
              placeholder="Enter your name"
              className="input no-print"
              value={data.proposalCreaterName}
              onChange={(e) => setData({ ...data, proposalCreaterName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="label">Proposal Title</label>
            <div className="display-field">{breakLongText(data.proposoleTitle) || "e.g. Website for XYZ Ltd"}</div>
            <input
              type="text"
              placeholder="e.g. Website for XYZ Ltd"
              className="input no-print"
              value={data.proposoleTitle}
              onChange={(e) => setData({ ...data, proposoleTitle: e.target.value })}
            />
          </div>

          <div className="form-group mb-extra">
            <label className="label">Message / Details</label>
            <div className="display-field multiline">
              {breakLongText(data.message) || "Write the scope of work here..."}
            </div>
            <textarea
              rows="5"
              placeholder="Write the scope of work here..."
              className="textarea no-print"
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
            />
          </div>

          <div className="form-group mb-extra">
            <label className="label">Project Description</label>
            <div className="display-field multiline">
              {breakLongText(data.description) || "Brief overview of the project..."}
            </div>
            <textarea
              rows="4"
              className="textarea no-print"
              placeholder="Brief overview of the project..."
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>

          <div className="form-group mb-extra">
            <label className="label">Milestones</label>
            <div className="display-field multiline">
              {breakLongText(data.milestones) || "e.g. Week 1: Design, Week 2: Development..."}
            </div>
            <textarea
              rows="3"
              className="textarea no-print"
              placeholder="e.g. Week 1: Design, Week 2: Development..."
              value={data.milestones}
              onChange={(e) => setData({ ...data, milestones: e.target.value })}
            />
          </div>

          <div className="form-group mb-extra">
            <label className="label">Payment Terms</label>
            <div className="display-field multiline">
              {breakLongText(data.paymentTerms) || "e.g. 50% upfront, 50% on delivery"}
            </div>
            <textarea
              rows="3"
              className="textarea no-print"
              placeholder="e.g. 50% upfront, 50% on delivery"
              value={data.paymentTerms}
              onChange={(e) => setData({ ...data, paymentTerms: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Contact Email</label>
              <div className="display-field">{breakLongText(data.contactEmail) || "your@email.com"}</div>
              <input
                type="email"
                className="input no-print"
                placeholder="your@email.com"
                value={data.contactEmail}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="label">Contact Phone</label>
              <div className="display-field">{data.contactPhone || "+91 9876543210"}</div>
              <input
                type="tel"
                className="input no-print"
                placeholder="+91 9876543210"
                value={data.contactPhone}
                onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group mb-extra">
            <label className="label">Tools / Tech Stack</label>
            <div className="display-field multiline">
              {breakLongText(data.toolsUsed) || "e.g. React, Node.js, Tailwind CSS"}
            </div>
            <textarea
              rows="3"
              className="textarea no-print"
              placeholder="e.g. React, Node.js, Tailwind CSS"
              value={data.toolsUsed}
              onChange={(e) => setData({ ...data, toolsUsed: e.target.value })}
            />
          </div>

          <div className="form-group mb-extra">
            <label className="label">Client Requirements</label>
            <div className="display-field multiline">
              {breakLongText(data.clientRequirements) || "Any special instructions from client..."}
            </div>
            <textarea
              rows="3"
              className="textarea no-print"
              placeholder="Any special instructions from client..."
              value={data.clientRequirements}
              onChange={(e) => setData({ ...data, clientRequirements: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Start Date</label>
              <div className="display-field">{data.startingDate || "Select start date"}</div>
              <input
                type="date"
                className="input no-print"
                value={data.startingDate}
                onChange={(e) => setData({ ...data, startingDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="label">End Date</label>
              <div className="display-field">{data.endDate || "Select end date"}</div>
              <input
                type="date"
                className="input no-print"
                value={data.endDate}
                onChange={(e) => setData({ ...data, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group mb-extra">
            <label className="label">Total Budget</label>
            <div className="display-field">{data.budget ? `₹${data.budget}` : "e.g. 50000"}</div>
            <input
              type="number"
              placeholder="e.g. 50000"
              min="0"
              className="input no-print"
              value={data.budget}
              onChange={(e) => setData({ ...data, budget: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Sender</label>
              <div className="display-field">{breakLongText(data.senderName) || "Your Name"}</div>
              <input
                type="text"
                placeholder="Your Name"
                className="input no-print"
                value={data.senderName}
                onChange={(e) => setData({ ...data, senderName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="label">Receiver</label>
              <div className="display-field">{breakLongText(data.reciverName) || "Client Name"}</div>
              <input
                type="text"
                placeholder="Client Name"
                className="input no-print"
                value={data.reciverName}
                onChange={(e) => setData({ ...data, reciverName: e.target.value })}
              />
            </div>
          </div>
        </div>

        <hr className="custom-hr" />

        <div className="signature-section">
          <p className="signature-text">Signature: ______________________</p>
        </div>
      </div>

      <div className="button-section no-print">
        <button 
        onClick={resetData}
        className="cancel-button">Cancel</button>
        <button onClick={handleDownloadPDF} className="download-button">
          Download PDF
        </button>
      </div>
    </div>
  )
}

export default Home
