
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

  const [message, setMessage] = useState("")

  // Registration
  const registerUser = async () => {
    if (!email || !firstName || !lastName) {
      setMessage("Please fill all fields")
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
        setMessage("Registration successful")
        setRegistrationOtp(data.otp)
        console.log("Registration OTP:", data.otp)
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      console.log(error)
      setMessage("Something went wrong")
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
      setMessage("OTP must be exactly 6 digits")
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
        setMessage("Login successful")
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      console.log(error)
      setMessage("Something went wrong")
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
      setMessage("Please fill all checkout fields")
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
        setMessage("Checkout information submitted successfully")
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      console.log(error)
      setMessage("Something went wrong")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fa",
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.06)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "28px",
            margin: "0",
            color: "#111827",
          }}
        >
          OTP Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px",
            marginTop: "10px",
            marginBottom: "30px",
          }}
        >
          Registration and secure checkout
        </p>

        {/* REGISTRATION */}
        {page === "register" && (
          <>
            <h2 style={headingStyle}>Registration</h2>

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

            {registrationOtp && (
              <p style={codeStyle}>
                Registration code: <strong>{registrationOtp}</strong>
              </p>
            )}

            <button
              onClick={() => {
                setPage("checkout")
                setMessage("")
              }}
              style={linkButtonStyle}
            >
              Continue to Checkout
            </button>
          </>
        )}

        {/* CHECKOUT */}
        {page === "checkout" && (
          <>
            <h2 style={headingStyle}>Checkout</h2>

            {loggedInUser && (
              <div
                style={{
                  background: "#f3f4f6",
                  padding: "12px",
                  borderRadius: "7px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                Welcome,{" "}
                <strong>
                  {loggedInUser.first_name} {loggedInUser.last_name}
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
              Back to Registration
            </button>
          </>
        )}

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
        <div
          style={{
            position: "fixed",
            inset: "0",
            background: "rgba(0, 0, 0, 0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "350px",
              background: "#ffffff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                marginTop: "0",
                color: "#111827",
              }}
            >
              Login with OTP
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              We recognized your email. Enter your registration code.
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={loginOtp}
              onChange={(e) => setLoginOtp(e.target.value)}
              style={inputStyle}
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

            {message && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "15px",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  boxSizing: "border-box",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  outline: "none",
  fontSize: "14px",
  marginBottom: "14px",
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "14px",
  color: "#374151",
}

const headingStyle = {
  fontSize: "20px",
  color: "#111827",
  marginBottom: "20px",
}

const primaryButtonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "7px",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "15px",
  cursor: "pointer",
}

const linkButtonStyle = {
  width: "100%",
  marginTop: "12px",
  padding: "8px",
  border: "none",
  background: "transparent",
  color: "#2563eb",
  fontSize: "14px",
  cursor: "pointer",
}

const codeStyle = {
  textAlign: "center",
  marginTop: "20px",
  color: "#374151",
  fontSize: "14px",
}

export default App

