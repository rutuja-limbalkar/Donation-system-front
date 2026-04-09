import axios from "axios";
import { useState } from "react";

function PaymentButton({ amount = 500, userEmail = "rutuja@example.com", userName = "Rutuja Jain" }) {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentSuccess(false);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay.");
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await axios.post(
        `http://localhost:8080/payment/create-order?amount=${amount}`
      );

      const order = JSON.parse(orderResponse.data);

      const options = {
        key: "rzp_test_SahHHcqfDLxNc9",
        amount: order.amount,
        currency: "INR",
        name: "Jevdaya",
        description: "Donation / Payment",
        order_id: order.id,
        prefill: {
          name: userName,
          email: userEmail,
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
        handler: async function (response) {
          console.log("Payment Response:", response);

          try {
            const verifyResponse = await axios.post(
              "http://localhost:8080/payment/verify",
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: amount,
                customerName: userName,      // ✅ NEW
                customerEmail: userEmail     // ✅ NEW
              }
            );

            console.log("Verification Response:", verifyResponse.data);
            setPaymentSuccess(true);
            alert("✅ Payment Successful! Receipt has been sent to your email.");

          } catch (verifyError) {
            console.error("Verification failed:", verifyError);
            alert("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#3399cc",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>

      {paymentSuccess && (
        <div style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>
          🎉 Payment Completed Successfully! Receipt sent to your email.
        </div>
      )}
    </div>
  );
}

export default PaymentButton;