/**
 * Switch to login page
 */
$('#toLogin').click(function (e) {
    e.preventDefault();
    $('#registerContainer').hide();
    $('#loginContainer').show();
})

/**
 * Switch to registration page
 */
$('#toRegistration').click(function (e) {
    e.preventDefault();
    $('#loginContainer').hide();
    $('#registerContainer').show();
})

function loadMainContainer() {
    return fetch('/personalInfo', { credentials: 'include' })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === 'ok') {
                $('#name').html(response.name)
                $('#registerContainer').hide();
                $('#loginContainer').hide();
                $('#mainContainer').show();
            } else {
                alert(`Error! ${response.errorMessage}`)
            }
        })
}

function loadMainRegistrationContainer() {
    return fetch('/personalInfo', { credentials: 'include' })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === 'ok') {
                $('#registrationName').html(response.name)
                $('#registerContainer').hide();
                $('#loginContainer').hide();
                $('#mainAuthenticationContainer').hide();
                $('#mainRegistrationContainer').show();
            } else {
                alert(`Error! ${response.errorMessage}`)
            }
        })
}

function loadMainAuthenticationContainer() {
    return fetch('/personalInfo', { credentials: 'include' })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === 'ok') {
                $('#loginName').html(response.name)
                $('#registerContainer').hide();
                $('#loginContainer').hide();
                $('#mainRegistrationContainer').hide();
                $('#mainAuthenticationContainer').show();
            } else {
                alert(`Error! ${response.errorMessage}`)
            }
        })
}

function checkIfLoggedIn() {
    return fetch('/isLoggedIn', { credentials: 'include' })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === 'ok') {
                return true
            } else {
                return false
            }
        })
}

$('#registrationToLogout').click(() => {
    fetch('/logout', { credentials: 'include' });
    $('#registerContainer').hide();
    $('#mainRegistrationContainer').hide();
    $('#mainAuthenticationContainer').hide();
    $('#loginContainer').show();
})

$('#loginToLogout').click(() => {
    fetch('/logout', { credentials: 'include' });
    $('#registerContainer').hide();
    $('#mainRegistrationContainer').hide();
    $('#mainAuthenticationContainer').hide();
    $('#loginContainer').show();
})