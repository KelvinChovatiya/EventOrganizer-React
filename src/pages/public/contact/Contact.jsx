import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || 'Failed to send message. Please try again.' 
      });
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-xl   mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Get in <span className="text-[#F95A00]">Touch</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Have a question about an upcoming event or need help with your tickets? Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="flex flex-col w-fit  lg:flex-row bg-white rounded-2xl shadow-sm border border-slate-200 ">
          
         
          <div className=" p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
            
            {status.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg font-bold">
                Your message has been sent successfully! We will contact you soon.
              </div>
            )}
            
            {status.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-bold">
                {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none transition-all"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                <textarea 
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-[#F95A00] focus:bg-white focus:outline-none transition-all"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={status.loading}
                className="inline-flex items-center justify-center bg-[#F95A00] hover:bg-orange-600 disabled:bg-slate-400 text-white font-bold py-3.5 px-8 rounded-md transition-all"
              >
                {status.loading ? 'Sending...' : (
                  <>Send Message <Send className="w-4 h-4 ml-2" /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>

<Footer />
    </>
  );
};

export default ContactPage;