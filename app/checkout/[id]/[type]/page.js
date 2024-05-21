// CheckoutPage.js
'use client'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Don't forget to import axios
import { usePathname } from 'next/navigation';
import UserContext from '@/app/UserContext';

const CheckoutPage = () => {
  const [item, setItem] = useState(null);
  const [bookingId, setBookingId] = useState('');

  const router = useRouter();
  const pathname = usePathname(); // Access the pathname
  const { touristid } = useContext(UserContext);
  const pathSegments = pathname.split('/'); // Split pathname to get segments
  const id = pathSegments[2]; // Access the `id` parameter
  const type = pathSegments[3];

  const getTourData = async () => {
    try {
      const response = await axios.get(`https://main--ershaadbackend.netlify.app/.netlify/functions/server/tour/tours/${id}`);
      if (response.status === 200) {
        setItem(response.data);
        return response.data; // Assuming the response contains event details in JSON format
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      // Handle error
    }
  };

  const getEventData = async () => {
    try {
      const response = await axios.get(`https://main--ershaadbackend.netlify.app/.netlify/functions/server/event/events/${id}`);
      if (response.status === 200) {
        setItem(response.data);
        return response.data; // Assuming the response contains event details in JSON format
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      // Handle error
    }
  };

  const fetchItemDetails = async () => {
    try {
      // const response = await axios.get(`/items/${id}`); // Uncomment for actual API call
      // const data = response.data; // Uncomment for actual API call
      const dummyData = { // Dummy data for testing
        name: "Tour Name",
        image: "https://c.myholidays.com/blog/blog/content/images/2020/10/A-Cosmopolitan-Delight-in-Saudi-Arabia.webp",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 100
      };
      setItem(dummyData); // Set item details from API response
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };


  useEffect(() => {
    console.log("Tourist " + touristid);
    fetchItemDetails();
  }, [id]);

  useEffect(() => {
    if (type === 'event') {
      getEventData();
    } else if (type === 'tour') {
      getTourData();
    }
  }, [type, id]);

  if (!item) {
    return <p>Loading...</p>; // Render loading message while fetching item details
  }

const confirmBooking = async () => {
  const payload = {
    tourist_id: touristid,
    type: type,
    activity_id: id
  };
  try {
    const response = await fetch('https://main--ershaadbackend.netlify.app/.netlify/functions/server/booking/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    setBookingId(data._id);

    console.log('Success:', data._id);
    return data._id; // Return the booking id
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleCheckout = async () => {
  // Perform checkout logic here
  // Once checkout is successful, navigate to ThankYouPage
  const newBookingId = await confirmBooking();
  console.log('New bookingId:', newBookingId);
  await addPayment(newBookingId); // Pass the new booking id to addPayment
};

const addPayment = async (newBookingId) => { // Accept the booking id as a parameter
  const payload = {
    booking_id: newBookingId,
    activity_id: id,
    commission: (parseFloat(item.price) * 0.1)
  };
  try {
    const response = await fetch('https://main--ershaadbackend.netlify.app/.netlify/functions/server/payment/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Success:', data);
    router.push('/home/tourist');
  } catch (error) {
    console.error('Error:', error);
  }
};

return (
  <>
    <div className="checkout-container">
      <div className="summary">
        <h2>Summary</h2>
        {/* Display summary of selected item */}
        <div className="item">
          <img src={item.image} alt={item.name} />
          <div>
          <h4><strong>{type === 'event' ? item.eventName : item.tourName}</strong></h4>
          <h4>Date: <strong>{new Date(type === 'event' ? item.date : item.startDate).toLocaleDateString()}</strong></h4>

            <p>{item.description}</p>
            <p>Price: SAR {item.price}</p>
          </div>
        </div>
      </div>
      <div className="checkout-table">
        <h2>Checkout</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{item.name}</td>
              <td>{item.price}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Subtotal</td>
              <td>SAR{item.price}</td>
            </tr>
            <tr>
              <td>Tax</td>
              <td>SAR10</td> {/* Sample tax value */}
            </tr>
            <tr>
              <td>Total</td>
              <td>SAR{item.price + 10}</td> {/* Sample total calculation */}
            </tr>
          </tfoot>
        </table>
        <button className="confirm-btn" onClick={handleCheckout}>Confirm Booking</button>
     
      </div>
    </div>
  </>
);
};

export default CheckoutPage;