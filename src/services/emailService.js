import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ADMIN_EMAIL = 'Theuniquevisuals15@gmail.com';

let initialized = false;

function init() {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
}

export async function sendBookingNotification(data) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return false;

  init();

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: ADMIN_EMAIL,
      subject: 'New Booking Request - Unique Visuals',
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      date: data.date,
      message: data.message,
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendContactNotification(data) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return false;

  init();

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: ADMIN_EMAIL,
      subject: 'New Contact Message - Unique Visuals',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    });
    return true;
  } catch {
    return false;
  }
}
