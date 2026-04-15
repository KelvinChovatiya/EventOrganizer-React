const Contact = require('../models/Contact');
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};


const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
};
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;


    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    res.status(201).json({ message: 'Message sent successfully!', data: newContact });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
};

module.exports = { submitContactForm, getAllContacts, updateContactStatus };
