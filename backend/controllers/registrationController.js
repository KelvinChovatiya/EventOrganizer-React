const Registration = require('../models/Registration'); 
const Event = require('../models/Event'); 
const sendEmail = require('../utils/sendEmail'); 

const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event') 
      .sort({ createdAt: -1 }); 

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: 'Server error while fetching your tickets.' });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email')
      .populate('event', 'title date location')
      .sort({ createdAt: -1 });
      
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching all registrations:", error);
    res.status(500).json({ message: 'Failed to fetch all registrations' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    // 1. Get the IDs
    const eventId = req.params.eventId; 
    const userId = req.user._id;        

    // 2. Prevent duplicate tickets
    const existingRegistration = await Registration.findOne({ 
      user: userId, 
      event: eventId 
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Failed to register. You might already have a ticket.' });
    }

   
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const newRegistration = await Registration.create({
      user: userId,
      event: eventId,
    });

   
    try {
      const eventDate = new Date(event.date).toLocaleDateString('en-US', { 
        weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' 
      });

      const message = `Hi ${req.user.name || 'Eventalk Member'},\n\nYour registration is confirmed! 🎉\n\nYou are successfully booked for:\n\nEVENT: ${event.title}\nDATE: ${eventDate}\nLOCATION: ${event.location || 'See event details'}\n\nPlease keep this email as your digital ticket.\n\nBest Regards,\nThe Eventalk Team`;

      await sendEmail({
        email: req.user.email,
        subject: `Ticket Confirmation: ${event.title}`,
        message: message
      });
      console.log(`Ticket email sent successfully to ${req.user.email}`);
    } catch (emailError) {
      console.error("Ticket email failed to send, but seat was booked:", emailError);
    }

    // Return your exact success response
    res.status(201).json(newRegistration);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = {
  registerForEvent,
  getUserRegistrations, 
  getAllRegistrations, 
};
