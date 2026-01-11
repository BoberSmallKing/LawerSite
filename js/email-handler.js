// Email Handler for Contact Form
// Sends form data to sashabobr2020@mail.ru via EmailJS

(function() {
    'use strict';

    // EmailJS Configuration
    const EMAILJS_CONFIG = {
        enabled: true,
        publicKey: 'coxzF2pnf6FfCbUJX',
        serviceID: 'service_esxx4vr',
        templateID: 'template_tpto69p'
    };

    const TARGET_EMAIL = 'sashabobr2020@mail.ru';

    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        } else {
            console.error('EmailJS library not loaded');
            return;
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email') || 'Не указан',
                message: formData.get('message') || 'Сообщение не указано'
            };
            
            // Validation
            if (!data.name || !data.phone) {
                showMessage('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            
            // Send via EmailJS
            sendEmail(data, submitButton, originalButtonText);
        });
    });

    function sendEmail(data, submitButton, originalButtonText) {
        // Get current date and time
        const now = new Date();
        const timeString = now.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const templateParams = {
            to_email: TARGET_EMAIL,
            from_name: data.name,
            from_phone: data.phone,
            from_email: data.email,
            message: data.message,
            subject: 'Новая заявка с сайта БИС - ' + data.name,
            time: timeString
        };

        emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
            .then(function(response) {
                // Success message
                showMessage('✓ Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Reset form
                document.getElementById('contactForm').reset();
                
                // Restore button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }, function(error) {
                console.error('EmailJS Error:', error);
                
                // More detailed error message
                let errorMessage = 'Произошла ошибка при отправке заявки. ';
                
                if (error.text) {
                    if (error.text.includes('service') || error.text.includes('Service ID')) {
                        errorMessage += 'Проверьте правильность Service ID в настройках EmailJS. ';
                    } else if (error.text.includes('template') || error.text.includes('Template ID')) {
                        errorMessage += 'Проверьте правильность Template ID в настройках EmailJS. ';
                    } else if (error.text.includes('public key') || error.text.includes('Public Key')) {
                        errorMessage += 'Проверьте правильность Public Key в настройках EmailJS. ';
                    }
                    errorMessage += 'Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.';
                } else {
                    errorMessage += 'Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.';
                }
                
                showMessage(errorMessage, 'error');
                
                // Restore button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
    }

    function showMessage(text, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const message = document.createElement('div');
        message.className = 'form-message form-message--' + type;
        message.textContent = text;
        
        // Insert before form
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(message, form);
        
        // Auto remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(function() {
                message.style.opacity = '0';
                message.style.transition = 'opacity 0.3s';
                setTimeout(function() {
                    message.remove();
                }, 300);
            }, 5000);
        }
    }
})();
