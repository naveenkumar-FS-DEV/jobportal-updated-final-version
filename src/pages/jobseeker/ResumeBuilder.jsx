import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FiDownload } from 'react-icons/fi';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#333333',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '2 solid #2563EB',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 8,
  },
  contactItem: {
    fontSize: 10,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #E5E7EB',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.5,
    textAlign: 'justify',
    color: '#374151',
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 4,
    marginTop: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 8,
    fontSize: 11,
    color: '#2563EB',
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.4,
    color: '#374151',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    backgroundColor: '#EFF6FF',
    color: '#1E40AF',
    padding: '4 8',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 15,
    borderTop: '1 solid #E5E7EB',
  },
  footerText: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 3,
  },
  footerBrand: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
});

const resumeSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  education: Yup.string().required('Education details are required'),
  experience: Yup.string().required('Experience details are required'),
  skills: Yup.string().required('Skills are required'),
});

const ResumePDF = ({ data }) => {
  const formatBulletPoints = (text) => {
    return text.split('\n').filter(line => line.trim()).map((line, index) => (
      <View key={index} style={styles.bulletPoint}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{line.trim()}</Text>
      </View>
    ));
  };

  const formatSkills = (skillsText) => {
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    return skillsArray.map((skill, index) => (
      <Text key={index} style={styles.skillItem}>{skill}</Text>
    ));
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>📧 {data.email}</Text>
            <Text style={styles.contactItem}>📞 {data.phone}</Text>
            <Text style={styles.contactItem}>📍 {data.address}</Text>
          </View>
        </View>

        {/* Professional Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.sectionContent}>{data.summary}</Text>
          </View>
        )}

        {/* Two Column Layout */}
        <View style={styles.twoColumn}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Experience Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              {formatBulletPoints(data.experience)}
            </View>

            {/* Projects Section */}
            {data.projects && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {formatBulletPoints(data.projects)}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Education Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {formatBulletPoints(data.education)}
            </View>

            {/* Skills Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technical Skills</Text>
              <View style={styles.skillsContainer}>
                {formatSkills(data.skills)}
              </View>
            </View>

            {/* Certifications Section */}
            {data.certifications && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {formatBulletPoints(data.certifications)}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Powered by Signpost Celfon.in Technology</Text>
          <Link src="https://signpostphonebook.in" style={styles.footerText}>www.signpostphonebook.in</Link>
        </View>
      </Page>
    </Document>
  );
};

const ResumeBuilder = () => {
  const [formData, setFormData] = useState(null);

  const initialValues = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    education: '',
    experience: '',
    skills: '',
    projects: '',
    certifications: '',
  };

  const handleSubmit = (values) => {
    setFormData(values);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Signpost Resume Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Resume Information</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={resumeSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="form-label">Full Name *</label>
                    <Field
                      type="text"
                      name="fullName"
                      className="form-input"
                      placeholder="John Doe"
                    />
                    {errors.fullName && touched.fullName && (
                      <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">Email *</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="john@example.com"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="form-label">Phone Number *</label>
                    <Field
                      type="text"
                      name="phone"
                      className="form-input"
                      placeholder="+1 234 567 8900"
                    />
                    {errors.phone && touched.phone && (
                      <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="form-label">Address *</label>
                    <Field
                      type="text"
                      name="address"
                      className="form-input"
                      placeholder="123 Street, City, Country"
                    />
                    {errors.address && touched.address && (
                      <div className="text-red-500 text-sm mt-1">{errors.address}</div>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <label htmlFor="summary" className="form-label">Professional Summary</label>
                  <Field
                    as="textarea"
                    name="summary"
                    rows="3"
                    className="form-input"
                    placeholder="Brief professional summary highlighting your key strengths and career objectives..."
                  />
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="form-label">Work Experience *</label>
                  <Field
                    as="textarea"
                    name="experience"
                    rows="6"
                    className="form-input"
                    placeholder="List your work experience with bullet points:
• Software Developer at ABC Company (2020-2023)
• Developed web applications using React and Node.js
• Led a team of 3 developers on major projects"
                  />
                  {errors.experience && touched.experience && (
                    <div className="text-red-500 text-sm mt-1">{errors.experience}</div>
                  )}
                </div>

                {/* Education */}
                <div>
                  <label htmlFor="education" className="form-label">Education *</label>
                  <Field
                    as="textarea"
                    name="education"
                    rows="4"
                    className="form-input"
                    placeholder="List your educational background:
• Bachelor of Computer Science, XYZ University (2016-2020)
• Relevant coursework: Data Structures, Algorithms, Web Development"
                  />
                  {errors.education && touched.education && (
                    <div className="text-red-500 text-sm mt-1">{errors.education}</div>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label htmlFor="skills" className="form-label">Technical Skills *</label>
                  <Field
                    as="textarea"
                    name="skills"
                    rows="3"
                    className="form-input"
                    placeholder="JavaScript, React, Node.js, Python, SQL, Git, AWS"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                  {errors.skills && touched.skills && (
                    <div className="text-red-500 text-sm mt-1">{errors.skills}</div>
                  )}
                </div>

                {/* Projects */}
                <div>
                  <label htmlFor="projects" className="form-label">Projects</label>
                  <Field
                    as="textarea"
                    name="projects"
                    rows="4"
                    className="form-input"
                    placeholder="List your notable projects:
• E-commerce Website - Built using React and Express.js
• Mobile App - Developed using React Native"
                  />
                </div>

                {/* Certifications */}
                <div>
                  <label htmlFor="certifications" className="form-label">Certifications</label>
                  <Field
                    as="textarea"
                    name="certifications"
                    rows="3"
                    className="form-input"
                    placeholder="List your certifications:
• AWS Certified Developer
• Google Cloud Professional"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="btn-primary px-8"
                    disabled={!isValid || !dirty}
                  >
                    Generate Professional Resume
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Preview Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Resume Preview</h2>
            {formData && (
              <PDFDownloadLink
                document={<ResumePDF data={formData} />}
                fileName={`${formData.fullName.replace(/\s+/g, '_')}_Professional_Resume.pdf`}
                className="btn-success flex items-center"
              >
                <FiDownload className="mr-2" />
                Download PDF
              </PDFDownloadLink>
            )}
          </div>
          
          {formData ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-96">
              <div className="text-center mb-6 pb-4 border-b-2 border-blue-600">
                <h1 className="text-2xl font-bold text-blue-900 mb-2">{formData.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <span>📧 {formData.email}</span>
                  <span>📞 {formData.phone}</span>
                  <span>📍 {formData.address}</span>
                </div>
              </div>
              
              {formData.summary && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-blue-900 mb-2 uppercase border-b border-gray-300">Professional Summary</h3>
                  <p className="text-xs text-gray-700">{formData.summary}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-blue-900 mb-2 uppercase border-b border-gray-300">Experience</h3>
                  <div className="text-gray-700 whitespace-pre-line">{formData.experience}</div>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-blue-900 mb-2 uppercase border-b border-gray-300">Education</h3>
                  <div className="text-gray-700 whitespace-pre-line">{formData.education}</div>
                  
                  <h3 className="text-sm font-bold text-blue-900 mb-2 mt-4 uppercase border-b border-gray-300">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.split(',').map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                <p className="text-xs text-gray-500">Resume generated using professional template</p>
                <p className="text-xs font-bold text-blue-900">Powered by Signpost Celfon.in Technology</p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">📄</div>
                <p>Fill out the form to see your professional resume preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;