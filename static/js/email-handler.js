// Email Handler for Contact Form
// Sends form data to Flask backend endpoint

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email") || "Не указан",
        message: formData.get("message") || "Сообщение не указано",
      };

      // Validation
      if (!data.name || !data.phone) {
        showMessage("Пожалуйста, заполните все обязательные поля", "error");
        return;
      }

      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Отправка...";

      // Send to Flask backend
      sendEmail(data, submitButton, originalButtonText);
    });
  });

  function sendEmail(data, submitButton, originalButtonText) {
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json().then(function (result) {
          return { ok: response.ok, result: result };
        });
      })
      .then(function (payload) {
        if (!payload.ok || !payload.result.ok) {
          throw new Error(
            payload.result.message ||
              "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону."
          );
        }

        showMessage(
          "✓ Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
          "success"
        );
        document.getElementById("contactForm").reset();
      })
      .catch(function (error) {
        console.error("Contact form error:", error);
        showMessage(
          error.message ||
            "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.",
          "error"
        );
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
  }

  function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const message = document.createElement("div");
    message.className = "form-message form-message--" + type;
    message.textContent = text;

    // Insert before form
    const form = document.getElementById("contactForm");
    form.parentNode.insertBefore(message, form);

    // Auto remove success messages after 5 seconds
    if (type === "success") {
      setTimeout(function () {
        message.style.opacity = "0";
        message.style.transition = "opacity 0.3s";
        setTimeout(function () {
          message.remove();
        }, 300);
      }, 5000);
    }
  }
})();
