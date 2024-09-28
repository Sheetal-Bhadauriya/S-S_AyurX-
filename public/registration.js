document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registration-form");

  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get user input values
    const username = document.querySelector('input[name="username"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Create an object with the user's data
    const userData = {
      username,
      email,
      password,
    };

    // Send the data to your Node.js server using an HTTP request (e.g., fetch)
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the server's response, e.g., redirect, display a message, etc.
        console.log(data);
        if (data.success) {
          // Redirect to a success page or display a success message
          console.log("Success");
        } else {
          // Display an error message to the user
          alert("Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
