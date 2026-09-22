/* =========================================================
   ROAMLY — FRONTEND SCRIPT
========================================================= */

// =========================================================
// API CONFIGURATION
// =========================================================

// CHANGE THIS if your backend runs on a different URL.
const API_BASE_URL = "http://localhost:5000/api/auth";

// =========================================================
// HELPER FUNCTIONS
// =========================================================

function setFieldError(input, message) {
  if (!input) return;

  const error = document.querySelector(`#${input.id}-error`);

  input.setAttribute("aria-invalid", message ? "true" : "false");

  if (error) {
    error.textContent = message;
  }
}

function showStatus(message, type = "success") {
  const statusMessage = document.getElementById("status-message");

  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusMessage.classList.add("is-visible");

  statusMessage.style.color = type === "error" ? "#ffd0cc" : "#e5ffef";
}

function clearStatus() {
  const statusMessage = document.getElementById("status-message");

  if (!statusMessage) return;

  statusMessage.textContent = "";
  statusMessage.classList.remove("is-visible");
}

// =========================================================
// LOGIN PAGE
// =========================================================

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// ---------------------------------------------------------
// LOGIN AUTHENTICATION
// ---------------------------------------------------------

if (loginForm && emailInput && passwordInput) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearStatus();

    // Clear previous errors
    setFieldError(emailInput, "");
    setFieldError(passwordInput, "");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    // Email validation
    if (!email) {
      setFieldError(emailInput, "Email is required.");
      isValid = false;
    } else if (!emailInput.validity.valid) {
      setFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    // Password validation
    if (!password) {
      setFieldError(passwordInput, "Password is required.");
      isValid = false;
    }

    if (!isValid) return;

    const submitButton = loginForm.querySelector(
      '.login-button[type="submit"]',
    );

    const originalButtonHTML = submitButton.innerHTML;

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Signing in...";

      showStatus("Connecting to your account...", "success");

      // Send login request to backend
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      // Check backend response
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      // YOUR BACKEND RETURNS:
      // result.data.user
      // result.data.token
      const { user, token } = result.data;

      if (!user || !token) {
        throw new Error("Invalid response received from server");
      }

      // Save login information
      // Both regular and remembered login currently use
      // localStorage so the dashboard can access the token.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showStatus("Login successful! Redirecting...", "success");

      // Redirect based on user role
      setTimeout(() => {
        if (String(user.role).toLowerCase() === "admin") {
          window.location.href = "../admin-dashboard.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }, 800);
    } catch (error) {
      console.error("Login error:", error);

      showStatus(error.message || "Unable to connect to the server.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  });

  // Clear email error while typing
  emailInput.addEventListener("input", () => {
    setFieldError(emailInput, "");
  });

  // Clear password error while typing
  passwordInput.addEventListener("input", () => {
    setFieldError(passwordInput, "");
  });
}

// =========================================================
// SHOW / HIDE LOGIN PASSWORD
// =========================================================

const togglePasswordButton = document.querySelector(".toggle-password");

if (togglePasswordButton && passwordInput) {
  togglePasswordButton.addEventListener("click", () => {
    const isPasswordVisible = passwordInput.type === "text";

    passwordInput.type = isPasswordVisible ? "password" : "text";

    togglePasswordButton.classList.toggle("is-visible", !isPasswordVisible);

    togglePasswordButton.setAttribute(
      "aria-label",
      isPasswordVisible ? "Show password" : "Hide password",
    );

    togglePasswordButton.setAttribute(
      "aria-pressed",
      String(!isPasswordVisible),
    );
  });
}

// =========================================================
// FORGOT PASSWORD PANEL
// =========================================================

const forgotPasswordLink = document.getElementById("forgot-password-link");

const backToLogin = document.getElementById("back-to-login");

const loginPanel = document.querySelector(".login-panel:not(.forgot-panel)");

const forgotPanel = document.getElementById("forgot-panel");

const forgotPasswordForm = document.getElementById("forgot-password-form");

const forgotEmail = document.getElementById("forgot-email");

const forgotStatusMessage = document.getElementById("forgot-status-message");

// Show forgot password panel
if (forgotPasswordLink && loginPanel && forgotPanel) {
  forgotPasswordLink.addEventListener("click", (event) => {
    event.preventDefault();

    loginPanel.hidden = true;
    forgotPanel.hidden = false;

    if (forgotEmail) {
      forgotEmail.focus();
    }
  });
}

// Go back to login panel
if (backToLogin && loginPanel && forgotPanel) {
  backToLogin.addEventListener("click", (event) => {
    event.preventDefault();

    forgotPanel.hidden = true;
    loginPanel.hidden = false;

    if (emailInput) {
      emailInput.focus();
    }
  });
}

// =========================================================
// FORGOT PASSWORD - CONNECTED TO BACKEND
// =========================================================

if (forgotPasswordForm && forgotEmail) {
  forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear previous errors and messages
    setFieldError(forgotEmail, "");

    if (forgotStatusMessage) {
      forgotStatusMessage.textContent = "";
      forgotStatusMessage.classList.remove("is-visible");
    }

    const email = forgotEmail.value.trim();

    // Validate email
    if (!email) {
      setFieldError(forgotEmail, "Email is required.");
      return;
    }

    if (!forgotEmail.validity.valid) {
      setFieldError(forgotEmail, "Please enter a valid email address.");
      return;
    }

    // Find the submit button
    const submitButton = forgotPasswordForm.querySelector(
      'button[type="submit"]',
    );

    const originalButtonHTML = submitButton ? submitButton.innerHTML : "";

    try {
      // Disable button while request is running
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      // Send request to your Express backend
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const result = await response.json();

      // Handle backend errors
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to process your request.");
      }

      // Show backend success message
      if (forgotStatusMessage) {
        forgotStatusMessage.textContent =
          result.message ||
          "If an account exists, password reset instructions will be sent.";

        forgotStatusMessage.style.color = "#e5ffef";

        forgotStatusMessage.classList.add("is-visible");
      }

      // Clear email after successful request
      forgotEmail.value = "";
    } catch (error) {
      console.error("Forgot password error:", error);

      // Show error message
      if (forgotStatusMessage) {
        forgotStatusMessage.textContent =
          error.message || "Unable to connect to the server.";

        forgotStatusMessage.style.color = "#ffd0cc";

        forgotStatusMessage.classList.add("is-visible");
      }
    } finally {
      // Restore button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
      }
    }
  });
}

// =========================================================
// REGISTER PAGE
// =========================================================

const createAccountForm = document.getElementById("createAccountForm");

const fullNameInput = document.getElementById("fullName");

const registerEmailInput = createAccountForm
  ? document.getElementById("email")
  : null;

const registerPasswordInput = createAccountForm
  ? document.getElementById("password")
  : null;

const confirmPasswordInput = document.getElementById("confirmPassword");

const termsCheckbox = document.getElementById("terms");

// ---------------------------------------------------------
// REGISTER USER WITH BACKEND
// ---------------------------------------------------------

if (createAccountForm) {
  createAccountForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = fullNameInput.value.trim();

    const email = registerEmailInput.value.trim();

    const password = registerPasswordInput.value;

    const confirmPassword = confirmPasswordInput.value;

    // Frontend validation
    if (!name) {
      alert("Please enter your full name.");
      fullNameInput.focus();
      return;
    }

    if (name.length > 100) {
      alert("Name must be 100 characters or fewer.");
      fullNameInput.focus();
      return;
    }

    if (!email) {
      alert("Please enter your email.");
      registerEmailInput.focus();
      return;
    }

    if (!registerEmailInput.validity.valid) {
      alert("Please enter a valid email address.");
      registerEmailInput.focus();
      return;
    }

    // IMPORTANT:
    // Matches your backend requirement of 8 characters
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      registerPasswordInput.focus();
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      confirmPasswordInput.focus();
      return;
    }

    if (!termsCheckbox.checked) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    const submitButton = createAccountForm.querySelector(".create-btn");

    const originalText = submitButton.textContent;

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Creating account...";

      // Send registration request
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration failed");
      }

      alert("Account created successfully! Please sign in.");

      // Go to login page
      window.location.href = "login.html";
    } catch (error) {
      console.error("Registration error:", error);

      alert(error.message || "Unable to connect to the server.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// =========================================================
// SHOW / HIDE REGISTER PASSWORDS
// =========================================================

const showPasswordButtons = document.querySelectorAll(".show-password");

showPasswordButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const inputId = button.dataset.input;

    const input = document.getElementById(inputId);

    if (!input) return;

    const isVisible = input.type === "text";

    input.type = isVisible ? "password" : "text";

    // Change simple icon
    button.textContent = isVisible ? "◉" : "◉";
  });
});

// =========================================================
// REAL GOOGLE SIGN-IN
// =========================================================

const googleSignInButton = document.getElementById("google-sign-in");

const registerGoogleButton = document.querySelector(".google-btn");

async function handleGoogleCredential(googleResponse) {
  try {
    showStatus("Signing in with Google...", "success");

    const response = await fetch(`${API_BASE_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: googleResponse.credential }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Google sign-in failed");
    }

    const { user, token } = result.data || {};
    if (!user || !token) {
      throw new Error("Invalid response received from server");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    showStatus("Google sign-in successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href =
        String(user.role).toLowerCase() === "admin"
          ? "../admin-dashboard.html"
          : "dashboard.html";
    }, 600);
  } catch (error) {
    console.error("Google sign-in error:", error);
    showStatus(error.message || "Unable to sign in with Google.", "error");
  }
}

function renderGoogleButton(existingButton) {
  if (!existingButton) return;

  const container = document.createElement("div");
  container.className = "google-sign-in-container";
  existingButton.replaceWith(container);

  window.google.accounts.id.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    width: 330,
  });
}

function initializeGoogleSignIn(attempt = 0) {
  if (
    !window.google ||
    !window.google.accounts ||
    !window.WELLNESS_GOOGLE_CLIENT_ID
  ) {
    if (attempt < 20) {
      window.setTimeout(() => initializeGoogleSignIn(attempt + 1), 250);
    }
    return;
  }

  window.google.accounts.id.initialize({
    client_id: window.WELLNESS_GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  renderGoogleButton(googleSignInButton);
  renderGoogleButton(registerGoogleButton);
}

window.addEventListener("load", () => initializeGoogleSignIn());

// =========================================================
// PASSWORD RESET PAGE
// =========================================================

const resetPasswordForm = document.getElementById("reset-password-form");

const resetPasswordInput = document.getElementById("reset-password");

const resetPasswordConfirm = document.getElementById("reset-password-confirm");

const resetStatusMessage = document.getElementById("reset-status-message");

// Get token from URL
const resetParams = new URLSearchParams(window.location.search);

const resetToken = resetParams.get("token");

console.log("=================================");
console.log("🔐 PASSWORD RESET PAGE");
console.log("🔗 Current URL:", window.location.href);
console.log("🔑 Token:", resetToken);
console.log("=================================");

// Only run on reset password page
if (resetPasswordForm && resetPasswordInput && resetPasswordConfirm) {
  // Check whether token exists
  if (!resetToken) {
    resetStatusMessage.textContent =
      "This password reset link is invalid or incomplete.";

    resetStatusMessage.style.color = "#ffd0cc";

    resetStatusMessage.classList.add("is-visible");

    console.error("❌ No reset token found in URL.");
  } else {
    console.log("✅ Reset token found.");

    resetPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const password = resetPasswordInput.value;

      const confirmPassword = resetPasswordConfirm.value;

      // Password validation
      if (password.length < 8) {
        resetStatusMessage.textContent =
          "Password must be at least 8 characters.";

        resetStatusMessage.style.color = "#ffd0cc";

        resetStatusMessage.classList.add("is-visible");

        return;
      }

      // Confirm password
      if (password !== confirmPassword) {
        resetStatusMessage.textContent = "Passwords do not match.";

        resetStatusMessage.style.color = "#ffd0cc";

        resetStatusMessage.classList.add("is-visible");

        return;
      }

      const submitButton = resetPasswordForm.querySelector(
        'button[type="submit"]',
      );

      const originalText = submitButton.textContent;

      try {
        submitButton.disabled = true;

        submitButton.textContent = "Resetting...";

        resetStatusMessage.textContent = "Updating your password...";

        resetStatusMessage.style.color = "#e5ffef";

        resetStatusMessage.classList.add("is-visible");

        console.log("📤 Sending password reset request...");

        // Send token and password to backend
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token: resetToken,
            password: password,
          }),
        });

        const result = await response.json();

        console.log("📥 Backend response:", result);

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to reset password.");
        }

        // Success
        resetStatusMessage.textContent =
          "Password reset successful! Redirecting to sign in...";

        resetStatusMessage.style.color = "#e5ffef";

        resetStatusMessage.classList.add("is-visible");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);
      } catch (error) {
        console.error("❌ Password reset error:", error);

        resetStatusMessage.textContent =
          error.message || "Unable to reset password.";

        resetStatusMessage.style.color = "#ffd0cc";

        resetStatusMessage.classList.add("is-visible");
      } finally {
        submitButton.disabled = false;

        submitButton.textContent = originalText;
      }
    });
  }
}
