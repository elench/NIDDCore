document.getElementById('change-pass-btn')
.addEventListener('click', e => {
    e.preventDefault();

    let newPass1 = document.getElementById('newPass');
    let newPass2 = document.getElementById('newPassConfirm');
    let msg = document.getElementById('passMsg');

    if (newPass1.value === '' && newPass2.value === '') {
        msg.innerHTML = 'You must enter a password';
    }
    else if (newPass1.value !== newPass2.value) {
        msg.innerHTML = 'Passwords are not the same';
    }
    else {
        document.getElementById('passForm').submit();
    }
});

document.getElementById('change-user-btn')
.addEventListener('click', e => {
    e.preventDefault();

    let newUser = document.getElementById('newUser');
    let msg = document.getElementById('userMsg');

    if (newUser.value === '') {
        msg.innerHTML = 'You must enter a username';
    }
    else {
        document.getElementById('userForm').submit();
    }
});
