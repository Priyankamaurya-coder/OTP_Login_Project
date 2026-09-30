
import { useState } from "react"

function App() {
  const [page, setPage] = useState("register")

  // Registration
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [registrationOtp, setRegistrationOtp] = useState("")

  // Checkout
  const [checkoutEmail, setCheckoutEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")

  // Login
  const [loginOtp, setLoginOtp] = useState("")
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  // Messages
  const [message, setMessage] = useState("")

  // Success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Error popup
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Show success popup
  const showSuccess = (text) => {
    setSuccessMessage(text)
    setShowSuccessPopup(true)
  }

  // Show error popup
  const showError = (text) => {
    setErrorMessage(text)
    setShowErrorPopup(true)
  }

  // Registration
  const registerUser = async () => {
    if (!email || !firstName || !lastName) {
      showError("Please fill in all registration fields.")
      return
    }

    try {
      const response = await fetch(
        "https://otp-login-project-i2wt.onrender.com/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage("")
        setRegistrationOtp(data.otp)

        showSuccess(
          "Registration successful! Your 6-digit verification code is displayed below."
        )

        console.log("Registration OTP:", data.otp)
      } else {
        showError(data.error || "Registration failed.")
      }
    } catch (error) {
      console.log(error)
      showError("Unable to connect to the server. Please try again.")
    }
  }

  // Email recognition
  const checkUser = async (value) => {
    setCheckoutEmail(value)

    // Wait until email looks complete
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return
    }

    try {
      const response = await fetch(
        "https://otp-login-project-i2wt.onrender.com/api/recognize-user/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: value,
          }),
        }
      )

      const data = await response.json()

      if (data.registered) {
        setShowOtpModal(true)
        setLoginOtp("")
        setMessage("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Verify registration OTP
  const verifyLoginOtp = async () => {
    if (!/^\d{6}$/.test(loginOtp)) {
      showError("OTP must be exactly 6 digits.")
      return
    }

    try {
      const response = await fetch(
        "https://otp-login-project-i2wt.onrender.com/api/verify-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: checkoutEmail,
            otp: loginOtp,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        // Get registered user details
        const userResponse = await fetch(
          "https://otp-login-project-i2wt.onrender.com/api/recognize-user/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: checkoutEmail,
            }),
          }
        )

        const userData = await userResponse.json()

        setLoggedInUser(userData.user)
        setShowOtpModal(false)
        setLoginOtp("")
        setMessage("")

        showSuccess("Verification successful! You are now logged in.")
      } else {
        showError(data.error || "Invalid OTP.")
      }
    } catch (error) {
      console.log(error)
      showError("Unable to verify the OTP. Please try again.")
    }
  }

  // Skip login
  const skipLogin = () => {
    setShowOtpModal(false)
    setLoginOtp("")
    setMessage("")
  }

  // Checkout submit
  const submitCheckout = async (e) => {
    e.preventDefault()

    if (!checkoutEmail || !phoneNumber || !shippingAddress) {
      showError("Please fill in all checkout fields.")
      return
    }

    try {
      const response = await fetch(
        "https://otp-login-project-i2wt.onrender.com/api/submit-checkout/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: checkoutEmail,
            phone_number: phoneNumber,
            shipping_address: shippingAddress,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage("")

        showSuccess(
          "Checkout successful! Your information has been submitted successfully."
        )
      } else {
        showError(data.error || "Checkout submission failed.")
      }
    } catch (error) {
      console.log(error)
      showError("Unable to submit checkout. Please try again.")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #ecfeff 100%)",
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "38px",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 15px 40px rgba(15, 23, 42, 0.10)",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "16px",
              background: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            OTP
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: "28px",
              color: "#111827",
              fontWeight: "700",
            }}
          >
            OTP Login
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginTop: "10px",
              marginBottom: "0",
            }}
          >
            Secure registration and checkout
          </p>
        </div>

        {/* REGISTRATION */}
        {page === "register" && (
          <>
            <h2 style={headingStyle}>Create your account</h2>

            <p style={descriptionStyle}>
              Enter your details to register and receive your verification
              code.
            </p>

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={registerUser}
              style={primaryButtonStyle}
            >
              Register
            </button>

            {/* REGISTRATION CODE */}
            {registrationOtp && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: "0 0 7px",
                    color: "#1e40af",
                    fontSize: "13px",
                  }}
                >
                  Your verification code
                </p>

                <strong
                  style={{
                    fontSize: "26px",
                    letterSpacing: "5px",
                    color: "#1d4ed8",
                  }}
                >
                  {registrationOtp}
                </strong>
              </div>
            )}

            <button
              onClick={() => {
                setPage("checkout")
                setMessage("")
              }}
              style={linkButtonStyle}
            >
              Continue to Checkout →
            </button>
          </>
        )}

        {/* CHECKOUT */}
        {page === "checkout" && (
          <>
            <h2 style={headingStyle}>Checkout</h2>

            <p style={descriptionStyle}>
              Enter your details to continue with checkout.
            </p>

            {/* LOGGED IN USER */}
            {loggedInUser && (
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  padding: "14px",
                  borderRadius: "10px",
                  marginBottom: "22px",
                  fontSize: "14px",
                  color: "#065f46",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    marginBottom: "4px",
                    color: "#047857",
                  }}
                >
                  ✓ Verified account
                </div>

                <strong>
                  Welcome, {loggedInUser.first_name}{" "}
                  {loggedInUser.last_name}
                </strong>
              </div>
            )}

            <form onSubmit={submitCheckout}>
              <label style={labelStyle}>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={checkoutEmail}
                onChange={(e) => checkUser(e.target.value)}
                style={inputStyle}
              />

              <label style={labelStyle}>Phone Number</label>

              <input
                type="text"
                placeholder="10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={inputStyle}
              />

              <label style={labelStyle}>Shipping Address</label>

              <textarea
                placeholder="Enter your shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={{
                  ...inputStyle,
                  height: "100px",
                  resize: "none",
                }}
              />

              <button
                type="submit"
                style={primaryButtonStyle}
              >
                Submit Checkout
              </button>
            </form>

            <button
              onClick={() => {
                setPage("register")
                setMessage("")
              }}
              style={linkButtonStyle}
            >
              ← Back to Registration
            </button>
          </>
        )}

        {/* OLD MESSAGE - only used if needed */}
        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "0",
              fontSize: "14px",
              color: "#374151",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div style={modalOverlayStyle}>
          <div style={otpModalStyle}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              #
            </div>

            <h2
              style={{
                marginTop: "0",
                marginBottom: "10px",
                color: "#111827",
                fontSize: "23px",
              }}
            >
              Verify your account
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              We recognized your email. Enter the 6-digit registration code to
              continue.
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={loginOtp}
              maxLength="6"
              onChange={(e) => setLoginOtp(e.target.value)}
              style={{
                ...inputStyle,
                textAlign: "center",
                fontSize: "20px",
                letterSpacing: "4px",
              }}
            />

            <button
              onClick={verifyLoginOtp}
              style={primaryButtonStyle}
            >
              Verify Code
            </button>

            <button
              onClick={skipLogin}
              style={linkButtonStyle}
            >
              Skip Login
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div style={modalOverlayStyle}>
          <div style={successPopupStyle}>
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: "34px",
                fontWeight: "bold",
              }}
            >
              ✓
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#166534",
                fontSize: "23px",
              }}
            >
              Success!
            </h2>

            <p
              style={{
                margin: "0 auto 24px",
                color: "#4b5563",
                fontSize: "14px",
                lineHeight: "1.6",
                maxWidth: "300px",
              }}
            >
              {successMessage}
            </p>

            <button
              onClick={() => setShowSuccessPopup(false)}
              style={successButtonStyle}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ERROR POPUP */}
      {showErrorPopup && (
        <div style={modalOverlayStyle}>
          <div style={successPopupStyle}>
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "#fee2e2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              !
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#991b1b",
                fontSize: "23px",
              }}
            >
              Something went wrong
            </h2>

            <p
              style={{
                margin: "0 auto 24px",
                color: "#4b5563",
                fontSize: "14px",
                lineHeight: "1.6",
                maxWidth: "300px",
              }}
            >
              {errorMessage}
            </p>

            <button
              onClick={() => setShowErrorPopup(false)}
              style={{
                ...successButtonStyle,
                background: "#dc2626",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- STYLES ---------------- */

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  boxSizing: "border-box",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  outline: "none",
  fontSize: "14px",
  marginBottom: "15px",
  background: "#ffffff",
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151",
}

const headingStyle = {
  fontSize: "21px",
  color: "#111827",
  marginBottom: "8px",
}

const descriptionStyle = {
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#6b7280",
  marginTop: "0",
  marginBottom: "22px",
}

const primaryButtonStyle = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "9px",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(37, 99, 235, 0.20)",
}

const linkButtonStyle = {
  width: "100%",
  marginTop: "14px",
  padding: "9px",
  border: "none",
  background: "transparent",
  color: "#2563eb",
  fontSize: "14px",
  cursor: "pointer",
}

const modalOverlayStyle = {
  position: "fixed",
  inset: "0",
  background: "rgba(15, 23, 42, 0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: "1000",
}

const otpModalStyle = {
  width: "100%",
  maxWidth: "380px",
  background: "#ffffff",
  padding: "32px",
  borderRadius: "18px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.20)",
  boxSizing: "border-box",
}

const successPopupStyle = {
  width: "100%",
  maxWidth: "380px",
  background: "#ffffff",
  padding: "35px 30px",
  borderRadius: "18px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.20)",
  boxSizing: "border-box",
  textAlign: "center",
}

const successButtonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "9px",
  background: "#16a34a",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
}

export default App

