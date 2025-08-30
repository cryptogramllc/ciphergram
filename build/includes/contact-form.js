// Simple Contact Form Handler
jQuery(document).ready(function($) {
    'use strict';

    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        var $form = $(this);
        var $submitButton = $form.find('button[type="submit"]');
        var $successMessage = $('#contactSuccess');
        var $errorMessage = $('#contactError');
        
        // Hide previous messages
        $successMessage.addClass('hidden');
        $errorMessage.addClass('hidden');
        
        // Disable submit button and show loading state
        $submitButton.prop('disabled', true).text('SENDING...');
        
        // Get form data
        var formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };
        
        // Simple validation
        if (!formData.name || !formData.email || !formData.message) {
            $errorMessage.removeClass('hidden');
            $submitButton.prop('disabled', false).text('SEND MESSAGE');
            return;
        }
        
        // Submit form using Formspree
        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            data: formData,
            dataType: 'json',
            success: function(response) {
                $successMessage.removeClass('hidden');
                $form[0].reset();
                
                // Scroll to success message
                $('html, body').animate({
                    scrollTop: $successMessage.offset().top - 100
                }, 500);
            },
            error: function(xhr, status, error) {
                $errorMessage.removeClass('hidden');
                
                // Scroll to error message
                $('html, body').animate({
                    scrollTop: $errorMessage.offset().top - 100
                }, 500);
            },
            complete: function() {
                $submitButton.prop('disabled', false).text('SEND MESSAGE');
            }
        });
    });
    
    // Hide messages when user starts typing
    $('.controled').on('keyup', function() {
        $('#contactSuccess, #contactError').addClass('hidden');
    });
});
