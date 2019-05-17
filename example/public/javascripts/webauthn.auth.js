'use strict';

function getMakeCredentialsChallenge(formBody) {
    return fetch('/attestation/options', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.errorMessage}`);

        return response
    })
}

function sendWebAuthnAttestationResponse(body) {
    return fetch('/attestation/result', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.errorMessage}`);

        return response
    })
}

function sendWebAuthnAssertionResponse(body) {
    return fetch('/assertion/result', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.errorMessage}`);

        return response
    })
}

/* Handle for register form submission */
$('#register').submit(function(event) {
    event.preventDefault();

    var username = this.username.value;
    var displayName     = this.displayName.value;

    if(!username || !displayName) {
        alert('Display name or username is missing!')
        return
    }

    getMakeCredentialsChallenge({username, displayName})
        .then((response) => {
            var publicKey = preformatMakeCredReq(response);
            return navigator.credentials.create({ publicKey })
        })
        .then((response) => {
            var makeCredResponse = publicKeyCredentialToJSON(response);
            return sendWebAuthnAttestationResponse(makeCredResponse)
        })
        .then((response) => {
            if(response.status === 'ok') {
                loadMainRegistrationContainer()   
            } else {
                alert(`Server responed with error. The message is: ${response.errorMessage}`);
            }
        })
        .catch((error) => alert(error))
})

function getGetAssertionChallenge(formBody) {
    return fetch('/assertion/options', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.errorMessage}`);

        return response
    })
}

/* Handle for login form submission */
$('#login').submit(function(event) {
    event.preventDefault();

    var username = this.username.value;

    if(!username) {
        alert('Username is missing!')
        return
    }

    getGetAssertionChallenge({username})
        .then((response) => {
            var publicKey = preformatGetAssertReq(response);
            return navigator.credentials.get({ publicKey })
        })
        .then((response) => {
            var getAssertionResponse = publicKeyCredentialToJSON(response);
            return sendWebAuthnAssertionResponse(getAssertionResponse)
        })
        .then((response) => {
            if(response.status === 'ok') {
                loadMainAuthenticationContainer()
            } else {
                alert(`Server responed with error. The message is: ${response.errorMessage}`);
            }
        })
        .catch((error) => alert(error))
})